# Role Management — Acceptance Checklist

Ovo nije QA test suite. Ovo je checklist za ručnu provjeru i review — koristi se pri pregledu implementacije da li je sve u skladu s poslovnim pravilima.

> **Autor:** Amina  
> **Koristi:** Amina (review), QA (provjera)  
> **Verzija:** 1.0

---

## 1. Role/Permission osnova

- [ ] Postoje tačno tri role: `Administrator`, `Unosnik`, `Verifikator`
- [ ] Nema nepotrebnih dodatnih rola (`Agent`, `Procjenitelj`, `Auditor`, `SuperAdmin`, `IntegrationAdmin`)
- [ ] Permission-i su centralizovani u `AppPermissions.cs`
- [ ] Policy-ji u `AppPolicies.cs` koriste permission konstante (ne hardkodovane stringove)
- [ ] `RolePermissionMatrix` postoji i odražava sve 17 permissiona za sve 3 role
- [ ] `AppPermissions.All[]` niz sadrži sve permission-e (17 komada)
- [ ] `AddPermissionPolicies()` automatski registruje policy za svaki permission iz `All[]`

---

## 2. Dodjela rola (AC-ASSIGN-*)

### AC-ASSIGN-01 — Uspješna dodjela
- [ ] Administrator može dodijeliti `Unosnik` rolu korisniku koji je nema
- [ ] Administrator može dodijeliti `Verifikator` rolu korisniku koji je nema
- [ ] Odgovor je 200 OK s ažuriranim podacima korisnika

### AC-ASSIGN-02 — Provjere preduvjeta
- [ ] Dodjela na nepostojećeg korisnika → 404 Not Found
- [ ] Dodjela nepostojeće role → 400 Bad Request
- [ ] Dodjela role korisniku koji je već ima → 409 Conflict (`ROLE_ALREADY_ASSIGNED`)

### AC-ASSIGN-03 — Autorizacija
- [ ] Korisnik bez `roles.assign` permission-a dobija 403 → ne 404 ne 500
- [ ] Korisnik bez tokena dobija 401

### AC-ASSIGN-04 — Audit
- [ ] Uspješna dodjela se bilježi u audit log (`USER_ROLE_ASSIGNED`, Severity: Security)

---

## 3. Uklanjanje rola (AC-REMOVE-*)

### AC-REMOVE-01 — Uspješno uklanjanje
- [ ] Administrator može ukloniti `Unosnik` rolu korisniku koji je ima
- [ ] Administrator može ukloniti `Verifikator` rolu korisniku koji je ima

### AC-REMOVE-02 — Zaštita posljednjeg Administratora
- [ ] Uklanjanje `Administrator` role od jedinom administratoru → 409 Conflict (`LAST_ADMIN_REMOVAL_BLOCKED`)
- [ ] Pokušaj se bilježi u audit log (`LAST_ADMIN_ROLE_REMOVAL_BLOCKED`, Severity: Critical)
- [ ] Sistem ostaje sa bar jednim aktivnim Administratorom

### AC-REMOVE-03 — Provjere preduvjeta
- [ ] Uklanjanje od korisnika koji ne postoji → 404 Not Found
- [ ] Uklanjanje role koje korisnik nema → 409 Conflict (`ROLE_NOT_ASSIGNED`)

### AC-REMOVE-04 — Autorizacija
- [ ] Korisnik bez `roles.remove` permission-a dobija 403
- [ ] Korisnik bez tokena dobija 401

### AC-REMOVE-05 — Audit
- [ ] Uspješno uklanjanje se bilježi u audit log (`USER_ROLE_REMOVED`, Severity: Security)

---

## 4. Transfer administratorske role (AC-TRANSFER-*)

### AC-TRANSFER-01 — Uspješan transfer
- [ ] Administrator A može prenijeti admin rolu na aktivnog Administratora B
- [ ] Nakon transfera: B ima Administrator rolu, A je nema
- [ ] Sistem nikad nema 0 Administratora tokom procesa

### AC-TRANSFER-02 — Siguran redosljed operacija
- [ ] Implementacija PRVO dodaje B, ZATIM uklanja A (nikad obrnuto)
- [ ] Ako dodavanje B padne → operacija se prekida, A zadržava rolu → 500
- [ ] Ako uklanjanje A padne nakon dodavanja B → transakcija se rollback-uje ili B ima rolu a A je zadržava (fail-safe) → audit

### AC-TRANSFER-03 — Provjere preduvjeta
- [ ] Transfer na nepostojećeg korisnika → 404
- [ ] Transfer na neaktivnog korisnika → 400
- [ ] Transfer na korisnika koji već ima Administrator rolu → 409
- [ ] Transfer samom sebi → 400
- [ ] Transfer na blokiranog korisnika → 400

### AC-TRANSFER-04 — Autorizacija
- [ ] Korisnik bez `roles.transfer-admin` permission-a dobija 403
- [ ] Korisnik bez tokena dobija 401

### AC-TRANSFER-05 — Audit
- [ ] Uspješan transfer se bilježi (`ADMIN_ROLE_TRANSFERRED`, Severity: Critical)

---

## 5. 401/403 ponašanje (AC-AUTH-*)

