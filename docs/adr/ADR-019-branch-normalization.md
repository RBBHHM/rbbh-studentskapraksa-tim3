# ADR-019: Branch/grad normalizovane relacije

**Status:** ⚠ Needs Review  
**Kategorija:** C — Persistencija  
**Owner:** Arhitekta  
**Datum donošenja:** Novembar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Odmah — BranchCatalog statična lista je identificiran problem koji treba riješiti  
**Zahvaćeni moduli:** Domain (AppraisalOrder), Application (BranchCatalog, validacija), Infrastructure  
**User Stories:** US-1 (kreiranje narudžbe — odabir poslovnice i grada)

---

## Kontekst

Narudžba je vezana za konkretnu poslovnicu banke i grad. Ovaj odnos mora biti normalizovan (FK veze) radi referencijalnog integriteta i reporting-a po poslovnici. Dodatno, validacija para (grad, poslovnica) pri kreiranju narudžbe mora osigurati da odabrana poslovnica zaista postoji u navedenom gradu.

---

## Decision Drivers

- **Referecijalni integritet** — narudžba ne smije moći biti vezana za nepostojeću poslovnicu
- **Reporting** — agregati po poslovnici i gradu zahtijevaju FK relacije, ne stringove
- **Validacija** — invalid kombinacija (grad=Sarajevo, poslovnica=Banja Luka Centar) mora biti uhvaćena pri unosu

---

## Odluka

`AppraisalOrder` sadrži `CityId (FK → cities)` i `BranchId (FK → branches)`. Relacija grad-poslovnica je modelirana kroz `branches.city_id`.

**Identificirani problem — BranchCatalog dual source**:

Validacija para (grad, poslovnica) koristi `BranchCatalog` — statičnu listu u Application sloju:

```csharp
// Application/Common/Branches/BranchCatalog.cs
public static class BranchCatalog
{
    public static readonly IReadOnlyList<BranchItem> All = [
        new("Sarajevo", "POS_SARAJEVO_CENTAR", "Sarajevo Centar"),
        // ... hardkodirano
    ];
}
```

Ova lista mora biti identična sadržaju `branches` tabele. Ako se doda nova poslovnica u DB-u, mora biti ručno dodana i u `BranchCatalog`. Ovo je **izvor divergencije**.

**Planirana ispravka**: Eliminisati `BranchCatalog` statičnu listu. Validacija para (grad, poslovnica) treba biti DB upit:

```csharp
var exists = await _db.Branches
    .AnyAsync(b => b.Id == branchId && b.CityId == cityId, ct);
```

---

## Alternativna rješenja

| Opcija | Consistency | DB poziv pri validaciji | Lako ažuriranje | Zašto nije izabrana / status |
|--------|------------|------------------------|----------------|------------------------------|
| **DB upit za validaciju** (planiran) | ✓ Single source of truth | ✓ (po zahtjevu, nije hot-path) | ✓ | Ovo je ciljna implementacija |
| BranchCatalog statična lista (trenutno) | ✗ Duplikacija | ✗ | ✗ (zahtijeva rekompajl) | Identificiran problem — u procesu rješavanja |
| In-memory cache s TTL-om | ✓ | Jednom po refresh-u | ✓ | Prihvatljivo ako DB upit postane overhead, ali nije potrebno za ovaj volumen |

---

## Consequences

### Pozitivne (nakon ispravke)
- Jedinstven izvor istine za poslovnice — DB
- Dodavanje nove poslovnice ne zahtijeva izmjenu koda

### Negativne (trenutno stanje)
- Ručna sinhronizacija između `BranchCatalog.cs` i `branches` tabele
- Moguće je narudžbu kreirati s poslovnicom koja postoji u kodu ali ne i u DB-u (ili obratno)

### Svjesno prihvaćeni kompromisi
- Statična lista je bila prihvatljiva za inicijalni razvoj dok se poslovnice nisu mijenjale. Postaje problem u produkciji gdje administratori mogu dodavati poslovnice.

---

## Tehnički dug

🟡 **SREDNJI PRIORITET**: Eliminisati `BranchCatalog` statičnu listu:
1. Zamijeniti `BranchCatalog.BranchExists(cityId, branchId)` s DB upitom u `CreateOrderCommandValidator`
2. Ažurirati `BranchQueryService` da vraća sve poslovnice direktno iz DB-a (veza s gradom)
3. Arhivirati `BranchCatalog.cs`

---

## Migration Impact

- **Breaking Changes:** Nema — promjena je u validacijskom sloju, ne u domenskim podacima
- **Rollback Plan:** `BranchCatalog.cs` može biti vraćen bez promjene DB sheme
- **Compatibility:** `branches` i `cities` tablice moraju imati sinhronizovane podatke s trenutnim `BranchCatalog` sadržajem

---

## Kada revidirati

- Odmah — BranchCatalog eliminacija je identificirani tech dug s poznatim planom
- Po završetku: ovaj ADR treba ažurirati na "Resolved" status
