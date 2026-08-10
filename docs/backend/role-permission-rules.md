# BE-ROLE-01 — Backend Role/Permission Pravila

## 1. User Story i Kriteriji Prihvatanja

**User Story:**
Kao administrator aplikacije, želim kreirati i dodjeljivati role korisnicima kako bih kontrolirao pristup podacima.

**Kriteriji prihvatanja:**
1. Svaka rola ima minimalno 2 korisnika: unosnik + verifikator.
2. Polja nedostupna za rolu su siva i onemogućena.
3. Administrator može prenositi administratorsku rolu na drugog korisnika.

---

## 2. Tumačenje "minimalno 2 korisnika: unosnik + verifikator"

Ovaj kriterij se tumači kao zahtjev za **razdvajanjem odgovornosti** (Separation of Duties / Maker-Checker princip):

- Jedan korisnik **unosi** zapis (Unosnik).
- Drugi korisnik ga **verifikuje** (Verifikator).
- Isti korisnik ne smije biti i Unosnik i Verifikator istog zapisa.

Ovaj princip se primjenjuje bez obzira na broj korisnika u sistemu i bez obzira na to ima li korisnik više rola. Čak i ako korisnik ima obje role, ne može verifikovati vlastiti zapis.

---

## 3. Role

### Administrator
Upravlja korisnicima i rolama. Ima pristup administrativnom dijelu sistema.

**Može:**
- Pregledati korisnike
- Pregledati role
- Dodijeliti rolu korisniku
- Ukloniti rolu korisniku
- Prenijeti administratorsku rolu na drugog korisnika
- Pristupiti administrativnom dijelu sistema
- Vidjeti sigurnosne audit zapise
- Administrativno pregledati zapise

**Ne smije:**
- Ukloniti posljednju administratorsku rolu iz sistema
- Deaktivirati/obrisati posljednjeg aktivnog Administratora
- Prenijeti rolu na nepostojećeg, neaktivnog ili blokiranog korisnika
- Napraviti stanje u kojem sistem nema Administratora
- Verifikovati vlastiti zapis (four-eyes pravilo)

---

### Unosnik
Kreira i unosi podatke/zapise u sistem.

**Može:**
- Kreirati zapis
- Pregledati vlastite zapise
- Uređivati vlastiti zapis dok je u statusu Draft ili ReturnedForCorrection
- Poslati zapis na verifikaciju
- Pregledati šifarnike

**Ne smije:**
- Verifikovati vlastiti zapis
- Odobriti/odbiti zapis
- Mijenjati verifikacijska polja
- Dodjeljivati/uklanjati role
- Pristupati administrativnom dijelu
- Mijenjati zapis koji je poslan na verifikaciju, osim ako je vraćen na doradu

---

### Verifikator
Provjerava zapise koje je Unosnik poslao na verifikaciju.

**Može:**
- Pregledati zapise koji čekaju verifikaciju
- Odobriti zapis
- Odbiti zapis (uz razlog)
- Unijeti komentar verifikatora
- Pregledati historiju zapisa
- Pregledati šifarnike

**Ne smije:**
- Verifikovati zapis koji je sam kreirao
- Dodjeljivati/uklanjati role
- Mijenjati osnovna polja unosa
- Odobriti/odbiti zapis koji nije u statusu PendingVerification

---

## 4. Permission-e

| Konstanta | Vrijednost | Opis |
|-----------|-----------|------|
| `UsersView` | `users.view` | Pregled korisnika |
| `RolesView` | `roles.view` | Pregled rola |
| `RolesAssign` | `roles.assign` | Dodjela rola |
| `RolesRemove` | `roles.remove` | Uklanjanje rola |
| `RolesTransferAdmin` | `roles.transfer-admin` | Prenos admin role |
| `RecordsCreate` | `records.create` | Kreiranje zapisa |
| `RecordsViewOwn` | `records.view-own` | Pregled vlastitih zapisa |
| `RecordsUpdateOwnDraft` | `records.update-own-draft` | Uređivanje vlastitog nacrta |
| `RecordsSubmitForVerification` | `records.submit-for-verification` | Slanje na verifikaciju |
| `RecordsViewPendingVerification` | `records.view-pending-verification` | Pregled zapisa koji čekaju verifikaciju |
| `RecordsApprove` | `records.approve` | Odobravanje zapisa |
| `RecordsReject` | `records.reject` | Odbijanje zapisa |
| `RecordsViewHistory` | `records.view-history` | Pregled historije |
| `CodebooksView` | `codebooks.view` | Pregled šifarnika (sve role) |
| `CodebooksManage` | `codebooks.manage` | Upravljanje šifarnicima: deaktivacija, aktivacija, brisanje, kreiranje (samo Administrator) — dodano u BE-CODEBOOK-04/05 tasku |
| `AuditViewSecurity` | `audit.view-security` | Pregled sigurnosnih audit zapisa |
| `AdminAccess` | `admin.access` | Pristup admin dijelu sistema |

