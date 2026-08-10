# Validation — Acceptance Checklist

Ova lista pokriva sve prihvatne kriterije za user story "Pop-up obavještenja i validacije".
QA tim i tech lead koriste ovu listu za finalno prihvatanje user story-ja.

---

## AC-INFRA — Infrastruktura i arhitektura

| ID | Prihvatni kriterij | Status |
|---|---|---|
| AC-INFRA-01 | `ValidationFieldError` sealed record postoji u `Application/Common/Models/` | ☐ |
| AC-INFRA-02 | `ValidationFieldError` ima polja `Field`, `Code`, `Message` (sve string) | ☐ |
| AC-INFRA-03 | `ValidationErrorCodes` static class postoji u `Application/Common/Validation/` | ☐ |
| AC-INFRA-04 | `ValidationErrorCodes` sadrži minimalno: `RequiredField`, `InvalidFormat`, `InvalidInput`, `InvalidCharacters`, sve JMBG kodove, sve porezni broj kodove | ☐ |
| AC-INFRA-05 | `ValidationException` ima novu `FieldErrors` property tipa `IReadOnlyList<ValidationFieldError>?` | ☐ |
| AC-INFRA-06 | `ValidationException` ima novi konstruktor koji prima `IReadOnlyList<ValidationFieldError>` | ☐ |
| AC-INFRA-07 | Stari `ValidationException` konstruktori rade normalno (backward compatibility) | ☐ |
| AC-INFRA-08 | Projekt se builda bez grešaka i upozorenja | ☐ |

---

## AC-ERROR-CONTRACT — Backend error contract

| ID | Prihvatni kriterij | Status |
|---|---|---|
| AC-CONTRACT-01 | `GlobalExceptionHandler` dodaje `correlationId` u **svaki** error odgovor | ☐ |
| AC-CONTRACT-02 | `correlationId` se čita iz `X-Correlation-ID` headera | ☐ |
| AC-CONTRACT-03 | Ako header nije prisutan, koristi se `TraceIdentifier` | ☐ |
| AC-CONTRACT-04 | Za `ValidationException` s `FieldErrors`: odgovor sadrži `fieldErrors` array | ☐ |
| AC-CONTRACT-05 | `fieldErrors` array sadrži `field`, `code`, `message` po elementu | ☐ |
| AC-CONTRACT-06 | Za stari `ValidationException` s `Errors`: odgovor sadrži `errors` (backward compat) | ☐ |
| AC-CONTRACT-07 | HTTP status je 400 za `ValidationException` | ☐ |
| AC-CONTRACT-08 | Content-Type je `application/problem+json` za sve greške | ☐ |
| AC-CONTRACT-09 | `title` je `"Validation Error"` za 400 odgovor | ☐ |
| AC-CONTRACT-10 | `detail` je prisutan i čitljiv korisniku | ☐ |

---

## AC-JMBG — JMBG validacija (Hamza — TODO)

| ID | Prihvatni kriterij | Status |
|---|---|---|
| AC-JMBG-01 | Prazan JMBG → `400` s `code: "REQUIRED_JMBG"` | ☐ |
| AC-JMBG-02 | JMBG s 12 cifara → `400` s `code: "INVALID_JMBG_LENGTH"` | ☐ |
| AC-JMBG-03 | JMBG s 14 cifara → `400` s `code: "INVALID_JMBG_LENGTH"` | ☐ |
| AC-JMBG-04 | JMBG sa slovom (`"A301199012345"`) → `400` s `code: "INVALID_JMBG_DIGITS_ONLY"` | ☐ |
| AC-JMBG-05 | JMBG s neispravnim datumom → `400` s `code: "INVALID_JMBG_DATE_PART"` | ☐ |
| AC-JMBG-06 | JMBG s crticama (`"1301-199-012345"`) → normalizovan i validiran | ☐ |
| AC-JMBG-07 | JMBG s razmacima → normalizovan i validiran | ☐ |
| AC-JMBG-08 | Validan JMBG (`"1301199012345"`) → prihvaćen (ako datumska val. aktivna) | ☐ |
| AC-JMBG-09 | `NormalizeIdentifier` se poziva prije validacije | ☐ |
| AC-JMBG-10 | JMBG validacija koristi `ValidationErrorCodes.InvalidJmbg*` konstante | ☐ |

---

## AC-TAX — Porezni broj validacija (Hamza — TODO)

| ID | Prihvatni kriterij | Status |
|---|---|---|
| AC-TAX-01 | Prazan porezni broj → `400` s `code: "REQUIRED_TAX_NUMBER"` | ☐ |
| AC-TAX-02 | Porezni broj s 12 cifara → `400` s `code: "INVALID_TAX_NUMBER_LENGTH"` | ☐ |
| AC-TAX-03 | Porezni broj s 14 cifara → `400` s `code: "INVALID_TAX_NUMBER_LENGTH"` | ☐ |
| AC-TAX-04 | Porezni broj sa slovom → `400` s `code: "INVALID_TAX_NUMBER_DIGITS_ONLY"` | ☐ |
| AC-TAX-05 | Validan porezni broj (`"4200123456789"`) → prihvaćen | ☐ |
| AC-TAX-06 | `NormalizeIdentifier` se poziva prije validacije | ☐ |
| AC-TAX-07 | Porezni broj validacija koristi `ValidationErrorCodes.InvalidTaxNumber*` konstante | ☐ |

