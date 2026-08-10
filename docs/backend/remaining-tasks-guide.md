# Vodič za preostale taskove — implementacijska uputstva

> **Autor:** Amina  
> **Datum:** 2026-05-30  
> **Namjena:** Detaljne upute za člana tima koji implementira: BE1-01, BE-ROLE-06

---

## Pregled statusa

| Task | Status | Šta treba uraditi |
|------|--------|-------------------|
| BE1-01 | ⚠️ Djelimično | Verificirati Keycloak JWT format + dodati OnChallenge/OnForbidden |
| BE-CODEBOOK-06 | ✅ Implementirano | Samo testirati, nema code izmjena |
| BE-VALID-05 | ✅ Implementirano | Implementirano potpuno |
| BE-ROLE-02 | ✅ Implementirano | Samo testirati |
| BE-ROLE-05 | ✅ Implementirano | Samo testirati s pravim Keycloakom |
| BE-ROLE-06 | ⚠️ Djelimično | Dodati OnChallenge + OnForbidden u JWT Events |

---

## BE1-01 — Konfigurisati JWT validaciju u .NET API-ju

### Što je već implementirano

Sve osnovno je urađeno u `src/Infrastructure/DependencyInjection.cs`:

```csharp
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = keycloak.Authority;           // http://localhost:8080/realms/praksa
        options.Audience  = keycloak.Audience;            // praksa-api
        options.RequireHttpsMetadata = false;             // development
        options.AutomaticRefreshInterval = 10 min;        // JWKS cache refresh
        options.Events.OnAuthenticationFailed             // Token-Expired header
    });
```

`PermissionClaimsTransformation` (Infrastructure/Auth/) automatski čita role iz tokena i dodaje `permission` claim-ove.

### ⚠️ KRITIČNO: Verificirati Keycloak JWT format

**Ovo je najvažnija stvar.** Keycloak može slati role u 3 formata. Naš kod podržava samo flat format.

**Korak 1 — Dobiti stvarni JWT token:**
```bash
curl -X POST \
  'http://localhost:8080/realms/praksa/protocol/openid-connect/token' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=password' \
  -d 'client_id=praksa-api' \
  -d 'username=TEST_KORISNIK' \
  -d 'password=TEST_LOZINKA'
```

**Korak 2 — Decodirati token** na https://jwt.io ili:
```csharp
var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
var token = handler.ReadJwtToken(ACCESS_TOKEN_OVDJE);
foreach (var c in token.Claims)
    Console.WriteLine($"{c.Type} = {c.Value}");
```

**Korak 3 — Provjeriti format rola u tokenu.**

Scenario A — **Flat format** (naš kod radi bez izmjena):
```json
{ "role": "Administrator" }
```

Scenario B — **realm_access.roles** (Keycloak default, treba dodati parsiranje):
```json
{
  "realm_access": {
    "roles": ["Administrator", "offline_access"]
  }
}
```

Scenario C — **resource_access format** (per-client role):
```json
{
  "resource_access": {
    "praksa-api": { "roles": ["Administrator"] }
  }
}
```

### Ako token koristi Scenario B ili C — izmjena u GetRoles()

**Fajl:** `src/Infrastructure/Auth/ClaimsPrincipalExtensions.cs`  
**Metoda:** `GetRoles()`

Dodati na kraj metode, nakon `principal.FindAll("roles")`:

```csharp
// Parsiranje Keycloak realm_access.roles (Scenario B)
var realmAccessClaim = principal.FindFirst("realm_access")?.Value;
if (!string.IsNullOrWhiteSpace(realmAccessClaim))
{
    try
    {
        using var doc = System.Text.Json.JsonDocument.Parse(realmAccessClaim);
        if (doc.RootElement.TryGetProperty("roles", out var rolesEl))
            foreach (var r in rolesEl.EnumerateArray())
                if (r.GetString() is { Length: > 0 } name)
                    roles.Add(name);
    }
    catch { /* ignorisati — nevalidan JSON */ }
}

// Parsiranje resource_access.praksa-api.roles (Scenario C)
var resourceAccessClaim = principal.FindFirst("resource_access")?.Value;
if (!string.IsNullOrWhiteSpace(resourceAccessClaim))
{
    try
    {
        using var doc = System.Text.Json.JsonDocument.Parse(resourceAccessClaim);
        if (doc.RootElement.TryGetProperty("praksa-api", out var clientEl)
         && clientEl.TryGetProperty("roles", out var rolesEl))
            foreach (var r in rolesEl.EnumerateArray())
                if (r.GetString() is { Length: > 0 } name)
                    roles.Add(name);
    }
    catch { /* ignorisati */ }
}
```

