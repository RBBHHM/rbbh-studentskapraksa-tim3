# Login tok i preusmeravanje po roli

## Pregled

Ovaj dokument definira:
- visoki nivo login toka (OAuth2 / OIDC putem Keycloak)
- kontrakt za `/api/me` endpoint (Hamzina implementacija)
- pravila preusmeravanja na osnovu role
- pravila za korisnike s više rola
- pravila za neaktivne module
- edge case listu (EC-AUTH-01 do EC-AUTH-15)
- raspodjelu odgovornosti između tima

> **Opseg Aminog rada:** Arhitektura, kontrakt, pravila, dokumentacija.
> **NE implementira:** Keycloak konfiguraciju, JWT Bearer middleware, frontend login ekran, frontend redirect logiku, QA testove.

---

## 1. Login tok (visoki nivo)

```
Korisnik
  │
  ▼
[Blazor frontend]
  │  Korisnik klikne "Prijavi se"
  │
  ▼
[Keycloak (OIDC Authorization Code Flow)]
  │  Keycloak provjerava korisnika
  │  Keycloak izdaje JWT access token + refresh token
  │  Token sadrži flat role claim-ove: "role": "Administrator"
  │
  ▼
[Blazor frontend prima token]
  │  Čuva token (secure cookie / session storage — odluka frontend tima)
  │
  ▼
GET /api/me  ──► [ASP.NET Core backend]
  │               │
  │               ├─ Validira JWT potpis (Keycloak public key)
  │               ├─ PermissionClaimsTransformation čita role → izračunava permissions
  │               └─ /api/me endpoint čita claims → vraća UserMeResponse
  │
  ▼
[Frontend prima UserMeResponse]
  │  Koristi defaultRoute iz odgovora
  │
  ▼
Redirect na defaultRoute (npr. /admin/dashboard)
```

### Keycloak JWT struktura (relevantan dio)

```json
{
  "sub": "kc-user-uuid-abc123",
  "preferred_username": "jdoe",
  "name": "John Doe",
  "email": "jdoe@example.com",
  "role": "Administrator"
}
```

> Keycloak koristi flat claim `"role"` (singular) — ne standardni `realm_access.roles`.
> `PermissionClaimsTransformation` čita ovaj claim.

---

## 2. `/api/me` — Backend kontrakt

> **Odgovoran za implementaciju: Hamza**
> Amina definiše kontrakt; Hamza implementira endpoint.

### Request

```
GET /api/me
Authorization: Bearer <token>
```

Zahtijeva autentifikovanog korisnika. Bez tokena → 401 Unauthorized.

### Response (200 OK)

```json
{
  "userId": "kc-user-uuid-abc123",
  "username": "jdoe",
  "displayName": "John Doe",
  "email": "jdoe@example.com",
  "roles": ["Administrator"],
  "permissions": [
    "users.view",
    "roles.view",
    "roles.assign",
    "roles.remove",
    "roles.transfer-admin",
    "records.create",
    "records.view-own",
    "records.update-own-draft",
    "records.submit-for-verification",
    "records.view-pending-verification",
    "records.approve",
    "records.reject",
    "records.view-history",
    "codebooks.view",
    "codebooks.manage",
    "audit.view-security",
    "admin.access"
  ],
  "defaultRoute": "/admin/dashboard",
  "availableModules": [
    {
      "moduleKey": "admin-dashboard",
      "label": "Administratorska ploča",
      "defaultRoute": "/admin/dashboard",
      "isVisible": true,
      "isEnabled": true,
      "disabledReason": null
    },
    {
      "moduleKey": "codebooks",
      "label": "Šifarnici",
      "defaultRoute": "/admin/codebooks",
      "isVisible": true,
      "isEnabled": true,
      "disabledReason": null
    },
    {
      "moduleKey": "audit",
      "label": "Revizijski log",
      "defaultRoute": "/admin/audit",
      "isVisible": true,
      "isEnabled": true,
      "disabledReason": null
    },
    {
      "moduleKey": "users",
      "label": "Korisnici",
      "defaultRoute": "/admin/users",
      "isVisible": true,
      "isEnabled": true,
      "disabledReason": null
    }
  ]
}
```

