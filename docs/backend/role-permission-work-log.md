# Role/Permission — Work Log i Mapa Implementacije

## 1. Sažetak

U okviru BE-ROLE-01 taska definisana su kompletna backend role/permission pravila za user story "Upravljanje rolama i ovlaštenjima". Postavljene su centralne role (`Administrator`, `Unosnik`, `Verifikator`), svih 17 permission-a, permission policy pravila, `RolePermissionMatrix`, skeleton interfejsi za servisnu logiku, DTO-i za svaku akciju, field visibility model i dokumentovana su sva poslovna pravila. Ovo je foundation layer koji ostali timovi koriste pri implementaciji konkretnih feature-a.

---

## 2. Lista fajlova i lokacija

### Application sloj — Security

| Fajl | Lokacija | Svrha |
|---|---|---|
| `AppRoles.cs` | `src/Application/Security/` | Centralna definicija rola (Administrator, Unosnik, Verifikator) |
| `AppPermissions.cs` | `src/Application/Security/` | Sve permission konstante (17 komada) i `All[]` niz |
| `AppPolicies.cs` | `src/Application/Security/` | Policy nazivi — identični permission konstantama |
| `RolePermissionMatrix.cs` | `src/Application/Security/` | Mapiranje rola na permission-e, `GetPermissionsForRoles()` |
| `README.md` | `src/Application/Security/` | Kratki vodič: kako dodati rolu/permission, kako zaštititi endpoint |
| `FieldVisibility.cs` | `src/Application/Security/Models/` | Enum: Hidden, ReadOnly, Editable |
| `RecordCapabilities.cs` | `src/Application/Security/Models/` | Capabilities objekt za konkretan zapis i korisnika |
| `UserPermissionsResponse.cs` | `src/Application/Security/Models/` | DTO za `GET /api/me/permissions` odgovor |
| `IUserPermissionService.cs` | `src/Application/Security/Interfaces/` | Izračun permission-a za korisnika |
| `IRoleManagementService.cs` | `src/Application/Security/Interfaces/` | Dodjela, uklanjanje, transfer admin role |
| `IRecordAuthorizationService.cs` | `src/Application/Security/Interfaces/` | Provjera prava na konkretan zapis |
| `IFieldAuthorizationService.cs` | `src/Application/Security/Interfaces/` | Field-level provjera i zabrana forbidden polja |
| `AssignRoleRequest.cs` | `src/Application/Security/DTOs/` | Request DTO za `POST /api/roles/assign` |
| `RemoveRoleRequest.cs` | `src/Application/Security/DTOs/` | Request DTO za `POST /api/roles/remove` |
| `TransferAdminRoleRequest.cs` | `src/Application/Security/DTOs/` | Request DTO za `POST /api/roles/transfer-admin` |

### Infrastructure sloj — Auth

| Fajl | Lokacija | Svrha |
|---|---|---|
| `PermissionClaimsTransformation.cs` | `src/Infrastructure/Auth/` | JWT role claims → permission claims (putem RolePermissionMatrix) |
| `ClaimsPrincipalExtensions.cs` | `src/Infrastructure/Auth/` | Extension metode: GetUserId, GetRoles, HasPermission |
| `CurrentUserService.cs` | `src/Infrastructure/Auth/` | Implementacija ICurrentUserService — čita usera iz HttpContext |
| `KeycloakOptions.cs` | `src/Infrastructure/Auth/` | POCO config za Keycloak postavke |
| `UserPermissionService.cs` | `src/Infrastructure/Security/` | Implementacija IUserPermissionService |

### API sloj — Extensions

| Fajl | Lokacija | Svrha |
|---|---|---|
| `AuthorizationExtensions.cs` | `src/Api/Extensions/` | `AddPermissionPolicies()` — auto-registracija svih policy-ja iz `AppPermissions.All` |
| `ServiceCollectionExtensions.cs` | `src/Api/Extensions/` | Poziva `AddPermissionPolicies()`, registruje security servise |

### Application sloj — Audit

| Fajl | Lokacija | Relevantne konstante |
|---|---|---|
| `AuditActions.cs` | `src/Application/Audit/` | `UserRoleAssigned`, `UserRoleRemoved`, `AdminRoleTransferred`, `LastAdminRoleRemovalBlocked`, `SelfVerificationBlocked`, `ForbiddenFieldUpdateAttempt`, `UnauthorizedAccessAttempt` |

### Dokumentacija

