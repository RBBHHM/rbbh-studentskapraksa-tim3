# Šifarnici — Work Log i Mapa Implementacije

---

## 1. Status taskova

| Task ID | Naziv | Assignee | Planirani status | Stvarni status u repozitoriju | Napomena |
|---|---|---|---|---|---|
| SA-04 | Definisati upravljanje šifarnicima | Amina | Završeno | ✅ Dokumentovano u `codebook-rules.md` | Arhitektura definisana |
| DB-CODEBOOK-01 | Definisati model šifarnika | Amina | Završeno | ✅ `Domain/Codebooks/CodebookValue.cs` | Entitet s lifecycle metodama |
| DB-CODEBOOK-02 | Dodati audit polja za šifarnike | Amina | Završeno | ✅ Polja u `CodebookValue.cs` + konfiguracija | DeactivatedAt/By, DeletedAt/By, UpdatedAt/By |
| BE-CODEBOOK-01 | CRUD — kreiranje vrijednosti | Hamza | ⏳ TODO | ❌ Nije implementirano | Nedostaje `POST /values` endpoint i request model |
| BE-CODEBOOK-02 | CRUD — uređivanje vrijednosti | Hamza | ⏳ TODO | ❌ Nije implementirano | Nedostaje `PUT /values/{id}` endpoint |
| BE-CODEBOOK-03 | CRUD — GET liste i detalji | Amina/Hamza | Završeno | ✅ `GET /values/active`, `GET /values`, `GET /values/{id}` | Implementirano |
| BE-CODEBOOK-04 | Deaktivacija i brisanje | Amina | Završeno | ✅ `CodebookValueService.cs` | Deactivate, Activate, SoftDelete s poslovnim pravilima |
| BE-CODEBOOK-05 | Provjera vrijednosti u upotrebi | Amina | Završeno | ✅ `CodebookUsageService.cs` + registry interfejs | Fail-safe, aggregator, checker registry |
| BE-CODEBOOK-06 | Permission pravila za endpointe | Amina | Završeno | ✅ `CodebookEndpoints.cs` + `AppPermissions.cs` + `RolePermissionMatrix.cs` | codebooks.view, codebooks.manage |
| BE-CODEBOOK-07 | Standardizovani error response | Amina | Završeno | ✅ `CodebookErrorCodes.cs` + `GlobalExceptionHandler` | 16 error codova, ProblemDetails format |
| DOC-CODEBOOK-01 | Dokumentacija | Amina | Završeno | ✅ `codebook-rules.md`, `codebook-work-log.md`, `codebook-acceptance-checklist.md`, `codebook-review-checklist.md` | Ovaj ciklus |
| FE-CODEBOOK-01 | Frontend ekran za šifarnike | Frontend tim | ⏳ TODO | ❌ Nije implementirano | Van Amininog scopea |
| FE-CODEBOOK-02 | Dropdown reflektovanje | Frontend tim | ⏳ TODO | ❌ Nije implementirano | Van Amininog scopea |
| FE-CODEBOOK-03 | Upozorenje za vrijednost u upotrebi | Frontend tim | ⏳ TODO | ❌ Nije implementirano | Van Amininog scopea |
| QA-CODEBOOK-01 | Test cases — business pravila | QA tim | ⏳ TODO | ❌ Nije implementirano | Van Amininog scopea |
| QA-CODEBOOK-02 | Edge case testiranje | QA tim | ⏳ TODO | ❌ Nije implementirano | Van Amininog scopea |

---

## 2. Mapa implementiranih fajlova

### Domain Layer

| Fajl | Status | Opis |
|---|---|---|
| `src/Domain/Codebooks/CodebookValue.cs` | ✅ Postoji | Entitet s `Create()`, `Deactivate()`, `Activate()`, `SoftDelete()`, `UpdateDetails()` metodama |
| `src/Domain/Common/BaseEntity.cs` | ✅ Postoji | `Id`, `CreatedAt`, `UpdatedAt`, `SetUpdatedAt()` |

### Application Layer

