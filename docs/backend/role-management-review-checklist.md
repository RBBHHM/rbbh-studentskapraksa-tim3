# Role Management — Review Checklist (Backend Implementacija)

Ovaj dokument Amina koristi kada Hamza završi konkretne endpoint-e za upravljanje rolama.
Svaki item mora biti potvrđen prije nego što se implementacija može smatrati kompletnom.

> **Autor:** Amina  
> **Koristi:** Amina (pri review-u Hamzine implementacije)  
> **Pokrenuti review:** Nakon što Hamza završi assign/remove/transfer endpoint-e

---

## 1. Opće arhitekturne provjere

- [ ] Svi endpoint-i koriste `AppPolicies.*` konstante — ne hardkodovane role stringove
- [ ] Nema `[Authorize(Roles = "Administrator")]` nigdje u kod implementaciji rola
- [ ] Nema `.RequireAuthorization(p => p.RequireRole("Administrator"))` pattern-a
- [ ] Build prolazi: `dotnet build` bez grešaka i upozorenja
- [ ] Nema `TODO: implementirati` komentara koji su trebali biti završeni ovim taskom

---

## 2. `POST /api/roles/assign`

- [ ] Endpoint registrovan s `.RequireAuthorization(AppPolicies.RolesAssign)`
- [ ] Koristi `AssignRoleRequest` DTO (iz `Application/Security/DTOs/`)
- [ ] Provjera: ciljni korisnik postoji → ako ne, 404 Not Found
- [ ] Provjera: ciljni korisnik je aktivan → ako ne, 400 Bad Request
- [ ] Provjera: rola postoji u `AppRoles.All` → ako ne, 400 Bad Request
- [ ] Provjera: korisnik već nema tu rolu → ako ima, 409 Conflict + `ROLE_ALREADY_ASSIGNED`
- [ ] Nakon uspješne dodjele: audit `USER_ROLE_ASSIGNED` (Severity: Security)
- [ ] Vraća 200 ili 201 s ažuriranim podacima korisnika
- [ ] Korisnik bez `roles.assign` → 403 Forbidden

---

## 3. `POST /api/roles/remove`

- [ ] Endpoint registrovan s `.RequireAuthorization(AppPolicies.RolesRemove)`
- [ ] Koristi `RemoveRoleRequest` DTO
- [ ] Provjera: ciljni korisnik postoji → ako ne, 404 Not Found
- [ ] Provjera: korisnik ima tu rolu → ako ne, 409 Conflict + `ROLE_NOT_ASSIGNED`
- [ ] **Kritično:** Provjera da uklanjanje neće ostaviti sistem bez Administratora → 409 + `LAST_ADMIN_REMOVAL_BLOCKED`
- [ ] Pokušaj uklanjanja posljednjeg admina se auditira (`LAST_ADMIN_ROLE_REMOVAL_BLOCKED`, Severity: Critical)
- [ ] Nakon uspješnog uklanjanja: audit `USER_ROLE_REMOVED` (Severity: Security)
- [ ] Vraća 200 ili 204
- [ ] Korisnik bez `roles.remove` → 403 Forbidden

---

## 4. `POST /api/roles/transfer-admin`

- [ ] Endpoint registrovan s `.RequireAuthorization(AppPolicies.RolesTransferAdmin)`
- [ ] Koristi `TransferAdminRoleRequest` DTO (s `Reason` poljem)
- [ ] Provjera: ciljni korisnik postoji → ako ne, 404
- [ ] Provjera: ciljni korisnik je aktivan → ako ne, 400
- [ ] Provjera: ciljni korisnik nije blokiran → ako jest, 400
- [ ] Provjera: ciljni korisnik već nema Administrator rolu → ako ima, 409
- [ ] Provjera: nije self-transfer (TargetUserId ≠ CurrentUserId) → ako jest, 400
- [ ] **Kritično: Siguran redosljed** — PRVO dodaj B, ZATIM ukloni A
- [ ] Operacija je u DB transakciji — rollback ako bilo koji korak padne
- [ ] Nakon uspješnog transfera: audit `ADMIN_ROLE_TRANSFERRED` (Severity: Critical)
- [ ] Korisnik bez `roles.transfer-admin` → 403 Forbidden

---

## 5. `GET /api/me/permissions`

- [ ] Endpoint registrovan i zahtijeva autentifikaciju (401 bez tokena)
- [ ] Koristi `IUserPermissionService` (implementacija postoji u `Infrastructure/Security/`)
- [ ] Vraća `UserPermissionsResponse(Roles, Permissions)` (model postoji)
- [ ] `Permissions` je unija permission-a svih rola, bez duplikata
- [ ] Ako korisnik nema poznate role → `roles: []`, `permissions: []` (ne greška)
- [ ] **Ne vraća** nikakve tajne ili interne podatke