| Fajl | Lokacija | Svrha |
|---|---|---|
| `role-permission-rules.md` | `docs/backend/` | Kompletna dokumentacija: 18 BR pravila, 24 EC edge case-a, tabele, akcije |
| `role-permission-work-log.md` | `docs/backend/` | Ovaj fajl — mapa implementacije za tim |
| `role-management-acceptance-checklist.md` | `docs/backend/` | Acceptance checklist za ručnu provjeru |
| `role-management-review-checklist.md` | `docs/backend/` | Review checklist za Aminin backend review |

---

## 3. Tok autorizacije (korak po korak)

```
1. Korisnik se prijavi → Keycloak izdaje JWT token
   Token sadrži: "role": "Administrator"  (flat claim)

2. Backend prima zahtjev s Authorization: Bearer <token>
   UseAuthentication() validira potpis tokena

3. PermissionClaimsTransformation.TransformAsync()
   → Čita "role" claims iz tokena
   → Poziva RolePermissionMatrix.GetPermissionsForRoles(roles)
   → Dodaje "permission" claims u ClaimsPrincipal
   (npr. "permission": "codebooks.manage", "permission": "admin.access", ...)

4. Endpoint .RequireAuthorization(AppPolicies.CodebooksManage)
   → Provjera: postoji li claim "permission" = "codebooks.manage"?
   → Postoji  → 200 (nastavlja)
   → Ne postoji → 403 Forbidden

5. Unutar handler-a:
   ICurrentUserService.Roles → čita role
   ICurrentUserService.UserId → čita userId
   IFieldAuthorizationService → provjerava field-level prava
   IRecordAuthorizationService → provjerava maker-checker pravilo
```

---

## 4. Gdje se dodaje nova rola

1. **`AppRoles.cs`** — dodati konstantu i u `All[]` niz
2. **`RolePermissionMatrix.PermissionsByRole`** — dodati entry za novu rolu
3. **`docs/backend/role-permission-rules.md`** — dokumentovati rolu (sekcije 3, 5, i 21)
4. **Keycloak** (Ernad) — kreirati rolu u realm-u

Nema potrebe mijenjati endpoint-e — permission model je Open/Closed.

---

## 5. Gdje se dodaje novi permission

1. **`AppPermissions.cs`** — dodati konstantu i u `All[]` niz
2. **`AppPolicies.cs`** — dodati konstantu (identičnu permission vrijednosti)
3. **`RolePermissionMatrix.PermissionsByRole`** — dodijeliti permission odgovarajućim rolama
4. **Endpoint** — zaštititi s `.RequireAuthorization(AppPolicies.NoviPermission)`
5. **`docs/backend/role-permission-rules.md`** — dodati u tabelu permission-a i matricu

Policy se **automatski** registruje jer `AddPermissionPolicies()` iterira `AppPermissions.All`.

---

## 6. Kako endpoint koristi policy

```csharp
// Minimal API (preporučeni pristup)
app.MapPost("/api/roles/assign", handler)
   .RequireAuthorization(AppPolicies.RolesAssign);

app.MapPost("/api/roles/remove", handler)
   .RequireAuthorization(AppPolicies.RolesRemove);

app.MapPost("/api/roles/transfer-admin", handler)
   .RequireAuthorization(AppPolicies.RolesTransferAdmin);

app.MapGet("/api/users", handler)
   .RequireAuthorization(AppPolicies.UsersView);

// Controller
[Authorize(Policy = AppPolicies.RolesAssign)]
public IActionResult AssignRole([FromBody] AssignRoleRequest request) { ... }

// NIKAD OVAKO:
[Authorize(Roles = "Administrator")]           // hardkodovan string
.RequireAuthorization(p => p.RequireRole("Administrator"))  // zaobilazi permission model
```

---

## 7. Šta je završeno

| Komponenta | Status |
|---|---|
| AppRoles, AppPermissions, AppPolicies | ✅ Završeno |
| RolePermissionMatrix (17 permissiona, 3 role) | ✅ Završeno |
| PermissionClaimsTransformation | ✅ Završeno |
| ClaimsPrincipalExtensions | ✅ Završeno |
| CurrentUserService | ✅ Završeno |
| UserPermissionService (implementacija) | ✅ Završeno |
| AuthorizationExtensions (auto policy reg.) | ✅ Završeno |
| FieldVisibility enum (Hidden/ReadOnly/Editable) | ✅ Završeno |
| RecordCapabilities model | ✅ Završeno |
| UserPermissionsResponse DTO | ✅ Završeno |
| IRoleManagementService interface + prav. komentari | ✅ Završeno |
| IRecordAuthorizationService interface | ✅ Završeno |
| IFieldAuthorizationService interface | ✅ Završeno |
| AssignRoleRequest, RemoveRoleRequest, TransferAdminRoleRequest | ✅ Završeno |
| AuditActions za sigurnosne događaje | ✅ Završeno |
| Application/Security/README.md | ✅ Završeno |
| role-permission-rules.md (18 BR, 24 EC) | ✅ Završeno |
| codebooks.manage permission (BE-CODEBOOK task) | ✅ Završeno + dokumentovano |
| role-permission-work-log.md | ✅ Završeno (ovaj fajl) |
| role-management-acceptance-checklist.md | ✅ Završeno |
| role-management-review-checklist.md | ✅ Završeno |

