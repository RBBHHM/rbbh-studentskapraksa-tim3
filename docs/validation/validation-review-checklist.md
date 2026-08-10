# Validation — Review Checklist za Hamzinu implementaciju

Ova lista se koristi pri code reviewu Hamzine implementacije JMBG validatora,
porezni broj validatora i obaveznih polja. Tech lead / Amina prolazi kroz ovu listu.

---

## 1. Opšti pregled koda

- [ ] Kod se kompajlira bez grešaka (`dotnet build` → 0 errors)
- [ ] Nema compiler upozorenja koja ukazuju na problem
- [ ] Nema hardkodovanih string poruka — sve poruke kao konstante ili iz `ValidationErrorCodes`
- [ ] Klase su u ispravnom layeru (`Application/Common/Validation/`)
- [ ] Imenovanje je konzistentno s ostatkom projekta (`JmbgValidator`, `TaxNumberValidator`)

---

## 2. ValidationErrorCodes — Korištenje

- [ ] Validator koristi `ValidationErrorCodes.*` konstante, ne literal stringove
- [ ] Za JMBG: koristi `ValidationErrorCodes.RequiredJmbg`, `InvalidJmbgLength`, `InvalidJmbgDigitsOnly`, `InvalidJmbgDatePart`, (opcija) `InvalidJmbgChecksum`
- [ ] Za porezni broj: koristi `ValidationErrorCodes.RequiredTaxNumber`, `InvalidTaxNumberLength`, `InvalidTaxNumberDigitsOnly`, `InvalidTaxNumberFormat`
- [ ] Nikakvi novi error codovi nisu izmišljeni mimo dokumentiranog seta

---

## 3. ValidationException — Bacanje greške

- [ ] Validator baca `ValidationException` s novim konstruktorom (`IReadOnlyList<ValidationFieldError>`)
- [ ] `ValidationFieldError` konstruktor prima `(field, code, message)` u ispravnom redoslijedu
- [ ] `field` vrijednost je `camelCase` (npr. `"jmbg"`, `"poreznibroj"`)
- [ ] `message` je na bosanskom jeziku i u skladu s tabelom u `validation-rules.md`
- [ ] Validator ne koristi stari `throw new ValidationException("field", "message")` format (osim ako nema opravdanog razloga)

---

## 4. JMBG validator — Specifična pravila

- [ ] Ulaz se trimuje (`Trim()`) prije obrade
- [ ] `ISearchNormalizer.NormalizeIdentifier()` ili ekvivalent se poziva za uklanjanje crtica i razmaka
- [ ] Provjera: `string.IsNullOrWhiteSpace` → `REQUIRED_JMBG`
- [ ] Provjera: nije tačno 13 cifara nakon normalizacije → `INVALID_JMBG_LENGTH`
- [ ] Provjera: sadrži ne-cifre → `INVALID_JMBG_DIGITS_ONLY`
- [ ] Ako je datum validacija aktivna: provjera `DDMMGGG` komponente → `INVALID_JMBG_DATE_PART`
- [ ] Checksum: ili implementiran s `INVALID_JMBG_CHECKSUM` ili jasno označen TODO s komentarom

---

## 5. Porezni broj validator — Specifična pravila

- [ ] Ulaz se trimuje (`Trim()`) prije obrade
- [ ] `ISearchNormalizer.NormalizeIdentifier()` se poziva za uklanjanje razmaka
- [ ] Provjera: `string.IsNullOrWhiteSpace` → `REQUIRED_TAX_NUMBER`
- [ ] Provjera: nije tačno 13 cifara nakon normalizacije → `INVALID_TAX_NUMBER_LENGTH`
- [ ] Provjera: sadrži ne-cifre → `INVALID_TAX_NUMBER_DIGITS_ONLY`
- [ ] Ako BiH prefiks provjera (`42`) implementirana: koristi `INVALID_TAX_NUMBER_FORMAT`
- [ ] Ako BiH prefiks provjera nije implementirana: postoji TODO comment

---

## 6. Obavezna polja — Opšta provjera

- [ ] `string.IsNullOrWhiteSpace()` se koristi (ne samo `== null` ili `== ""`)
- [ ] Error code je `ValidationErrorCodes.RequiredField`
- [ ] Poruka je `"Ovo polje je obavezno."` ili ekvivalent specifičan za polje

---

## 7. Bosanska slova — Ne smiju biti odbijena

- [ ] Validator ne odbija Š, Đ, Č, Ć, Ž u tekstualnim poljima
- [ ] Nema regex-a koji dozvoljavaju samo `[a-zA-Z]` za tekstualna polja
- [ ] `UNSUPPORTED_CHARACTERS` se ne baca za bosanska slova
- [ ] Ako postoji charset validacija: koristi Unicode-aware pristup

---

## 8. Integracija s postojećom arhitekturom

- [ ] Validator je injektovan putem DI ako je interfejs, ili je statička metoda ako je utility
- [ ] Validator je pozvan iz command handler-a, ne direktno iz API controllera
- [ ] Validacija se dešava **prije** pristupa bazi podataka (fail fast princip)
- [ ] Više grešaka se prikuplja i baca u jednom `ValidationException` (ne više bacanja)

---

## 9. Unit testovi (ako postoje)

- [ ] Test: prazan JMBG → `REQUIRED_JMBG`
- [ ] Test: 12-cifreni JMBG → `INVALID_JMBG_LENGTH`
- [ ] Test: JMBG sa slovom → `INVALID_JMBG_DIGITS_ONLY`
- [ ] Test: JMBG s crticama → normalizovan i validiran
- [ ] Test: validan JMBG → ne baca grešku
- [ ] Test: prazan porezni broj → `REQUIRED_TAX_NUMBER`
- [ ] Test: 12-cifreni porezni broj → `INVALID_TAX_NUMBER_LENGTH`
- [ ] Test: porezni broj sa slovom → `INVALID_TAX_NUMBER_DIGITS_ONLY`

---

## 10. API odgovor (integration test / Postman)

- [ ] `POST /api/[endpoint]` s nevalidnim JMBG → 400 + `fieldErrors` array
- [ ] `fieldErrors[0].code` odgovara dokumentovanom kodu
- [ ] `fieldErrors[0].field` je `"jmbg"` ili odgovarajući camelCase naziv
- [ ] `correlationId` je prisutan u odgovoru
- [ ] Content-Type je `application/problem+json`
- [ ] Direktan API poziv bez frontend-a → isti 400 odgovor

---

## 11. Dokumentacija

- [ ] Svaki novi validator/klasa ima kratki summary komentar (samo ako nije očito)
- [ ] TODO odluke (npr. checksum aktivacija) su označene s `// TODO:` komentarom
- [ ] Nema mrtvih komentara, zakomentiranog koda, ili `// added for X` komentara

---

## 12. Red flagovi — Automatski reject pri review-u

| Problem | Zašto odbiti |
|---|---|
| Hardkodovan error code string (`"INVALID_JMBG_LENGTH"`) | Mora koristiti konstantu iz `ValidationErrorCodes` |
| Regex `[a-zA-Z]+` za ime/prezime | Odbija bosanska slova — breaking |
| `throw new ValidationException("jmbg", "...")` s novim kodom | Stari format nema `code` polje — fieldErrors ne rade |
| Validacija direktno u controlleru | Mora biti u command handleru ili validatoru |
| Više `throw ValidationException` poziva za jedno polje | Skupiti sve greške u jednu listu |
| `UNSUPPORTED_CHARACTERS` za Š/Đ/Č/Ć/Ž | Eksplicitno zabranjeno u `validation-rules.md` |
