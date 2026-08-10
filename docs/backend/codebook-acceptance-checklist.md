# Šifarnici — Acceptance Checklist

Ova lista pokriva sve prihvatne kriterije za user story "Upravljanje šifarnicima".
QA tim i tech lead koriste ovu listu za finalno prihvatanje user story-ja.

---

## AC-INFRA — Arhitektura i infrastruktura

| ID | Prihvatni kriterij | Status |
|---|---|---|
| AC-INFRA-01 | `CodebookValue` entitet postoji u `Domain/Codebooks/` | ☐ |
| AC-INFRA-02 | `CodebookValue` nasljeđuje `BaseEntity` (ima `Id`, `CreatedAt`, `UpdatedAt`) | ☐ |
| AC-INFRA-03 | `ICodebookValueService` interfejs postoji u `Application/Codebooks/Interfaces/` | ☐ |
| AC-INFRA-04 | `ICodebookUsageService` interfejs postoji | ☐ |
| AC-INFRA-05 | `ICodebookUsageChecker` interfejs postoji | ☐ |
| AC-INFRA-06 | `ICodebookCacheInvalidator` interfejs postoji | ☐ |
| AC-INFRA-07 | `CodebookErrorCodes` klasa postoji s konstantama | ☐ |
| AC-INFRA-08 | `CodebookValueService` je implementiran u `Infrastructure/Codebooks/` | ☐ |
| AC-INFRA-09 | `CodebookUsageService` je implementiran | ☐ |
| AC-INFRA-10 | Svi servisi registrovani u DI (`DependencyInjection.cs`) | ☐ |
| AC-INFRA-11 | Projekt se builda bez grešaka i upozorenja | ☐ |

---

## AC-DB — Database model i migracija

| ID | Prihvatni kriterij | Status |
|---|---|---|
| AC-DB-01 | Tabela `codebook_values` postoji u bazi (migracija pokrenuta) | ☐ |
| AC-DB-02 | Tabela ima sve potrebne kolone: `id`, `codebook_key`, `code`, `label`, `description`, `sort_order`, `is_active`, `is_system`, `is_critical` | ☐ |
| AC-DB-03 | Tabela ima audit kolone: `created_at`, `updated_at`, `created_by_user_id`, `updated_by_user_id` | ☐ |
| AC-DB-04 | Tabela ima deaktivacijske kolone: `deactivated_at`, `deactivated_by_user_id` | ☐ |
| AC-DB-05 | Tabela ima soft delete kolone: `deleted_at`, `deleted_by_user_id` | ☐ |
| AC-DB-06 | Unique parcijalni indeks: `(codebook_key, code)` WHERE `deleted_at IS NULL` | ☐ |
| AC-DB-07 | Composite indeks: `(codebook_key, is_active)` za dropdown upite | ☐ |
| AC-DB-08 | EF Core globalni query filter isključuje `deleted_at IS NOT NULL` zapise | ☐ |

---

## AC-DROPDOWN — Dropdown reflektovanje

| ID | Prihvatni kriterij | Status |
|---|---|---|
| AC-DROP-01 | `GET /api/codebooks/{key}/values/active` vraća samo aktivne, neobrisane vrijednosti | ☐ |
| AC-DROP-02 | Odgovor je sortiran po `sort_order ASC, label ASC` | ☐ |
| AC-DROP-03 | Deaktivirana vrijednost se odmah ne pojavljuje u sljedećem pozivu dropdowna | ☐ |
| AC-DROP-04 | Endpoint zahtijeva `codebooks.view` permission | ☐ |
| AC-DROP-05 | DTO sadrži `id`, `code`, `label`, `sortOrder` (bez audit polja) | ☐ |
| AC-DROP-06 | Korisnik bez `codebooks.view` dobija 403 | ☐ |

---

## AC-DEACTIVATE — Deaktivacija