---

## 8. Šta ostaje TODO po odgovornostima

### Amina
- [ ] Review implementacije nakon što Hamza završi endpoint-e (koristiti `role-management-review-checklist.md`)

### Hamza (backend endpoint implementacije)
- [ ] `GET /api/me/permissions` endpoint (`IUserPermissionService` je spreman)
- [ ] `POST /api/roles/assign` → `.RequireAuthorization(AppPolicies.RolesAssign)`
- [ ] `POST /api/roles/remove` → `.RequireAuthorization(AppPolicies.RolesRemove)`
- [ ] `POST /api/roles/transfer-admin` → `.RequireAuthorization(AppPolicies.RolesTransferAdmin)`
- [ ] `GET /api/users` → `.RequireAuthorization(AppPolicies.UsersView)`
- [ ] `GET /api/users/{id}/roles` → `.RequireAuthorization(AppPolicies.UsersView)`
- [ ] Implementacija `IRoleManagementService` (zahtijeva User entitet i repozitorij)
- [ ] Implementacija `IRecordAuthorizationService` (zahtijeva Record entitet)
- [ ] Implementacija `IFieldAuthorizationService` (zahtijeva Record entitet)

### Ernad (Keycloak i JWT)
- [ ] Keycloak realm konfiguracija — kreirati role Administrator, Unosnik, Verifikator
- [ ] Protocol mapper: flat `"role"` claim u JWT tokenu
- [ ] JWT Bearer middleware u `ServiceCollectionExtensions.cs` (TODO komentar postoji)
- [ ] `app.UseAuthentication()` u `WebApplicationExtensions.cs` (TODO komentar postoji)
- [ ] Dostaviti primjer stvarnog JWT tokena timu za provjeru

### Frontend tim
- [ ] Ekran za administraciju korisnika i rola
- [ ] Prikaz trenutnih i novih rola
- [ ] Potvrde osjetljivih akcija (transfer admina)
- [ ] Sakrivanje/disabling akcija za koje korisnik nema permission
- [ ] Korištenje `RecordCapabilities` za field-level prikaz (Hidden/ReadOnly/Editable)

### QA tim
- [ ] Formalni test case-ovi za EC-ROLE-01 do EC-ROLE-24
- [ ] 401/403/409 endpoint testovi
- [ ] Multi-role edge cases
- [ ] Regression testovi nakon Hamzine implementacije

---

## 9. Kako novi član tima treba čitati dokumentaciju

Preporučeni redosljed:

```
1. docs/backend/role-permission-work-log.md       ← Ovaj fajl (brzi pregled)
2. docs/backend/role-permission-rules.md          ← Kompletna pravila i edge case-ovi
3. src/Application/Security/README.md             ← Praktični vodič za kod
4. src/Application/Security/AppRoles.cs           ← Koje role postoje
5. src/Application/Security/AppPermissions.cs     ← Koji permission-i postoje
6. src/Application/Security/RolePermissionMatrix.cs ← Ko ima šta
7. src/Infrastructure/Auth/PermissionClaimsTransformation.cs ← Kako radi tok
```

Za backend implementaciju endpointa — pročitati i:
- `src/Application/Security/Interfaces/IRoleManagementService.cs`
- `src/Application/Security/DTOs/` — request DTO-i
- `docs/backend/role-management-review-checklist.md` — šta mora biti zadovoljeno

---

## 10. Napomene o sigurnosti

- **Ne ubacivati tajne, lozinke ili Keycloak secretove u kod**
- Keycloak config ide u `appsettings.Development.json` (lokalno) ili environment varijable (staging/prod)
- JWT Bearer middleware konfiguracija ide u TODO sekciju `ServiceCollectionExtensions.cs`
- Nikad ne koristiti `[Authorize(Roles = "Administrator")]` direktno na endpointima
