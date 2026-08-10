# BE-CODEBOOK-04/05 — Deaktivacija, Brisanje i Provjera Upotrebe Šifarnika

**Verzija:** 1.1  
**Status:** Backend infrastruktura završena — čekaju se per-entitet usage checkeri i CRUD endpointi  
**Odgovornost:** Amina (arhitektura, backend pravila, migracija), Hamza (CRUD endpointi, usage checkeri)

---

## 1. User Story

Kao administrator, želim dodavati, uređivati i brisati vrijednosti u šifarnicima
(tipovi rola, osnov povezanosti, vrste limita) kako bi forma uvijek odražavala aktuelne opcije.

**Kriteriji prihvatanja:**
1. Izmjene šifarnika odmah se reflektuju u svim padajućim menijima.
2. Brisanje vrijednosti koja je u upotrebi prikazuje upozorenje.
3. Sve promjene bilježe korisnika i datum izmjene.

---

## 2. Scope

**BE-CODEBOOK-04:** Implementacija deaktivacije i brisanja vrijednosti šifarnika.  
**BE-CODEBOOK-05:** Implementacija provjere vrijednosti u upotrebi (usage check).

**Nije u scopu:** Frontend komponente, dropdown UI, modal prozori, vizuelna upozorenja,
frontend cache, QA automatizovani testovi.

---

## 3. Arhitekturna odluka: Deaktivacija kao primarni mehanizam

Šifarnici nisu običan CRUD. Vrijednosti šifarnika se koriste u poslovnim zapisima.
Ako se vrijednost fizički obriše dok je koriste postojeći zapisi, sistem gubi značenje
historijskih podataka — relacije mogu puknuti, a audit postaje nepouzdan.

**Pravila:**
- Vrijednost koja nije u upotrebi → može se soft-delete-ovati
- Vrijednost koja je u upotrebi → može se deaktivirati, ali NE smije se fizički obrisati
- Sistemska vrijednost (IsSystem=true) → ne smije se brisati standardnom admin akcijom
- Kritična sistemska vrijednost (IsCritical=true) → ne smije se ni deaktivirati

---

## 4. Dizajn odluka: Flat schema (bez parent Codebook entiteta)

**Odluka:** Koristi se samo tabela `codebook_values` s `CodebookKey` string kolonom.
Nema odvojene `codebooks` tabele s metapodacima o šifarniku.

| Razlog | Obrazloženje |
|---|---|
| Niži kompleksitet | Nema JOIN-a, nema FK između tabela |
| Šifarnici su poznati unaprijed | `role_types`, `limit_types`, `relation_basis` — lista nije potpuno dinamična |
| MVP scope | Parent entitet nije potreban za definisane kriterije prihvatanja |
| Proširivost | Može se dodati migracijom ako se pokaže potreba |

**DB Model tabele:** `codebook_values`

| Kolona | Tip | Opis |
|---|---|---|
| `id` | `int` (identity) | PK |
| `codebook_key` | `varchar(100)` NOT NULL | Ključ šifarnika (`"role_types"`, `"limit_types"`, `"relation_basis"`) |
| `code` | `varchar(100)` NOT NULL | Tehnički ID vrijednosti unutar šifarnika |
| `label` | `varchar(300)` NOT NULL | Naziv prikazan u dropdownu |
| `description` | `varchar(1000)` nullable | Opcijski opis za admin pregled |
| `sort_order` | `int` NOT NULL | Redoslijed prikaza |
| `is_active` | `bool` NOT NULL | Da li se nudi u dropdownima |
| `is_system` | `bool` NOT NULL | Zaštićena od brisanja |
| `is_critical` | `bool` NOT NULL | Zaštićena od deaktivacije i brisanja |
| `created_at` | `timestamptz` NOT NULL | Popunjava `BaseEntity` pri kreiranju |
| `updated_at` | `timestamptz` nullable | Popunjava `SetUpdatedAt()` pri svakoj mutaciji |
| `created_by_user_id` | `varchar(100)` nullable | Iz `ICurrentUserService.UserId` pri `Create()` |
| `updated_by_user_id` | `varchar(100)` nullable | Iz `ICurrentUserService.UserId` pri svakoj mutaciji |
| `deactivated_at` | `timestamptz` nullable | Popunjava `Deactivate()` |
| `deactivated_by_user_id` | `varchar(100)` nullable | Popunjava `Deactivate()` |
| `deleted_at` | `timestamptz` nullable | Popunjava `SoftDelete()` — EF filter isključuje ove zapise |
| `deleted_by_user_id` | `varchar(100)` nullable | Popunjava `SoftDelete()` |