### `UserModuleDto` — definirano u kontraktu (nije produkcijska klasa)

```csharp
// Kontrakt — Hamza implementira kao pravi DTO u Application sloju
public sealed record UserModuleDto(
    string ModuleKey,
    string Label,
    string DefaultRoute,
    bool IsVisible,
    bool IsEnabled,
    string? DisabledReason
);
```

### Opis polja

| Polje | Tip | Opis |
|---|---|---|
| `userId` | `string` | Keycloak Subject claim (`sub`) |
| `username` | `string` | Keycloak `preferred_username` |
| `displayName` | `string` | Keycloak `name` (full name) |
| `email` | `string` | Keycloak `email` |
| `roles` | `string[]` | Role iz JWT tokena (filtrirano na poznate role iz `AppRoles.All`) |
| `permissions` | `string[]` | Izvedene permission-e iz `RolePermissionMatrix` |
| `defaultRoute` | `string` | Frontend ruta na koju se redirect-uje nakon login-a |
| `availableModules` | `UserModuleDto[]` | Moduli vidljivi/dostupni korisniku |

### `availableModules` — pravila vidljivosti i dostupnosti

- `isVisible = false`: modul se ne prikazuje u navigaciji
- `isVisible = true, isEnabled = false`: modul se prikazuje ali je siv/disabled (sa porukom `disabledReason`)
- `isVisible = true, isEnabled = true`: modul je potpuno dostupan

> Ova polja su **UI hints** — backend uvijek provjerava permission-e za svaki API poziv bez obzira na ovaj odgovor.

### Error odgovori

| Situacija | HTTP status | Opis |
|---|---|---|
| Nema Authorization header-a | 401 Unauthorized | Token nije proslijeđen |
| Token istekao | 401 Unauthorized | `exp` claim u prošlosti |
| Token nevažeći potpis | 401 Unauthorized | Nije potpisan Keycloak ključem |
| Korisnik nema poznate role | 200 OK | `roles: []`, `permissions: []`, `defaultRoute: "/no-access"` |
| Korisnik deaktiviran u Keycloaku | 401 Unauthorized | Keycloak ne izdaje validan token |

---

## 3. Mapa preusmeravanja po roli

### Primarna ruta po roli

| Rola | defaultRoute | Opis |
|---|---|---|
| `Administrator` | `/admin/dashboard` | Administratorska kontrolna ploča |
| `Verifikator` | `/verifikator/dashboard` | Pregled zapisa čekajućih verifikaciju |
| `Unosnik` | `/unosnik/dashboard` | Kreiranje i pregled vlastitih zapisa |
| (nema poznate role) | `/no-access` | Stranica s objašnjenjem + kontakt admina |

### Moduli i neophodne permission-e

| Modul | moduleKey | Potrebna permission | Pristup |
|---|---|---|---|
| Admin ploča | `admin-dashboard` | `admin.access` | Samo Administrator |
| Unosnik ploča | `unosnik-dashboard` | `records.create` | Unosnik (+ Administrator) |
| Verifikator ploča | `verifikator-dashboard` | `records.view-pending-verification` | Verifikator (+ Administrator) |
| Šifarnici (pregled) | `codebooks` | `codebooks.view` | Sve role |
| Šifarnici (upravljanje) | `codebooks-manage` | `codebooks.manage` | Samo Administrator |
| Korisnici | `users` | `users.view` | Samo Administrator |
| Revizijski log | `audit` | `audit.view-security` | Samo Administrator |

---

## 4. Pravila za korisnike s više rola

Korisnik može imati više rola u Keycloak tokenu (npr. `Unosnik` i `Verifikator`).

### Izračun permission-a

Permission-e su **unija** svih rola:
```
korisnik.permissions = UNION(permissions(rola1), permissions(rola2), ...)
```