---

## 5. Role/Permission Matrica

| Permission | Administrator | Unosnik | Verifikator |
|-----------|:---:|:---:|:---:|
| `users.view` | ✅ | ❌ | ❌ |
| `roles.view` | ✅ | ❌ | ❌ |
| `roles.assign` | ✅ | ❌ | ❌ |
| `roles.remove` | ✅ | ❌ | ❌ |
| `roles.transfer-admin` | ✅ | ❌ | ❌ |
| `records.create` | ✅ | ✅ | ❌ |
| `records.view-own` | ✅ | ✅ | ❌ |
| `records.update-own-draft` | ✅ | ✅ | ❌ |
| `records.submit-for-verification` | ✅ | ✅ | ❌ |
| `records.view-pending-verification` | ✅ | ❌ | ✅ |
| `records.approve` | ✅ | ❌ | ✅ |
| `records.reject` | ✅ | ❌ | ✅ |
| `records.view-history` | ✅ | ❌ | ✅ |
| `codebooks.view` | ✅ | ✅ | ✅ |
| `codebooks.manage` ¹ | ✅ | ❌ | ❌ |
| `audit.view-security` | ✅ | ❌ | ❌ |
| `admin.access` | ✅ | ❌ | ❌ |

> ¹ `codebooks.manage` dodano u BE-CODEBOOK-04/05 tasku. Dozvoljava deaktivaciju, aktivaciju, brisanje i kreiranje vrijednosti šifarnika. Samo Administrator ima ovu permission.

---

## 6. 401 / 403 Pravila

| Situacija | HTTP Status |
|-----------|------------|
| Korisnik nije prijavljen (nema/istekao token) | **401 Unauthorized** |
| Korisnik je prijavljen, ali nema potrebnu permission | **403 Forbidden** |
| Korisnik ima permission, ali status zapisa ne dozvoljava akciju | **409 Conflict** |
| Korisnik pokušava verifikovati vlastiti zapis | **403 Forbidden** |
| Pokušaj izmjene zabranjenog polja | **403 Forbidden** |

**Pravilo:** Backend nikad ne vraća 200 sa praznim podacima za zabranjene akcije.

---

## 7. Statusna Pravila Zapisa

Minimalni status model ako entitet zapisa ne postoji:

| Status | Vrijednost | Opis |
|--------|-----------|------|
| `Draft` | Nacrt | Zapis u pripremi |
| `PendingVerification` | Čeka verifikaciju | Poslan na verifikaciju |
| `Verified` | Verifikovan | Odobren |
| `Rejected` | Odbijen | Odbijen bez vraćanja na doradu |
| `ReturnedForCorrection` | Vraćen na doradu | Odbijen uz zahtjev za ispravkom |

### Dozvoljene akcije po statusu

**Draft:**
- Unosnik: može uređivati, može poslati na verifikaciju
- Verifikator: ne može odobravati/odbijati (nije u ispravnom statusu)

**PendingVerification:**
- Unosnik: ne može mijenjati osnovna polja
- Verifikator: može odobriti ili odbiti (osim ako je kreator zapisa)
- Kreator zapisa: ne može verifikovati bez obzira na rolu

**Verified:**
- Niko: ne može mijenjati bez posebnog procesa
- Administrativna intervencija mora biti auditirana

**Rejected:**
- Unosnik: može vidjeti razlog odbijanja
- Nova akcija moguća samo kroz ReturnedForCorrection tok

**ReturnedForCorrection:**
- Unosnik: može ispraviti i ponovo poslati na verifikaciju

---

## 8. Field Visibility Model: Hidden / ReadOnly / Editable

Acceptance kriterij "polja nedostupna za rolu su siva i onemogućena" se implementira kao **trostepeni model**:

| Stanje | Šalje se frontendu | Korisnik može mijenjati | Kad se primjenjuje |
|--------|:-----------------:|:-------------------:|-------------------|
| **Hidden** | ❌ Ne | ❌ Ne | Korisnik nema pravo vidjeti polje |
| **ReadOnly** | ✅ Da | ❌ Ne | Korisnik smije vidjeti, ali ne mijenjati |
| **Editable** | ✅ Da | ✅ Da | Korisnik smije mijenjati |

### Primjeri po roli

