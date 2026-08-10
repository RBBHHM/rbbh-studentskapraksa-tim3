# Manuelni test plan — Praksa API

| Polje | Vrijednost |
|---|---|
| Verzija dokumenta | 1.0 |
| Datum | 2026-06-02 |
| Autor | Harun Zukanović |
| Branch | develop |
| Build (commit) | _(popuniti pri izvršavanju)_ |
| Stack | .NET 10 · Minimal API · PostgreSQL · Keycloak · Docker Compose |

---

## 1. Cilj

Verifikovati ponašanje REST API sloja aplikacije **Praksa** na granicama autentifikacije, autorizacije, validacije i obrade grešaka. Skup test slučajeva odgovara stvarnim endpointima registrovanim u `WebApplicationExtensions.MapAllEndpoints` i prati postojeću konvenciju identifikatora iz koda (`BE-04`, `BR-ROLE-04`, itd.).

## 2. Opseg

**Uključeno:**
- Health endpointi: `/health`, `/health/ready`, `/health/live`
- Test endpointi za autentifikaciju/autorizaciju: `/api/hello`, `/api/hello/secure`, `/api/hello/admin`
- Me endpointi: `/api/me`, `/api/me/permissions`
- Codebook endpointi: `/api/codebooks/{codebookKey}/values/...`
- Role management endpointi: `/api/roles/assign`, `/api/roles/remove`, `/api/roles/transfer-admin`
- User-Role endpointi: `/api/users`, `/api/users/{userId}/roles`
- Cross-cutting ponašanje: `X-Correlation-ID` header, ProblemDetails (RFC 7807) format greški
- Validatori: JMBG, porezni broj

**Nije uključeno:**
- Performance testiranje
- Penetration testiranje
- UI testovi Blazor frontenda
- Database migracije

## 3. Test okruženje

| Komponenta | URL / Verzija |
|---|---|
| API | http://localhost:5000 |
| Web (Blazor WASM) | http://localhost:5001 |
| Keycloak | http://localhost:8080 |
| PostgreSQL | localhost:5432 |
| Testing alat | Postman / curl |
| OS testera | macOS 14+ |

## 4. Preduslovi

1. `cd` u repo, prebaciti se na `develop`, `git pull`
2. `cp .env.example .env` i popuniti
3. Pokrenuti stack:
   ```bash
   docker compose -f docker/docker-compose.yml \
                  -f docker/docker-compose.override.yml up --build
   ```
4. Sačekati da svi kontejneri budu **healthy**
5. U Keycloak realm-u kreirati test korisnike (ako već ne postoje):
   - `test.administrator` → realm rola `Administrator`
   - `test.unosnik` → realm rola `Unosnik`
   - `test.verifikator` → realm rola `Verifikator`
   - `test.bezrole` → bez aplikacijskih rola
6. Pribaviti JWT tokene za svaku rolu (Keycloak password grant ili UI login)

## 5. Konvencija ID-jeva

`TC-<MODUL>-<BROJ>`

| Prefiks | Modul |
|---|---|
| `TC-HEALTH` | Health endpointi |
| `TC-HELLO` | Hello (BE-04) test endpointi |
| `TC-ME` | Me / current user |
| `TC-CB` | Codebooks |
| `TC-ROLE` | Role management |
| `TC-USR` | Users / user-role list |
| `TC-CORR` | Correlation ID middleware |
| `TC-VAL` | Validatori (JMBG, porezni broj) |
| `TC-ERR` | ProblemDetails format greške |

## 6. Statusne oznake

| Status | Značenje |
|---|---|
| ✅ Pass | Stvarni rezultat odgovara očekivanom |
| ❌ Fail | Stvarni rezultat NE odgovara očekivanom |
| ⏸ Blocked | Test nije moguće izvršiti zbog vanjske prepreke |
| 🚧 N/A | Test nije primjenjiv u ovom buildu |

---

## 7. Test slučajevi

### 7.1 Health endpointi (`HealthEndpoints`)

#### TC-HEALTH-001 — `/health` vraća 200 anonimno

| Polje | Vrijednost |
|---|---|
| **Preduslov** | API kontejner pokrenut |
| **Koraci** | `curl -i http://localhost:5000/health` |
| **Očekivani rezultat** | HTTP `200 OK`; tijelo: `Healthy` (text/plain) |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

#### TC-HEALTH-002 — `/health/ready` vraća 200 anonimno

