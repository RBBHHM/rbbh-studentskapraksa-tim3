# ADR-025: Dvostepena validacija — FluentValidation + static SSOT

**Status:** Accepted  
**Kategorija:** E — Servisna arhitektura  
**Owner:** Arhitekta  
**Datum donošenja:** Oktobar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako se uvede zasebni validation microservice ili ako FluentValidation uvede breaking changes  
**Zahvaćeni moduli:** Application (validatori, OrderRequestValidator), Api (ValidationBehavior)  
**User Stories:** US-1 (validacija narudžbe), US-3 (validacija šifarnika), sve — svaka write operacija prolazi kroz validaciju

---

## Kontekst

Validacijska pravila za narudžbu su kompleksna: FL vs PL logika (JMBG vs matični broj), validacija para (grad, poslovnica), email format, telefonski broj, ime klijenta s podrškom za bosanska slova. Ova pravila se pojavljuju na više mjesta (API ulaz, Blazor UI, seeder) i moraju biti konzistentna.

Bez jednog mjesta gdje su validacijska pravila definirana, divergencija između slojeva je neizbježna.

---

## Decision Drivers

- **Single Source of Truth** — validacijska pravila definirana na jednom mjestu; svi konzumenti koriste iste klase
- **Automatski HTTP 422** — MediatR ValidationBehavior automatski baca `ValidationException` s `FieldErrors` prije nego što handler bude pozvan
- **Testabilnost** — validatori mogu biti unit testirani neovisno o HTTP sloju
- **Machine-readable greške** — frontend mora moći programski identificirati koji polj ima grešku

---

## Odluka

**Dvostepena arhitektura validacije**:

### Stepen 1 — FluentValidation (per-command/query validators)

Svaki Command koji zahtijeva validaciju ima odgovarajući `IValidator<TCommand>`:
- `CreateOrderCommandValidator` — validira sve polje narudžbe
- `ManualSelectAppraiserCommandValidator` — validira odabir vještaka
- itd.

`ValidationBehavior<TRequest, TResponse>` u MediatR pipeline-u automatski poziva sve registrirane validatore:
```csharp
// Paralelna validacija svih validatora za dati request tip:
var validationResults = await Task.WhenAll(validators.Select(v => v.ValidateAsync(request, ct)));
if (validationResults.Any(r => !r.IsValid))
    throw new ValidationException(FieldErrors);
```

### Stepen 2 — Statička klasa `OrderRequestValidator` (SSOT)

Kompleksna validacijska pravila (JMBG algoritam, email regex, bosanska slova regex, telefon format) su izdvojena u statičku klasu `OrderRequestValidator` s javnim metodama:

```csharp
public static class OrderRequestValidator
{
    public static bool IsValidJmbg(string? jmbg) { ... }
    public static bool IsValidEmail(string? email) { ... }
    public static bool IsValidPhone(string? phone) { ... }
    // ...
}
```

Ove metode pozivaju se iz FluentValidation validatora, Blazor UI form validatora i iz testera. **Jedna implementacija, višestruki konzumenti**.

### Machine-readable greške

`ValidationFieldError(Field, Code, Message)` record gdje `Code` dolazi iz `ValidationErrorCodes` konstanti (upper-snake-case, npr. `JMBG_INVALID_CHECKSUM`). Komentar u klasi: *"Nikad mijenjati Code vrijednosti — to je breaking change za frontend."*

---

## Alternativna rješenja

| Opcija | SSOT | Automatski HTTP 422 | Testabilnost | Zašto nije izabrana |
|--------|------|--------------------|-----------|--------------------|
| **FluentValidation + static SSOT** ✓ | ✓ | ✓ (ValidationBehavior) | Visoka | — |
| DataAnnotations | Parcijalno | Parcijalno | Srednja | DataAnnotations ne mogu izraziti kontekstualne validacije (JMBG format ovisi o ClientType); loša podrška za complex cross-field validacije |
| Inline validacija u servisu | ✗ | ✗ (ručno mapiranje) | Niska | Validacijska logika raspršena po servisima; duplicira se po handler-ima |
| Samo FluentValidation (bez SSOT) | ✗ | ✓ | Visoka | JMBG algoritam bi bio implementiran u svakom validatoru koji ga treba — duplikacija |

---

## Consequences

### Pozitivne
- `ValidationBehavior` automatski baca 422 s `FieldErrors` — handler nikad ne prima nevalidan request
- JMBG algoritam, email regex i telefon format su implementirani jednom u `OrderRequestValidator` — bez divergencije
- Frontend dobiva strukturiran `{field, code, message}` format — može programski prikazati grešku ispod pravog polja

### Negativne
- `ValidationErrorCodes` su "frozen API" — mijenjanje code string-a je breaking change koji zahtijeva frontend promjenu
- `OrderRequestValidator` je statička klasa — metode moraju biti čiste funkcije bez vanjskih zavisnosti (DB validacija mora biti u FluentValidation, ne u SSOT)

### Svjesno prihvaćeni kompromisi
- Prihvatamo odvojenost SSOT statičke klase i FluentValidation klasa jer alternativa — sve u FluentValidation — ne pruža dovoljan nivo reusabilitya za Blazor UI validaciju.

---

## Tehnički dug

- `OrderRequestValidator.IsValidBranch(city, branch)` trenutno poziva `BranchCatalog` statičnu listu (vidi ADR-019 problem) — treba biti refaktorisano na DB upit

---

## Migration Impact

- **Breaking Changes:** Promjena `ValidationErrorCodes` je breaking change; dodavanje novih je backward-compatible
- **Rollback Plan:** Nije primjenjivo — ovo je fundamentalna odluka o validacijskoj arhitekturi
- **Compatibility:** FluentValidation 11.x; nema planova za upgrade

---

## Kada revidirati

- FluentValidation uvede breaking API promjenu u novoj major verziji
- Tim identificira klasu validacija (npr. DB existence checks) koja prirodno pripada u server-side handler, ne FluentValidation validator