**Unosnik:**
- Osnovna unosna polja → **Editable** (dok je Draft ili ReturnedForCorrection)
- Osnovna unosna polja → **ReadOnly** (kada je PendingVerification ili Verified)
- Verifikacijska polja → **Hidden** (dok nisu relevantna)
- Razlog odbijanja i komentar verifikatora → **ReadOnly** (kada je Rejected/ReturnedForCorrection)
- Admin polja i role korisnika → **Hidden**

**Verifikator:**
- Osnovna unosna polja → **ReadOnly**
- Odluka verifikacije → **Editable** (dok je PendingVerification)
- Razlog odbijanja → **Editable** (ako odbija)
- Admin polja i role korisnika → **Hidden**

**Administrator:**
- Admin polja za upravljanje korisnicima → **Editable** (u admin kontekstu)
- Sigurnosna/audit polja → **ReadOnly**

---

## 9. Field-Level Backend Authorization

Backend **uvijek** validira field-level pravila, bez obzira na to što je frontend sakrio ili onemogućio.

Ako korisnik ručno pošalje API request sa poljem koje ne smije mijenjati:
- HTTP 403 Forbidden
- Error code: `FORBIDDEN_FIELD_UPDATE`
- Poruka: "Nemate pravo mijenjati jedno ili više poslanih polja."

Implementirano u: `IFieldAuthorizationService.EnsureNoForbiddenFieldsModified()`

---

## 10. Server-Driven Capabilities Model

Backend priprema `RecordCapabilities` objekt koji opisuje šta korisnik smije raditi na konkretnom zapisu.

### Endpoint (dokumentovan skeleton)
```
GET /api/records/{id}/capabilities
GET /api/me/permissions
```

### Primjer response-a
```json
{
  "recordId": "123",
  "status": "PendingVerification",
  "capabilities": {
    "canEdit": false,
    "canSubmitForVerification": false,
    "canApprove": true,
    "canReject": true,
    "canViewHistory": true,
    "canAssignRole": false,
    "canRemoveRole": false,
    "canTransferAdminRole": false
  },
  "fields": {
    "title": "ReadOnly",
    "description": "ReadOnly",
    "verificationComment": "Editable",
    "rejectionReason": "Editable"
  }
}
```

Capabilities uzimaju u obzir:
- Role korisnika
- Permission-e korisnika
- Status zapisa
- Vlasništvo nad zapisom (kreator ≠ verifikator)
- Maker-checker pravilo

---

## 11. Action-Specific DTO Pristup

Umjesto jednog velikog DTO-a za sve operacije, svaka akcija ima vlastiti request model:

| Request DTO | Endpoint | Policy |
|-------------|---------|--------|
| `AssignRoleRequest` | `POST /api/roles/assign` | `roles.assign` |
| `RemoveRoleRequest` | `POST /api/roles/remove` | `roles.remove` |
| `TransferAdminRoleRequest` | `POST /api/roles/transfer-admin` | `roles.transfer-admin` |
| `CreateRecordRequest` | `POST /api/records` | `records.create` |
| `UpdateDraftRecordRequest` | `PUT /api/records/{id}` | `records.update-own-draft` |
| `SubmitForVerificationRequest` | `POST /api/records/{id}/submit` | `records.submit-for-verification` |
| `ApproveRecordRequest` | `POST /api/records/{id}/approve` | `records.approve` |
| `RejectRecordRequest` | `POST /api/records/{id}/reject` | `records.reject` |

---

## 12. Standardizovane Greške

```json
{
  "type": "https://example.com/errors/forbidden-field-update",
  "title": "Nedozvoljena izmjena polja",
  "status": 403,
  "detail": "Nemate pravo mijenjati verifikacijska polja.",
  "errorCode": "FORBIDDEN_FIELD_UPDATE",
  "correlationId": "abc-123"
}
```

| Situacija | errorCode |
|-----------|-----------|
| Nemate pravo na akciju | `PERMISSION_DENIED` |
| Zabranjena izmjena polja | `FORBIDDEN_FIELD_UPDATE` |
| Pokušaj samoverifikacije | `SELF_VERIFICATION_BLOCKED` |
| Pokušaj uklanjanja posljednjeg admina | `LAST_ADMIN_REMOVAL_BLOCKED` |
| Status zapisa ne dozvoljava akciju | `INVALID_RECORD_STATUS` |
| Korisnik već ima rolu | `ROLE_ALREADY_ASSIGNED` |
| Korisnik nema rolu | `ROLE_NOT_ASSIGNED` |

---

## 13. Maker-Checker / Four-Eyes Pravilo

Korisnik koji je kreirao zapis ne smije ga verifikovati.