| Polje | Vrijednost |
|---|---|
| **Preduslov** | API pokrenut |
| **Koraci** | `curl -i http://localhost:5000/health/ready` |
| **Očekivani rezultat** | HTTP `200 OK` |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

#### TC-HEALTH-003 — `/health/live` vraća 200 anonimno

| Polje | Vrijednost |
|---|---|
| **Preduslov** | API pokrenut |
| **Koraci** | `curl -i http://localhost:5000/health/live` |
| **Očekivani rezultat** | HTTP `200 OK` |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

---

### 7.2 BE-04 Hello endpointi (Auth/AuthZ smoke test)

#### TC-HELLO-001 — `/api/hello` vraća 200 anonimno

| Polje | Vrijednost |
|---|---|
| **Preduslov** | API pokrenut |
| **Koraci** | `curl -i http://localhost:5000/api/hello` |
| **Očekivani rezultat** | HTTP `200 OK`; JSON sadrži `status: "OK"` i `timestamp` |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

#### TC-HELLO-002 — `/api/hello/secure` bez tokena vraća 401

| Polje | Vrijednost |
|---|---|
| **Preduslov** | API pokrenut |
| **Koraci** | `curl -i http://localhost:5000/api/hello/secure` |
| **Očekivani rezultat** | HTTP `401 Unauthorized` |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

#### TC-HELLO-003 — `/api/hello/secure` s validnim tokenom vraća 200

| Polje | Vrijednost |
|---|---|
| **Preduslov** | Validan JWT bilo koje aplikacijske role |
| **Koraci** | `curl -i -H "Authorization: Bearer <TOKEN>" http://localhost:5000/api/hello/secure` |
| **Očekivani rezultat** | HTTP `200 OK`; JSON sadrži `userId`, `username`, `status: "OK"` |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

#### TC-HELLO-004 — `/api/hello/admin` s Administrator rolom vraća 200

| Polje | Vrijednost |
|---|---|
| **Preduslov** | Token korisnika `test.administrator` |
| **Koraci** | `curl -i -H "Authorization: Bearer <ADMIN_TOKEN>" http://localhost:5000/api/hello/admin` |
| **Očekivani rezultat** | HTTP `200 OK`; JSON poruka "Admin pristup potvrđen." |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

#### TC-HELLO-005 — `/api/hello/admin` bez Administrator role vraća 403

| Polje | Vrijednost |
|---|---|
| **Preduslov** | Token `test.unosnik` (nije admin) |
| **Koraci** | `curl -i -H "Authorization: Bearer <UNOSNIK_TOKEN>" http://localhost:5000/api/hello/admin` |
| **Očekivani rezultat** | HTTP `403 Forbidden` |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

---

### 7.3 Me endpointi

#### TC-ME-001 — `/api/me` s validnim tokenom vraća MeDto

| Polje | Vrijednost |
|---|---|
| **Preduslov** | Validan JWT |
| **Koraci** | `curl -i -H "Authorization: Bearer <TOKEN>" http://localhost:5000/api/me` |
| **Očekivani rezultat** | HTTP `200 OK`; JSON sadrži `userId`, `username`, `email`, `roles` (array), `permissions` (array) |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

#### TC-ME-002 — `/api/me` bez tokena vraća 401

| Polje | Vrijednost |
|---|---|
| **Preduslov** | API pokrenut |
| **Koraci** | `curl -i http://localhost:5000/api/me` |
| **Očekivani rezultat** | HTTP `401 Unauthorized` |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

#### TC-ME-003 — `/api/me/permissions` za Administratora vraća sve admin permission-e

| Polje | Vrijednost |
|---|---|
| **Preduslov** | Admin token |
| **Koraci** | `curl -i -H "Authorization: Bearer <ADMIN_TOKEN>" http://localhost:5000/api/me/permissions` |
| **Očekivani rezultat** | HTTP `200 OK`; JSON sadrži `roles: ["Administrator"]` i `permissions` lista sa `users.view`, `roles.assign`, `codebooks.manage`, `admin.access`, itd. (vidi `RolePermissionMatrix`) |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

#### TC-ME-004 — `/api/me/permissions` za Unosnika ne sadrži admin permission-e

| Polje | Vrijednost |
|---|---|
| **Preduslov** | Token `test.unosnik` |
| **Koraci** | `curl -i -H "Authorization: Bearer <UNOSNIK_TOKEN>" http://localhost:5000/api/me/permissions` |
| **Očekivani rezultat** | `permissions` sadrži `records.create`, `codebooks.view`; **ne** sadrži `users.view`, `roles.assign`, `codebooks.manage` |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