**Napomena o `reason` pri deaktivaciji:** `DeactivateCodebookValueRequest.Reason` se ne čuva u entitetu.
Bilježi se isključivo u audit logu (`newValues: { Reason: "..." }`).

---

## 5. Tri stanja vrijednosti

### Active (IsActive=true, DeletedAt=null)
- Prikazuje se u dropdownima.
- Može se koristiti za nove unose.
- Može se uređivati (Label, Description, SortOrder).
- Može se deaktivirati (osim kritičnih).
- Može se obrisati (soft delete) samo ako nije u upotrebi i nije sistemska.

### Inactive (IsActive=false, DeletedAt=null)
- **Ne prikazuje se u dropdownima za nove unose.**
- **Ne može se koristiti za nove zapise** — backend odbija takav unos (409).
- **Ostaje dostupna za prikaz postojećih zapisa** gdje je ranije korištena.
- Može se reaktivirati.
- Može se soft-delete-ovati ako nije u upotrebi i nije sistemska.

### Deleted (DeletedAt != null)
- Globalni EF Core query filter je automatski isključuje iz svih standardnih upita.
- Ne prikazuje se u dropdownima.
- Ne može se koristiti za nove unose.
- Ne može se reaktivirati bez posebnog restore procesa.

---

## 6. Dropdown pravila

```
GET /api/codebooks/{codebookKey}/values/active
→ WHERE is_active = true AND deleted_at IS NULL
→ ORDER BY sort_order ASC, label ASC
→ Vraća: CodebookOptionDto[] (id, code, label, sortOrder)
```

**Novo vs. Postojeće:**
- Novi unos → samo aktivne vrijednosti
- Prikaz postojećeg zapisa → prikazati vrijednost čak i ako je sada neaktivna
- Edit postojećeg zapisa → ako korisnik ne mijenja polje, neaktivna vrijednost može ostati;
  ako mijenja polje, mora izabrati aktivnu vrijednost

---

## 7. Validacija neaktivne vrijednosti pri novom unosu

Ako API prima `codebookValueId` za novi zapis, servis mora provjeriti:
```
Vrijednost postoji I IsActive=true → OK
Vrijednost ne postoji → 404 Not Found
Vrijednost postoji ali IsActive=false → 409 CODEBOOK_VALUE_INACTIVE_FOR_NEW_RECORD
```

---

## 8. Deactivation flow (Decision Tree)

```
1. Korisnik ima codebooks.manage?
   └─ Ne → 403 Forbidden

2. Vrijednost postoji i pripada codebookKey-u?
   └─ Ne → 404 Not Found

3. Vrijednost je soft-deleted?
   └─ Da → 404 Not Found (globalni query filter)

4. Vrijednost je već neaktivna?
   └─ Da → 409 CODEBOOK_VALUE_ALREADY_INACTIVE

5. Vrijednost je kritična sistemska?
   └─ Da → 409 CODEBOOK_VALUE_CRITICAL_LOCKED + audit

6. Postavi IsActive=false, DeactivatedAt=now, DeactivatedByUserId, UpdatedAt, UpdatedByUserId

7. Audit: CODEBOOK_ENTRY_DEACTIVATED

8. Cache invalidacija

9. Vrati 200 + CodebookValueDto
```

---

## 9. Activation flow