| Fajl | Status | Opis |
|---|---|---|
| `src/Application/Codebooks/Interfaces/ICodebookValueService.cs` | ✅ Postoji | Servisni interfejs — 7 metoda |
| `src/Application/Codebooks/Interfaces/ICodebookUsageService.cs` | ✅ Postoji | Agregator usage checkera |
| `src/Application/Codebooks/Interfaces/ICodebookUsageChecker.cs` | ✅ Postoji | Registry checker interfejs |
| `src/Application/Codebooks/Interfaces/ICodebookCacheInvalidator.cs` | ✅ Postoji | Cache invalidator interfejs |
| `src/Application/Codebooks/Models/CodebookValueDto.cs` | ✅ Postoji | Puni DTO za admin pregled |
| `src/Application/Codebooks/Models/CodebookOptionDto.cs` | ✅ Postoji | Lagani DTO za dropdown |
| `src/Application/Codebooks/Models/CodebookUsageResult.cs` | ✅ Postoji | Usage check rezultat s fail-safe logikom |
| `src/Application/Codebooks/Models/CodebookUsageLocation.cs` | ✅ Postoji | Jedna lokacija upotrebe |
| `src/Application/Codebooks/Requests/DeactivateCodebookValueRequest.cs` | ✅ Postoji | Request s opcijskim `Reason` poljem |
| `src/Application/Codebooks/CodebookErrorCodes.cs` | ✅ Postoji | 16 error code konstanti |
| `src/Application/Security/AppPermissions.cs` | ✅ Ažurirano | Dodato `CodebooksView`, `CodebooksManage` |
| `src/Application/Security/AppPolicies.cs` | ✅ Ažurirano | Policy konstante za šifarnike |
| `src/Application/Security/RolePermissionMatrix.cs` | ✅ Ažurirano | Administrator: oba; Unosnik/Verifikator: samo view |
| `src/Application/Audit/AuditActions.cs` | ✅ Ažurirano | 9 codebook audit akcija |

#### TODO za Application Layer (Hamza)

| Fajl | Status | Opis |
|---|---|---|
| `src/Application/Codebooks/Requests/CreateCodebookValueRequest.cs` | ❌ Nedostaje | Za BE-CODEBOOK-01 |
| `src/Application/Codebooks/Requests/UpdateCodebookValueRequest.cs` | ❌ Nedostaje | Za BE-CODEBOOK-02 |

### Infrastructure Layer

| Fajl | Status | Opis |
|---|---|---|
| `src/Infrastructure/Codebooks/CodebookValueService.cs` | ✅ Postoji | Kompletan servis s audit, fail-safe, business pravilima |
| `src/Infrastructure/Codebooks/CodebookUsageService.cs` | ✅ Postoji | Registry aggregator — DI injection svih ICodebookUsageChecker |
| `src/Infrastructure/Codebooks/NullCodebookCacheInvalidator.cs` | ✅ Postoji | No-op placeholder |
| `src/Infrastructure/Persistence/ApplicationDbContext.cs` | ✅ Ažurirano | `DbSet<CodebookValue>` registrovan |
| `src/Infrastructure/Persistence/Configurations/CodebookValueConfiguration.cs` | ✅ Postoji | EF konfiguracija, 3 indeksa, globalni query filter |
| `src/Infrastructure/Migrations/20260526090239_AddCodebookValues.cs` | ✅ Kreirano | Tabela `codebook_values` s audit stupcima |
| `src/Infrastructure/DependencyInjection.cs` | ✅ Ažurirano | Registrovani svi codebook servisi |

#### TODO za Infrastructure Layer (Hamza)

| Fajl | Status | Opis |
|---|---|---|
| `src/Infrastructure/Codebooks/LimitTypeUsageChecker.cs` (primjer) | ❌ Nedostaje | Tek kada se definira `LimitType` entitet |
| Ostali `ICodebookUsageChecker` per entitet | ❌ Nedostaje | Po jedan po šifarniku koji se koristi |

### API Layer

| Fajl | Status | Opis |
|---|---|---|
| `src/Api/Endpoints/CodebookEndpoints.cs` | ✅ Postoji | 7 endpointa s permission guardsima |

#### TODO za API Layer (Hamza)

| Endpoint | Status | Opis |
|---|---|---|
| `POST /api/codebooks/{codebookKey}/values` | ❌ Nedostaje | BE-CODEBOOK-01 |
| `PUT /api/codebooks/{codebookKey}/values/{id}` | ❌ Nedostaje | BE-CODEBOOK-02 |

### Dokumentacija

| Fajl | Status | Opis |
|---|---|---|
| `docs/backend/codebook-rules.md` | ✅ Postoji | Kompletna pravila, 30 BR, 40 EC, arhitektura |
| `docs/backend/codebook-work-log.md` | ✅ Ovaj fajl | Status taskova, mapa fajlova |
| `docs/backend/codebook-acceptance-checklist.md` | ✅ Kreiran | AC lista za QA i review |
| `docs/backend/codebook-review-checklist.md` | ✅ Kreiran | Review lista za Hamzinu implementaciju |

---

## 3. DB model — šta je u bazi

### Tabela: `codebook_values`

Kreirana migracijom: `src/Infrastructure/Migrations/20260526090239_AddCodebookValues.cs`