```csharp
if (record.CreatedByUserId == currentUser.UserId)
{
    // TODO: Auditiraj SelfVerificationBlocked
    throw new ForbiddenException("Korisnik ne može verifikovati vlastiti zapis.");
}
```

Ovo pravilo važi za sve role, uključujući Administrator.
Provjerava se u: `IRecordAuthorizationService.EnsureCanVerifyAsync()`

---

## 14. Pravila za Prenos Administratorske Role

### Siguran redoslijed (EC-ROLE-24)
1. Provjeri da TargetUserId postoji i da je aktivan
2. Dodaj Administrator rolu korisniku B
3. Potvrdi da korisnik B sada ima Administrator rolu
4. Tek onda ukloni Administrator rolu korisniku A
5. Auditiraj sa `ADMIN_ROLE_TRANSFERRED` (Severity: Critical)

**Nikad ne raditi obrnuto** (ukloni A → dodaj B), jer ako drugi korak padne, sistem ostaje bez Administratora.

### Preduvjeti
- Izvršilac mora imati `roles.transfer-admin` permission
- Ciljni korisnik mora postojati → 404
- Ciljni korisnik mora biti aktivan → 400
- Ciljni korisnik ne smije biti blokiran → 400
- Ciljni korisnik ne smije već imati Administrator rolu → 409
- Ne može prenijeti rolu samom sebi → 400
- Cijela operacija mora biti u transakciji

---

## 15. Pravila Dodjele Role

Preduvjeti:
- Izvršilac ima `roles.assign` permission
- Korisnik postoji → 404
- Korisnik je aktivan → 400
- Rola postoji → 404 ili 400
- Korisnik već nema tu rolu → 409

Svaka dodjela se auditira sa `USER_ROLE_ASSIGNED` (Severity: Security).

---

## 16. Pravila Uklanjanja Role

Preduvjeti:
- Izvršilac ima `roles.remove` permission
- Korisnik postoji → 404 ako ne postoji
- Korisnik mora imati tu rolu koja se uklanja → 409 ako je nema

Zabranjena uklanjanja:
- Posljednja Administrator rola → 409 + audit `LAST_ADMIN_ROLE_REMOVAL_BLOCKED` (Severity: Critical)

Svako uklanjanje se auditira sa `USER_ROLE_REMOVED` (Severity: Security).

---

## 17. Audit Pravila

Ako audit sistem postoji, auditirati sljedeće sigurnosne događaje:

| AuditAction | Severity | Kada |
|------------|---------|------|
| `USER_ROLE_ASSIGNED` | Security | Dodjela role korisniku |
| `USER_ROLE_REMOVED` | Security | Uklanjanje role korisniku |
| `ADMIN_ROLE_TRANSFERRED` | Critical | Prenos administratorske role |
| `LAST_ADMIN_ROLE_REMOVAL_BLOCKED` | Critical | Pokušaj uklanjanja posljednjeg admina |
| `SELF_VERIFICATION_BLOCKED` | Security | Pokušaj verifikacije vlastitog zapisa |
| `FORBIDDEN_FIELD_UPDATE_ATTEMPT` | Security | Pokušaj izmjene zabranjenog polja |
| `UNAUTHORIZED_ACCESS_ATTEMPT` | Security | Pristup bez ovlaštenja |

Implementacija u `AuditActions.cs` postoji. Pozvati `IAuditService.RecordAsync()` u odgovarajućim servisima.

---

## 18. Poslovna Pravila

| ID | Pravilo |
|----|---------|
| **BR-ROLE-01** | Sistem podržava tri osnovne role: Administrator, Unosnik i Verifikator. |
| **BR-ROLE-02** | Samo Administrator može dodjeljivati i uklanjati role korisnicima. |
| **BR-ROLE-03** | Samo Administrator može prenijeti administratorsku rolu na drugog korisnika. |
| **BR-ROLE-04** | Sistem ne smije ostati bez najmanje jednog aktivnog Administratora. |
| **BR-ROLE-05** | Korisnik koji kreira zapis ne smije verifikovati isti zapis. |
| **BR-ROLE-06** | Unosnik može uređivati samo vlastite zapise i samo dok su u statusu koji dozvoljava izmjene. |
| **BR-ROLE-07** | Verifikator može odobriti ili odbiti samo zapise koji su u statusu "Čeka verifikaciju". |
| **BR-ROLE-08** | Verifikator ne smije mijenjati osnovna polja unosa osim ako je to posebno dozvoljeno budućim zahtjevom. |
| **BR-ROLE-09** | Polja koja nisu dostupna korisnikovoj roli moraju biti kontrolisana kroz hidden/readOnly/editable model. |
| **BR-ROLE-10** | Backend mora odbiti svaki pokušaj izmjene polja za koje korisnik nema ovlaštenje. |
| **BR-ROLE-11** | Dodjela, uklanjanje i prenos rola moraju biti auditirani ako audit sistem postoji. |
| **BR-ROLE-12** | Pokušaj uklanjanja posljednjeg Administratora mora biti blokiran i auditiran. |
| **BR-ROLE-13** | Pokušaj samoverifikacije mora biti blokiran i auditiran. |
| **BR-ROLE-14** | Ako korisnik ima više rola, njegove permission-e se sabiraju, ali poslovna pravila integriteta i dalje važe. |
| **BR-ROLE-15** | Frontend sakrivanje, read-only ili disabled prikaz služe korisničkom iskustvu, ali ne predstavljaju sigurnosnu zaštitu. |
| **BR-ROLE-16** | Polja koja korisnik nema pravo vidjeti ne smiju se slati frontendu. |
| **BR-ROLE-17** | Polja koja korisnik smije vidjeti, ali ne smije mijenjati, šalju se kao ReadOnly. |
| **BR-ROLE-18** | Polja koja korisnik smije mijenjati dostupna su samo kroz odgovarajuće akcione request DTO-e. |