```
1. codebooks.manage permission? → 403 ako ne
2. Vrijednost postoji? → 404 ako ne
3. Već aktivna? → 409 CODEBOOK_VALUE_ALREADY_ACTIVE
4. Postavi IsActive=true, UpdatedAt, UpdatedByUserId
   (DeactivatedAt/DeactivatedByUserId ostaju kao historijski trag)
5. Audit: CODEBOOK_VALUE_ACTIVATED
6. Cache invalidacija
7. Vrati 200 + CodebookValueDto
```

---

## 10. Delete flow (Decision Tree)

```
1. Korisnik ima codebooks.manage?
   └─ Ne → 403

2. Vrijednost postoji i pripada codebookKey-u?
   └─ Ne → 404

3. Vrijednost je soft-deleted?
   └─ Da → 404 (globalni query filter)

4. IsSystem=true?
   └─ Da → 409 CODEBOOK_VALUE_SYSTEM_LOCKED + audit

5. Pokrenuti usage check (UVIJEK, bez obzira na prethodni /usage poziv)
   └─ Checker pao / Exception → 409 CODEBOOK_USAGE_CHECK_FAILED + audit (fail-safe)
   └─ IsReliable=false → 409 CODEBOOK_USAGE_CHECK_FAILED + audit (fail-safe)

6. IsInUse=true?
   └─ Da → 409 CODEBOOK_VALUE_IN_USE + usageCount + recommendedAction=Deactivate + audit

7. Soft delete (DeletedAt=now, DeletedByUserId, UpdatedAt, UpdatedByUserId)

8. Audit: CODEBOOK_VALUE_DELETED

9. Cache invalidacija

10. Vrati 204 No Content
```

**Najvažnije pravilo:** DELETE endpoint uvijek sam ponavlja usage check.
GET /usage je informativan. DELETE je autoritativan.

---

## 11. Usage check flow

```
GET /api/codebooks/{codebookKey}/values/{id}/usage

1. Validirati da vrijednost postoji → 404 ako ne
2. Pozvati ICodebookUsageService.CheckUsageAsync(codebookKey, valueId)
3. Agregirati rezultate od svih ICodebookUsageChecker za taj codebookKey
4. Ako checker baci grešku → IsReliable=false
5. Vrati CodebookUsageResult

Response primjer:
{
  "isInUse": true,
  "usageCount": 12,
  "isReliable": true,
  "locations": [
    { "module": "Limits", "entityName": "LimitRequest", "count": 12 }
  ],
  "canDelete": false,
  "canDeactivate": true,
  "recommendedAction": "Deactivate"
}
```

---

## 12. Usage Checker Registry Pattern

```
ICodebookUsageService (agregator)
    ↓ pronalazi sve ICodebookUsageChecker gdje CodebookKey == traženi key
    ↓ poziva svaki checker
    ↓ sabira lokacije
    ↓ ako checker padne → IsReliable=false (fail-safe)
    ↓ vraća CodebookUsageResult
```

Za svaki šifarnik koji se koristi u poslovnim entitetima registruje se poseban checker:
```csharp
public sealed class LimitTypeUsageChecker : ICodebookUsageChecker
{
    public string CodebookKey => "limit_types";

    public async Task<CodebookUsageLocation?> CheckAsync(int valueId, CancellationToken ct)
    {
        var count = await _db.LimitRequests
            .CountAsync(x => x.LimitTypeValueId == valueId, ct);

        return count > 0
            ? new CodebookUsageLocation { Module = "Limits", EntityName = "LimitRequest", Count = count }
            : null;
    }
}
```

Registracija (DI, bez promjene CodebookUsageService — Open/Closed Principle):
```csharp
services.AddScoped<ICodebookUsageChecker, LimitTypeUsageChecker>();
```

---

## 13. Fail-safe pravilo za usage check

Ako usage check nije pouzdan (checker pao, IsReliable=false):
- Delete se blokira.
- Vraća se 409 CODEBOOK_USAGE_CHECK_FAILED.
- Akcija se auditira.
- **Princip**: bolje je blokirati brisanje nego obrisati vrijednost koja je možda u upotrebi.

---

## 14. Permission pravila