| ID | Prihvatni kriterij | Status |
|---|---|---|
| AC-DEA-01 | `POST /values/{id}/deactivate` zahtijeva `codebooks.manage` | ☐ |
| AC-DEA-02 | Uspješna deaktivacija → 200 + `CodebookValueDto` s `isActive=false` | ☐ |
| AC-DEA-03 | Deaktivacija već neaktivne vrijednosti → 409 `CODEBOOK_VALUE_ALREADY_INACTIVE` | ☐ |
| AC-DEA-04 | Deaktivacija kritične sistemske vrijednosti → 409 `CODEBOOK_VALUE_CRITICAL_LOCKED` | ☐ |
| AC-DEA-05 | Deaktivacija vrijednosti u upotrebi → dozvoljena (200 OK) | ☐ |
| AC-DEA-06 | `deactivated_at` i `deactivated_by_user_id` se popunjavaju u bazi | ☐ |
| AC-DEA-07 | `updated_at` i `updated_by_user_id` se popunjavaju | ☐ |
| AC-DEA-08 | Audit event `CODEBOOK_ENTRY_DEACTIVATED` se bilježi | ☐ |
| AC-DEA-09 | Deaktivirana vrijednost se ne pojavljuje u dropdownu | ☐ |
| AC-DEA-10 | Korisnik bez permission-a → 403 | ☐ |
| AC-DEA-11 | Nepostojeća vrijednost → 404 | ☐ |

---

## AC-ACTIVATE — Aktivacija (reaktivacija)

| ID | Prihvatni kriterij | Status |
|---|---|---|
| AC-ACT-01 | `POST /values/{id}/activate` zahtijeva `codebooks.manage` | ☐ |
| AC-ACT-02 | Uspješna aktivacija → 200 + `CodebookValueDto` s `isActive=true` | ☐ |
| AC-ACT-03 | Aktivacija već aktivne vrijednosti → 409 `CODEBOOK_VALUE_ALREADY_ACTIVE` | ☐ |
| AC-ACT-04 | Reaktivirana vrijednost se ponovo pojavljuje u dropdownu | ☐ |
| AC-ACT-05 | Audit event `CODEBOOK_VALUE_ACTIVATED` se bilježi | ☐ |
| AC-ACT-06 | `updated_at` i `updated_by_user_id` se ažuriraju | ☐ |

---

## AC-DELETE — Brisanje (soft delete)

| ID | Prihvatni kriterij | Status |
|---|---|---|
| AC-DEL-01 | `DELETE /values/{id}` zahtijeva `codebooks.manage` | ☐ |
| AC-DEL-02 | Brisanje nekorištene, nesistemske vrijednosti → 204 No Content | ☐ |
| AC-DEL-03 | Vrijednost se ne pojavljuje u dropdownu nakon brisanja | ☐ |
| AC-DEL-04 | Brisanje vrijednosti u upotrebi → 409 `CODEBOOK_VALUE_IN_USE` | ☐ |
| AC-DEL-05 | 409 odgovor sadrži `usageCount` iz `CodebookUsageResult` | ☐ |
| AC-DEL-06 | Brisanje sistemske vrijednosti → 409 `CODEBOOK_VALUE_SYSTEM_LOCKED` | ☐ |
| AC-DEL-07 | Brisanje je soft delete: `deleted_at` i `deleted_by_user_id` se postavljaju | ☐ |
| AC-DEL-08 | Obrisana vrijednost je nevidljiva za sve daljnje upite | ☐ |
| AC-DEL-09 | Audit event `CODEBOOK_VALUE_DELETED` ili blokirajući event se bilježi | ☐ |
| AC-DEL-10 | Korisnik bez permission-a → 403 | ☐ |
| AC-DEL-11 | Nepostojeća vrijednost → 404 | ☐ |

---

## AC-USAGE — Usage check

| ID | Prihvatni kriterij | Status |
|---|---|---|
| AC-USE-01 | `GET /values/{id}/usage` zahtijeva `codebooks.manage` | ☐ |
| AC-USE-02 | Response sadrži `isInUse`, `usageCount`, `locations`, `isReliable`, `canDelete`, `canDeactivate`, `recommendedAction` | ☐ |
| AC-USE-03 | Nekorištena vrijednost → `isInUse=false`, `canDelete=true` | ☐ |
| AC-USE-04 | Korištena vrijednost → `isInUse=true`, `canDelete=false`, `recommendedAction="Deactivate"` | ☐ |
| AC-USE-05 | Ako usage checker baci grešku → `isReliable=false`, `canDelete=false` | ☐ |
| AC-USE-06 | DELETE uvijek ponavlja usage check neovisno od prethodnog GET /usage | ☐ |