---

### 7.4 Codebook endpointi

> **Napomena:** `{codebookKey}` u rutama je placeholder za stvarni ključ šifarnika (npr. `limit_types`, `role_types`). Provjeriti aktivne ključeve u Domain sloju ili konsultovati tim.

#### TC-CB-001 — GET active values vraća 200 s `codebooks.view` permission

| Polje | Vrijednost |
|---|---|
| **Preduslov** | Token Unosnika ili Administratora |
| **Koraci** | `curl -i -H "Authorization: Bearer <TOKEN>" "http://localhost:5000/api/codebooks/<KEY>/values/active"` |
| **Očekivani rezultat** | HTTP `200 OK`; JSON niz `CodebookOptionDto` (polja: `id`, `code`, `label`, `sortOrder`) |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

#### TC-CB-002 — GET all values bez `codebooks.manage` vraća 403

| Polje | Vrijednost |
|---|---|
| **Preduslov** | Token Unosnika (ima `codebooks.view` ali ne i `codebooks.manage`) |
| **Koraci** | `curl -i -H "Authorization: Bearer <UNOSNIK_TOKEN>" "http://localhost:5000/api/codebooks/<KEY>/values"` |
| **Očekivani rezultat** | HTTP `403 Forbidden` |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

#### TC-CB-003 — POST create s duplim Code-om vraća 409 i errorCode `CODEBOOK_VALUE_DUPLICATE_CODE`

| Polje | Vrijednost |
|---|---|
| **Preduslov** | Admin token; postoji vrijednost sa Code-om `X` u šifarniku |
| **Koraci** | POST sa body `{"code": "X", "label": "Duplikat", "description": null, "sortOrder": 10}` |
| **Očekivani rezultat** | HTTP `409 Conflict`; ProblemDetails sa `errorCode: "CODEBOOK_VALUE_DUPLICATE_CODE"` |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

#### TC-CB-004 — PUT update na nepostojeći ID vraća 404 i errorCode `CODEBOOK_VALUE_NOT_FOUND`

| Polje | Vrijednost |
|---|---|
| **Preduslov** | Admin token |
| **Koraci** | PUT `/api/codebooks/<KEY>/values/99999999` sa validnim body-jem |
| **Očekivani rezultat** | HTTP `404 Not Found`; ProblemDetails sa `errorCode: "CODEBOOK_VALUE_NOT_FOUND"` |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

#### TC-CB-005 — DELETE vrijednosti koja je u upotrebi vraća 409 i errorCode `CODEBOOK_VALUE_IN_USE`

| Polje | Vrijednost |
|---|---|
| **Preduslov** | Admin token; vrijednost ID = `<ID>` je referencirana u poslovnim zapisima |
| **Koraci** | `curl -i -X DELETE -H "Authorization: Bearer <ADMIN_TOKEN>" "http://localhost:5000/api/codebooks/<KEY>/values/<ID>"` |
| **Očekivani rezultat** | HTTP `409 Conflict`; `errorCode: "CODEBOOK_VALUE_IN_USE"` |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

#### TC-CB-006 — GET `/usage` vraća `CodebookUsageResult` sa `canDelete`, `canDeactivate`, `recommendedAction`

| Polje | Vrijednost |
|---|---|
| **Preduslov** | Admin token |
| **Koraci** | `curl -i -H "Authorization: Bearer <ADMIN_TOKEN>" "http://localhost:5000/api/codebooks/<KEY>/values/<ID>/usage"` |
| **Očekivani rezultat** | HTTP `200 OK`; JSON sadrži `isInUse`, `usageCount`, `locations[]`, `isReliable`, `canDelete`, `canDeactivate`, `recommendedAction` (`"Deactivate"` ili `"Delete"`) |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

---

### 7.5 Role Management endpointi (BR-ROLE-02, BR-ROLE-04)

#### TC-ROLE-001 — Assign role bez `roles.assign` permission-a vraća 403

| Polje | Vrijednost |
|---|---|
| **Preduslov** | Token Unosnika |
| **Koraci** | POST `/api/roles/assign` body `{"userId": "<ID>", "roleName": "Unosnik"}` |
| **Očekivani rezultat** | HTTP `403 Forbidden` |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

#### TC-ROLE-002 — Assign role admin korisniku uspješan vraća 204

