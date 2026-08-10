# ADR-028: Dvofazni import šifarnika s preview tokenom

**Status:** Accepted  
**Kategorija:** E — Servisna arhitektura  
**Owner:** Arhitekta  
**Datum donošenja:** Januar 2026  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako se uvede multi-node deployment (tada in-memory token treba Redis externalizaciju)  
**Zahvaćeni moduli:** Application (import logika), Infrastructure, BlazorApp (ImportExportDialog)  
**User Stories:** US-3 (administratorski import šifarnika iz Excel fajla)

---

## Kontekst

Administrator importuje šifarnike iz Excel fajla. Greška pri importu (duplikati, neispravni podaci) koja se propagira direktno u bazu bez provjere može korumpirati šifarnike koji se koriste u stotinama aktivnih narudžbi.

Alternativa — dry-run s rollback-om — zahtijeva otvorenu transakciju tokom dok administrator pregleda preview, što može trajati minutama. Dugotrajne otvorene transakcije blokiraju PostgreSQL VACUUM i uzrokuju lock contention.

---

## Decision Drivers

- **Sigurnost importa** — administrator mora vidjeti što će biti promijenjeno prije commita
- **Bez dugotrajnih transakcija** — preview ne smije blokirati VACUUM procesom baze podataka
- **Atomičnost faze 2** — commit mora biti kompletan ili ne; parcijalni import nije prihvatljiv

---

## Odluka

**Dvofazni import**:

**Faza 1 — Preview (bez DB promjena)**:
```
Upload Excel → Parse + Validacija + Klasifikacija (New | Update | Unchanged | Error)
     ↓
Rezultati pohranjeni u IMemoryCache s Guid tokenom (15 min TTL)
     ↓
Korisniku se prikazuje diff (šta će biti dodato/ažurirano/preskočeno)
```

**Faza 2 — Confirm (s tokenom)**:
```
Korisnik potvrdi (šalje token)
     ↓
Token dohvaćen iz IMemoryCache → validacija da nije istekao
     ↓
Import izvršen u jednoj DB transakciji
     ↓
Token obrisan
```

Token je `Guid`, a pohranjeni podaci su `ImportPreviewResultDto` s kompletnom klasifikacijom svakog reda. Faza 2 koristi pohranjene klasifikacione rezultate — ne ponavlja validaciju.

---

## Alternativna rješenja

| Opcija | Korisnik vidi diff | Otvorena transakcija | Faza 2 bez ponovne validacije | Zašto nije izabrana |
|--------|-------------------|---------------------|------------------------------|---------------------|
| **Dvofazni import s tokenom** ✓ | ✓ | ✗ | ✓ | — |
| Import s rollback (dry-run) | ✓ | ✓ Blokirajuća | ✗ (ponovi validaciju) | PostgreSQL VACUUM blokiran pri dugotrajnim transakcijama |
| Dry-run flag (validacija bez DB) | ✓ | ✗ | ✗ | Faza 2 mora ponoviti validaciju; ne možemo garantovati konzistentnost između preview i commit-a |
| Import bez preview | ✗ | ✗ | — | Neprihvatljivo za administratora koji nema uvid u promjene |

---

## Consequences

### Pozitivne
- Administrator vidi kompletni diff (NEW, UPDATE, UNCHANGED, ERROR) po redu Excel fajla
- Nema dugotrajnih transakcija — baza je slobodna za VACUUM tokom preview perioda
- Faza 2 koristi pohranjene rezultate — konzistentna s onim što je korisnik vidio u preview-u

### Negativne
- In-memory token nije dostupan u multi-node deployment-u — svaki API node ima vlastiti IMemoryCache; request za Fazu 2 mora stići na isti node kao Faza 1 (sticky session issue)
- 15-min TTL — ako korisnik kasni s konfirmacijom, token istekne i mora početi iznova
- IMemoryCache nije durabilna — restart API-ja u toku 15-min preview prozora briše token

### Svjesno prihvaćeni kompromisi
- Prihvatamo in-memory token za single-node deployment kao prihvatljiv kompromis. Multi-node deployment zahtijeva externalizaciju tokena u Redis. Import šifarnika je rijetka administratorska operacija, ne high-frequency user flow.

---

## Tehnički dug

- Multi-node deployment zahtijeva `IDistributedCache` (Redis) umjesto `IMemoryCache` za token storage
- Nema monitorizacije "zaostalih" tokena koji nikad nisu konfirmirani (IMemoryCache ih automatski čisti)

---

## Migration Impact

- **Breaking Changes:** Promjena token store-a iz IMemoryCache u Redis je infrastrukturna; API kontrakt (Faza 1 + Faza 2 sa tokenom) ostaje isti
- **Rollback Plan:** Implementacija može biti zamijenjena bez promjene API ugovora
- **Compatibility:** Nema

---

## Kada revidirati

- Planiranje multi-node API deploya — IMemoryCache mora biti zamijenjen s Redis-om
- 15-min TTL se pokaže prekratak za administratore koji pregledaju veliki import
