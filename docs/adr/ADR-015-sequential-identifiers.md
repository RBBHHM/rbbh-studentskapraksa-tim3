# ADR-015: Atomičnost sekvencijalnih poslovnih identifikatora

**Status:** Accepted · ⚠ Djelimično (ORDER NUMBER kritičan — vidi dole)  
**Kategorija:** B — Domen i poslovni model  
**Owner:** Arhitekta  
**Datum donošenja:** Oktobar 2025 (protokolni broj) · Januar 2026 (order number — problem identificiran)  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Odmah — order number generator mora biti migriran na atomsku implementaciju  
**Zahvaćeni moduli:** Domain, Infrastructure (OrderNumberGenerator, ProtocolService)  
**User Stories:** US-1 (kreiranje narudžbe — order number), Protokol (protokolni broj)

---

## Kontekst

Sistem generira dvije vrste sekvencijalnih poslovnih identifikatora:

1. **Protokolni broj** — format `[YYYY]/[NNNN]`, jedinstven po godini. Kršenje jedinstvenosti direktno narušava bankarski protokolni registar — regulatorni incident.
2. **Broj narudžbe** — format `ORD-YYYY-NNNNNN`, jedinstven po godini. Kršenje jedinstvenosti uzrokuje konfuziju u operativnom radu.

Oba identifikatora imaju godišnji reset sekvence.

---

## Decision Drivers

- **Atomičnost** — race condition između dva simultana INSERT-a mora biti nemoguća
- **Jedinstvenost** — duplirani protokolni ili redni broj narudžbe je bankarski incident
- **Godišnji reset** — sekvenca počinje od 1 svake nove poslovne godine
- **Bez vanjskih zavisnosti** — rješenje mora raditi unutar PostgreSQL-a bez posebnog sekvencijskog servisa

---

## Odluka

### Protokolni broj — RIJEŠENO ✓

PostgreSQL atomski `UPSERT RETURNING` na tabeli `protocol_year_counters`:

```sql
INSERT INTO protocol_year_counters (year, last_sequence) VALUES (@year, 1)
ON CONFLICT (year)
DO UPDATE SET last_sequence = protocol_year_counters.last_sequence + 1
RETURNING last_sequence
```

Ovo je **atomska operacija** — PostgreSQL garantuje da dva simultana poziva ne mogu dobiti isti `last_sequence`. Godišnji reset je automatski (UPSERT za novu godinu kreira novi zapis od 1).

### Broj narudžbe — ⚠ KRITIČAN PROBLEM

`OrderNumberGenerator` trenutno koristi:

```csharp
var count = await _db.AppraisalOrders.CountAsync(x => x.CreatedAt.Year == year, ct);
return $"ORD-{year}-{count + 1:D6}";
```

**Ovo nije atomično.** Dva simultana poziva mogu pročitati isti COUNT i generirati isti broj narudžbe. Ista greška zbog koje je protokolni broj migriran na UPSERT.

**Planirana ispravka** (prema redoslijedu prioriteta u README):
```sql
INSERT INTO order_number_counters (year, last_sequence) VALUES (@year, 1)
ON CONFLICT (year)
DO UPDATE SET last_sequence = order_number_counters.last_sequence + 1
RETURNING last_sequence
```

---

## Alternativna rješenja

| Opcija | Atomičnost | Godišnji reset | Bez vanjske inf. | Zašto nije izabrana / status |
|--------|-----------|---------------|-----------------|------------------------------|
| **PostgreSQL UPSERT RETURNING** ✓ | ✓ Garantovana | ✓ Auto | ✓ | Implementirano za protokolni broj; isti pattern treba za order number |
| COUNT(*) + 1 | ✗ Race condition | ✓ | ✓ | Korišćeno za order number — kritični bug |
| PostgreSQL SEQUENCE | ✓ | Zahtijeva ručni reset | ✓ | Godišnji reset nije podržan nativno — treba scheduler; UPSERT pattern je elegantniji |
| Redis INCR | ✓ | Zahtijeva ručni reset + Redis setup | ✗ | Uvodi Redis zavisnost za problem koji PostgreSQL može riješiti |

---

## Consequences

### Pozitivne (protokolni broj)
- Protokolni broj je garantovano jedinstven čak i pri paralelnim zahtjevima
- Godišnji reset je automatski — nema potrebe za job-om koji resetuje sekvencu

### Negativne
- Duplirani broj narudžbe moguć je pri paralelnim INSERT-ovima dok ORDER NUMBER nije migriran — ovo je aktivan bug, ne hipotetički rizik
- PostgreSQL unique constraint na `order_number` koloni bi uhvatio duplikat, ali bi vratio DB grešku umjesto poslovne greške

### Svjesno prihvaćeni kompromisi
- UPSERT pattern veže nas za PostgreSQL semantiku (ON CONFLICT DO UPDATE). Prihvatljivo — baza je PostgreSQL i nema planova za promjenu.

---

## Tehnički dug

🔴 **KRITIČNO**: `OrderNumberGenerator` mora biti migriran na UPSERT pattern identičan protokolnom brojaču. Prioritet: viši od svih ostalih tehničkih dugova.

Koraci migracije:
1. Kreirati tabelu `order_number_counters (year INT PK, last_sequence INT NOT NULL)`
2. Popuniti s trenutnim maksimalnim brojevima po godini iz aktivnih narudžbi
3. Zamijeniti COUNT(*) implementaciju u `OrderNumberGenerator` s UPSERT
4. Dodati unique constraint na `AppraisalOrder.OrderNumber`

---

## Migration Impact

- **Breaking Changes:** Nema za korisnike — format `ORD-YYYY-NNNNNN` ostaje isti
- **Rollback Plan:** Nova tabela `order_number_counters` može biti napuštena; COUNT(*) može biti vraćen bez gubitka podataka (ali problem ostaje)
- **Compatibility:** InMemory DbContext u testovima ne podržava raw SQL UPSERT — `InMemoryOrderNumberGenerator` ostaje u `WebApplicationFactory`

---

## Kada revidirati

- Odmah — migracija order number generatora je kritični prioritet
- Po završetku migracije: ovaj ADR treba ažurirati na "Fully Resolved" status