| Endpoint | Permission |
|---|---|
| GET /values/active | `codebooks.view` |
| GET /values | `codebooks.manage` |
| GET /values/{id} | `codebooks.manage` |
| GET /values/{id}/usage | `codebooks.manage` |
| POST /values/{id}/deactivate | `codebooks.manage` |
| POST /values/{id}/activate | `codebooks.manage` |
| DELETE /values/{id} | `codebooks.manage` |

**RolePermissionMatrix:**
- Administrator: `codebooks.view` + `codebooks.manage`
- Unosnik: `codebooks.view` (čita dropdown, ne upravlja)
- Verifikator: `codebooks.view` (čita dropdown, ne upravlja)

---

## 15. Audit pravila

Svaka mutacija generiše audit event sa:
- `Action` = odgovarajuća `AuditActions.*` konstanta
- `Module` = "Codebooks"
- `EntityType` = "CodebookValue"
- `EntityKey` = ID vrijednosti
- `EntityDisplayName` = "key / code — label"
- `OldValues` / `NewValues` = promjena stanja
- `Status` = Success / Conflict / Failed
- `ActorUserId` = trenutni korisnik (iz ICurrentUserService)

**Audit akcije:**

| Akcija | Konstantas |
|---|---|
| Kreiranje | `CODEBOOK_ENTRY_CREATED` |
| Uređivanje | `CODEBOOK_ENTRY_UPDATED` |
| Deaktivacija (uspješna) | `CODEBOOK_ENTRY_DEACTIVATED` |
| Reaktivacija | `CODEBOOK_VALUE_ACTIVATED` |
| Brisanje (uspješno) | `CODEBOOK_VALUE_DELETED` |
| Brisanje blokirano — u upotrebi | `CODEBOOK_VALUE_DELETE_BLOCKED_IN_USE` |
| Brisanje blokirano — usage check pao | `CODEBOOK_VALUE_DELETE_BLOCKED_USAGE_CHECK_FAILED` |
| Brisanje blokirano — sistemska vrijed. | `CODEBOOK_VALUE_SYSTEM_DELETE_BLOCKED` |
| Deaktivacija blokirana — kritična vrijed. | `CODEBOOK_VALUE_CRITICAL_DEACTIVATION_BLOCKED` |

---

## 16. Cache invalidacija

Nakon svake mutacije (deactivate/activate/delete) poziva se:
```csharp
await _cache.InvalidateAsync(codebookKey, ct);
```

**Trenutno:** `NullCodebookCacheInvalidator` — ne radi ništa (cache nije implementiran).
**Dropdown endpoint** uvijek čita direktno iz baze → kriterij "odmah se reflektuje" je ispunjen.

**Buduće:** zamijeniti `NullCodebookCacheInvalidator` sa pravom implementacijom.
Ako invalidacija ne uspije → greška se loguje, **ne ignoruje se tiho**.

---

## 17. Konkurentnost

| Scenario | Ponašanje |
|---|---|
| Frontend pozove /usage → canDelete=true, drugi korisnik iskoristi vrijednost → DELETE | DELETE ponavlja usage check → 409 IN_USE |
| Dva admina istovremeno deaktiviraju istu vrijednost | Prvi uspije, drugi → 409 ALREADY_INACTIVE |
| Dva admina istovremeno brišu istu vrijednost | Prvi uspije, drugi → 404 (soft-deleted) |
| Vrijednost deaktivirana dok korisnik ima otvorenu formu | Backend odbija submit → 409 INACTIVE_FOR_NEW_RECORD |

---

## 18. Standardizovane greške

