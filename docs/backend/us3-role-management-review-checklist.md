# US3 — Role Management — Review Checklist (Backend Implementacija)

Ovaj dokument Amina koristi kada Hamza završi konkretnu implementaciju za US3.
Svaki item mora biti potvrđen prije nego što se implementacija može smatrati kompletnom.

> **Autor:** Amina  
> **Koristi:** Amina (pri review-u Hamzine implementacije)

---

## 1. Opće arhitekturne provjere

- [ ] Build prolazi: `dotnet build` bez grešaka i upozorenja
- [ ] Nema hardkodovanih role stringova na endpointima (`[Authorize(Roles = "Administrator")]`)
- [ ] Nema `.RequireAuthorization(p => p.RequireRole("Administrator"))` pattern-a
- [ ] Application sloj ne uvozi `Microsoft.EntityFrameworkCore` direktno
- [ ] Application sloj ne uvozi Keycloak SDK direktno
- [ ] Provider implementacija je u Infrastructure sloju

---

## 2. `GET /api/role-management/users`

- [ ] Endpoint registrovan s `.RequireAuthorization(AppPolicies.UsersView)` ili ekvivalent
- [ ] Poziva `IUserRoleQueryService.GetUsersWithRolesAsync(request)`
- [ ] Korisnik bez `users.view` → 403 Forbidden
- [ ] Zahtjev bez tokena → 401 Unauthorized
- [ ] Response je `PagedResult<UserRoleListItemDto>`
- [ ] Response ne sadrži osjetljive podatke (token, hash, secret)
- [ ] Paginacija je obavezna — nema odgovora bez limite
- [ ] Search je case-insensitive i ne radi in-memory
- [ ] Filter po nepoznatoj roli → 400 Bad Request

---

## 3. `GET /api/role-management/users/{userId}/roles`

- [ ] Endpoint registrovan s `.RequireAuthorization(AppPolicies.UsersView)` ili ekvivalent
- [ ] Poziva `IUserRoleQueryService.GetUserRolesAsync(userId)`
- [ ] Korisnik ne postoji → 404 Not Found
- [ ] Korisnik bez `users.view` → 403 Forbidden
- [ ] Zahtjev bez tokena → 401 Unauthorized
- [ ] Response je `UserRolesDetailDto`
- [ ] `EffectivePermissions` je izračunat putem `RolePermissionMatrix`, ne hardkodovan
- [ ] `CanRemove=false` za Administrator rolu ako je jedini aktivan Administrator
- [ ] `RemoveBlockedReason` je popunjen kada je `CanRemove=false`
- [ ] Nepoznata rola → `IsSupported=false`, ne pada endpoint

---

## 4. IUserRoleProvider implementacija (LocalDatabaseUserRoleProvider)

- [ ] Implementira `IUserRoleProvider` interfejs u cijelosti
- [ ] Registrovana u `Infrastructure/DependencyInjection.cs`:
      `services.AddScoped<IUserRoleProvider, LocalDatabaseUserRoleProvider>();`
- [ ] Search se radi SQL-om (LIKE, normalizovane kolone, ili parametrizovani query)
- [ ] Paginacija se radi SQL OFFSET/LIMIT (ne in-memory)
- [ ] Filter po roli se radi SQL-om, ne in-memory
- [ ] Provider ne računa permission-e — vraća samo korisnika i role
- [ ] `GetUserWithRolesAsync` vraća null ako korisnik ne postoji

---

## 5. IUserRoleQueryService implementacija

- [ ] Implementira `IUserRoleQueryService` interfejs
- [ ] Poziva `IUserRoleProvider` (ne direktno bazu ili Keycloak)
- [ ] `EffectivePermissions = RolePermissionMatrix.GetPermissionsForRoles(item.Roles)` — bez duplikata
- [ ] Nepoznata rola → `IsSupported=false` (ne pada, ne baca grešku)
- [ ] Null role lista iz providera → tretira kao praznu listu
- [ ] Duple role iz providera → uklanja duplikate
- [ ] `CanManageRoles` se popunjava na osnovu permission-a trenutnog korisnika
- [ ] `CanRemove` se popunjava prema poslovnim pravilima (jedini admin, itd.)
- [ ] Registrovana u `Infrastructure/DependencyInjection.cs`

---

## 6. NullRoleManagementNotificationService

- [ ] Implementira `IRoleManagementNotificationService`
- [ ] Sve metode imaju tijelo (ne baca `NotImplementedException`)
- [ ] Loguje poziv ali ne šalje stvarnu notifikaciju
- [ ] Registrovana u `Infrastructure/DependencyInjection.cs`:
      `services.AddScoped<IRoleManagementNotificationService, NullRoleManagementNotificationService>();`

---

## 7. Assign/Remove/Transfer endpoint-i (ako su Hamzin task)

- [ ] `POST /api/roles/assign` → `AppPolicies.RolesAssign`
- [ ] `POST /api/roles/remove` → `AppPolicies.RolesRemove`
- [ ] `POST /api/roles/transfer-admin` → `AppPolicies.RolesTransferAdmin`
- [ ] Svaka uspješna promjena role poziva `IAuditService.RecordAsync(...)` 
- [ ] Svaka uspješna promjena role poziva `IRoleManagementNotificationService` metodu
- [ ] Audit i notification greška NE ruše poslovnu operaciju (try/catch)
- [ ] Admin transfer slijedi siguran redosljed (prvo dodaj B, pa ukloni A)
- [ ] Uklanjanje posljednjeg Administratora → 409 + audit + warning notification

---

## 8. HTTP status kodovi provjera

| Situacija | Očekivani status | Provjeren |
|---|---|---|
| Bez tokena | 401 | [ ] |
| Validan token, nema `users.view` | 403 | [ ] |
| Validan token, admin | 200 | [ ] |
| Korisnik ne postoji (detalj) | 404 | [ ] |
| Filter po nepoznatoj roli | 400 | [ ] |
| Page < 1 (prema API standardu) | 400 ili auto-correct | [ ] |
| Assign duplat rola | 409 | [ ] |
| Remove posljednji admin | 409 | [ ] |

---

## 9. Dokumentacija ažurnost

- [ ] Ako implementacija odstupa od pravila u `us3-role-management-notifications-rules.md`, razlog je dokumentovan
- [ ] TODO liste u work logu su ažurirane
- [ ] Ako je dodan novi provider, work log je dopunjen
