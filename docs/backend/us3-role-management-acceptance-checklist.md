# US3 — Role Management i Obavještenja — Acceptance Checklist

Ovo nije QA test suite. Ovo je acceptance checklist za ručnu provjeru da li su zahtjevi US3 zadovoljeni.

> **Autor:** Amina  
> **Koristi:** Amina (review), QA (provjera)

---

## 1. Role/permission osnova

- [ ] Postoje tačno tri role: `Administrator`, `Unosnik`, `Verifikator`
- [ ] Nema scope creep rola (`Agent`, `Procjenitelj`, `Auditor`, `SuperAdmin`, `IntegrationAdmin`)
- [ ] Permission-i su centralizovani u `AppPermissions.cs` (17 permissiona)
- [ ] `users.view` permission postoji i dodijeljen je Administratoru
- [ ] `roles.view` permission postoji i dodijeljen je Administratoru
- [ ] `roles.assign`, `roles.remove`, `roles.transfer-admin` postoje
- [ ] Policy-ji u `AppPolicies.cs` koriste permission konstante (ne hardkodovane stringove)
- [ ] `RolePermissionMatrix` postoji i odražava ispravan mapping

---

## 2. Pregled korisnika i rola

- [ ] `GET /api/role-management/users` endpoint postoji i vraća paginiranu listu
- [ ] `GET /api/role-management/users/{userId}/roles` endpoint postoji i vraća detaljan prikaz
- [ ] Oba endpointa su zaštićena s `AppPolicies.UsersView`
- [ ] Korisnik bez `users.view` permission-a → 403 Forbidden
- [ ] Zahtjev bez tokena → 401 Unauthorized
- [ ] Nepostojeći `userId` → 404 Not Found

---

## 3. Provider/adapter arhitektura

- [ ] `IUserRoleProvider` interfejs postoji u `Application/Users/`
- [ ] `IUserRoleQueryService` interfejs postoji u `Application/Users/`
- [ ] Konkretni provider je u Infrastructure sloju (ne u Application)
- [ ] Application sloj ne zavisi direktno od `ApplicationDbContext`, Keycloak SDK-a ili vanjske baze
- [ ] Effective permissions se računaju putem `RolePermissionMatrix`, ne u provideru

---

## 4. Paginacija

- [ ] Lista korisnika je paginirana — ne vraća sve bez limita
- [ ] `Page < 1` → 400 Bad Request ili automatski koriguje na 1
- [ ] `PageSize > 100` → 400 Bad Request ili automatski koriguje na max
- [ ] Response sadrži `TotalCount`, `Page`, `PageSize`, `Items`

---

## 5. Search i filter

- [ ] Search je case-insensitive
- [ ] Search input se trimuje
- [ ] Search radi po `username`, `displayName`, `email`
- [ ] Search se ne radi in-memory nad kompletnom tabelom
- [ ] Filter po roli prihvata samo poznate role iz `AppRoles.All`
- [ ] Filter po nepoznatoj roli → 400 Bad Request

---

## 6. Korisnik s više rola

- [ ] Korisnik s više rola prikazuje sve role u `Roles` listi
- [ ] `EffectivePermissions` je unija svih rola, bez duplikata
- [ ] Nepoznata rola → `IsSupported=false`, ne daje permission-e
- [ ] Korisnik bez rola → prazne `Roles` i `EffectivePermissions` liste

---

## 7. Sensitive data

- [ ] Endpoint ne vraća password hash
- [ ] Endpoint ne vraća refresh token, access token, security stamp
- [ ] Endpoint ne vraća Keycloak client secret ili interne sistemske podatke

---

## 8. CanManageRoles i CanRemove

- [ ] `CanManageRoles=true` samo ako korisnik ima `roles.assign` ili `roles.remove`
- [ ] `CanRemove=false` za Administrator rolu kada je korisnik jedini aktivni Administrator
- [ ] `RemoveBlockedReason` je popunjen kada je `CanRemove=false`
- [ ] `CanRemove=true` ne garantira uspjeh remove endpointa — backend uvijek sam validira

---

## 9. Notification event pravila

- [ ] `IRoleManagementNotificationService` interfejs postoji u `Application/Notifications/`
- [ ] `RoleManagementNotificationEvent` model postoji
- [ ] Definirani su eventi: `ROLE_ASSIGNED`, `ROLE_REMOVED`, `ADMIN_ROLE_TRANSFERRED`, `LAST_ADMIN_REMOVAL_BLOCKED`, `ROLE_CHANGE_BLOCKED`, `ROLE_CHANGE_FAILED`
- [ ] Admin transfer je označen kao `Severity: Critical`
- [ ] Blokiran pokušaj uklanjanja posljednjeg admina je `Severity: Critical` ili `Warning`
- [ ] Normalna dodjela/uklanjanje je `Severity: Info`
- [ ] MVP: Postoji `NullRoleManagementNotificationService` stub implementacija

---

## 10. Audit vs Notification

- [ ] Audit i notification su jasno razdvojena odgovornost u dokumentaciji
- [ ] Osjetljive role-management promjene generišu audit event
- [ ] Notification greška ne ruši poslovnu operaciju
- [ ] Audit akcije za role management postoje u `AuditActions.cs`

---

## 11. Admin sigurnost

- [ ] Nije moguće ukloniti posljednjeg aktivnog Administratora → 409
- [ ] Pokušaj se auditira (`LAST_ADMIN_ROLE_REMOVAL_BLOCKED`)
- [ ] Admin transfer slijedi siguran redosljed: prvo dodaj B, pa ukloni A
- [ ] Nije moguće transferovati admin rolu na neaktivnog korisnika

---

## 12. Dokumentacija

- [ ] `us3-user-role-provider-decision.md` postoji s trade-off analizom i decision matrix
- [ ] `us3-role-management-notifications-rules.md` postoji s BR i EC listama
- [ ] `us3-role-management-work-log.md` postoji s mapom fajlova i TODO listom
- [ ] `us3-role-management-acceptance-checklist.md` postoji (ovaj fajl)
- [ ] `us3-role-management-review-checklist.md` postoji
- [ ] `IUserRoleProvider.cs` i `IUserRoleQueryService.cs` postoje u `Application/Users/`