---

## AC-PERMISSIONS — Permission pravila

| ID | Prihvatni kriterij | Status |
|---|---|---|
| AC-PERM-01 | Administrator ima i `codebooks.view` i `codebooks.manage` | ☐ |
| AC-PERM-02 | Unosnik ima samo `codebooks.view` | ☐ |
| AC-PERM-03 | Verifikator ima samo `codebooks.view` | ☐ |
| AC-PERM-04 | Unosnik ne može deaktivirati, aktivirati ni brisati → 403 | ☐ |
| AC-PERM-05 | Verifikator ne može deaktivirati, aktivirati ni brisati → 403 | ☐ |
| AC-PERM-06 | Neprijavljen korisnik → 401 | ☐ |

---

## AC-AUDIT — Audit i praćenje

| ID | Prihvatni kriterij | Status |
|---|---|---|
| AC-AUD-01 | Deaktivacija bilježi korisnika i datum u bazi (`deactivated_by_user_id`, `deactivated_at`) | ☐ |
| AC-AUD-02 | Aktivacija bilježi `updated_by_user_id`, `updated_at` | ☐ |
| AC-AUD-03 | Brisanje bilježi `deleted_by_user_id`, `deleted_at` | ☐ |
| AC-AUD-04 | Svaka mutacija generiše `AuditLog` zapis | ☐ |
| AC-AUD-05 | Audit log sadrži `ActorUserId`, `Action`, `Module=Codebooks`, `EntityKey` | ☐ |
| AC-AUD-06 | Blokirane operacije (IN_USE, SYSTEM_LOCKED, CRITICAL_LOCKED) se audiraju | ☐ |
| AC-AUD-07 | Greška u audit logu ne ruši poslovnu operaciju | ☐ |

---

## AC-SECURITY — Sigurnost

| ID | Prihvatni kriterij | Status |
|---|---|---|
| AC-SEC-01 | Direktan API poziv bez tokena → 401 | ☐ |
| AC-SEC-02 | Direktan API poziv bez `codebooks.manage` → 403 | ☐ |
| AC-SEC-03 | Pokušaj brisanja vrijednosti s `codebookKey` koji ne odgovara → 404 | ☐ |
| AC-SEC-04 | Poslovna pravila su u servisu, ne samo u endpointu | ☐ |

---

## AC-CRUD — Kreiranje i uređivanje (Hamzini taskovi — za review)

| ID | Prihvatni kriterij | Status |
|---|---|---|
| AC-CRUD-01 | `POST /values` kreira novu aktivnu vrijednost | ☐ |
| AC-CRUD-02 | Duplikat `code` u istom `codebookKey` → greška (unique constraint) | ☐ |
| AC-CRUD-03 | `PUT /values/{id}` ažurira `label`, `description`, `sortOrder` | ☐ |
| AC-CRUD-04 | Promjena `code` za vrijednost u upotrebi → 409 `CODEBOOK_VALUE_CODE_IN_USE_CANNOT_CHANGE` | ☐ |
| AC-CRUD-05 | `updated_at`, `updated_by_user_id` se postavljaju pri updateu | ☐ |
| AC-CRUD-06 | Kreiranje bilježi `created_by_user_id`, `created_at` | ☐ |

---

## AC-DOC — Dokumentacija

| ID | Prihvatni kriterij | Status |
|---|---|---|
| AC-DOC-01 | `docs/backend/codebook-rules.md` postoji i pokriva sva pravila | ☐ |
| AC-DOC-02 | `docs/backend/codebook-work-log.md` postoji s mapom fajlova i statusom taskova | ☐ |
| AC-DOC-03 | Raspodjela odgovornosti jasna (Amina vs Hamza vs Frontend vs QA) | ☐ |