| Polje | Vrijednost |
|---|---|
| **Preduslov** | Admin token; postoji korisnik `<UID>` koji NEMA rolu Verifikator |
| **Koraci** | POST `/api/roles/assign` body `{"userId": "<UID>", "roleName": "Verifikator"}` |
| **Očekivani rezultat** | HTTP `204 No Content` |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

#### TC-ROLE-003 — Assign već dodijeljene role vraća 409

| Polje | Vrijednost |
|---|---|
| **Preduslov** | Admin token; korisnik `<UID>` već ima rolu `Verifikator` |
| **Koraci** | POST `/api/roles/assign` body `{"userId": "<UID>", "roleName": "Verifikator"}` |
| **Očekivani rezultat** | HTTP `409 Conflict` |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

#### TC-ROLE-004 — BR-ROLE-04: Uklanjanje posljednjeg Administratora se blokira (409)

| Polje | Vrijednost |
|---|---|
| **Preduslov** | U sistemu postoji **tačno jedan** korisnik sa rolom `Administrator` (`<ADMIN_UID>`) |
| **Koraci** | POST `/api/roles/remove` body `{"userId": "<ADMIN_UID>", "roleName": "Administrator"}` |
| **Očekivani rezultat** | HTTP `409 Conflict`; audit log sadrži `LAST_ADMIN_ROLE_REMOVAL_BLOCKED` |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |
| **Napomena** | Kritični sigurnosni test — sistem nikad ne smije ostati bez admina |

#### TC-ROLE-005 — Transfer admin role: siguran redoslijed (dodaj pa skini)

| Polje | Vrijednost |
|---|---|
| **Preduslov** | `<SRC>` ima Admin rolu, `<TGT>` postoji ali nema Admin rolu |
| **Koraci** | POST `/api/roles/transfer-admin` body `{"sourceUserId": "<SRC>", "targetUserId": "<TGT>", "reason": "Predaja dužnosti"}` |
| **Očekivani rezultat** | HTTP `204 No Content`; `<TGT>` ima Admin rolu, `<SRC>` nema; audit log sadrži `ADMIN_ROLE_TRANSFERRED` |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

---

### 7.6 User-Role endpointi

#### TC-USR-001 — GET `/api/users` s admin token-om vraća paginiranu listu

| Polje | Vrijednost |
|---|---|
| **Preduslov** | Admin token |
| **Koraci** | `curl -i -H "Authorization: Bearer <ADMIN_TOKEN>" "http://localhost:5000/api/users?page=1&pageSize=20"` |
| **Očekivani rezultat** | HTTP `200 OK`; JSON sadrži `items[]`, `totalCount`, `page`, `pageSize`, `totalPages` |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

#### TC-USR-002 — GET `/api/users` bez `users.view` vraća 403

| Polje | Vrijednost |
|---|---|
| **Preduslov** | Token korisnika koji nema `users.view` permission (npr. Unosnik) |
| **Koraci** | `curl -i -H "Authorization: Bearer <UNOSNIK_TOKEN>" "http://localhost:5000/api/users"` |
| **Očekivani rezultat** | HTTP `403 Forbidden` |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

#### TC-USR-003 — GET `/api/users?role=<nepoznata>` vraća 400 sa `VALUE_NOT_ALLOWED`

| Polje | Vrijednost |
|---|---|
| **Preduslov** | Admin token |
| **Koraci** | `curl -i -H "Authorization: Bearer <ADMIN_TOKEN>" "http://localhost:5000/api/users?role=NepoznataRola"` |
| **Očekivani rezultat** | HTTP `400 Bad Request`; ProblemDetails `fieldErrors[0]` ima `field: "role"`, `code: "VALUE_NOT_ALLOWED"` |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

#### TC-USR-004 — GET `/api/users/<nepostojeci>/roles` vraća 404 sa `USER_NOT_FOUND`

| Polje | Vrijednost |
|---|---|
| **Preduslov** | Admin token |
| **Koraci** | `curl -i -H "Authorization: Bearer <ADMIN_TOKEN>" "http://localhost:5000/api/users/00000000-0000-0000-0000-000000000000/roles"` |
| **Očekivani rezultat** | HTTP `404 Not Found`; `errorCode: "USER_NOT_FOUND"` |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

---

### 7.7 Correlation ID middleware

#### TC-CORR-001 — Server generiše novi `X-Correlation-ID` ako klijent ne pošalje