---

## 19. Edge Caseovi

| ID | Scenarij | Odgovor |
|----|---------|---------|
| **EC-ROLE-01** | Korisnik bez tokena pokušava pristupiti zaštićenom endpointu | 401 |
| **EC-ROLE-02** | Korisnik sa pogrešnom rolom pokušava dodijeliti rolu | 403 |
| **EC-ROLE-03** | Administrator pokušava dodijeliti nepostojeću rolu | 404 ili 400 |
| **EC-ROLE-04** | Administrator pokušava dodijeliti rolu nepostojećem korisniku | 404 |
| **EC-ROLE-05** | Administrator pokušava dodijeliti rolu koju korisnik već ima | 409 |
| **EC-ROLE-06** | Administrator pokušava ukloniti rolu koju korisnik nema | 409 |
| **EC-ROLE-07** | Administrator pokušava ukloniti posljednju Administrator rolu | 409 + audit |
| **EC-ROLE-08** | Administrator pokušava prenijeti admin rolu na neaktivnog korisnika | 400 |
| **EC-ROLE-09** | Administrator pokušava prenijeti admin rolu na samog sebe | 400 |
| **EC-ROLE-10** | Dva administratora istovremeno mijenjaju admin role | Transakcijska provjera unutar DB transakcije |
| **EC-ROLE-11** | Unosnik pokušava promijeniti verifikacijska polja | 403 + audit |
| **EC-ROLE-12** | Verifikator pokušava promijeniti osnovna unosna polja | 403 + audit |
| **EC-ROLE-13** | Unosnik pokušava uređivati zapis koji je poslan na verifikaciju | 409 |
| **EC-ROLE-14** | Verifikator pokušava odobriti zapis koji nije u PendingVerification statusu | 409 |
| **EC-ROLE-15** | Korisnik pokušava verifikovati vlastiti zapis | 403 + audit |
| **EC-ROLE-16** | Korisnik ima i Unosnik i Verifikator rolu, ali pokušava verifikovati vlastiti zapis | 403 |
| **EC-ROLE-17** | Administrator kreira zapis i pokuša ga sam verifikovati | 403 (strogi four-eyes) |
| **EC-ROLE-18** | Request sadrži dodatna polja koja nisu dozvoljena za rolu | 403 |
| **EC-ROLE-19** | Frontend prikaže polje disabled, ali korisnik ručno pošalje API request | 403 (backend odbija) |
| **EC-ROLE-20** | Role postoje u tokenu, ali nisu mapirane u RolePermissionMatrix | Korisnik nema pristup |
| **EC-ROLE-21** | Polje je Hidden, ali frontend ga pokuša prikazati iz cache-a | Backend ga ne šalje u response DTO-u |
| **EC-ROLE-22** | Korisnik ima permission za akciju, ali status zapisa ne dozvoljava akciju | 409 |
| **EC-ROLE-23** | Korisnik ima permission za verifikaciju, ali je kreator zapisa | 403 |
| **EC-ROLE-24** | Transfer admin role ne uspije nakon djelimične promjene | Transakcija vraća sistem u sigurno stanje |

---

## 20. Šta Nije Uključeno u Ovaj Task

- Role Agent, Procjenitelj, Auditor, SuperAdmin, IntegrationAdmin
- Workflow engine za zapise (pun domenski model)
- UI za upravljanje rolama
- Konkretna implementacija Record entiteta i repozitorija
- Keycloak realm konfiguracija (korisnici, role, clients)
- JWT Bearer middleware konfiguracija
- Integracija sa Keycloak Admin API-jem

