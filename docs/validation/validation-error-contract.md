# Backend Validation Error Contract

Ovaj dokument definiše standardni format koji backend vraća za validacijske greške.
Frontend, backend i QA moraju koristiti ovaj isti contract.

---

## 1. Standardni response format za validacijske greške

HTTP status: **400 Bad Request**  
Content-Type: `application/problem+json`

### S fieldErrors (greška vezana za jedno ili više polja)

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "Validation Error",
  "status": 400,
  "detail": "Jedan ili više uslova validacije nisu ispunjeni.",
  "instance": "/api/clients",
  "correlationId": "abc-123-def-456",
  "fieldErrors": [
    {
      "field": "jmbg",
      "code": "INVALID_JMBG_FORMAT",
      "message": "JMBG mora sadržavati tačno 13 cifara."
    },
    {
      "field": "ime",
      "code": "REQUIRED_FIELD",
      "message": "Ovo polje je obavezno."
    }
  ]
}
```

### Bez fieldErrors (opšta greška forme)

```json
{
  "title": "Validation Error",
  "status": 400,
  "detail": "Jedan ili više uslova validacije nisu ispunjeni.",
  "correlationId": "abc-123-def-456"
}
```

---

## 2. Opis polja

| Polje | Tip | Opis |
|---|---|---|
| `title` | `string` | Kratki naslov greške. Uvijek `"Validation Error"` za 400. |
| `status` | `int` | HTTP status kod. `400` za validacijske greške. |
| `detail` | `string` | Opšta poruka koja se može prikazati korisniku. |
| `instance` | `string` | URL endpointa koji je bio pozvan. |
| `correlationId` | `string` | ID za praćenje greške u logovima. Iz `X-Correlation-ID` headera. |
| `fieldErrors` | `array` | Lista grešaka po poljima. Prisutna samo ako ima grešaka po poljima. |
| `fieldErrors[].field` | `string` | camelCase naziv polja (npr. `"jmbg"`, `"poreznibroj"`, `"ime"`). |
| `fieldErrors[].code` | `string` | Stabilan error code. Nikad se ne mijenja (breaking change). |
| `fieldErrors[].message` | `string` | Korisniku razumljiva poruka. Može se promijeniti, `code` je stabilan. |

---

## 3. Implementacija (backend)

### Bačiti grešku s fieldErrors

```csharp
using Praksa.Application.Common.Models;
using Praksa.Application.Common.Validation;

// Jedan field error:
throw new ValidationException([
    new ValidationFieldError("jmbg", ValidationErrorCodes.InvalidJmbgFormat,
        "JMBG mora sadržavati tačno 13 cifara.")
]);

// Više field errora:
throw new ValidationException([
    new ValidationFieldError("jmbg", ValidationErrorCodes.InvalidJmbgLength,
        "JMBG mora sadržavati tačno 13 cifara."),
    new ValidationFieldError("ime", ValidationErrorCodes.RequiredField,
        "Ovo polje je obavezno.")
]);
```

### Stari format (backward compatibility)

```csharp
// Zadržan za backward compatibility:
throw new ValidationException("jmbg", "JMBG mora biti 13 cifara.");

// Ili:
throw new ValidationException(new Dictionary<string, string[]>
{
    { "jmbg", ["JMBG mora biti 13 cifara."] }
});
```

---

## 4. Error Code lista

### Opšti kodovi

| Code | Opis | Kada |
|---|---|---|
| `VALIDATION_ERROR` | Opšta validacijska greška | Naslov odgovora |
| `REQUIRED_FIELD` | Obavezno polje je prazno | Null, prazan string, whitespace |
| `INVALID_FORMAT` | Pogrešan format | Generički format |
| `INVALID_INPUT` | Nedozvoljen unos | Generički nevalidan sadržaj |
| `VALUE_NOT_ALLOWED` | Vrijednost nije dozvoljena | Enum-like validation |
| `MAX_LENGTH_EXCEEDED` | Prekoračena maksimalna dužina | Dug string |
| `MIN_LENGTH_NOT_MET` | Minimalna dužina nije dostignuta | Kratak string |
| `INVALID_CHARACTERS` | Nedozvoljeni znakovi | Specijalni karakteri |
| `UNSUPPORTED_CHARACTERS` | Nepodržani znakovi | Znakovi van dozvoljenog seta |

### JMBG kodovi

| Code | Opis | Primjer poruke |
|---|---|---|
| `REQUIRED_JMBG` | JMBG je obavezno polje | "JMBG je obavezno." |
| `INVALID_JMBG_FORMAT` | JMBG nije u ispravnom formatu | "JMBG nije u ispravnom formatu." |
| `INVALID_JMBG_LENGTH` | JMBG nema 13 cifara | "JMBG mora sadržavati tačno 13 cifara." |
| `INVALID_JMBG_DIGITS_ONLY` | JMBG sadrži slova ili znakove | "JMBG smije sadržavati samo brojeve." |
| `INVALID_JMBG_DATE_PART` | Datumska komponenta JMBG-a nije ispravna | "Datum u JMBG-u nije ispravan." |
| `INVALID_JMBG_CHECKSUM` | Kontrolna cifra JMBG-a nije ispravna | "JMBG ima neispravnu kontrolnu cifru." |

### Porezni broj kodovi

| Code | Opis | Primjer poruke |
|---|---|---|
| `REQUIRED_TAX_NUMBER` | Porezni broj je obavezno polje | "Porezni broj je obavezan." |
| `INVALID_TAX_NUMBER_FORMAT` | Porezni broj nije u ispravnom formatu | "Porezni broj nije u ispravnom formatu." |
| `INVALID_TAX_NUMBER_LENGTH` | Porezni broj ima pogrešnu dužinu | "Porezni broj mora imati [N] cifara." |
| `INVALID_TAX_NUMBER_DIGITS_ONLY` | Porezni broj sadrži slova ili znakove | "Porezni broj smije sadržavati samo brojeve." |

### Pretraga kodovi

| Code | Opis |
|---|---|
| `INVALID_SEARCH_QUERY` | Nevalidan search term |
| `SEARCH_QUERY_TOO_LONG` | Search term predugi |

---

## 5. Pravila za errorCode vrijednosti

- Kodovi su u `UPPER_SNAKE_CASE` formatu
- Nikad ne mijenjati vrijednost postojećeg koda (breaking change za frontend i QA)
- Novi kodovi se dodaju, stari nikad ne uklanjaju bez dogovora s timom
- Kodovi su definirani u `src/Application/Common/Validation/ValidationErrorCodes.cs`
- Kodovi se ne ponavljaju za isti tip greške

---

## 6. Frontend ponašanje prema fieldErrors

```
Backend odgovor sadrži fieldErrors[]
  ↓
Za svaki fieldError:
  - Pronađi element forme po field nazivu
  - Prikaži inline poruku uz polje (message)
  - Označi polje kao pogrešno (CSS klasa / aria-invalid)

Ako fieldErrors[] je prazna ili ne postoji:
  - Prikaži opštu grešku kao pop-up/toast (detail poruka)
```

Ovo je pravilo — detaljna implementacija je frontend tim.

---

## 7. Napomene za QA

- Svaki test koji šalje nevalidan JMBG mora dobiti `400` s `code: "INVALID_JMBG_FORMAT"` ili specifičnijim kodom
- Test koji zaobilazi frontend validaciju direktnim API pozivom mora dobiti 400
- `correlationId` mora biti prisutan u svakom error odgovoru
- `fieldErrors[].code` mora odgovarati konstantama u `ValidationErrorCodes.cs`
