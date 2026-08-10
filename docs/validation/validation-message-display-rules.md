# Pravila prikaza validacijskih poruka — Inline vs Pop-up/Toast

Ovaj dokument definiše kada i kako se prikazuju validacijske poruke korisniku.
Frontend tim implementira prema ovim pravilima. Backend mora vraćati odgovore
koji podržavaju oba tipa prikaza.

---

## 1. Pregled tipova prikaza

| Tip | Kada | Gdje | Trajanje |
|---|---|---|---|
| **Inline poruka** | Field-level greška | Uz polje na formi | Dok korisnik ne ispravi |
| **Pop-up / Toast** | Opšta greška forme, server greška | Gornji desni ugao ili vrh strane | 5–8 sekundi ili dok korisnik ne zatvori |

---

## 2. Inline poruke (field-level)

### Kada prikazati inline poruku

- `onBlur` — korisnik napusti polje (Tab, klik drugdje)
- `onSubmit` — sva obavezna polja se validiraju pri pokušaju submit-a
- Backend vrati `fieldErrors[]` — prikazati za svaki field navedeno u arrayu

### Gdje prikazati inline poruku

- Direktno **ispod polja** na koje se odnosi
- Crvena boja teksta (CSS klasa `field-error` ili `is-invalid`)
- `aria-invalid="true"` na input elementu
- `aria-describedby` koji pokazuje na element s porukom

### Šta prikazati

- Koristiti `message` iz `fieldErrors[].message` kada greška dođe s backenda
- Koristiti lokalno definirane poruke za frontend-only validaciju (iste poruke iz `validation-rules.md`)
- **Nikad prikazivati `code` vrijednost korisniku** — `code` je za logove i mapiranje

### Kada ukloniti inline poruku

- Kada korisnik počne kucati u polju (`onChange`) — ukloniti grešku
- Kada polje prođe validaciju — ukloniti grešku
- Ne uklanjati na `onFocus` — korisnik treba vidjeti grešku dok je u polju

### Primjer prikaza

```
[ Ime i prezime         ]
  Ovo polje je obavezno.   ← crveni tekst ispod polja

[ JMBG                  ]
  JMBG mora sadržavati tačno 13 cifara.   ← crveni tekst ispod polja
```

---

## 3. Pop-up / Toast poruke

### Kada prikazati toast

- **Backend vrati 400 bez `fieldErrors`** — koristiti `detail` polje
- **Backend vrati 500** — prikazati generičku poruku ("Došlo je do greške. Pokušajte ponovo.")
- **Mrežna greška** — "Nije moguće uspostaviti vezu. Provjerite internet vezu."
- **Opoziv prava / Forbidden 403** — "Nemate pravo izvršiti ovu akciju."
- **Sesija istekla / 401** — preusmjeriti na login (ne toast)

### Šta prikazati u toast-u

- Koristiti `detail` polje iz ProblemDetails odgovora
- Ako `detail` nije prisutan: koristiti default poruku prema HTTP kodu

| HTTP status | Default poruka |
|---|---|
| 400 (bez fieldErrors) | "Unos nije ispravan. Provjerite unesene podatke." |
| 403 | "Nemate pravo izvršiti ovu akciju." |
| 404 | "Tražena stavka nije pronađena." |
| 409 | "Akcija nije moguća zbog konflikta s postojećim podacima." |
| 500 | "Došlo je do greške na serveru. Pokušajte ponovo." |
| Network error | "Nije moguće uspostaviti vezu. Provjerite internet vezu." |

### Kada ne prikazivati toast

- Kada postoje `fieldErrors` — koristiti inline prikaz, ne toast
- Kada je 401 — preusmjeriti direktno na login bez toast-a

---

## 4. Pravilo odluke: inline ili toast?

```
Backend odgovor:
  ├─ 400 + fieldErrors[] neprazno
  │    → Prikaži inline poruke uz odgovarajuća polja
  │    → NE prikazuj toast
  │
  ├─ 400 + fieldErrors[] prazno ili odsutno
  │    → Prikaži toast s detail porukom
  │
  ├─ 403 Forbidden
  │    → Prikaži toast ("Nemate pravo...")
  │
  ├─ 404 Not Found
  │    → Prikaži toast ili inline (ovisno o kontekstu — lookup polje vs stranica)
  │
  ├─ 409 Conflict
  │    → Prikaži toast s detail porukom
  │
  ├─ 500 Internal Server Error
  │    → Prikaži toast s generičkom porukom (ne prikazivati detalje greške)
  │
  └─ Network error / Timeout
       → Prikaži toast s porukom o konekciji
```

---

## 5. Mapiranje `fieldErrors[].field` na form element

Frontend traži element po `field` vrijednosti iz backenda.