| Polje | Vrijednost |
|---|---|
| **Preduslov** | API pokrenut |
| **Koraci** | `curl -i http://localhost:5000/api/hello` |
| **Očekivani rezultat** | Response sadrži header `X-Correlation-ID` sa GUID vrijednošću |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

#### TC-CORR-002 — Server zadržava `X-Correlation-ID` koji klijent pošalje

| Polje | Vrijednost |
|---|---|
| **Preduslov** | API pokrenut |
| **Koraci** | `curl -i -H "X-Correlation-ID: TEST-12345" http://localhost:5000/api/hello` |
| **Očekivani rezultat** | Response sadrži `X-Correlation-ID: TEST-12345` |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

#### TC-CORR-003 — Predugi `X-Correlation-ID` (>64 znaka) se zamjenjuje novim

| Polje | Vrijednost |
|---|---|
| **Preduslov** | API pokrenut |
| **Koraci** | curl sa header-om dužim od 64 znaka: `-H "X-Correlation-ID: AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"` |
| **Očekivani rezultat** | Response `X-Correlation-ID` je novi GUID, ne ulazna vrijednost |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

---

### 7.8 ProblemDetails format greški (RFC 7807)

#### TC-ERR-001 — 404 odgovor je u ProblemDetails formatu

| Polje | Vrijednost |
|---|---|
| **Preduslov** | Admin token |
| **Koraci** | GET `/api/codebooks/<KEY>/values/99999999` |
| **Očekivani rezultat** | Content-Type: `application/problem+json`; tijelo sadrži `status: 404`, `title: "Not Found"`, `detail`, `instance`, `type` (URL RFC), `errorCode`, `correlationId` |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

#### TC-ERR-002 — 400 ValidationException response ima `fieldErrors`

| Polje | Vrijednost |
|---|---|
| **Preduslov** | Admin token |
| **Koraci** | GET `/api/users?role=NepoznataRola` (kao TC-USR-003) |
| **Očekivani rezultat** | Tijelo sadrži `fieldErrors: [{ "field": "role", "code": "VALUE_NOT_ALLOWED", "message": "..." }]` |
| **Stvarni rezultat** | _(popuniti)_ |
| **Status** | _(popuniti)_ |

---

### 7.9 Validatori (jedinično, bez HTTP-a — bonus)

> Ovi testovi se izvršavaju direktno preko unit test projekta `Application.Tests`, ne preko HTTP-a. Uvršteni u manuelni plan radi kompletnosti pregleda.

#### TC-VAL-001 — JMBG s 12 cifara vraća `INVALID_JMBG_LENGTH`

| Polje | Vrijednost |
|---|---|
| **Preduslov** | Build prošao |
| **Koraci** | Pozvati `JmbgValidator.Validate("123456789012")` |
| **Očekivani rezultat** | Lista sa 1 greškom, `Code: "INVALID_JMBG_LENGTH"` |

#### TC-VAL-002 — JMBG s nevažećim danom vraća `INVALID_JMBG_DATE_PART`

| Polje | Vrijednost |
|---|---|
| **Koraci** | `JmbgValidator.Validate("3213999123456")` (dan 32) |
| **Očekivani rezultat** | `Code: "INVALID_JMBG_DATE_PART"` |

#### TC-VAL-003 — Porezni broj sa slovima vraća `INVALID_TAX_NUMBER_DIGITS_ONLY`

| Polje | Vrijednost |
|---|---|
| **Koraci** | `TaxNumberValidator.Validate("1234567890ABC")` |
| **Očekivani rezultat** | `Code: "INVALID_TAX_NUMBER_DIGITS_ONLY"` |

---

## 8. Prijava defekta

Kod statusa **❌ Fail** otvoriti GitHub Issue:

- **Naslov:** `[Bug] <TC-XXX-NNN> <kratak opis>`
- **Build commit:** _(npr. `e037483`)_
- **Reprodukcija:** kopirati korake iz TC
- **Očekivano:** kopirati iz TC
- **Stvarno:** detalj + status code + tijelo odgovora
- **Correlation ID:** iz `X-Correlation-ID` header-a odgovora
- **Logovi:** `docker compose logs api`

## 9. Istorija promjena

| Verzija | Datum | Autor | Promjene |
|---|---|---|---|
| 1.0 | 2026-06-02 | Harun Zukanović | Inicijalna verzija — pokriva svih 6 endpoint familija + correlation ID + ProblemDetails |
