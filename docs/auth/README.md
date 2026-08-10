# Auth — Autentifikacija i autorizacija

Ovaj folder sadrži dokumentaciju za login tok, preusmeravanje po roli i prihvaćajuće kriterije.

## Šta je implementirano (backend, gotovo)

| Komponenta | Putanja | Status |
|---|---|---|
| `AppRoles` konstante | `src/Application/Security/AppRoles.cs` | ✅ |
| `AppPermissions` konstante | `src/Application/Security/AppPermissions.cs` | ✅ |
| `AppPolicies` konstante | `src/Application/Security/AppPolicies.cs` | ✅ |
| `RolePermissionMatrix` | `src/Application/Security/RolePermissionMatrix.cs` | ✅ |
| `PermissionClaimsTransformation` | `src/Infrastructure/Auth/PermissionClaimsTransformation.cs` | ✅ |
| `CurrentUserService` | `src/Infrastructure/Auth/CurrentUserService.cs` | ✅ |
| `UserPermissionsResponse` | `src/Application/Security/Models/UserPermissionsResponse.cs` | ✅ |
| Permission policy registracija | `src/Api/Extensions/ServiceCollectionExtensions.cs` | ✅ |

## Šta tek treba implementirati

| Zadatak | Odgovoran | Napomena |
|---|---|---|
| `GET /api/me` endpoint | **Hamza** | Kontrakt u `login-flow-and-role-redirect.md` |
| `UserMeResponse` DTO | **Hamza** | U `Application/Auth/Models/` |
| `UserModuleDto` DTO | **Hamza** | Kontrakt u `login-flow-and-role-redirect.md` |
| Keycloak realm konfiguracija | **DevOps** | Ne commitovati tajne! |
| JWT Bearer middleware | **Hamza** | TODO komentar u `ServiceCollectionExtensions.cs` |
| `UseAuthentication()` | **Hamza** | TODO komentar u `WebApplicationExtensions.cs` |
| Frontend login ekran | **Frontend tim** | Blazor OIDC integracija |
| Frontend redirect logika | **Frontend tim** | Koristi `defaultRoute` iz `/api/me` |

## Sadržaj foldera

| Fajl | Opis |
|---|---|
| `login-flow-and-role-redirect.md` | Kompletan login tok, `/api/me` kontrakt, redirect mapa, edge case lista |
| `login-flow-acceptance-checklist.md` | 15-stavčana lista za manuelno testiranje |
| `login-auth-work-log.md` | Radni dnevnik: šta, ko, zašto |
| `README.md` | Ovaj fajl — brzi pregled za tim |

## Brzi pregled: Ko ima šta

```
Administrator  → /admin/dashboard
               → admin.access, codebooks.manage, audit.view-security, users.view, + sve ostalo

Verifikator    → /verifikator/dashboard
               → records.view-pending-verification, records.approve, records.reject,
                 records.view-history, codebooks.view

Unosnik        → /unosnik/dashboard
               → records.create, records.view-own, records.update-own-draft,
                 records.submit-for-verification, codebooks.view

Više rola      → defaultRoute po prioritetu: Administrator > Verifikator > Unosnik
               → permissions = unija svih rola
               → samoverifikacija blokirana na backend nivou (nije zaobilazeća rolama)
```

## Važna pravila

1. **Backend uvijek validira permission** — `/api/me` odgovor je UI hint, ne sigurnosni mehanizam
2. **Ne hardkodovati role stringove** — koristiti `AppRoles.*`, `AppPermissions.*`, `AppPolicies.*`
3. **Samoverifikacija blokirana** — korisnik ne može verificirati vlastiti zapis ni sa obje role
4. **Keycloak tajne ne idu u kod** — koristiti `.env.example` za primjer konfiguracije
5. **Nepoznate role se ignorišu** — backend filtrira na `AppRoles.All`

## Dijagram toka (ukratko)

```
Login → Keycloak (OIDC) → JWT token
     → GET /api/me → UserMeResponse
     → Frontend čita defaultRoute
     → Redirect na odgovarajući dashboard
```

Za detalje, vidjeti [login-flow-and-role-redirect.md](login-flow-and-role-redirect.md).
