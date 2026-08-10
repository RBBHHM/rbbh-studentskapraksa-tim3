# ADR-016: Document versioning — CreateNewVersion pattern

**Status:** Accepted  
**Kategorija:** B — Domen i poslovni model  
**Owner:** Arhitekta / Compliance Engineer  
**Datum donošenja:** Decembar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako se uvede zahtjev za branching verzijama (više paralelnih grana verzija) ili za delta diff storage-om  
**Zahvaćeni moduli:** Domain (Document), Infrastructure (DocumentService)  
**User Stories:** US-4 (CO vraća procjenu na doradu — nova verzija dokumenta), US-3 (upload dokumenta)

---

## Kontekst

Procjena nekretnina može biti vraćena na doradu (AppraisalReturnedForRework → vještak uploaduje korigovanu verziju). Bankarska regulativa zahtijeva da svaka uploadovana verzija dokumenta bude trajno dostupna — ne smije se prepisati prethodna verzija.

Istovremeno, aplikacija mora znati koja je "aktualna" verzija dokumenta za svaku narudžbu.

---

## Decision Drivers

- **Imutabilnost verzija** — jednom uploadovana verzija dokumenta ne može biti promijenjena
- **Historija** — sve verzije moraju biti dostupne za regulatornu reviziju
- **Jednoznačnost "aktualne" verzije** — aplikacija mora znati koja je najnovija verzija bez kompleksnih upita
- **Audit po verziji** — svaki download mora bilježiti konkretnu verziju dokumenta

---

## Odluka

`Document.Create()` kreira verziju 1. `Document.CreateNewVersion()` kreira novi zapis s povećanim `VersionNumber` i `ParentDocumentId`:

```csharp
public sealed class Document : BaseEntity
{
    public int AppraisalOrderId { get; }
    public int? DocumentTypeId { get; }
    public string FileName { get; }
    public int VersionNumber { get; }           // 1, 2, 3...
    public int? ParentDocumentId { get; }       // null za v1; ID prethodne verzije za v2+
    public bool IsCurrentVersion { get; }       // samo jedna verzija po DocumentType per narudžba
    public string StoragePath { get; }
    // ...
}
```

Kad se uploaduje nova verzija:
1. Postojeća verzija dobiva `IsCurrentVersion = false`
2. Nova verzija dobiva `IsCurrentVersion = true`, `VersionNumber = prethodna + 1`, `ParentDocumentId = ID prethodne verzije`

**Ko može kreirati novu verziju**: Vještak (za finalnu procjenu nakon dorade) i CA (za ostale dokumente). Tip dokumenta određuje dozvoljene aktere.

**UI prikaz**: Prikazuje se `IsCurrentVersion = true` dokument; link za pregled starijih verzija je dostupan ispod.

---

## Alternativna rješenja

| Opcija | Imutabilnost | Historija | Jednostavnost | Zašto nije izabrana |
|--------|-------------|-----------|--------------|---------------------|
| **CreateNewVersion (linked list)** ✓ | ✓ | ✓ Sve verzije u tabeli | Srednja | — |
| Prepiši isti zapis | ✗ | ✗ | Visoka | Direktno krši regulatorne zahtjeve |
| Zasebna versioning tablica | ✓ | ✓ | Niska | Duplicate logike između Document i DocumentVersion; kompleksni JOINovi za "aktualnu" verziju |
| Git-like content addressed storage | ✓ | ✓ | Izuzetno niska za implementaciju | Overkill za ovaj opseg |

---

## Consequences

### Pozitivne
- Sve verzije dokumenta trajno dostupne — regulatorna usklađenost je automatska
- `ParentDocumentId` chain rekonstruira kompletnu historiju promjena dokumenta
- Audit log bilježi `documentId` i `versionNumber` pri svakom downloadu — precizno praćenje pristupa

### Negativne
- Storage raste s brojem revizija — svaka nova verzija je zasebna kopija fajla na disku (nema delta storage-a)
- Upit za "aktualnu" verziju dokumenta zahtijeva filter po `IsCurrentVersion = true` — performance overhead je minimalan ali prisutan
- `IsCurrentVersion` flag mora biti ažuriran atomski s kreiranjem nove verzije — greška u ovoj logici rezultira u dvije "aktualne" verzije

### Svjesno prihvaćeni kompromisi
- Prihvatamo veći storage footprint (full file kopija po verziji) jer delta storage zahtijeva kompleksniju infrastrukturu koja nije opravdana za predviđeni volumen dokumenata.

---

## Tehnički dug

- Nema automatskog upozorenja kada isti dokument ima N verzija (indikator problema s procesom)
- `IsCurrentVersion` ažuriranje nije zaštićeno unique constraint-om na DB razini — integrity ovisi o aplikacijskoj logici

---

## Migration Impact

- **Breaking Changes:** Dodavanje `VersionNumber` i `ParentDocumentId` polja je additive uz nullable default vrijednosti za stare zapise
- **Rollback Plan:** Nije primjenjivo — regulatorni zahtjev za historijom ne može biti uklonjen
- **Compatibility:** Stari zapisi bez `ParentDocumentId` tretiraju se kao v1

---

## Kada revidirati

- Pojavi se zahtjev za branching verzijama (npr. CA i vještak paralelno rade na različitim verzijama)
- Volumen dokumenata po narudžbi naraste do točke gdje `IsCurrentVersion` filter postane mjerljiv performance problem
