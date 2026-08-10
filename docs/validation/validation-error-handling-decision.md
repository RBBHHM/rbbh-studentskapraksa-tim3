# Decision Dokument: Pristup Validacijama i Error Porukama

## 1. Problem

Sistem mora prikazivati jasne korisničke poruke o greškama (pogrešan JMBG, pogrešan porezni broj, obavezno polje, nedozvoljen unos, pogrešan format). Poruke moraju se pojaviti odmah pri napuštanju polja. Backend mora ostati autoritativni sloj koji odbija neispravne podatke čak i ako frontend validacija zakaže ili se zaobiđe.

---

## 2. Ciljevi

| Cilj | Prioritet |
|---|---|
| Brza korisnička povratna informacija (inline/onBlur) | Visok |
| Backend sigurnost — odbijanje nevalidnih podataka | Visok |
| Konzistentne poruke na frontend i backend nivou | Visok |
| Stabilan errorCode standard (ne mijenja se) | Visok |
| Podrška za frontend, backend i QA (isti izvor istine) | Visok |
| Izbjegavanje dupliranja validacijskih pravila | Srednji |
| Lakše održavanje | Srednji |

---

## 3. Razmatrane opcije

### Opcija A — Samo frontend validacija

Frontend sam validira polja i prikazuje poruke. Backend ne validira.

**Prednosti:**
- Brz feedback korisniku
- Manje backend koda

**Mane:**
- Ozbiljna sigurnosna rupa — API se može pozvati direktno mimo frontend-a
- Lako se zaobilazi DevTools-ima ili Postmanom
- Backend prima nevalidne podatke
- Nije prihvatljivo za poslovnu aplikaciju koja rukuje JMBG-om i poreznim brojevima

---

### Opcija B — Samo backend validacija

Sva validacija je na backendu. Frontend prikazuje greške samo nakon submit-a.

**Prednosti:**
- Siguran
- Jedan izvor istine

**Mane:**
- Loš UX — korisnik grešku vidi tek kad pošalje formu
- Ne ispunjava kriterij "odmah pri napuštanju polja"
- Ne ispunjava kriterij "Tab/Enter ne može preskočiti obavezno prazno polje"

---

### Opcija C — Frontend + backend validacija sa zajedničkim error contractom ✅ (IZABRANA)

Frontend validira za brz feedback. Backend ponovo validira sve kao autoritativni sloj. Oba sloja koriste iste errorCode vrijednosti i iste poruke iz zajedničke dokumentacije.

**Prednosti:**
- Najbolji UX (inline poruke odmah pri napuštanju polja)
- Backend ostaje siguran i autoritativan
- Frontend i backend koriste iste errorCode vrijednosti
- QA testira oba nivoa konzistentno
- Jasan izvor istine

**Mane:**
- Pravila se moraju dokumentovati i ne smiju se razilaziti između slojeva
- Zahtijeva dogovoreni standardni backend error response

---

## 4. Decision matrix

| Opcija | UX brzina | Sigurnost | Održavanje | Konzistentnost | Ispunjava kriterije | Složenost | Preporuka |
|---|:---:|:---:|:---:|:---:|:---:|:---:|---|
| Samo frontend | 5 | 1 | 2 | 2 | 2 | 1 | Ne |
| Samo backend | 2 | 5 | 4 | 4 | 2 | 1 | Djelimično |
| **Frontend + backend + contract** | **5** | **5** | **4** | **5** | **5** | **3** | **Da** |

---

## 5. Konačna odluka

**Za ovaj user story bira se kombinovani pristup:** frontend validacija za brz feedback korisniku, backend validacija kao autoritativna sigurnosna provjera, i zajednički standardizovani backend error response contract koji frontend koristi za prikaz inline i pop-up poruka.

---

## 6. Posljedice odluke

| Posljedica | Napomena |
|---|---|
| Backend mora imati stabilne errorCode vrijednosti | Definisano u `ValidationErrorCodes.cs` |
| Frontend mora mapirati errorCode na prikaz poruke | Npr. `INVALID_JMBG_FORMAT` → tooltip uz polje |
| QA testira oba nivoa | Oba moraju odbiti neispravne podatke |
| Dokumentacija je izvor istine | `validation-rules.md` + `validation-error-contract.md` |
| Greška u jednom sloju ne znači greška u drugom | Frontend može biti brži ali backend je autoritativan |

---

## 7. Veza s postojećim rješenjima

| Komponenta | Status | Napomena |
|---|---|---|
| `ValidationException` | ✅ Postoji + dopunjen | Dodato `FieldErrors` s `ValidationFieldError` |
| `GlobalExceptionHandler` | ✅ Postoji + dopunjen | Dodato `fieldErrors` + `correlationId` |
| `ValidationFieldError` | ✅ Kreiran | `Field`, `Code`, `Message` |
| `ValidationErrorCodes` | ✅ Kreiran | Centralizovani error code konstante |
| `SearchNormalizer` | ✅ Postoji | Case-insensitive + diacritic-aware |
| JMBG validator | ⏳ TODO Hamza | Pravila u `validation-rules.md` |
| Porezni broj validator | ⏳ TODO Hamza | Pravila u `validation-rules.md` |
