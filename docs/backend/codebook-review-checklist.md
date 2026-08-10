# Šifarnici — Review Checklist

Ova lista se koristi pri code reviewu Hamzine implementacije (BE-CODEBOOK-01/02 i usage checkeri)
i pri finalnom reviewu frontend i QA implementacija.
Tech lead / Amina prolazi kroz ovu listu.

---

## 1. Opšti pregled koda

- [ ] Kod se kompajlira bez grešaka (`dotnet build` → 0 errors, 0 warnings)
- [ ] Nema hardkodovanih stringova — error codes koriste `CodebookErrorCodes.*` konstante
- [ ] Nema hardkodovanih poruka — poruke su konzistentne s `codebook-rules.md`
- [ ] Novi fajlovi su u ispravnom layeru (Domain/Application/Infrastructure/Api)
- [ ] Imenovanje je konzistentno s projektnim stilom

---

## 2. Kreiranje vrijednosti (BE-CODEBOOK-01) — review za Hamzu

- [ ] `POST /api/codebooks/{codebookKey}/values` endpoint postoji
- [ ] Endpoint zahtijeva `codebooks.manage` permission
- [ ] `CreateCodebookValueRequest` postoji u `Application/Codebooks/Requests/`
- [ ] Request validira obavezna polja (`Code`, `Label`)
- [ ] Koristiti `CodebookValue.Create()` factory metodu (ne direktan `new CodebookValue()`)
- [ ] `CreatedByUserId` uzet iz `ICurrentUserService.UserId`
- [ ] `IsActive = true` na kreiranoj vrijednosti
- [ ] Duplikat `Code` u istom `codebookKey` → DB constraint greška se hvata i vraća čitljiva greška
- [ ] Audit event `CODEBOOK_ENTRY_CREATED` bilježi se
- [ ] Cache invalidacija poziva se
- [ ] Vraća 201 Created + `CodebookValueDto`

---

## 3. Uređivanje vrijednosti (BE-CODEBOOK-02) — review za Hamzu

- [ ] `PUT /api/codebooks/{codebookKey}/values/{id}` endpoint postoji
- [ ] Endpoint zahtijeva `codebooks.manage` permission
- [ ] `UpdateCodebookValueRequest` postoji
- [ ] Koristiti `CodebookValue.UpdateDetails()` metodu
- [ ] `UpdatedByUserId` uzet iz `ICurrentUserService.UserId`
- [ ] Promjena `Code` za vrijednost u upotrebi → 409 `CODEBOOK_VALUE_CODE_IN_USE_CANNOT_CHANGE`
- [ ] `Label`, `Description`, `SortOrder` se mogu promijeniti bez usage checka
- [ ] Audit event `CODEBOOK_ENTRY_UPDATED` bilježi se s `oldValues` i `newValues`
- [ ] Vraća 200 + `CodebookValueDto`

---

## 4. Usage Checkers (per entitet) — review za Hamzu

- [ ] Klasa implementira `ICodebookUsageChecker` interfejs
- [ ] `CodebookKey` property vraća ispravnu vrijednost (npr. `"limit_types"`)
- [ ] `CheckAsync` vraća `CodebookUsageLocation` s tačnim `Module`, `EntityName`, `Count`
- [ ] `CheckAsync` vraća `null` ako nema upotrebe (ne baca grešku)
- [ ] Koristi `AsNoTracking()` za performance
- [ ] Checker je registrovan u DI: `services.AddScoped<ICodebookUsageChecker, XyzUsageChecker>()`
- [ ] Svaki poslovni entitet koji koristi šifarnik ima odgovarajući checker
- [ ] Nema promjena u `CodebookUsageService` — Open/Closed Principle

---

## 5. Deaktivacija — provjera ispravne implementacije

- [ ] `ConflictException` se baca s ispravnim `errorCode` iz `CodebookErrorCodes`
- [ ] `entity.Deactivate(now, userId, reason)` se poziva (ne ručno postavljanje polja)
- [ ] `DeactivatedAt`, `DeactivatedByUserId` se popunjavaju
- [ ] `UpdatedAt`, `UpdatedByUserId` se popunjavaju
- [ ] Kritična sistemska vrijednost je zaštićena
- [ ] Audit se bilježi sa `oldValues={IsActive:true}`, `newValues={IsActive:false}`
- [ ] Cache invalidacija se poziva

---

## 6. Brisanje — provjera fail-safe logike

