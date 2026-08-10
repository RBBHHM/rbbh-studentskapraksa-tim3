# Validacijska pravila — Jedinstven izvor istine

Backend, frontend i QA koriste ovaj dokument kao autoritativni izvor validacijskih pravila.

---

## 1. Principi validacije

| Princip | Objašnjenje |
|---|---|
| Frontend daje brz feedback | onBlur validacija prikazuje grešku odmah |
| Backend je autoritativan | Backend uvijek ponovo validira — neovisno od frontend-a |
| Backend štiti od zaobilaženja | Direktan API poziv mora dobiti istu grešku kao submit kroz UI |
| errorCode je stabilan | Nikad mijenjati error code vrijednost — breaking change |
| Poruke su na jeziku projekta | Bosanski jezik, jasne korisniku |

---

## 2. Obavezna polja

**Pravila:**
- Obavezno polje ne smije biti `null`
- Ne smije biti prazan string `""`
- Ne smije sadržavati samo razmake (whitespace)
- Backend trimuje unos prije provjere
- Frontend prikazuje poruku pri napuštanju praznog polja (onBlur)

**Error code:** `REQUIRED_FIELD`

**Korisnička poruka:** `"Ovo polje je obavezno."`

**Backend implementacija (primjer s ValidationException):**
```csharp
if (string.IsNullOrWhiteSpace(request.Ime))
    throw new ValidationException([
        new ValidationFieldError("ime", ValidationErrorCodes.RequiredField, "Ovo polje je obavezno.")
    ]);
```

---

## 3. JMBG (Jedinstveni matični broj građana)

**Format:** 13 cifara bez razmaka i crtica  
`DDMMGGGAAABBC` (dan, mjesec, godine, region, redni, kontrolna)

**Pravila:**
1. Obavezno polje (ako polje postoji na formi) — `REQUIRED_JMBG`
2. Trimovati unos
3. Ukloniti razmake i crtice (`ISearchNormalizer.NormalizeIdentifier` — zadržava samo cifre)
4. Nakon normalizacije: mora imati tačno 13 cifara — `INVALID_JMBG_LENGTH`
5. Smije sadržavati samo cifre — `INVALID_JMBG_DIGITS_ONLY`
6. Datumska komponenta `DDMMGGG`: validacija datuma — `INVALID_JMBG_DATE_PART` (ako je aktivirana)
7. Checksum validacija — `INVALID_JMBG_CHECKSUM` (ako je aktivirana — TODO odluka tima)
8. Backend odbija svaki JMBG koji ne prođe sva aktivirana pravila

**Korisnička poruka primjeri:**

| Situacija | Poruka |
|---|---|
| Obavezno, prazno | "JMBG je obavezan." |
| Nije 13 cifara | "JMBG mora sadržavati tačno 13 cifara." |
| Sadrži slova | "JMBG smije sadržavati samo brojeve." |
| Neispravan datum | "Datum u JMBG-u nije ispravan." |
| Neispravna kontrolna cifra | "JMBG ima neispravnu kontrolnu cifru." |

**Napomena za implementatora (Hamza):**
- Koristiti `ISearchNormalizer.NormalizeIdentifier(jmbg)` za čišćenje ulaza
- Validacija u posebnoj `JmbgValidator` klasi ili metodi
- Koristiti `ValidationErrorCodes.Invalid Jmbg*` konstante

---

## 4. Porezni broj

**BiH format:** 13 cifara (numerički)  
Primjer: `4200123456789`

**Pravila:**
1. Obavezno polje ako je relevantno — `REQUIRED_TAX_NUMBER`
2. Trimovati unos
3. Ukloniti razmake (`ISearchNormalizer.NormalizeIdentifier` zadržava samo cifre)
4. Nakon normalizacije: mora imati tačno 13 cifara — `INVALID_TAX_NUMBER_LENGTH`
5. Smije sadržavati samo cifre — `INVALID_TAX_NUMBER_DIGITS_ONLY`
6. TODO: definisati ako postoji format provjera (prefiks `42` za BiH)

**Korisnička poruka primjeri:**

| Situacija | Poruka |
|---|---|
| Obavezno, prazno | "Porezni broj je obavezan." |
| Pogrešan format | "Porezni broj nije u ispravnom formatu." |
| Nije 13 cifara | "Porezni broj mora sadržavati 13 cifara." |
| Sadrži slova | "Porezni broj smije sadržavati samo brojeve." |

**Napomena za implementatora (Hamza):**
- Koristiti `ValidationErrorCodes.InvalidTaxNumber*` konstante

---

## 5. Nedozvoljen unos

**Pravila:**
- Odbiti unos koji sadrži znakove koji nisu dozvoljeni za dato polje
- Primjer: SQL injection pokušaj, HTML, script tagovi u tekstualnom polju
- Backend mora sanitizovati unos prije obrade
- Frontend ne smije slati specijalne znakove koji nisu dozvoljeni

**Error code:** `INVALID_CHARACTERS` ili `INVALID_INPUT`

**Korisnička poruka:** `"Unos sadrži nedozvoljene znakove."`

---

## 6. Pogrešan format (generički)

Za polja koja imaju specifičan format (email, datum, broj) koristiti specifičan errorCode.

**Error code:** `INVALID_FORMAT`

**Korisnička poruka:** `"Unos nije u ispravnom formatu."`

---

## 7. Podrška za Š, Đ, Č, Ć, Ž (afrikate / bosanska slova)