| HTTP | ErrorCode | Situacija |
|---|---|---|
| 401 | — | Korisnik nije prijavljen |
| 403 | — | Nema codebooks.manage permission |
| 404 | CODEBOOK_VALUE_NOT_FOUND | Vrijednost ne postoji ili ne pripada codebookKey-u |
| 409 | CODEBOOK_VALUE_ALREADY_INACTIVE | Pokušaj deaktivacije već neaktivne vrijednosti |
| 409 | CODEBOOK_VALUE_ALREADY_ACTIVE | Pokušaj aktivacije već aktivne vrijednosti |
| 409 | CODEBOOK_VALUE_SYSTEM_LOCKED | Pokušaj brisanja sistemske vrijednosti |
| 409 | CODEBOOK_VALUE_CRITICAL_LOCKED | Pokušaj deaktivacije kritične sistemske vrijednosti |
| 409 | CODEBOOK_VALUE_IN_USE | Pokušaj brisanja vrijednosti koja je u upotrebi |
| 409 | CODEBOOK_USAGE_CHECK_FAILED | Usage check nije bio pouzdan — brisanje blokirano |
| 409 | CODEBOOK_VALUE_INACTIVE_FOR_NEW_RECORD | Novi unos koristi neaktivnu vrijednost |
| 409 | CODEBOOK_VALUE_CODE_IN_USE_CANNOT_CHANGE | Pokušaj promjene Code-a koji je u upotrebi |

Sve greške se vraćaju kao `application/problem+json` (ProblemDetails standard).

---

## 19. Sistemske i kritične vrijednosti

| Polje | Značenje | Brisanje | Deaktivacija |
|---|---|---|---|
| IsSystem=false, IsCritical=false | Obična vrijednost | Ako nije u upotrebi | Da |
| IsSystem=true, IsCritical=false | Sistemska | BLOKIRANO | Da |
| IsSystem=true, IsCritical=true | Kritična sistemska | BLOKIRANO | BLOKIRANO |

---

## 20. Pravila za uređivanje vrijednosti

| Polje | Nije u upotrebi | U upotrebi |
|---|---|---|
| Code | Dozvoljeno | BLOKIRANO (može narušiti historiju) |
| Label | Dozvoljeno | Dozvoljeno (ako ne mijenja poslovno značenje) |
| Description | Dozvoljeno | Dozvoljeno |
| SortOrder | Dozvoljeno | Dozvoljeno |

---

## 21. Pravila za duplikate i reaktivaciju

- Dvije aktivne vrijednosti ne mogu imati isti Code u istom codebookKey-u (DB unique constraint: parcijalni indeks).
- Ako postoji neaktivna vrijednost sa istim Code-om, preporučiti reaktivaciju umjesto kreiranja duplikata.
- Ako postoji soft-deleted vrijednost sa istim Code-om — parcijalni DB unique indeks to dozvoljava.

---

## 22. Hijerarhijski šifarnici

Trenutni sistem ne podržava parent-child odnose u šifarnicima.

**Buduće proširenje:** Ako se doda hijerarhija:
- Vrijednost s aktivnim child vrijednostima ne smije se obrisati.
- Deaktivacija parenta mora blokirati ili kaskadirati (prema poslovnom pravilu).
- Ne uvoditi kaskadnu deaktivaciju bez eksplicitnog poslovnog zahtjeva.

---

## 23. Business Rules (BR-CODEBOOK-01 do BR-CODEBOOK-30)