---

## 21. Raspodjela Odgovornosti

| Ko | Šta |
|----|-----|
| **Amina** | Backend pravila, arhitektura, scaffold (AppRoles, AppPermissions, AppPolicies, RolePermissionMatrix, PermissionClaimsTransformation, UserPermissionService, skeleton interfejsi, DTO-i, dokumentacija, review i acceptance kontrola) |
| **Ernad** | Keycloak realm konfiguracija — kreiranje rola Administrator/Unosnik/Verifikator, JWT Bearer middleware, provjera stvarnog tokena i formata role claim-ova, prilagodba `ClaimsPrincipalExtensions.GetRoles()` ako Keycloak koristi `realm_access.roles` ili `resource_access` format |
| **Hamza** | Konkretni API endpointi (`GET /api/me/permissions`, `POST /api/roles/assign`, `POST /api/roles/remove`, `POST /api/roles/transfer-admin`), konkretna implementacija `IRoleManagementService` i `IRecordAuthorizationService` i `IFieldAuthorizationService` kada postoji Record entitet |
| **Frontend tim** | Prikaz hidden/readOnly/editable stanja polja na osnovu `RecordCapabilities` i `UserPermissionsResponse`, UI za upravljanje rolama, prikaz `GET /api/me/permissions` response-a |
| **QA** | Automatizovani testovi za role i permission provjere, 401/403/409 edge case testiranje, regression testovi, formalni test caseovi za sve EC-ROLE-* scenarije |

---

## 22. TODO po Odgovornosti

### Amina (backend review/pravila)
- [x] AppRoles, AppPermissions, AppPolicies, RolePermissionMatrix
- [x] PermissionClaimsTransformation, ClaimsPrincipalExtensions
- [x] CurrentUserService (Roles), UserPermissionService
- [x] Skeleton interfejsi (IRoleManagementService, IRecordAuthorizationService, IFieldAuthorizationService)
- [x] DTOs (AssignRoleRequest, RemoveRoleRequest, TransferAdminRoleRequest)
- [x] AuthorizationExtensions, DependencyInjection registracija
- [x] FieldVisibility, RecordCapabilities, UserPermissionsResponse modeli
- [x] Audit akcije za sigurnost u AuditActions.cs
- [x] Dokumentacija role-permission-rules.md
- [ ] Review implementacije kada Hamza završi endpointe

### Hamza (API endpointi i servisna implementacija)
- [ ] `GET /api/me/permissions` endpoint — servis `IUserPermissionService` je spreman
- [ ] `POST /api/roles/assign` → `.RequireAuthorization(AppPolicies.RolesAssign)`
- [ ] `POST /api/roles/remove` → `.RequireAuthorization(AppPolicies.RolesRemove)`
- [ ] `POST /api/roles/transfer-admin` → `.RequireAuthorization(AppPolicies.RolesTransferAdmin)`
- [ ] Implementacija `IRoleManagementService` (zahtijeva korisnikov entitet/repozitorij)
- [ ] Implementacija `IRecordAuthorizationService` i `IFieldAuthorizationService` (zahtijeva Record entitet)
- [ ] Kreirati Record domenski entitet sa statusom i `CreatedByUserId` (ako nije tuđi task)
- [ ] Globalni error handler za `ForbiddenException` → 403, `ConflictException` → 409, `NotFoundException` → 404

### Ernad (Keycloak i JWT)
- [ ] Kreirati Keycloak realm sa rolama Administrator, Unosnik, Verifikator
- [ ] Konfigurirati protocol mapper koji šalje role kao flat `role` claim-ove u JWT
- [ ] Alternativno: ako Keycloak koristi `realm_access.roles`, prilagoditi `ClaimsPrincipalExtensions.GetRoles()`
- [ ] Konfigurirati JWT Bearer middleware u `ServiceCollectionExtensions.cs`
- [ ] Omogućiti `app.UseAuthentication()` u `WebApplicationExtensions.cs`
- [ ] Dostaviti Amini/Hamzi primjer stvarnog JWT tokena za provjeru claim-ova

### QA
- [ ] Test caseovi za sve EC-ROLE-01 do EC-ROLE-24 scenarije
- [ ] 401/403/409 endpoint testovi
- [ ] Integracijski testovi za role i permission provjere
- [ ] Edge case: korisnik sa više rola, samoverifikacija, transfer admina
- [ ] Regression testovi nakon Hamzine implementacije

---

## 23. Buduća Proširenja