```sql
CREATE TABLE codebook_values (
    id                    SERIAL PRIMARY KEY,
    codebook_key          VARCHAR(100)  NOT NULL,
    code                  VARCHAR(100)  NOT NULL,
    label                 VARCHAR(300)  NOT NULL,
    description           VARCHAR(1000) NULL,
    sort_order            INT           NOT NULL,
    is_active             BOOL          NOT NULL,
    is_system             BOOL          NOT NULL,
    is_critical           BOOL          NOT NULL,
    created_at            TIMESTAMPTZ   NOT NULL,
    updated_at            TIMESTAMPTZ   NULL,
    created_by_user_id    VARCHAR(100)  NULL,
    updated_by_user_id    VARCHAR(100)  NULL,
    deactivated_at        TIMESTAMPTZ   NULL,
    deactivated_by_user_id VARCHAR(100) NULL,
    deleted_at            TIMESTAMPTZ   NULL,
    deleted_by_user_id    VARCHAR(100)  NULL
);

-- Indeksi
CREATE UNIQUE INDEX uix_codebook_values_key_code_active
    ON codebook_values (codebook_key, code) WHERE deleted_at IS NULL;

CREATE INDEX ix_codebook_values_key_active
    ON codebook_values (codebook_key, is_active);

CREATE INDEX ix_codebook_values_key
    ON codebook_values (codebook_key);
```

---

## 4. Šta je Amina definisala

| Stavka | Gdje |
|---|---|
| DB model šifarnika | `src/Domain/Codebooks/CodebookValue.cs` |
| Audit polja (`DeactivatedAt/By`, `DeletedAt/By`, `UpdatedAt/By`) | `CodebookValue.cs` + `CodebookValueConfiguration.cs` |
| Deaktivacija kao primarni mehanizam | `codebook-rules.md` sekcija 3 + `CodebookValueService.cs` |
| Brisanje s usage check-om | `CodebookValueService.DeleteAsync()` |
| Fail-safe usage check | `CodebookUsageService.cs` + `ICodebookUsageChecker` registry |
| Usage check result model | `CodebookUsageResult.cs` |
| Permission pravila | `AppPermissions.cs`, `AppPolicies.cs`, `RolePermissionMatrix.cs` |
| Error codovi | `CodebookErrorCodes.cs` |
| Audit akcije | `AuditActions.cs` sekcija šifarnici |
| EF konfiguracija i indeksi | `CodebookValueConfiguration.cs` |
| EF migracija | `20260526090239_AddCodebookValues.cs` |
| DI registracija | `Infrastructure/DependencyInjection.cs` |
| Endpointi za read/deactivate/activate/delete | `CodebookEndpoints.cs` |
| Dokumentacija pravila | `codebook-rules.md` |

---

## 5. Šta ostaje Hamzi

| Stavka | Task | Napomena |
|---|---|---|
| `POST /values` — kreiranje | BE-CODEBOOK-01 | Koristiti `CodebookValue.Create()` factory metodu |
| `PUT /values/{id}` — update | BE-CODEBOOK-02 | Koristiti `CodebookValue.UpdateDetails()` |
| `CreateCodebookValueRequest`, `UpdateCodebookValueRequest` | BE-CODEBOOK-01/02 | Validacija: obavezna polja, max dužine |
| `ICodebookUsageChecker` per entitet | BE-CODEBOOK-05 ext. | Po jedan checker kada se definiše svaki poslovni entitet |
| Registracija checkera u DI | BE-CODEBOOK-05 ext. | `services.AddScoped<ICodebookUsageChecker, XyzChecker>()` |
| Data seeding početnih vrijednosti | TBD | Dogovoriti s timom koje šifarnike seed-ovati |

---

## 6. Šta ostaje frontendu

| Stavka | Task |
|---|---|
| Ekran za pregled i upravljanje šifarnicima | FE-CODEBOOK-01 |
| Dropdown komponenta koja koristi `/values/active` | FE-CODEBOOK-02 |
| Modal za deaktivaciju/brisanje | FE-CODEBOOK-03 |
| Prikaz upozorenja "u upotrebi" (iz `usage.usageCount`) | FE-CODEBOOK-03 |
| Prikaz neaktivne vrijednosti na starim zapisima | FE-CODEBOOK |

---

## 7. Šta ostaje QA-u

| Stavka | Task |
|---|---|
| Test: brisanje vrijednosti u upotrebi → 409 | QA-CODEBOOK-01 |
| Test: brisanje nekorištene vrijednosti → 204 | QA-CODEBOOK-01 |
| Test: deaktivacija → dropdown ne prikazuje | QA-CODEBOOK-01 |
| Test: direktan API poziv bez permission → 403 | QA-CODEBOOK-01 |
| Sve EC-CODEBOOK-01 do EC-CODEBOOK-40 | QA-CODEBOOK-02 |

---

## 8. Log izmjena

| Datum | Izmjena | Ko |
|---|---|---|
| 2026-05-26 | Kreiran `CodebookValue` domain entitet, interfejsi, servisi, konfiguracija, endpointi, error codes, audit actions, permissions, DI | Amina |
| 2026-05-26 | Kreirana EF migracija `AddCodebookValues` | Amina |
| 2026-05-26 | Kreirana dokumentacija: `codebook-rules.md`, `codebook-work-log.md`, `codebook-acceptance-checklist.md`, `codebook-review-checklist.md` | Amina |
| TBD | `POST /values`, `PUT /values/{id}`, usage checkeri per entitet | Hamza |
| TBD | Frontend ekran i dropdown | Frontend tim |
| TBD | QA testovi | QA tim |