- [ ] Sistemska vrijednost je zaštićena (`IsSystem` provjera)
- [ ] Usage check se PONAVLJA unutar DELETE operacije (ne oslanja se na prethodni GET /usage)
- [ ] Try/catch oko usage check poziva → 409 ako checker baci grešku
- [ ] `IsReliable=false` → 409 blokira brisanje
- [ ] `IsInUse=true` → 409 s `usageCount` u poruci
- [ ] Soft delete: `entity.SoftDelete(now, userId)` se poziva
- [ ] Audit se bilježi za svaki ishod (blokiran ili uspješan)
- [ ] Cache invalidacija se poziva

---

## 7. Permission i autorizacija

- [ ] Svi endpointi koji mijenjaju šifarnike imaju `.RequireAuthorization(AppPolicies.CodebooksManage)`
- [ ] Dropdown endpoint ima `.RequireAuthorization(AppPolicies.CodebooksView)`
- [ ] Nema endpointa koji zaobilazi permission sistem
- [ ] Testirati: Unosnik dobija 403 na manage endpointima

---

## 8. Error handling i response format

- [ ] Svi 409 odgovori koriste `ConflictException` s `errorCode`
- [ ] Svi 404 odgovori koriste `NotFoundException` s `errorCode`
- [ ] `GlobalExceptionHandler` mapira izuzetke na ProblemDetails format
- [ ] `correlationId` prisutan u svakom error odgovoru
- [ ] Content-Type je `application/problem+json`
- [ ] Frontend može koristiti `errorCode` za prikazivanje odgovarajuće poruke

---

## 9. Audit

- [ ] Svaka mutacija generiše `AuditLog` zapis
- [ ] Greška u audit logu ne ruši poslovnu operaciju (try/catch + log)
- [ ] `Module = AuditModules.Codebooks` (konstantan string)
- [ ] `EntityType = nameof(CodebookValue)`
- [ ] `ActorUserId` odgovara korisniku iz tokena

---

## 10. Arhitektura i clean code

- [ ] Poslovna pravila su u `CodebookValueService`, ne u endpointu
- [ ] `CodebookEndpoints` je samo routing sloj — delegira na servis
- [ ] `CodebookValue` entitet sadrži domain logiku (metode), ne servis direktno setuje polja
- [ ] Nema cirkularnih zavisnosti između layerova
- [ ] Infrastructure servis ne referencira API projekte
- [ ] Application layer ne referencira Infrastructure

---

## 11. Frontend review (FE tim)

- [ ] Dropdown poziva `GET /values/active` (ne dohvaća sve vrijednosti)
- [ ] Dropdown prikazuje `label`, šalje `id` pri submitovanju
- [ ] Deaktivirana vrijednost se ne pojavljuje u novim dropdownima odmah
- [ ] Stari zapis prikazuje neaktivnu vrijednost ako je bila odabrana
- [ ] Upozorenje se prikazuje korisniku kada `usage.isInUse = true` pri brisanju
- [ ] Frontend šalje `codebooks.manage` akcije samo za Administratora
- [ ] Modal za potvrdu brisanja prikazuje `usage.usageCount` i `usage.locations`

---

## 12. Red flagovi — automatski reject pri reviewu

| Problem | Zašto odbiti |
|---|---|
| Hardkodovani error code string (npr. `"CODEBOOK_VALUE_IN_USE"`) | Mora koristiti `CodebookErrorCodes.ValueInUse` |
| `delete entity;` fizičko brisanje iz baze | Mora biti soft delete |
| DELETE ne ponavlja usage check | Fail-safe princip — GET /usage je informativan |
| Poslovna pravila u endpointu (controlleru) | Moraju biti u `CodebookValueService` |
| Direktno postavljanje `entity.IsActive = false` izvana | Mora koristiti `entity.Deactivate(now, userId)` |
| `IsReliable=false` a brisanje se dozvoljava | Kršenje fail-safe principa |
| Nedostaje audit za blokiranu operaciju | Sve blokirane operacije moraju biti auditirane |
| `try/catch` koji guta grešku tiho | Audit greška loguje se, ali ne ignoruje se |
| Registracija checkera bez `ICodebookUsageChecker` interfejsa | Checker mora biti registrovan kao `ICodebookUsageChecker` |
| Softdelete vrijednosti koja je u upotrebi | Fizičko brisanje dozvoljeno samo ako `canDelete=true` |