### Preporučena Keycloak konfiguracija (Scenario A — bez izmjene koda)

Ako imaš pristup Keycloak Admin Console, možeš konfigurirati da realm role idu kao flat claims:

1. Admin Console → Clients → `praksa-api` → Client Scopes → Dedicated scope
2. Add mapper → User Realm Role
   - Name: `realm-roles-flat`
   - Token Claim Name: `role`
   - Claim JSON Type: `String`
   - Add to access token: **ON**
   - Multivalued: **ON**
3. Save → Token sad sadrži: `"role": ["Administrator"]` → naš `GetRoles()` radi

### Provjera da autentifikacija radi

```bash
# 1. Uzeti token
TOKEN=$(curl -s -X POST 'http://localhost:8080/realms/praksa/protocol/openid-connect/token' \
  -d 'grant_type=password&client_id=praksa-api&username=admin_user&password=admin_pass' \
  | jq -r '.access_token')

# 2. Testirati zaštićeni endpoint
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/me
# Očekivani odgovor: 200 s UserId, Username, Email, Roles, Permissions

# 3. Testirati bez tokena
curl http://localhost:5000/api/me
# Očekivani odgovor: 401

# 4. Testirati s isteklim tokenom (ili tokenom bez permission-a)
curl -H "Authorization: Bearer INVALID_TOKEN" http://localhost:5000/api/me
# Očekivani odgovor: 401
```

---

## BE-ROLE-06 — 401/403 ponašanje za role endpointe

### ⚠️ GAP: Standardizirani ProblemDetails za 401/403

**Problem:** Kada ASP.NET Core authentication/authorization middleware vrati 401 ili 403 (ne kao exception), ti odgovori ne prolaze kroz `GlobalExceptionHandler`. Vraća se default ProblemDetails bez `correlationId` i `errorCode`.

**Gdje dodati:** `src/Infrastructure/DependencyInjection.cs`, unutar `AddJwtBearer(options => ...)`, u `options.Events`.

**Using koji treba dodati na vrh fajla:**
```csharp
using Microsoft.AspNetCore.Http;
```

**Kod koji treba dodati** (unutar `options.Events = new JwtBearerEvents { ... }`):

```csharp
options.Events = new JwtBearerEvents
{
    OnAuthenticationFailed = context =>        // postoji — ne mijenjati
    {
        if (context.Exception is SecurityTokenExpiredException)
            context.Response.Headers["Token-Expired"] = "true";
        return Task.CompletedTask;
    },

    // 401 — korisnik nije prijavljen (nema/istekao/nevažeći token)
    OnChallenge = async context =>
    {
        context.HandleResponse(); // sprečava defaultni 401 odgovor

        context.Response.StatusCode  = StatusCodes.Status401Unauthorized;
        context.Response.ContentType = "application/problem+json";

        var correlationId =
            context.HttpContext.Items[Praksa.Application.Common.HttpHeaders.CorrelationId] as string
            ?? context.HttpContext.TraceIdentifier;

        var problem = new Microsoft.AspNetCore.Mvc.ProblemDetails
        {
            Status   = 401,
            Title    = "Unauthorized",
            Detail   = "Morate biti prijavljeni (validan JWT Bearer token) za pristup ovom resursu.",
            Instance = context.HttpContext.Request.Path,
            Type     = "https://tools.ietf.org/html/rfc7235#section-3.1"
        };
        problem.Extensions["correlationId"] = correlationId;
        problem.Extensions["errorCode"]     = "UNAUTHORIZED";

        await context.HttpContext.Response
            .WriteAsJsonAsync(problem, context.HttpContext.RequestAborted);
    },

    // 403 — korisnik prijavljen ali nema permission
    OnForbidden = async context =>
    {
        context.Response.StatusCode  = StatusCodes.Status403Forbidden;
        context.Response.ContentType = "application/problem+json";

        var correlationId =
            context.HttpContext.Items[Praksa.Application.Common.HttpHeaders.CorrelationId] as string
            ?? context.HttpContext.TraceIdentifier;

        var problem = new Microsoft.AspNetCore.Mvc.ProblemDetails
        {
            Status   = 403,
            Title    = "Forbidden",
            Detail   = "Nemate dozvolu za ovu akciju. Provjerite da li vaša rola ima potreban permission.",
            Instance = context.HttpContext.Request.Path,
            Type     = "https://tools.ietf.org/html/rfc7231#section-6.5.3"
        };
        problem.Extensions["correlationId"] = correlationId;
        problem.Extensions["errorCode"]     = "PERMISSION_DENIED";

        await context.HttpContext.Response
            .WriteAsJsonAsync(problem, context.HttpContext.RequestAborted);
    }
};
```

