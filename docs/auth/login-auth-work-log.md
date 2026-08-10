# Login / Auth — Radni dnevnik

Ovaj fajl bilježi šta je urađeno, zašto, i ko je odgovoran za šta u okviru login / auth user story-ja.

---

## Pregled zadataka

| ID | Zadatak | Odgovoran | Status |
|---|---|---|---|
| AUTH-DOC-01 | Login flow arhitektura i `/api/me` kontrakt | Amina | ✅ Završeno |
| AUTH-DOC-02 | Redirect mapa po roli | Amina | ✅ Završeno |
| AUTH-DOC-03 | Pravila za multi-role korisnike | Amina | ✅ Završeno |
| AUTH-DOC-04 | Edge case lista (EC-AUTH-01 do EC-AUTH-15) | Amina | ✅ Završeno |
| AUTH-DOC-05 | Acceptance checklist za QA | Amina | ✅ Završeno |
| AUTH-BE-01 | `GET /api/me` endpoint implementacija | Hamza | Čekanje |
| AUTH-BE-02 | `UserMeResponse` i `UserModuleDto` DTO klase | Hamza | Čekanje |
| AUTH-BE-03 | `UseAuthentication()` + JWT Bearer middleware | Hamza | Čekanje |
| AUTH-INFRA-01 | Keycloak realm + klijent konfiguracija | DevOps | Čekanje |
| AUTH-FE-01 | Frontend OIDC login ekran (Blazor) | Frontend tim | Čekanje |
| AUTH-FE-02 | Frontend redirect logika (`defaultRoute`) | Frontend tim | Čekanje |
| AUTH-FE-03 | Frontend navigacija po `availableModules` | Frontend tim | Čekanje |
| AUTH-QA-01 | Izvršavanje acceptance checklist (15 AC) | QA tim | Čekanje |

---

## Šta je Amina napravila

### AUTH-DOC-01 — Login flow arhitektura i kontrakt

**Fajl:** `docs/auth/login-flow-and-role-redirect.md`

Definiran kompletan tok:
- OAuth2/OIDC Authorization Code Flow putem Keycloak
- Keycloak JWT struktura (flat `"role"` claim)
- Kontrakt za `/api/me` endpoint sa svim poljima i tipovima
- `UserModuleDto` kao dokumentacijski kontrakt (nije produkcijska klasa)
- Error odgovori za sve neispravne situacije

**Zašto ovako:**
Hamza implementira `/api/me`, ali frontend tim treba znati šta očekivati u odgovoru.
Kontrakt mora biti definiran prije implementacije da bi oba tima radila paralelno.

---

### AUTH-DOC-02 — Redirect mapa

**Fajl:** `docs/auth/login-flow-and-role-redirect.md`, Sekcija 3

Definirano:
- Administrator → `/admin/dashboard`
- Verifikator → `/verifikator/dashboard`
- Unosnik → `/unosnik/dashboard`
- Bez role → `/no-access`

Tabela modula s neophodnim permission-ama izvedena iz postojećeg `RolePermissionMatrix`.

---

### AUTH-DOC-03 — Multi-role pravila

**Fajl:** `docs/auth/login-flow-and-role-redirect.md`, Sekcija 4

Definirano:
- Permission-e = unija svih rola (implementirano u `RolePermissionMatrix.GetPermissionsForRoles`)
- Priority red za `defaultRoute`: Administrator (1) > Verifikator (2) > Unosnik (3)
- Zabrana samoverifikacije — eksplicitno navedeno kao backend pravilo van permission modela

**Zašto ovako:**
Bez pisanog pravila o prioritetu rola, frontend tim bi mogao koristiti nasumičan redosljed.
Ovo je poslovni zahtjev, ne tehnička preferencija.

---

### AUTH-DOC-04 — Edge case lista

**Fajl:** `docs/auth/login-flow-and-role-redirect.md`, Sekcija 6

15 edge case-ova (EC-AUTH-01 do EC-AUTH-15) pokrivaju:
- Istekle tokene i refresh scenarije
- Korisnike bez rola i s nepoznatim rolama
- Multi-role konfliktne situacije
- Keycloak nedostupnost
- Tampered JWT
- Pristup zabranjenim modulima

---

### AUTH-DOC-05 — Acceptance checklist

**Fajl:** `docs/auth/login-flow-acceptance-checklist.md`

15 AC stavki (AC-01 do AC-15) za manualno testiranje.
Svaka stavka ima:
- Korake za reprodukciju
- Listu checkbox-a za verificiranje

---

