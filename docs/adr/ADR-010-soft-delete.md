# ADR-010: Soft delete s audit trail poljem

**Status:** Accepted  
**Kategorija:** B — Domen i poslovni model  
**Owner:** Arhitekta / Compliance Engineer  
**Datum donošenja:** Oktobar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako veličina tablica postane mjerljiv performance problem ili ako se uvede arhivacijska procedura  
**Zahvaćeni moduli:** Domain (BaseEntity), Infrastructure (EF query filteri), svi entiteti  
**User Stories:** Sve — primjenjuje se na narudžbe, šifarnike, vještake, dokumente

---

## Kontekst

Bankarska interna politika zahtijeva zadržavanje svih zapisa — fizičko brisanje podataka nije dozvoljeno za poslovne entitete koji su bili dio aktivnih procesa. Zapisi moraju biti dostupni za regulatornu reviziju i historijsku analizu.

Istovremeno, "obrisani" zapisi ne smiju se pojavljivati u normalnim poslovnim upitima (lista aktivnih narudžbi, dropdown šifarnika, pregled vještaka).

---

## Decision Drivers

- **Regulatorna usklađenost** — bankarska politika zabranjuje fizičko brisanje poslovnih zapisa
- **Historijska rekonstrukcija** — svaki zapis mora biti dostupan za revizionu analizu "šta je sistem vidio u trenutku T"
- **Transparentnost** — ko je, kada i iz kojeg razloga "obrisao" entitet mora biti vidljivo
- **Jednostavnost upita** — aktivni zapisi trebaju biti vidljivi bez eksplicitnog filtriranja po IsDeleted u svakom upitu

---

## Odluka

Svi poslovni entiteti nasljeđuju `BaseEntity` koji sadrži soft delete polja:

```csharp
public abstract class BaseEntity
{
    public int Id { get; protected set; }
    public DateTime CreatedAt { get; protected set; }
    public DateTime UpdatedAt { get; protected set; }
    public bool IsDeleted { get; protected set; }
    public DateTime? DeletedAt { get; protected set; }
    public string? DeletedByUserId { get; protected set; }

    public void SoftDelete(string userId, DateTime now)
    {
        IsDeleted = true;
        DeletedAt = now;
        DeletedByUserId = userId;
        SetUpdatedAt(now);
    }
}
```

**EF Core globalni query filtar** automatski isključuje soft-deleted zapise iz svih standardnih upita:
```csharp
builder.HasQueryFilter(x => !x.IsDeleted);
```

Child entiteti (TaskItem, OrderProtocolEntry) bez vlastite `IsDeleted` kolone filtriraju se kroz navigacijski property parent-a:
```csharp
builder.HasQueryFilter(x => x.AppraisalOrder == null || !x.AppraisalOrder.IsDeleted);
```

**Filtered unique index**: Entiteti s unique constraint-om (npr. Codebook.Key) koriste PostgreSQL filtered unique index koji ignorira soft-deleted zapise, dozvoljavajući kreiranje novog zapisa s istim ključem:
```sql
CREATE UNIQUE INDEX ix_codebooks_key ON codebooks(key) WHERE deleted_at IS NULL;
```

**Poseban slučaj — šifarnici**: Zastarjeli šifarnik može biti "deaktiviran" (IsActive = false) ili "obrisan" (IsDeleted = true). Deaktivacija se koristi kada je šifarnik korišten u narudžbama (historijska vrijednost ostaje vidljiva); fizičko brisanje je dozvoljeno samo ako je šifarnik nikad nije korišten.

---

## Alternativna rješenja

| Opcija | Historija | Regulatorna usklađenost | DB overhead | Upit jednostavnost | Zašto nije izabrana |
|--------|-----------|------------------------|-------------|-------------------|---------------------|
| **Soft delete (IsDeleted)** ✓ | ✓ Potpuna | ✓ | Tablice rastu | ✓ (query filtar) | — |
| Hard delete + arhivska tablica | ✓ | ✓ | Nema u primary tablicama | Srednja (INSERT u arhivu + DELETE) | Aplikacijska logika mora upravljati arhivskim tablicama; arhivne tablice imaju drugačiju strukturu od aktivnih |
| Fizičko brisanje | ✗ | ✗ Direktno krši politiku | Nema | ✓ | Nedopustivo |
| Event sourcing (nikad ne brišeš) | ✓ | ✓ | Visok (full event log) | ✗ (složena rekonstrukcija) | Prevelika kompleksnost za ovaj opseg |

---

## Consequences

### Pozitivne
- EF Core globalni query filtar eliminira potrebu za eksplicitnim `WHERE IsDeleted = false` u svakom upitu — greška propuštanja nije moguća
- Ko je, kada i zbog čega "obrisao" entitet je vidljivo direktno na entitetu bez pretraživanja audit loga
- Soft-deleted entiteti dostupni su za regulatorne upite kroz `IgnoreQueryFilters()`

### Negativne
- Poslovne tablice rastu bez gornje granice — narudžbe, dokumenti i šifarnici se nikad ne brišu fizički. Za sistem s godišnjim volumenom od npr. 5000 narudžbi, ovo rezultira u ~50 000 zapisa u 10 godina — prihvatljivo za PostgreSQL, ali treba biti praćeno.
- Indeksi na tablicama s velikim brojem soft-deleted zapisa postaju manje efikasni jer B-tree indeks sadrži i obrisane zapise (filtered index rješava ovo za unique constraints ali ne za sve indekse)
- JOIN upiti koji kombinuju narudžbu s child entitetima moraju biti pažljivi s `IgnoreQueryFilters()` — može slučajno prikazati soft-deleted child entitete

### Svjesno prihvaćeni kompromisi
- Prihvatamo rast tablica i potencijalni budući performance problem kao cijenu regulatorne usklađenosti. PostgreSQL je sposoban efikasno upravljati tablicama s milionima zapisa uz properly indexirane upite; ovo postaje problem tek na ekstremnim volumenima koji su iznad predviđenog opsega ovog sistema.

---

## Tehnički dug

- Nema planiranih procedura arhiviranja starih soft-deleted zapisa u zasebne arhivske tablice ili cold storage
- Monitoring rasta tablica nije implementiran — nema upozorenja kada soft-deleted zapisi pređu određeni udio ukupnih zapisa

---

## Migration Impact

- **Breaking Changes:** Promjena sa soft delete na hard delete bi bila regulatorno neprihvatljiva
- **Rollback Plan:** Nije primjenjivo — ovo je jednosmjerna politika definirana regulatornim zahtjevima
- **Compatibility:** Svi EF Core upiti koji koriste `IgnoreQueryFilters()` moraju biti pregledani pri svakoj promjeni soft delete logike

---

## Kada revidirati

- Ukupna veličina baze podataka premaši prihvatljive granice s obzirom na storage kapacitete
- PostgreSQL query performance analyzer pokaže da soft-deleted zapisi uzrokuju mjerljivo usporavanje u kritičnim upitima
- Regulatorna politika promijeni zahtjeve (npr. dozvoljeno arhiviranje starijih od 10 godina)
