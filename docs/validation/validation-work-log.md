# Validation — Work Log i Mapa Implementacije

## 1. Status taskova

| Task ID | Naziv | Tip | Odgovorna osoba | Status |
|---|---|---|---|---|
| SA-03 | Validacijska pravila — jedinstven izvor istine | Analiza / Docs | Amina | ✅ Završeno |
| UX-VALID-01 | Inline validacija i error poruke | UX / Frontend | Frontend tim | ⏳ TODO |
| BE-VALID-01 | ValidationException + fieldErrors | Backend | Amina | ✅ Završeno |
| BE-VALID-02 | ValidationErrorCodes konstante | Backend | Amina | ✅ Završeno |
| BE-VALID-03 | GlobalExceptionHandler — correlationId + fieldErrors | Backend | Amina | ✅ Završeno |
| BE-VALID-04 | JMBG validator (JmbgValidator klasa) | Backend | Hamza | ⏳ TODO |
| BE-VALID-05 | Porezni broj validator | Backend | Hamza | ⏳ TODO |
| BE-SEARCH-01 | SearchNormalizer — case-insensitive, FormC | Backend | Amina | ✅ Postoji |
| QA-VALID-01 | Test slučajevi — validacijska pravila | QA | QA tim | ⏳ TODO |

---

## 2. Mapa implementiranih fajlova

### Backend — Application Layer

| Fajl | Status | Opis |
|---|---|---|
| `src/Application/Common/Models/ValidationFieldError.cs` | ✅ Kreiran | Sealed record: Field, Code, Message |
| `src/Application/Common/Validation/ValidationErrorCodes.cs` | ✅ Kreiran | 21 konstanta, svi error codovi |
| `src/Application/Common/Exceptions/ValidationException.cs` | ✅ Ažuriran | Dodato FieldErrors + novi konstruktor |
| `src/Application/Common/Models/PagedResult.cs` | ✅ Postoji | Generički paginovani odgovor |

### Backend — API Layer

| Fajl | Status | Opis |
|---|---|---|
| `src/Api/Middleware/GlobalExceptionHandler.cs` | ✅ Ažuriran | Dodato correlationId + fieldErrors serializacija |
| `src/Api/Middleware/CorrelationIdMiddleware.cs` | ✅ Postoji | Postavlja X-Correlation-ID header |

### Backend — TODO (Hamza)

| Fajl | Status | Opis |
|---|---|---|
| `src/Application/Common/Validation/JmbgValidator.cs` | ⏳ TODO | Validacija JMBG-a (13 cifara, datum, checksum) |
| `src/Application/Common/Validation/TaxNumberValidator.cs` | ⏳ TODO | Validacija poreznog broja (13 cifara) |

### Dokumentacija

| Fajl | Status | Opis |
|---|---|---|
| `docs/validation/validation-error-handling-decision.md` | ✅ Kreiran | Odluka: Opcija C (frontend + backend + contract) |
| `docs/validation/validation-error-contract.md` | ✅ Kreiran | Standardni error response format, fieldErrors JSON |
| `docs/validation/validation-rules.md` | ✅ Kreiran | Sva pravila, BR-VALID-*, EC-VALID-* |
| `docs/validation/validation-message-display-rules.md` | ✅ Kreiran | Inline vs toast pravila, mapiranje polja |
| `docs/validation/validation-work-log.md` | ✅ Ovaj fajl | Status taskova, mapa fajlova |
| `docs/validation/validation-acceptance-checklist.md` | ✅ Kreiran | AC lista za QA i review |
| `docs/validation/validation-review-checklist.md` | ✅ Kreiran | Review lista za Hamzinu implementaciju |
| `docs/backend/validation-rules.md` | ⏳ Referiše novo | Stari placeholder — ažuriran da upućuje na docs/validation/ |

---

## 3. Veza s ValidationErrorCodes konstantama

Sve konstantne vrijednosti nalaze se u jednom fajlu:
`src/Application/Common/Validation/ValidationErrorCodes.cs`