| # | Pravilo |
|---|---|
| BR-01 | Samo codebooks.manage može mijenjati vrijednosti šifarnika. |
| BR-02 | codebooks.view može čitati aktivne vrijednosti za dropdown. |
| BR-03 | Dropdown endpoint vraća samo aktivne i neobrisane vrijednosti. |
| BR-04 | Neaktivne vrijednosti se ne nude za nove unose. |
| BR-05 | Neaktivne vrijednosti ostaju dostupne za prikaz postojećih zapisa. |
| BR-06 | Vrijednost koja je u upotrebi ne smije se fizički obrisati. |
| BR-07 | Vrijednost koja je u upotrebi može se deaktivirati (osim kritičnih). |
| BR-08 | Fizičko brisanje dozvoljeno samo ako vrijednost nije u upotrebi. |
| BR-09 | Prije svakog brisanja mora se izvršiti usage check. |
| BR-10 | DELETE endpoint mora sam ponoviti usage check neposredno prije brisanja. |
| BR-11 | Ako usage check nije pouzdan, brisanje se ne smije dozvoliti. |
| BR-12 | Sistemske vrijednosti se ne smiju brisati. |
| BR-13 | Kritične sistemske vrijednosti se ne smiju deaktivirati. |
| BR-14 | Vrijednost mora pripadati codebookKey-u iz rute. |
| BR-15 | Sve promjene moraju bilježiti korisnika i datum izmjene. |
| BR-16 | Sve promjene moraju biti auditirane. |
| BR-17 | Brisanje blokirano zbog upotrebe vraća 409 sa jasnim upozorenjem. |
| BR-18 | Usage check vraća IsInUse, UsageCount i Locations. |
| BR-19 | Cache mora se invalidirati nakon svake promjene. |
| BR-20 | Cache invalidacija ne smije se tiho ignorisati. |
| BR-21 | Code/Value koji je u upotrebi ne smije se mijenjati bez posebnog procesa. |
| BR-22 | Label i Description se mogu mijenjati ako ne narušavaju historijsko značenje. |
| BR-23 | Novi unos ne smije koristiti neaktivnu vrijednost. |
| BR-24 | Postojeći zapis može zadržati neaktivnu vrijednost ako je već koristio. |
| BR-25 | Kreiranje duplikata aktivne vrijednosti mora biti spriječeno. |
| BR-26 | Reaktivacija neaktivne vrijednosti je bolja od kreiranja duplikata. |
| BR-27 | Usage check treba biti proširiv bez switch-a u controlleru. |
| BR-28 | Poslovna pravila moraju biti u servisu, ne u controlleru. |
| BR-29 | Mutacije šifarnika trebaju biti transakcijski sigurne. |
| BR-30 | Obrisana vrijednost ne smije se aktivirati bez restore procesa. |

---

## 24. Edge Cases (EC-CODEBOOK-01 do EC-CODEBOOK-40)

| # | Situacija | Ponašanje |
|---|---|---|
| EC-01 | Brisanje vrijednosti u upotrebi | 409 IN_USE + usageCount + recommendedAction=Deactivate |
| EC-02 | Brisanje vrijednosti koja nije u upotrebi | Soft delete dozvoljeno |
| EC-03 | Deaktivacija vrijednosti u upotrebi | Deaktivacija dozvoljena |
| EC-04 | Deaktivacija vrijednosti koja nije u upotrebi | Deaktivacija dozvoljena |
| EC-05 | Deaktivacija već neaktivne vrijednosti | 409 ALREADY_INACTIVE |
| EC-06 | Aktivacija već aktivne vrijednosti | 409 ALREADY_ACTIVE |
| EC-07 | Bez codebooks.manage → deaktivacija | 403 Forbidden |
| EC-08 | Bez codebooks.manage → brisanje | 403 Forbidden |
| EC-09 | Vrijednost ne postoji | 404 Not Found |
| EC-10 | Vrijednost postoji ali ne pripada codebookKey-u | 404 (security) |
| EC-11 | Brisanje sistemske vrijednosti | 409 SYSTEM_LOCKED |
| EC-12 | Deaktivacija kritične sistemske vrijednosti | 409 CRITICAL_LOCKED |
| EC-13 | Deaktivacija sistemske (ali ne kritične) | Dozvoljena |
| EC-14 | /usage=canDelete=true, drugi korisnik iskoristi, DELETE | DELETE ponavlja check → 409 |
| EC-15 | Dva admina deaktiviraju istu vrijednost | Prvi uspije, drugi → 409 |
| EC-16 | Dva admina brišu istu vrijednost | Prvi uspije, drugi → 404 |
| EC-17 | Dropdown pokazuje vrijednost nakon deaktivacije (cache) | Neprihvatljivo; cache mora biti invalidiran |
| EC-18 | Postojeći zapis koristi neaktivnu vrijednost | Zapis je i dalje prikazuje |
| EC-19 | Novi API unos šalje neaktivnu vrijednost | Backend odbija → 409 INACTIVE_FOR_NEW_RECORD |
| EC-20 | Edit zapisa s neaktivnom vrijed. (polje se ne mijenja) | Može ostati |
| EC-21 | Promjena Label za vrijednost u upotrebi | Dozvoljena |
| EC-22 | Promjena Code za vrijednost u upotrebi | Blokirano |
| EC-23 | Promjena SortOrder | Dozvoljena (dropdown redoslijed se odmah mijenja) |
| EC-24 | Brisanje već soft-deleted vrijednosti | 404 (globalni query filter) |
| EC-25 | Deaktivacija soft-deleted vrijednosti | 404 |
| EC-26 | Usage check — jedan modul ima grešku | IsReliable=false → delete blokiran (fail-safe) |
| EC-27 | Vrijednost samo u audit historiji | Preporuka soft delete |
| EC-28 | Vrijednost u integraciji s vanjskim sistemom | Tretirati kao in-use ili system-locked |
| EC-29 | Nepoznati codebookKey | 404 (prazna lista za dropdown) |
| EC-30 | Deaktivacija uspije, audit ne uspije | Audit greška se loguje, operacija ne pada |
| EC-31 | Deaktivacija uspije, cache invalidacija ne uspije | Greška se loguje (ne ignoruje se) |
| EC-32 | Vrijednost ima prevode/lokalizacije | Deaktivacija obuhvata glavnu vrijednost |
| EC-33 | Duplikat Label s drugom aktivnom vrijed. | Validirati ako je to poslovno pravilo |
| EC-34 | Kreiranje s istim Code-om kao neaktivna vrijed. | Preporuka reaktivirati |
| EC-35 | Kreiranje s istim Code-om kao soft-deleted | Parcijalni DB indeks dozvoljava |
| EC-36 | Vrijednost je parent u hijerarhijskom šif. | Blokirati dok ima child vrijednosti (buduće) |
| EC-37 | Aktivne child vrijednosti | Blokirati deaktivaciju parenta (buduće) |
| EC-38 | SortOrder konflikt | Dozvoliti isti SortOrder; sekundarno sortiranje po Label |
| EC-39 | Granularni permission po codebookKey | Generalni codebooks.manage dovoljan (MVP) |
| EC-40 | Vrijednost deaktivirana dok korisnik ima otvorenu formu | Backend odbija submit |

