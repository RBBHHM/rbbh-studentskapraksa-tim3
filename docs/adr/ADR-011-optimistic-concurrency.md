# ADR-011: Selektivni optimistički concurrency

**Status:** Accepted  
**Kategorija:** B — Domen i poslovni model  
**Owner:** Arhitekta  
**Datum donošenja:** Novembar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako se identificira novi entitet s visokim rizikom od concurrent editova  
**Zahvaćeni moduli:** Domain (IConcurrencyAware), Infrastructure (EF Core mapping)  
**User Stories:** US-1 (CA/CO paralelni rad na istoj narudžbi), US-8 (TaskItem prihvatanje)

---

## Kontekst

Sistem ima šest tipova korisnika koji mogu istovremeno pregledati i mijenjati iste entitete. Konkretni scenariji s rizikom od concurrent izmjena:

1. CA i CO istovremeno mijenjaju `AppraisalOrder` (CA ažurira dokumentaciju, CO radi pristupnu provjeru)
2. Dva CA pokušavaju paralelno prihvatiti isti `TaskItem`

"Last write wins" tiha greška u bankarskom kontekstu nije prihvatljiva — gubitak promjene jednog aktera bez ikakve obavijesti je poslovni incident.

---

## Decision Drivers

- **Integritet podataka** — nije prihvatljivo da jedna promjena prećutno prepiše drugu
- **Throughput** — pesimistički lock (SELECT FOR UPDATE) blokira sve čitaoce; to je neprihvatljivo za sistem koji ima više paralelnih korisnika
- **Selektivnost** — ne trebaju svi entiteti zaštitu od concurrent izmjena; pretjerana zaštita uvodi nepotreban overhead

---

## Odluka

Interfejs `IConcurrencyAware` markira entitete koji trebaju zaštitu:

```csharp
public interface IConcurrencyAware
{
    uint RowVersion { get; }
}
```

`AppraisalOrder` i `TaskItem` implementiraju `IConcurrencyAware`. EF Core mapira `RowVersion` na PostgreSQL sistem kolonu `xmin` (automatski inkrementiranu pri svakom UPDATE-u — bez aplikacijske intervencije):

```csharp
builder.Property(x => x.RowVersion)
    .HasColumnName("xmin")
    .HasColumnType("xid")
    .IsRowVersion();
```

Pri UPDATE-u koji vrši korisnik koji je učitao stariju verziju entiteta, EF Core baca `DbUpdateConcurrencyException` → mappiran na HTTP 409 s porukom "Entitet je izmijenjen od drugog korisnika."

### Zašto samo AppraisalOrder i TaskItem

Ovi entiteti imaju identificirani pattern concurrent modificiranja u normalnom radu sistema. Ostali entiteti (Appraiser, CodebookValue, Branch) mijenja isključivo administrator kroz namjenski UI, gdje su paralelne izmjene rijetke i organizacijski kontrolisane.

---

## Alternativna rješenja

| Opcija | Throughput | Deadlock rizik | Granularnost | Zašto nije izabrana |
|--------|-----------|---------------|-------------|---------------------|
| **Optimistički (selektivno)** ✓ | Visok | Nema | Per-entitet | — |
| Pesimistički (SELECT FOR UPDATE) | Nizak (blokira čitaoce) | Moguć | Globalni | Neprihvatljivo kašnjenje za sistem s paralelnim korisnicima; risk deadlocka pri kompleksnim transakcijama |
| Last write wins (bez zaštite) | Maksimalan | Nema | — | Tihi gubitak promjena je neprihvatljiv u bankarskom kontekstu |
| EF Core Timestamp/byte[] RowVersion | Visok | Nema | Per-entitet | PostgreSQL xmin je elegantnije rješenje jer ne zahtijeva posebnu kolonu |

---

## Consequences

### Pozitivne
- Korisnik koji pokuša sačuvati zastarjele podatke dobiva razumljivu poruku — nema tihog gubitka promjena
- PostgreSQL `xmin` je sistem kolona koja se automatski ažurira bez aplikacijske logike
- Throughput nije ugrožen — čitanje ne blokira ni jednog korisnika

### Negativne
- Korisnik koji dobiva 409 mora osvježiti stranicu i ponovo unijeti promjene — loš UX pri čestim conflict-ima
- `xmin` je PostgreSQL-specifičan — zamjena baze podataka zahtijeva drugačiji mehanizam RowVersion-a
- U Blazor Server kontekstu, refresh stranice može biti zbunjujuć za korisnika koji nije naviknut na optimistički concurrency koncept

### Svjesno prihvaćeni kompromisi
- Prihvatamo da korisnik mora ponoviti unos pri conflict-u kao cijenu za throughput bez pesimističkih lockova. U praksi, conflict scenariji su rijetki — CA i CO tipično rade na različitim aspektima iste narudžbe u različitim fazama workflowa.

---

## Tehnički dug

- Nema automatizovanog ponovnog pokušaja (retry) pri `DbUpdateConcurrencyException` — svaki servis mora rukovati izuzetkom i baciti ga prema UI-u
- UI ne nudi mogućnost "merge" dviju verzija — korisnik gubi sve neunesene promjene pri conflict-u

---

## Migration Impact

- **Breaking Changes:** `xmin` je PostgreSQL sistem kolona — kompatibilan s EF Core PostgreSQL provajderom bez migracije
- **Rollback Plan:** `IConcurrencyAware` marker može biti uklonjen bez DB migracije
- **Compatibility:** Nije primjenjivo van PostgreSQL okruženja

---

## Kada revidirati

- Korisnici izvještavaju o čestim 409 grešakama — to signalizira da je UX pattern za optimistički concurrency neadekvatan za taj use case
- Identificira se novi entitet s visokim rizikom od concurrent izmjena (npr. ako se uvede zajednički kanban board)
- Migracija na drugu bazu podataka koja nema ekvivalent za `xmin`