```
ValidationErrorCodes.RequiredField           = "REQUIRED_FIELD"
ValidationErrorCodes.InvalidFormat           = "INVALID_FORMAT"
ValidationErrorCodes.InvalidInput            = "INVALID_INPUT"
ValidationErrorCodes.ValueNotAllowed         = "VALUE_NOT_ALLOWED"
ValidationErrorCodes.MaxLengthExceeded       = "MAX_LENGTH_EXCEEDED"
ValidationErrorCodes.MinLengthNotMet         = "MIN_LENGTH_NOT_MET"
ValidationErrorCodes.InvalidCharacters       = "INVALID_CHARACTERS"
ValidationErrorCodes.UnsupportedCharacters   = "UNSUPPORTED_CHARACTERS"
ValidationErrorCodes.RequiredJmbg            = "REQUIRED_JMBG"
ValidationErrorCodes.InvalidJmbgFormat       = "INVALID_JMBG_FORMAT"
ValidationErrorCodes.InvalidJmbgLength       = "INVALID_JMBG_LENGTH"
ValidationErrorCodes.InvalidJmbgDigitsOnly   = "INVALID_JMBG_DIGITS_ONLY"
ValidationErrorCodes.InvalidJmbgDatePart     = "INVALID_JMBG_DATE_PART"
ValidationErrorCodes.InvalidJmbgChecksum     = "INVALID_JMBG_CHECKSUM"
ValidationErrorCodes.RequiredTaxNumber       = "REQUIRED_TAX_NUMBER"
ValidationErrorCodes.InvalidTaxNumberFormat  = "INVALID_TAX_NUMBER_FORMAT"
ValidationErrorCodes.InvalidTaxNumberLength  = "INVALID_TAX_NUMBER_LENGTH"
ValidationErrorCodes.InvalidTaxNumberDigitsOnly = "INVALID_TAX_NUMBER_DIGITS_ONLY"
ValidationErrorCodes.InvalidSearchQuery      = "INVALID_SEARCH_QUERY"
ValidationErrorCodes.SearchQueryTooLong      = "SEARCH_QUERY_TOO_LONG"
```

---

## 4. Napomene i tehničke odluke

### Odluka: fieldErrors vs errors

- Stari format: `errors: { "jmbg": ["poruka"] }` — backward compatibility
- Novi format: `fieldErrors: [{ field, code, message }]` — standardni contract
- `GlobalExceptionHandler` preferira `fieldErrors` ako postoji, pada na `errors` inače

### Odluka: correlationId

- Uzima se iz `X-Correlation-ID` headera (postavljeno od `CorrelationIdMiddleware`)
- Ako header nije prisutan: koristi `httpContext.TraceIdentifier`
- Prisutan u SVAKOM error odgovoru (400, 403, 404, 409, 500)

### Odluka: bosanska slova

- Backend ne smije odbijati Š, Đ, Č, Ć, Ž u tekstualnim poljima
- `UNSUPPORTED_CHARACTERS` ne smije biti bačen za ova slova
- `NormalizeText()` koristi FormC (ne accent-stripping)

### Odluka: JMBG checksum

- Checksum validacija je **opcionalna** (TODO — odluka tima)
- `INVALID_JMBG_CHECKSUM` constant postoji, validator ga može aktivirati kad tim odluči

---

## 5. Kako koristiti ValidationException

### Jedno polje

```csharp
throw new ValidationException([
    new ValidationFieldError("ime", ValidationErrorCodes.RequiredField,
        "Ovo polje je obavezno.")
]);
```

### Više polja odjednom

```csharp
throw new ValidationException([
    new ValidationFieldError("jmbg", ValidationErrorCodes.InvalidJmbgLength,
        "JMBG mora sadržavati tačno 13 cifara."),
    new ValidationFieldError("ime", ValidationErrorCodes.RequiredField,
        "Ovo polje je obavezno.")
]);
```

### Stari format (backward compatibility)

```csharp
throw new ValidationException("jmbg", "JMBG mora biti 13 cifara.");
```

---

## 6. Log izmjena

| Datum | Izmjena | Ko |
|---|---|---|
| 2026-05-26 | Kreiran ValidationFieldError, ValidationErrorCodes, ažuriran ValidationException i GlobalExceptionHandler | Amina |
| 2026-05-26 | Kreirana kompletna docs/validation/ dokumentacija | Amina |
| TBD | JmbgValidator implementacija | Hamza |
| TBD | TaxNumberValidator implementacija | Hamza |
| TBD | Frontend inline/toast implementacija | Frontend tim |
| TBD | QA test slučajevi | QA tim |