### Strategija mapiranja

```
fieldErrors[].field = "jmbg"
  → document.getElementById("jmbg") ili querySelector("[name='jmbg']")
  → Prikaži message uz taj element

fieldErrors[].field = "ime"
  → querySelector("[name='ime']") 
  → Prikaži message uz taj element

Ako element nije pronađen za dati field:
  → Sakupiti sve neMapirane poruke
  → Prikazati ih kao toast ili u summary bloku na vrhu forme
```

### Napomena o camelCase

Polje `field` uvijek dolazi u `camelCase` formatu (npr. `"poreznibroj"`, `"jmbg"`, `"ime"`).
HTML atributi `name` i `id` moraju koristiti iste nazive za ispravno mapiranje.

---

## 6. Tab / Enter ponašanje pri validaciji

| Akcija | Ponašanje |
|---|---|
| Tab na praznom obaveznom polju | Prikazuje inline grešku, fokus prelazi na sljedeće polje |
| Enter na praznom obaveznom polju | Validira sva polja, prikazuje greške, submit **ne prolazi** |
| Enter na ispravno popunjenoj formi | Submit se izvršava normalno |
| Tab / Enter na nevalidnom JMBG polju | Prikazuje inline grešku odmah |

Pravilo: **Tab ne smije tiho preskočiti obavezno prazno polje** bez prikaza greške.

---

## 7. Više fieldErrors istovremeno

Kada backend vrati više grešaka:
- Prikazati **sve inline poruke** za sva polja odjednom
- Ne prikazivati jednu po jednu greška
- Fokus postaviti na **prvo polje s greškom** (po redu u DOM-u, ne po redu u `fieldErrors[]`)

```json
{
  "fieldErrors": [
    { "field": "jmbg", "code": "INVALID_JMBG_LENGTH", "message": "JMBG mora sadržavati tačno 13 cifara." },
    { "field": "ime",  "code": "REQUIRED_FIELD",       "message": "Ovo polje je obavezno." }
  ]
}
```
→ Oba polja dobijaju inline grešku istovremeno.

---

## 8. Trajanje i zatvaranje toast-a

| Tip greške | Trajanje | Može se zatvoriti |
|---|---|---|
| Uspješna akcija (success) | 3–5 sekundi, auto-zatvori | Da |
| Upozorenje (warning) | 5–8 sekundi, auto-zatvori | Da |
| Greška (error) | Ostaje dok korisnik ne zatvori | Da (X dugme) |
| Mrežna greška | Ostaje dok korisnik ne zatvori | Da (X dugme) |

---

## 9. Business rules za prikaz poruka

| ID | Pravilo |
|---|---|
| BR-DISP-01 | Inline poruka se prikazuje `onBlur` — brz feedback |
| BR-DISP-02 | Toast se prikazuje za opšte greške — ne za field greške |
| BR-DISP-03 | `fieldErrors[].code` se nikad ne prikazuje korisniku |
| BR-DISP-04 | `fieldErrors[].message` je jedina poruka koja se prikazuje uz polje |
| BR-DISP-05 | Za 500 greške: prikazati generičku poruku, **ne** detalje iz servera |
| BR-DISP-06 | Za 401: preusmjeriti na login bez toast-a |
| BR-DISP-07 | Sve fieldErrors iz jednog odgovora se prikazuju istovremeno |
| BR-DISP-08 | Fokus se postavlja na prvo polje s greškom |
| BR-DISP-09 | Error toast ostaje dok korisnik ne zatvori |
| BR-DISP-10 | Inline greška se uklanja čim korisnik počne kucati (`onChange`) |

---

## 10. Edge caseovi prikaza

| ID | Scenarij | Očekivanje |
|---|---|---|
| EC-DISP-01 | Backend vrati fieldErrors za nepostojeće polje u DOM-u | Greška ide u summary blok ili toast |
| EC-DISP-02 | Backend vrati 5+ fieldErrors | Sve prikazati istovremeno |
| EC-DISP-03 | Korisnik submituje bez ijednog unosa | Sva obavezna polja dobijaju inline grešku |
| EC-DISP-04 | Backend vrati 500 s HTML body-jem | Frontend prikazuje generičku poruku, ne HTML |
| EC-DISP-05 | Timeout (fetch ne dobije odgovor) | Toast: "Nije moguće uspostaviti vezu" |
| EC-DISP-06 | Korisnik ispravi polje pa ponovo pogriješi | Greška se uklanja pri kucanju, pa se ponovo prikazuje `onBlur` |
| EC-DISP-07 | Forma ima disabled polja s greškom | Inline greška prikazana, ali korisnik ne može editovati |
| EC-DISP-08 | Submit u toku (loading state) | Dugme disabled, greška nakon odgovora |