---

## 25. Šta nije implementirano u ovom tasku

- Frontend UI (dropdown, modal, upozorenja)
- QA automatizovani testovi
- Per-entitet ICodebookUsageChecker implementacije (čekaju definiciju poslovnih entiteta)
- Pravi cache (NullCodebookCacheInvalidator je placeholder)
- Kreiranje i uređivanje vrijednosti šifarnika (BE-CODEBOOK-01/02/03)

---

## 26. Buduća proširenja

- [ ] Pravi cache (IMemoryCache ili Redis) za GetActiveAsync
- [ ] Per-entitet usage checkeri (Hamza, pri definiciji entiteta)
- [x] EF migracija (`20260526090239_AddCodebookValues.cs`) — ✅ kreirana 2026-05-26
- [ ] Hijerarhijski šifarnici (parent-child)
- [ ] Number/Date range validacija
- [ ] Granularni permission po codebookKey
- [ ] Restore endpoint za soft-deleted vrijednosti
- [ ] Bulk deaktivacija

---

## 27. Raspodjela odgovornosti

| Odgovornost | Ko |
|---|---|
| Arhitektura, CodebookValue entitet, servis, usage checker infrastruktura | Amina ✅ |
| AppPermissions.CodebooksManage, RolePermissionMatrix, AuditActions | Amina ✅ |
| GlobalExceptionHandler, ProblemDetails standard | Amina ✅ |
| EF konfiguracija (CodebookValueConfiguration) | Amina ✅ |
| EF migracija (`20260526090239_AddCodebookValues.cs`) | Amina ✅ |
| Per-entitet ICodebookUsageChecker implementacije | Hamza (uz definiciju entiteta) |
| Frontend dropdown komponente, modal, upozorenja | Frontend tim |
| QA testovi (unit, integracija, e2e) | QA team |
| Cache implementacija (Redis/IMemoryCache) | DevOps/Hamza |