**Napomena:** `HttpHeaders.CorrelationId` je konstanta `"X-Correlation-ID"` iz `Praksa.Application.Common.HttpHeaders`.

### Provjera 401/403 ponašanja

```bash
# 401 — bez tokena
curl -v http://localhost:5000/api/roles/assign
# Treba: 401 + ProblemDetails s errorCode: "UNAUTHORIZED"

# 401 — s nevažećim tokenom
curl -v -H "Authorization: Bearer lazni_token" http://localhost:5000/api/roles/assign
# Treba: 401 + Token-Expired header ako istekao

# 403 — s validnim tokenom ali pogrešnom rolom (npr. Unosnik)
curl -v -H "Authorization: Bearer UNOSNIK_TOKEN" http://localhost:5000/api/roles/assign
# Treba: 403 + ProblemDetails s errorCode: "PERMISSION_DENIED"

# 204 — s Administrator tokenom + validnim tijelom
curl -X POST -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId":"...", "roleName":"Unosnik"}' \
  http://localhost:5000/api/roles/assign
# Treba: 204 No Content
```

---

## BE-VALID-05 — Standardizovati backend error response

### Status: ✅ IMPLEMENTIRANO POTPUNO

`GlobalExceptionHandler` (`src/Api/Middleware/GlobalExceptionHandler.cs`) implementira:

**400 Validation Error:**
```json
{
  "status": 400,
  "title": "Validation Error",
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "detail": "Jedan ili više uslova validacije nisu ispunjeni.",
  "instance": "/api/codebooks/tipovi/values",
  "fieldErrors": [
    { "field": "code", "code": "REQUIRED_FIELD", "message": "Kod je obavezan." },
    { "field": "sortOrder", "code": "INVALID_INPUT", "message": "Redoslijed ne smije biti negativan." }
  ],
  "correlationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

**404 Not Found:**
```json
{
  "status": 404,
  "title": "Not Found",
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
  "detail": "Vrijednost šifarnika ID=99 nije pronađena u šifarniku 'tipovi'.",
  "errorCode": "CODEBOOK_VALUE_NOT_FOUND",
  "correlationId": "..."
}
```

**409 Conflict:**
```json
{
  "status": 409,
  "title": "Conflict",
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.8",
  "detail": "Vrijednost s kodom 'TIP_A' već postoji u šifarniku 'tipovi'.",
  "errorCode": "CODEBOOK_VALUE_DUPLICATE_CODE",
  "correlationId": "..."
}
```

**403 Forbidden:**
```json
{
  "status": 403,
  "title": "Forbidden",
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.3",
  "detail": "Poruka greške.",
  "errorCode": "ERROR_CODE",
  "correlationId": "..."
}
```

**500 Internal Server Error:**
```json
{
  "status": 500,
  "title": "Internal Server Error",
  "type": "https://tools.ietf.org/html/rfc7231#section-6.6.1",
  "detail": "Neočekivana greška servera.",
  "correlationId": "..."
}
```

**Dodatno implementirano:**
- `BadHttpRequestException` → 400 (nevažeći HTTP zahtjev, preveliko tijelo)
- `OperationCanceledException` → tiho ignoriše (klijent odspojio, nema potrebe slati odgovor)
- RFC 7807 `type` URI za sve status kodove

---

## BE-CODEBOOK-06 — Zaštita šifarnik endpointa

### Status: ✅ IMPLEMENTIRANO — samo testirati

Svi endpointi su zaštićeni:

| Endpoint | Permission | Ko ima pristup |
|----------|-----------|---------------|
| `GET /values/active` | `codebooks.view` | Administrator, Unosnik, Verifikator |
| `GET /values` | `codebooks.manage` | Administrator |
| `GET /values/{id}` | `codebooks.manage` | Administrator |
| `GET /values/{id}/usage` | `codebooks.manage` | Administrator |
| `POST /values` | `codebooks.manage` | Administrator |
| `PUT /values/{id}` | `codebooks.manage` | Administrator |
| `POST /values/{id}/deactivate` | `codebooks.manage` | Administrator |
| `POST /values/{id}/activate` | `codebooks.manage` | Administrator |
| `DELETE /values/{id}` | `codebooks.manage` | Administrator |

### Testiranje (ručno)

```bash
# 401 — bez tokena
curl -v http://localhost:5000/api/codebooks/tipovi/values
# Treba: 401