## Ključne arhitekturne odluke

### Odluka 1: `/api/me` kao jedinstven endpoint za sve role

**Alternativa:** poseban endpoint po roli (`/api/me/admin`, `/api/me/unosnik`)

**Zašto `/api/me`:**
- Frontend ima jednu tačku gdje dobija sve što treba za inicijalizaciju UI-a
- Manje duplikacije koda u backendu
- Keycloak token je jedinstven bez obzira na rolu
- Lakše dodavanje novih rola bez promjene frontend inicijalizacije

---

### Odluka 2: `defaultRoute` u odgovoru servera, ne hardkodovano na frontendu

**Alternativa:** Frontend sam zna gdje da pošalje koga na osnovu rola

**Zašto server:**
- Pravila preusmeravanja su poslovna pravila — trebaju biti na backendu
- Ako se rola ili struktura promijeni, frontend ne treba deployment
- Testabilno: backend test verificira tačan `defaultRoute` za svaki skup rola

---

### Odluka 3: Nepoznate role se ignorišu (ne greška)

**Zašto:**
- Ako Keycloak doda novu rolu koja još nije u `AppRoles.All`, aplikacija ne smije pasti
- Korisnik dobiva samo permission-e za poznate role
- Administrator može pregledati audit log korisnika s nepoznatim rolama

---

### Odluka 4: `availableModules` je UI hint, ne sigurnosni mehanizam

**Zašto:**
- Frontend može biti zaobiđen direktnim API pozivima
- Jedini pouzdan sigurnosni mehanizam je backend permission check
- `availableModules` štedi frontend od nepotrebnih API poziva koji bi svejedno završili 403

---

## Fajlovi koje Hamza treba kreirati

```
src/Application/Auth/
├── Models/
│   ├── UserMeResponse.cs       — puni response DTO za /api/me
│   └── UserModuleDto.cs        — DTO za jedan modul u availableModules

src/Api/Endpoints/
└── MeEndpoints.cs              — GET /api/me endpoint (po uzoru na CodebookEndpoints.cs)
```

### Minimalni kontrakt za `UserMeResponse`

```csharp
// Hamza kreira ovo u Application/Auth/Models/
public sealed record UserMeResponse(
    string UserId,
    string Username,
    string DisplayName,
    string Email,
    IReadOnlyList<string> Roles,
    IReadOnlyList<string> Permissions,
    string DefaultRoute,
    IReadOnlyList<UserModuleDto> AvailableModules
);

public sealed record UserModuleDto(
    string ModuleKey,
    string Label,
    string DefaultRoute,
    bool IsVisible,
    bool IsEnabled,
    string? DisabledReason
);
```

### Preporučeni pristup za `DefaultRoute`

```csharp
// Logika za određivanje defaultRoute po prioritetu
private static string DetermineDefaultRoute(IReadOnlyList<string> roles)
{
    if (roles.Contains(AppRoles.Administrator)) return "/admin/dashboard";
    if (roles.Contains(AppRoles.Verifikator))   return "/verifikator/dashboard";
    if (roles.Contains(AppRoles.Unosnik))       return "/unosnik/dashboard";
    return "/no-access";
}
```

---

## Veza s postojećim kodom

| Postojeća klasa | Gdje | Kako se koristi u /api/me |
|---|---|---|
| `ICurrentUserService` | `Infrastructure/Auth/CurrentUserService.cs` | Čita `UserId`, `Username`, `Roles` |
| `RolePermissionMatrix` | `Application/Security/RolePermissionMatrix.cs` | `GetPermissionsForRoles(roles)` za `Permissions` |
| `AppRoles` | `Application/Security/AppRoles.cs` | Konstante za role nazive i prioritet |
| `AppPermissions` | `Application/Security/AppPermissions.cs` | Konstante za provjerumodulskog pristupa |
| `UserPermissionsResponse` | `Application/Security/Models/UserPermissionsResponse.cs` | Može se proširiti ili koristiti kao baza za `UserMeResponse` |

---

## Napomene o sigurnosti

- **Ne ubacuj tajne, lozinke, connection stringove ili Keycloak secret-e u kod.**
- **Koristi `.env.example` za primjer konfiguracije, a ne stvarne tajne.**
- **NIKADA ne commitujte stvarne admin lozinke!**
- **Ne smiješ hardkodovati secrets.**

Keycloak konfiguracija ide u `appsettings.Development.json` (lokalno) ili environment varijable (staging/prod).
Primjer konfiguracije: `appsettings.example.json` ili `.env.example`.
