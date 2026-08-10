# ADR-014: Per-order blacklista odbijenih vještaka

**Status:** Accepted  
**Kategorija:** B — Domen i poslovni model  
**Owner:** Arhitekta / Domain Expert  
**Datum donošenja:** Decembar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako se uvede globalna suspenzija vještaka ili kvota odbijanja po vještaku  
**Zahvaćeni moduli:** Domain (OrderDeclinedAppraiser), Infrastructure (AppraiserSelectionService)  
**User Stories:** US-1 (auto-reassign nakon odbijanja), US-PL (QuoteRequest timeout)

---

## Kontekst

Kada vještak odbije narudžbu ili istekne rok prihvatanja, sistem mora automatski dodijeliti drugog vještaka (FL workflow) ili označiti QuoteRequest kao expired (PL workflow). Ključni poslovni zahtjev: isti vještak ne smije biti ponovo odabran za istu narudžbu. Bez eksplicitnog mehanizma, auto-reassign bi mogao kružiti kroz iste vještake.

---

## Decision Drivers

- **Izolacija po narudžbi** — vještak koji odbije narudžbu A mora i dalje moći prihvatiti narudžbu B
- **Determinizam** — odabir novog vještaka mora garantovano isključiti prethodno odbijene
- **Jednostavnost provjere** — provjera pri svakom odabiru mora biti jednostavna

---

## Odluka

`OrderDeclinedAppraiser` entitet čuva par `(AppraisalOrderId, AppraiserId)`:

```csharp
public sealed class OrderDeclinedAppraiser : BaseEntity
{
    public int AppraisalOrderId { get; private set; }
    public int AppraiserId { get; private set; }
    public string Reason { get; private set; }  // "Declined" | "Timeout" | "ThankYou"
}
```

Pri svakom odbijanju / timeoutu, servis upisuje novi `OrderDeclinedAppraiser` zapis. `AutoSelectAppraiserAsync` ekskluzivno filtrira odabrane koji su na blacklisti:

```csharp
var declinedIds = await _db.OrderDeclinedAppraisers
    .Where(x => x.AppraisalOrderId == orderId)
    .Select(x => x.AppraiserId)
    .ToListAsync(ct);

candidates = candidates.Where(a => !declinedIds.Contains(a.Id));
```

---

## Alternativna rješenja

| Opcija | Per-narudžba izolacija | Vještak radi dalje | Jednostavnost | Zašto nije izabrana |
|--------|----------------------|-------------------|--------------|---------------------|
| **Per-order OrderDeclinedAppraiser** ✓ | ✓ | ✓ | Visoka | — |
| Globalna suspenzija vještaka (IsActive=false) | ✗ (previše agresivno) | ✗ | Visoka | Blokira vještaka od svih narudžbi zbog jednog odbijanja |
| TimesDeclined brojač na vještaku | ✗ (ne per-narudžba) | ✓ | Srednja | Ne možemo znati za koje konkretne narudžbe je odbijen |
| Lista na narudžbi (JSONB) | ✓ | ✓ | Srednja | JSONB nije queryable JOIN-om pri odabiru vještaka |

---

## Consequences

### Pozitivne
- Vještak koji odbije narudžbu A nastavlja normalno prihvatati narudžbu B — nema nepotrebnog blokiranja
- Provjera je čist JOIN upit koji radi efikasno s indeksom na `(AppraisalOrderId, AppraiserId)`

### Negativne
- Ako su svi dostupni vještaci za grad na blacklisti date narudžbe, sistem ne može automatski dodijeliti novog — ovo je "deadlock" scenario koji zahtijeva ručnu intervenciju
- `OrderDeclinedAppraiser` zapisi akumuliraju se bez arhivacijske procedure

### Svjesno prihvaćeni kompromisi
- Prihvatamo zasebni entitet umjesto JSONB kolone jer JOIN pri odabiru je čišće rješenje.

---

## Tehnički dug

- Nema automatske notifikacije kada su svi dostupni vještaci za narudžbu na blacklisti
- Razlog odbijanja (`Reason`) nije strukturirani tip — trebalo bi biti enum za bolju queryabilnost

---

## Migration Impact

- **Breaking Changes:** Nema
- **Rollback Plan:** Zapisi se mogu obrisati; jedina posljedica je da prethodno odbijeni vještak može biti ponovo odabran
- **Compatibility:** Nema

---

## Kada revidirati

- Identifikuje se pattern gdje vještak odbija mnogo narudžbi — tada poslovni zahtjev može biti globalna suspenzija, a ne samo per-order blacklista
- Uvede se automatski escalation prema supervizoru kada su svi vještaci na blacklisti