Implementirano u `RolePermissionMatrix.GetPermissionsForRoles()`.

### Određivanje `defaultRoute`

Prioritet rola za određivanje defaultRoute:

```
Administrator  (prioritet 1) → /admin/dashboard
Verifikator    (prioritet 2) → /verifikator/dashboard
Unosnik        (prioritet 3) → /unosnik/dashboard
```

Korisnik koji ima `Unosnik + Verifikator` → defaultRoute = `/verifikator/dashboard` (viši prioritet).

### Pravilo zabrane samoverifikacije

Posjedovanje obje role `Unosnik` i `Verifikator` **NE dozvoljava** korisniku da verificira vlastiti zapis.
Ovo se ne može zaobići kombinovanjem rola.

> Implementacija: `IRecordAuthorizationService.CanVerifyAsync()` provjerava `record.CreatedByUserId != currentUser.UserId`.
> Ovo pravilo je na backend nivou — nije vidljivo iz permission-a.

### Napomena o admin.access

Ako korisnik ima Administrator rolu, `admin.access` permission je uključena.
Ostale role nemaju `admin.access` ni kombinovanjem.

---

## 5. Pravila za neaktivne module

Modul može biti:
- **neaktivan zbog nedostupnosti funkcionalnosti** (npr. modul još nije implementiran)
- **neaktivan za specifičnog korisnika** (npr. rola mu ne daje pristup)

### Logika u `/api/me`

```
Za svaki modul:
  korisnikovePermissions.Contains(modulRequiredPermission)
    → true  : isVisible = true, isEnabled = true
    → false : isVisible = false  (modul se ne šalje ili je skriven)

Iznimka: modul u razvoju (feature flag = false)
    → isVisible = false za sve korisnike bez obzira na permission
```

### Poruke za disabled module (primjeri `disabledReason`)

| Situacija | disabledReason |
|---|---|
| Modul u razvoju | `"Ovaj modul je u pripremi i bit će dostupan uskoro."` |
| Korisnik nema permission | *(modul se ne šalje — ne prikazuje se)* |
| Tehnički problem na serveru | `"Modul privremeno nije dostupan. Kontaktirajte administratora."` |

> **Pravilo:** Backend nikad ne šalje modul koji korisnik nema pravo vidjeti.
> Frontend može koristiti `isEnabled = false` za module koji su vidljivi ali ne i klikabilni.

---

## 6. Edge case lista (EC-AUTH-01 do EC-AUTH-15)

| ID | Scenarij | Očekivano ponašanje |
|---|---|---|
| EC-AUTH-01 | Token istekao tokom aktivne sesije | 401 pri prvom API pozivu nakon isteka; frontend automatski koristi refresh token; ako i refresh istekao → redirect na login |
| EC-AUTH-02 | Korisnik nema nijednu poznatu rolu | `/api/me` vraća `roles: []`, `permissions: []`, `defaultRoute: "/no-access"`; frontend prikazuje stranicu s objašnjenjem |
| EC-AUTH-03 | Korisnik ima nepoznatu rolu (ne postoji u `AppRoles.All`) | Nepoznata rola se ignorira; token ostaje validan; samo poznate role se mapiraju |
| EC-AUTH-04 | Korisnik ima više rola | Permission-e = unija; defaultRoute = po prioritetu (Administrator > Verifikator > Unosnik) |
| EC-AUTH-05 | Korisnik deaktiviran u Keycloak admin konzoli | Keycloak ne može izdati novi token; refresh token nevažeći; sesija istječe prirodno; korisnik mora ponovo na login |
| EC-AUTH-06 | Rola dodijeljena korisniku dok je u aktivnoj sesiji | Stari token ne uključuje novu rolu; nova rola aktivna tek pri sljedećem login-u (ili refresh tokena ako Keycloak podržava) |
| EC-AUTH-07 | Rola uklonjena korisniku dok je u aktivnoj sesiji | Stari token i dalje validan do isteka; backend validira permission-e prema claims u tokenu; permission je "zastarjela" dok token ne istekne |
| EC-AUTH-08 | Keycloak nedostupan pri pokušaju login-a | Frontend prikazuje grešku "Servis za autentifikaciju trenutno nije dostupan. Pokušajte ponovo." |
| EC-AUTH-09 | Korisnik ručno navigira na URL modula bez permission-e | Backend vraća 403; frontend prikazuje "Nemate pristup ovoj stranici" |
| EC-AUTH-10 | Administrator pokušava pristupiti `/unosnik/...` ruti | Administrator ima `records.create` permission → pristup dozvoljen (rute nisu role-locked, samo permission-locked) |
| EC-AUTH-11 | JWT potpisan nepoznatim ključem | Backend validacija potpisa padne → 401 Unauthorized |
| EC-AUTH-12 | Frontend šalje zahtjev bez Authorization headera | 401 Unauthorized; frontend redirect na login |
| EC-AUTH-13 | Korisnik ima i `Unosnik` i `Verifikator` rolу i pokušava samoverifikaciju | Backend `IRecordAuthorizationService` blokira; 403 Forbidden s porukom o zabrani samoverifikacije |
| EC-AUTH-14 | `/api/me` pozvan bez tokena | 401 Unauthorized (nije `UseAuthentication()` skip — endpoint mora biti zaštićen) |
| EC-AUTH-15 | Refresh token istekao | Frontend ne može obnoviti sesiju → redirect na login; korisnik ne gubi podatke u formi (frontend odgovornost) |

