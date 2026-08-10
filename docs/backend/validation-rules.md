# Validacijska pravila

> **Ovaj fajl je zamijenjen novom dokumentacijom.**
>
> Autoritativni izvor svih validacijskih pravila je sada:
> **`docs/validation/`**
>
> | Dokument | Sadržaj |
> |---|---|
> | [`docs/validation/validation-rules.md`](../validation/validation-rules.md) | Sva validacijska pravila, JMBG, porezni broj, bosanska slova, BR-VALID-*, EC-VALID-* |
> | [`docs/validation/validation-error-contract.md`](../validation/validation-error-contract.md) | Backend error response format, fieldErrors JSON, errorCode lista |
> | [`docs/validation/validation-error-handling-decision.md`](../validation/validation-error-handling-decision.md) | Odluka: frontend + backend + standardni contract |
> | [`docs/validation/validation-message-display-rules.md`](../validation/validation-message-display-rules.md) | Inline vs pop-up/toast pravila prikaza |
> | [`docs/validation/validation-acceptance-checklist.md`](../validation/validation-acceptance-checklist.md) | Acceptance checklist za QA |
> | [`docs/validation/validation-review-checklist.md`](../validation/validation-review-checklist.md) | Review checklist za Hamzinu implementaciju |

---

## Kratki pregled arhitekture validacije

**Slojevi validacije:**
1. **Frontend** — `onBlur` validacija, brz feedback korisniku
2. **Backend** — autoritativan sloj, uvijek ponovo validira neovisno od frontenda

**Error response format:**

```json
{
  "title": "Validation Error",
  "status": 400,
  "detail": "Jedan ili više uslova validacije nisu ispunjeni.",
  "correlationId": "abc-123",
  "fieldErrors": [
    { "field": "jmbg", "code": "INVALID_JMBG_LENGTH", "message": "JMBG mora sadržavati tačno 13 cifara." }
  ]
}
```

**Ključne klase:**
- `ValidationFieldError` — `Application/Common/Models/ValidationFieldError.cs`
- `ValidationErrorCodes` — `Application/Common/Validation/ValidationErrorCodes.cs`
- `ValidationException` — `Application/Common/Exceptions/ValidationException.cs`
- `GlobalExceptionHandler` — `Api/Middleware/GlobalExceptionHandler.cs`

Za detalje vidi `docs/validation/`.