---

## 6. `GET /api/users` i `GET /api/users/{id}/roles`

- [ ] Zaštićeni s `AppPolicies.UsersView`
- [ ] `GET /api/users` vraća listu korisnika (paginisanu)
- [ ] `GET /api/users/{id}/roles` vraća role konkretnog korisnika
- [ ] Nepostojeći korisnik → 404 Not Found
- [ ] Korisnik bez `users.view` permission-a → 403 Forbidden

---

## 7. IRoleManagementService implementacija

- [ ] Implementacija u `Infrastructure/` sloju
- [ ] Registrovana u `DependencyInjection.cs` (TODO komentar je tu — odkomentarisati)
- [ ] Implementira sve metode definirane u `Application/Security/Interfaces/IRoleManagementService.cs`
- [ ] Koristi `IAuditService` za bilježenje sigurnosnih događaja
- [ ] Audit greška ne ruši poslovnu operaciju (try/catch pattern, po uzoru na `CodebookValueService`)

---

## 8. IRecordAuthorizationService i IFieldAuthorizationService

- [ ] Implementirani ako Record entitet postoji (inače ostaju skeleton)
- [ ] `EnsureCanVerifyAsync()` provjerava `record.CreatedByUserId != currentUser.UserId`
- [ ] `EnsureNoForbiddenFieldsModified()` vraća 403 za zabranjene fieldove
- [ ] Registrovani u `DependencyInjection.cs`

---

## 9. HTTP status kodovi — kompletna provjera

| Scenarij | Očekivani status | Provjeren |
|---|---|---|
| Bez tokena | 401 | [ ] |
| Istekao token | 401 | [ ] |
| Validan token, nema permission-a | 403 | [ ] |
| Validan token, zabranjen field | 403 | [ ] |
| Korisnik ne postoji | 404 | [ ] |
| Korisnik već ima rolu | 409 | [ ] |
| Korisnik nema rolu za uklanjanje | 409 | [ ] |
| Posljednji admin, pokušaj uklanjanja | 409 | [ ] |
| Self-transfer | 400 | [ ] |
| Status zapisa ne dozvoljava akciju | 409 | [ ] |
| Maker-checker zabrana | 403 | [ ] |

---

## 10. Standardizovani error format

- [ ] Svi error odgovori su u ProblemDetails formatu
- [ ] Svaki odgovor ima `errorCode` extension polje
- [ ] Korelacijski ID je uključen (`correlationId` claim ili header)
- [ ] Error poruke su na bosanskom/srpskom/hrvatskom (jezik projekta)

Primjer ispravnog formata:
```json
{
  "type": "https://...",
  "title": "Conflict",
  "status": 409,
  "detail": "Korisnik već ima ovu rolu.",
  "errorCode": "ROLE_ALREADY_ASSIGNED"
}
```

---

## 11. Audit provjera

- [ ] `USER_ROLE_ASSIGNED` se bilježi pri svakoj uspješnoj dodjeli
- [ ] `USER_ROLE_REMOVED` se bilježi pri svakom uspješnom uklanjanju
- [ ] `ADMIN_ROLE_TRANSFERRED` se bilježi pri uspješnom transferu
- [ ] `LAST_ADMIN_ROLE_REMOVAL_BLOCKED` se bilježi pri blokiranom pokušaju
- [ ] Audit konstante su u `AuditActions.cs` (postoje ✅)
- [ ] Audit greška ne prekida poslovnu operaciju

---

## 12. Documentacija ažurnost

- [ ] Ako implementacija odstupa od pravila u `role-permission-rules.md`, razlog je dokumentovan
- [ ] TODO liste u dokumentima su ažurirane (završeni taskovi označeni `[x]`)
- [ ] Novi edge case-ovi koji su se pojavili pri implementaciji su dodani u `role-permission-rules.md`

---

## Napomene za Hamzu (pre-implementation)

Pročitati prije implementacije:
1. `docs/backend/role-permission-rules.md` — Sva poslovna pravila (BR-ROLE-01 do BR-ROLE-18)
2. `docs/backend/role-permission-work-log.md` — Mapa fajlova i tok autorizacije
3. `src/Application/Security/Interfaces/IRoleManagementService.cs` — Interface s komentarima
4. `src/Application/Security/DTOs/` — Postojeći request DTO-i
5. `src/Infrastructure/Codebooks/CodebookValueService.cs` — Primjer pattern-a (audit, exception handling)