---

## 7. Ograničenja i napomene za implementatora

### Što backend (Hamza) mora napraviti za `/api/me`

1. Endpoint registrovan pod `GET /api/me`
2. Zaštićen autentifikacijom (token obavezan)
3. Čita `userId` iz `ICurrentUserService.UserId`
4. Čita `roles` iz `ICurrentUserService.Roles`
5. Izračunava `permissions` putem `RolePermissionMatrix.GetPermissionsForRoles(roles)`
6. Određuje `defaultRoute` prema prioritetu rola
7. Gradi `availableModules` na osnovu permission-a
8. Vraća `UserMeResponse` (novi DTO koji Hamza kreira u `Application/Auth/Models/`)

### Što frontend tim mora napraviti

1. OIDC login flow prema Keycloak-u
2. Čuvanje tokena (secure storage)
3. Interceptor za automatski refresh tokena
4. Parsiranje `defaultRoute` iz `/api/me` odgovora
5. Redirect nakon uspješnog `/api/me`
6. Prikaz/skrivanje navigacije prema `availableModules`

### Što Keycloak admin mora podesiti

1. Kreirati realm i klijenta za aplikaciju
2. Kreirati role: `Administrator`, `Unosnik`, `Verifikator`
3. Konfigurirati JWT claim `"role"` (flat, singular)
4. Podesiti token expiry i refresh token politiku
5. Postaviti allowed redirect URLs

> **NIKADA ne commitujte stvarne Keycloak admin lozinke!**
> Koristiti `.env.example` za primjer konfiguracije, ne stvarne tajne.

---

## 8. Raspodjela odgovornosti

| Zadatak | Odgovornost |
|---|---|
| Ovaj dokument (arhitektura, kontrakt, pravila) | Amina ✅ |
| `/api/me` endpoint implementacija | Hamza |
| `UserMeResponse` i `UserModuleDto` DTO klase | Hamza |
| Keycloak realm + klijent konfiguracija | DevOps / Keycloak admin |
| Frontend login ekran (Blazor) | Frontend tim |
| Frontend redirect logika | Frontend tim |
| Frontend navigacija prema `availableModules` | Frontend tim |
| QA testovi za login tok | QA tim |
| `ICurrentUserService` implementacija | Postoji (`Infrastructure/Auth/CurrentUserService.cs`) |
| `PermissionClaimsTransformation` | Postoji (`Infrastructure/Auth/PermissionClaimsTransformation.cs`) |
| `RolePermissionMatrix` | Postoji, ažuriran |