### AC-AUTH-01
- [ ] Zahtjev bez tokena (bez Authorization headera) → 401 Unauthorized
- [ ] Zahtjev s isteklim tokenom → 401 Unauthorized
- [ ] Zahtjev s nevažećim potpisom tokena → 401 Unauthorized

### AC-AUTH-02
- [ ] Zahtjev s validnim tokenom, ali korisniku nedostaje permission → 403 Forbidden
- [ ] Tijelo 403 odgovora je ProblemDetails format s `errorCode: "PERMISSION_DENIED"`

### AC-AUTH-03
- [ ] Backend nikad ne vraća 200 za zabranjene akcije (čak ni s praznim podacima)

---

## 6. Korisnik s više rola (AC-MULTI-*)

### AC-MULTI-01 — Unija permission-a
- [ ] Korisnik s `Unosnik + Verifikator` ima permission-e obje role
- [ ] `permissions` polje u `/api/me` response-u je unija bez duplikata
- [ ] Korisnik može i kreirati zapis (`records.create`) i verificirati tuđi (`records.approve`)

### AC-MULTI-02 — Maker-checker pravilo
- [ ] Korisnik s `Unosnik + Verifikator` NE može verificirati vlastiti zapis → 403
- [ ] Greška je jasna: `SELF_VERIFICATION_BLOCKED`
- [ ] Pokušaj se bilježi u audit log

### AC-MULTI-03 — defaultRoute prioritet
- [ ] Korisnik s `Unosnik + Verifikator` → `defaultRoute = /verifikator/dashboard` (Verifikator ima viši prioritet)
- [ ] Korisnik s `Unosnik + Administrator` → `defaultRoute = /admin/dashboard` (Administrator ima najviši prioritet)

---

## 7. Field visibility (AC-FIELD-*)

### AC-FIELD-01 — Hidden polja
- [ ] Polja označena kao Hidden se ne šalju frontendu u response DTO-u
- [ ] Ako frontend pokuša dohvatiti Hidden polje direktno — backend ga ne vraća

### AC-FIELD-02 — ReadOnly polja
- [ ] ReadOnly polja su uključena u response
- [ ] Pokušaj izmjene ReadOnly polja u API zahtjevu → 403 (`FORBIDDEN_FIELD_UPDATE`)

### AC-FIELD-03 — Editable polja
- [ ] Editable polja se mogu mijenjati samo kroz odgovarajuće akcione request DTO-e
- [ ] Direktno slanje polja koja nisu u DTO-u se ignorira ili odbija

### AC-FIELD-04 — Frontend nije sigurnosni sloj
- [ ] Čak i ako frontend sakrije/disabluje polje, backend uvijek validira
- [ ] Ručni API poziv s forbidden poljem → 403 bez obzira na UI state

---

## 8. Maker-checker / Four-eyes pravilo (AC-MAKER-*)

### AC-MAKER-01
- [ ] `Unosnik` koji kreira zapis ne može isti verificirati → 403
- [ ] `Verifikator` koji slučajno kreira zapis ne može ga verificirati → 403
- [ ] `Administrator` koji kreira zapis ne može ga verificirati → 403 (four-eyes važi za sve)

### AC-MAKER-02
- [ ] Provjera je `record.CreatedByUserId == currentUser.UserId` → tada zabrana
- [ ] Nije dovoljno imati permission — vlasništvo je primarni uvjet

---

## 9. Edge case-ovi (AC-EC-*)

### AC-EC-01 — Nepoznata rola u tokenu
- [ ] Rola koja ne postoji u `AppRoles.All` se tiho ignorira
- [ ] Sistem ne pada, ne loguje grešku za to — samo ne mapira permission-e za nju

### AC-EC-02 — Posljednji Administrator
- [ ] Nije moguće ostaviti sistem bez nijednog aktivnog Administratora
- [ ] Pokušaj se blokira s 409 i auditira

### AC-EC-03 — Transakciona sigurnost kod transfera
- [ ] Transfer je atomičan — ili oba koraka uspijevaju ili se sistem vraća u polazno stanje

### AC-EC-04 — Forbidden field u requestu
- [ ] Request koji sadrži polje koje korisnik nema pravo mijenjati → 403 (ne ignorira se tiho)

### AC-EC-05 — Korisnik deaktiviran
- [ ] Deaktiviran korisnik u Keycloak-u ne može dobiti validan token
- [ ] Ako token istekne, korisnik mora se ponovo prijaviti

---

## 10. Dokumentacija (AC-DOC-*)

### AC-DOC-01
- [ ] `docs/backend/role-permission-rules.md` postoji i sadrži sve role, permission-e, matricu i edge case-ove
- [ ] `docs/backend/role-permission-work-log.md` postoji
- [ ] `docs/backend/role-management-acceptance-checklist.md` postoji (ovaj fajl)
- [ ] `docs/backend/role-management-review-checklist.md` postoji
- [ ] `src/Application/Security/README.md` postoji

### AC-DOC-02 — Ažurnost
- [ ] Matrica u dokumentu odražava stvarno stanje u kodu (uključujući `codebooks.manage`)
- [ ] TODO lista je ažurna