**Pravila:**
- Sva tekstualna polja **moraju** prihvatiti `Š, Đ, Č, Ć, Ž` i ostala slova bosanskog pisma
- Backend ne smije odbaciti ova slova
- Frontend input komponente ne smiju blokirati ova slova
- Unicode normalizacija: `SearchNormalizer.NormalizeText()` koristi Unicode FormC → `ŠARIĆ` ostaje `ŠARIĆ` (ne pretvara u `SARIC`)
- `Š` ≠ `S`, `Đ` ≠ `D`, `Č` ≠ `C`, `Ć` ≠ `C`, `Ž` ≠ `Z` — ovo su različita slova

**Što ovo znači za pretragu:**
- "Šarić" i "šarić" → isti rezultat (**case-insensitive**)
- "Šarić" i "Saric" → RAZLIČITI rezultati (**diacritic-aware, ne accent-insensitive**)

**Greška:** nikad vraćati `UNSUPPORTED_CHARACTERS` za bosanska slova u tekstualnim poljima.

---

## 8. Case-insensitive unos i pretraga

**Pravila:**
- Pretraga ne zavisi od velikih/malih slova
- "Amina", "amina", "AMINA" → isti rezultat
- "Čović", "čović", "ČOVIĆ" → isti rezultat
- Implementirano putem `ISearchNormalizer.NormalizeText()`: `Trim → FormC → ToUpperInvariant`
- Normalized vrijednosti se čuvaju u `*_search` kolonama (npr. `name_search`)
- Frontend input se normalizuje prije slanja ili backend normalizuje primljeni term

**Nije accent-insensitive pretraga:**
- "Covic" i "Čović" su RAZLIČITI upiti → RAZLIČITI rezultati
- Ovo je namjerno — vidi `docs/backend/search-rules.md` sekcija 2

---

## 9. Dužina polja

**Pravila:**
- Svako polje mora imati definirani maksimum (database constraint + backend validation)
- Prekoračenje → `MAX_LENGTH_EXCEEDED`
- Minimum → `MIN_LENGTH_NOT_MET`
- Default maksimumi:
  - Kratka tekstualna polja: 100 znakova
  - Srednja tekstualna polja: 256 znakova
  - Dugačka tekstualna polja: 2000 znakova
  - TODO: Hamza definiše konkretne limite po entitetu

---

## 10. Business rules

| ID | Pravilo |
|---|---|
| BR-VALID-01 | Frontend validacija daje brz feedback korisniku |
| BR-VALID-02 | Backend validacija je autoritativna i ne smije se preskočiti |
| BR-VALID-03 | Obavezna polja ne smiju biti prazna, null ili whitespace |
| BR-VALID-04 | JMBG mora imati validan format (13 cifara, samo brojevi, validan datum) |
| BR-VALID-05 | Porezni broj mora imati validan format (13 cifara, samo brojevi) |
| BR-VALID-06 | Tekstualna polja moraju podržati Š, Đ, Č, Ć, Ž |
| BR-VALID-07 | Pretraga i unos koji se poredi ne smiju zavisiti od velikih/malih slova |
| BR-VALID-08 | Backend error response mora biti standardizovan (ProblemDetails + fieldErrors) |
| BR-VALID-09 | Greške vezane za polje vraćaju se kroz `fieldErrors` |
| BR-VALID-10 | Opšte greške forme prikazuju se kao pop-up/toast |
| BR-VALID-11 | Frontend ne smije izmišljati poslovna pravila mimo dokumentovanog contracta |
| BR-VALID-12 | Ako frontend validacija zakaže, backend mora vratiti grešku |

---

## 11. Edge caseovi

| ID | Scenarij | Očekivanje |
|---|---|---|
| EC-VALID-01 | Obavezno polje je null | `REQUIRED_FIELD` |
| EC-VALID-02 | Obavezno polje je prazan string | `REQUIRED_FIELD` |
| EC-VALID-03 | Obavezno polje sadrži samo razmake | `REQUIRED_FIELD` (backend trimuje) |
| EC-VALID-04 | Korisnik pritisne Tab na praznom obaveznom polju | Frontend prikazuje validaciju, ne dozvoljava tiho preskakanje |
| EC-VALID-05 | Korisnik pritisne Enter na praznom obaveznom polju | Frontend validira, submit ne prolazi |
| EC-VALID-06 | JMBG ima 12 cifara | `INVALID_JMBG_LENGTH` |
| EC-VALID-07 | JMBG ima 14 cifara | `INVALID_JMBG_LENGTH` |
| EC-VALID-08 | JMBG sadrži slovo (`"A301199012345"`) | `INVALID_JMBG_DIGITS_ONLY` |
| EC-VALID-09 | JMBG ima neispravan datum (`"9999999012345"`) | `INVALID_JMBG_DATE_PART` (ako datum validacija aktivna) |
| EC-VALID-10 | Porezni broj ima pogrešan format | `INVALID_TAX_NUMBER_FORMAT` |
| EC-VALID-11 | Tekstualno polje sadrži Š, Đ, Č, Ć ili Ž | Prihvaćeno bez greške |
| EC-VALID-12 | Search "Amina" i "amina" | Isti rezultat |
| EC-VALID-13 | Search "Čović" i "čović" | Isti rezultat |
| EC-VALID-14 | Frontend validacija zaobiđena direktnim API pozivom | Backend vraća 400 s fieldErrors |
| EC-VALID-15 | Backend vrati više fieldErrors | Frontend prikazuje greške po odgovarajućim poljima |
| EC-VALID-16 | Backend vrati grešku bez fieldErrors | Frontend prikazuje pop-up/toast |
| EC-VALID-17 | Unos nedozvoljenih specijalnih znakova | `INVALID_CHARACTERS` |
| EC-VALID-18 | Predug unos (npr. 1000 znakova u kratkom polju) | `MAX_LENGTH_EXCEEDED` |