# 403 — s Unosnik tokenom na manage endpoint
curl -v -H "Authorization: Bearer UNOSNIK_TOKEN" \
  http://localhost:5000/api/codebooks/tipovi/values
# Treba: 403

# 200 — s Unosnik tokenom na active (view) endpoint
curl -H "Authorization: Bearer UNOSNIK_TOKEN" \
  http://localhost:5000/api/codebooks/tipovi/values/active
# Treba: 200

# 200 — s Administrator tokenom
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  http://localhost:5000/api/codebooks/tipovi/values
# Treba: 200
```

**Fajlovi za pregled (ne mijenjati):**
- `src/Api/Endpoints/CodebookEndpoints.cs`
- `src/Application/Security/RolePermissionMatrix.cs`
- `src/Api/Extensions/AuthorizationExtensions.cs`

---

## BE-ROLE-02 — Zaštita role-management funkcionalnosti

### Status: ✅ IMPLEMENTIRANO — samo testirati

| Endpoint | Permission | Ko ima pristup |
|----------|-----------|---------------|
| `GET /api/users` | `users.view` | Administrator |
| `GET /api/users/{id}/roles` | `users.view` | Administrator |
| `POST /api/roles/assign` | `roles.assign` | Administrator |
| `POST /api/roles/remove` | `roles.remove` | Administrator |
| `POST /api/roles/transfer-admin` | `roles.transfer-admin` | Administrator |

---

## BE-ROLE-05 — Pravilo za administratorsku rolu (min. 1 admin)

### Status: ✅ IMPLEMENTIRANO — samo testirati

Implementirano u `src/Infrastructure/Auth/RoleManagementService.cs`:

**Metoda `EnsureNotLastAdminAsync`:**
- Poziva Keycloak: `GET /admin/realms/{realm}/roles/Administrator/users?max=2`
- Ako je <= 1 admin → 409 `ROLE_LAST_ADMIN_REMOVAL_BLOCKED`
- Audit log + notifikacija (Critical severity) za svaki blokirani pokušaj

**Metoda `TransferAdminRoleAsync` — siguran redosljed (EC-ROLE-24):**
1. Validacija Reason (obavezan)
2. Self-transfer provjera (SourceUserId != TargetUserId)
3. Provjeri da source ima Administrator rolu
4. Dodaj Administrator rolu target korisniku PRVO
5. Ukloni Administrator rolu source korisniku NAKON
6. Audit `ADMIN_ROLE_TRANSFERRED` (Critical severity)

### Edge case-ovi za testiranje

- [x] Transfer na samog sebe → 409 `ROLE_SELF_TRANSFER` ✅ implementirano
- [x] Transfer bez Reason → 400 ValidationError ✅ implementirano
- [ ] Transfer na neaktivnog korisnika → Keycloak vraća 404, propagira se kao greška
- [ ] Transfer na korisnika koji već ima Administrator rolu → Keycloak prihvata (idempotent), remove ide normalno

---

## Redosljed implementacije za preostalog člana tima

1. **Prvo:** BE1-01 — dekodirajte stvarni Keycloak JWT i provjerite format rola. Bez toga ništa ne radi.
2. **Drugo:** BE-ROLE-06 — dodajte `OnChallenge` + `OnForbidden` u `DependencyInjection.cs` prema kodu iznad.
3. **Na kraju:** Testirati BE-CODEBOOK-06 i BE-ROLE-02 prema checklistama.

---

## Ključni fajlovi

| Fajl | Relevantnost |
|------|-------------|
| `src/Infrastructure/DependencyInjection.cs` | JWT config, dodati OnChallenge/OnForbidden (BE-ROLE-06) |
| `src/Infrastructure/Auth/ClaimsPrincipalExtensions.cs` | GetRoles() — dodati realm_access parsiranje ako treba (BE1-01) |
| `src/Infrastructure/Auth/RoleManagementService.cs` | BE-ROLE-05 — implementirano |
| `src/Api/Middleware/GlobalExceptionHandler.cs` | BE-VALID-05 — implementirano |
| `src/Api/Endpoints/CodebookEndpoints.cs` | BE-CODEBOOK-06 — implementirano |
| `src/Api/Endpoints/RoleManagementEndpoints.cs` | BE-ROLE-02 — implementirano |
| `src/Application/Common/HttpHeaders.cs` | Konstanta za X-Correlation-ID header |
| `src/Application/Security/RolePermissionMatrix.cs` | Matrica rola i permissiona |