---

## AC-REQUIRED — Obavezna polja

| ID | Prihvatni kriterij | Status |
|---|---|---|
| AC-REQ-01 | Null vrijednost obaveznog polja → `400` s `code: "REQUIRED_FIELD"` | ☐ |
| AC-REQ-02 | Prazni string `""` obaveznog polja → `400` s `code: "REQUIRED_FIELD"` | ☐ |
| AC-REQ-03 | Whitespace-only string obaveznog polja → `400` s `code: "REQUIRED_FIELD"` | ☐ |
| AC-REQ-04 | Backend trimuje ulaz prije provjere | ☐ |

---

## AC-BOSNIAN — Podrška za bosanska slova

| ID | Prihvatni kriterij | Status |
|---|---|---|
| AC-BOS-01 | Polje s vrijednošću "Šarić" → prihvaćeno bez greške | ☐ |
| AC-BOS-02 | Polje s vrijednošću "Đukić" → prihvaćeno bez greške | ☐ |
| AC-BOS-03 | Polje s vrijednošću "Čović" → prihvaćeno bez greške | ☐ |
| AC-BOS-04 | Polje s vrijednošću "Ćatić" → prihvaćeno bez greške | ☐ |
| AC-BOS-05 | Polje s vrijednošću "Žutić" → prihvaćeno bez greške | ☐ |
| AC-BOS-06 | Backend ne vraća `UNSUPPORTED_CHARACTERS` za bosanska slova | ☐ |

---

## AC-SEARCH — Case-insensitive pretraga

| ID | Prihvatni kriterij | Status |
|---|---|---|
| AC-SEARCH-01 | Search "Amina" vraća iste rezultate kao "amina" | ☐ |
| AC-SEARCH-02 | Search "AMINA" vraća iste rezultate kao "amina" | ☐ |
| AC-SEARCH-03 | Search "Čović" vraća iste rezultate kao "čović" | ☐ |
| AC-SEARCH-04 | Search "Čović" **ne** vraća rezultate za "Covic" (diacritic-aware) | ☐ |
| AC-SEARCH-05 | `NormalizeText()` koristi FormC + ToUpperInvariant | ☐ |
| AC-SEARCH-06 | `*_search` kolone postoje i sadrže normalizovane vrijednosti | ☐ |

---

## AC-FRONTEND — Frontend prikaz (Frontend tim)

| ID | Prihvatni kriterij | Status |
|---|---|---|
| AC-FE-01 | Inline greška se prikazuje `onBlur` na praznom obaveznom polju | ☐ |
| AC-FE-02 | Tab na praznom obaveznom polju → prikazuje inline grešku | ☐ |
| AC-FE-03 | Enter na praznoj formi → validira sva polja, submit ne prolazi | ☐ |
| AC-FE-04 | Backend `fieldErrors` → prikazano uz odgovarajuća polja inline | ☐ |
| AC-FE-05 | Backend 400 bez `fieldErrors` → toast/pop-up s `detail` porukom | ☐ |
| AC-FE-06 | Backend 500 → toast s generičkom porukom (ne detalji servera) | ☐ |
| AC-FE-07 | Korisniku se nikad ne prikazuje `code` vrijednost | ☐ |
| AC-FE-08 | Inline greška se uklanja kad korisnik počne kucati (`onChange`) | ☐ |
| AC-FE-09 | Fokus ide na prvo polje s greškom nakon validacije forme | ☐ |
| AC-FE-10 | Više `fieldErrors` odjednom → sve prikazane istovremeno | ☐ |

---

## AC-SECURITY — Sigurnost validacije

| ID | Prihvatni kriterij | Status |
|---|---|---|
| AC-SEC-01 | Direktan API poziv bez frontend validacije → backend vraća 400 | ☐ |
| AC-SEC-02 | Postman/curl s nevalidnim JMBG → 400 s `fieldErrors` | ☐ |
| AC-SEC-03 | Frontend koji zaobilazi validaciju → backend odbija nevalidan unos | ☐ |

---

## AC-DOC — Dokumentacija

| ID | Prihvatni kriterij | Status |
|---|---|---|
| AC-DOC-01 | `docs/validation/validation-rules.md` postoji i pokriva sva pravila | ☐ |
| AC-DOC-02 | `docs/validation/validation-error-contract.md` postoji s JSON primjerima | ☐ |
| AC-DOC-03 | `docs/validation/validation-message-display-rules.md` pokriva inline vs toast | ☐ |
| AC-DOC-04 | `docs/backend/validation-rules.md` upućuje na novu lokaciju | ☐ |