Implementirati samo kroz novi user story:
- Proširivanje RecordCapabilities za buduće entitete
- Auditni UI za sigurnosne događaje
- Upravljanje korisnicima kroz aplikaciju (trenutno putem Keycloak admin)
- Field-level permission model za specifične poslovne entitete

---

## 24. Proširenje — Narudžbe procjene (US 92/93/94, ZADATAK-T1)

> Dodano u sklopu Sprint 2 foundation zadatka (T1), grana `feature/DPNPN-platforma-foundation`.
> Ovo proširenje uvodi nove poslovne role i permisije za workflow narudžbe procjene
> (upload dokumentacije, odobrenje finalne procjene, mišljenja CO/Pravne).

### 24.1 Nove poslovne role (`AppRoles`)

| Konstanta | Vrijednost | Opis |
|---|---|---|
| `AM` | `AM` | Account Manager — segment Prodaja. |
| `SM` | `SM` | Sales Manager — segment Prodaja. |
| `UB` | `UB` | Universal Banker — segment Prodaja. |
| `KolateralAdministrator` | `KolateralAdministrator` | CA — vodi narudžbu, provjerava dokumentaciju, bira vještaka. |
| `KolateralOficir` | `KolateralOficir` | CO — provjera pristupa, odobrava finalnu procjenu, daje mišljenje CO. |
| `Vjestak` | `Vjestak` | Eksterni izvođač procjene. |
| `PravnaSluzba` | `PravnaSluzba` | Daje pravno mišljenje (US 94). |
| `Protokol` | `Protokol` | Upload/obrada fakture (5. kućica) — van scope-a US 92/93/94. |

Sve role su dodane u `AppRoles.All`. `RolePermissionSeeder` ih idempotentno upisuje u
`RoleDefinition` i pokušava sinhronizaciju u Keycloak realm.

#### 24.1.1 Segment Prodaja — AM, SM, UB (DPNPN, T1 update)

`AM`, `SM` i `UB` su **tri odvojene Keycloak/aplikativne role** (korisnik se nikad ne
prijavljuje kao generička rola "Prodaja"), ali su funkcionalno grupisane u zajednički
poslovni segment/kućicu **Prodaja**:

- `AppRoles.ProdajaSegment = "Prodaja"` — naziv segmenta, **nije** Keycloak rola; koristi
  se samo za labeling (UI naslovi kućice, audit, notifikacije).
- `AppRoles.SalesRoles = [AM, SM, UB]` i `AppRoles.IsSalesRole(role)` — jedino mjesto gdje
  se provjerava pripadnost segmentu. UI gate-ovi (`Home.razor`, `MainLayout.razor`,
  `MyOrders.razor`, `CreateOrder.razor`) već koriste `AppRoles.SalesRoles` umjesto
  hardkodirane role, pa je dodavanje AM/SM/UB bilo dovoljno bez diranja te logike.
- `RolePermissionMatrix.ProdajaSegmentPermissions` — jedan permission set dijeljen sva tri
  ključa (`[AM]`, `[SM]`, `[UB]`) u `PermissionsByRole`, garantuje da AM/SM/UB nikad ne
  mogu "iskliznuti" iz sinhronizacije.
- `DashboardRoutes` / `RolePriorityResolver` — AM/SM/UB mapirani na ISTU rutu (`Home`,
  `/`) i isti prioritet (20) — jedan zajednički dashboard, ne tri.
- Narudžba (`AppraisalOrder`) pamti `CreatedByUserId`, `CreatedByRole` (AM/SM/UB) i
  `CreatedByName` (puno ime — `ICurrentUserService.FullName`, iz Keycloak `name`/
  `given_name`+`family_name` claim-ova). Segment se izvodi iz `CreatedByRole` putem
  `AppRoles.IsSalesRole(...)` — nema posebne "Segment" kolone (izbjegnuto dupliranje).

### 24.2 Nove permisije (`AppPermissions` / `AppPolicies`)

| Permisija | Oblast | Opis |
|---|---|---|
| `documents.upload` | US 92 | Upload dokumentacije uz narudžbu. |
| `documents.view` | US 92 | Pregled liste dokumenata. |
| `documents.download` | US 92 | Preuzimanje dokumenta. |
| `documents.delete` | US 92 | Soft-delete dokumenta. |
| `orders.view` | US 93 | Pregled narudžbi i statusa. |
| `orders.approve-final` | US 93 | CO odobrava finalnu procjenu ("može dalje u proceduru"). |
| `orders.download-appraisal` | US 93 | Preuzimanje finalnog dokumenta procjene. |
| `orders.confirm-original` | US 93 | Potvrda preuzimanja originala procjene u poslovnici. |
| `orders.remind-appraiser` | US 93 | Reminder vještaku za dostavu originala. |
| `opinions.request` | US 94 | Traženje mišljenja CO i Pravne. |
| `opinions.submit-co` | US 94 | Import mišljenja CO. |
| `opinions.submit-legal` | US 94 | Import mišljenja Pravne službe. |
| `opinions.view` | US 94 | Pregled statusa/sadržaja mišljenja. |
| `notifications.view` | sve | Pregled vlastitog in-app notifikacijskog inboxa. |
| `sales.dashboard.view` | Prodaja | Pristup početnom dashboardu segmenta Prodaja. |
| `sales.order.create` | Prodaja | Kreiranje nove narudžbe. |
| `sales.order.view` | Prodaja | Pregled narudžbi segmenta Prodaja. |
| `sales.order.editDraft` | Prodaja | Čuvanje/izmjena nacrta. |
| `sales.order.submit` | Prodaja | Završetak unosa i slanje prema CA. |
| `sales.order.details.view` | Prodaja | Pregled detalja narudžbe. |

> `sales.*` su imenovan permission katalog za segment Prodaja (zahtjev T1). Enforcement na
> endpointima i dalje ide preko `orders.*`/`documents.*` (dokazana logika, isti resursi) —
> AM/SM/UB imaju i `sales.*` i odgovarajuće `orders.*` permisije (vidi `RolePermissionMatrix`).

### 24.3 Mapa rola → permisija

| Permisija | AM/SM/UB | CA | CO | Pravna | Vještak | Protokol | Admin |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| documents.upload | ✅ | ✅ | | | | | ✅ |
| documents.view | ✅ | ✅ | ✅ | ✅ | | | ✅ |
| documents.download | ✅ | ✅ | ✅ | ✅ | | | ✅ |
| documents.delete | ✅ | ✅ | | | | | ✅ |
| orders.view | ✅ | ✅ | ✅ | ✅ | | | ✅ |
| orders.approve-final | | | ✅ | | | | ✅ |
| orders.download-appraisal | ✅ | ✅ | ✅ | | | | ✅ |
| orders.confirm-original | ✅ | | | | | | ✅ |
| orders.remind-appraiser | ✅ | | | | | | ✅ |
| opinions.request | ✅ | | | | | | ✅ |
| opinions.submit-co | | | ✅ | | | | ✅ |
| opinions.submit-legal | | | | ✅ | | | ✅ |
| opinions.view | ✅ | ✅ | ✅ | ✅ | | | ✅ |
| notifications.view | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| codebooks.view | ✅ | ✅ | ✅ | ✅ | | | ✅ |

> Vještak i Protokol su van scope-a US 92/93/94 ovog sprinta — dobijaju samo `notifications.view`
> kao baseline. Proširiti kad se njihovi zadaci budu radili.

### 24.4 Šema (T1) koju koriste T2-T8

- `IFileStorageProvider` (`src/Application/Common/Interfaces`) + `LocalFileStorageProvider`
  (`src/Infrastructure/Storage`) — skladište dokumenata.
- `INotificationService` (`src/Application/Notifications`) — dispatch in-app + email notifikacija
  (kreira `Notification` zapise, šalje preko `IEmailProvider`).
- `IEndpointModule` / `IFeatureModule` — auto-discovery endpointa i DI registracije (vidi
  `docs/backend/feature-module-pattern.md`). T2-T8 se kače kroz ove interfejse, ne diraju
  `WebApplicationExtensions.cs` ni `DependencyInjection.cs`.
- Entitet `Opinion` (`src/Domain/Orders/Opinion.cs`, tabela `order_opinions`) — praćenje
  mišljenja CO i Pravne (US 94).
- Nove kolone na `AppraisalOrder` za US 93/94 (vidi migraciju `AddBusinessWorkflowFields_92_93_94`).

### 24.5 Kako dodati novu permisiju (podsjetnik za T1/tech lead)

1. Dodaj konstantu u `AppPermissions.cs` + u `AppPermissions.All`.
2. Dodaj odgovarajuću konstantu u `AppPolicies.cs` (alias na `AppPermissions`).
3. Mapiraj permisiju na role u `RolePermissionMatrix.PermissionsByRole`.
4. Dodaj display name/opis u `RolePermissionSeeder.PermissionCatalog` (za admin UI).
5. Zaštiti endpoint sa `.RequireAuthorization(AppPolicies.NovaPermisija)`.

**Nakon T1, samo T1/tech lead mijenja role/permission fajlove** (vidi
`dokumenti-sprint2/03-PLAN-PODJELE-8-DEVOVA.md`, §3.4) — T2-T8 samo referenciraju postojeće konstante.
