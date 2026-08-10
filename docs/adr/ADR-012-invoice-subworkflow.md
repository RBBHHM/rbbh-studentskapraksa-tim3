# ADR-012: Invoice tri-state sub-workflow

**Status:** Accepted  
**Kategorija:** B — Domen i poslovni model  
**Owner:** Arhitekta / Domain Expert  
**Datum donošenja:** Januar 2026  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako fakturiranje postane zasebni poslovni proces s vlastitim životnim ciklusom van narudžbe  
**Zahvaćeni moduli:** Domain, Infrastructure (InvoiceWorkflowService)  
**User Stories:** US-F1 (upload fakture — Protokol), US-F2 (slanje na plaćanje — Likvidatura), US-F3 (potvrda plaćanja — Računovodstvo)

---

## Kontekst

Nakon odobravanja procjene (ReadyForProcedure), slijedi fakturni proces s tri koraka i tri različita aktera:
1. **Protokol** uploaduje fakturu
2. **Likvidatura / Računovodstvo** šalje fakturu na plaćanje
3. **Računovodstvo** potvrđuje plaćanje

Svaki korak ima striktan redoslijed i guard uslove. Faktura nije samostalni poslovni entitet — ona je zaključni segment iste narudžbe.

---

## Decision Drivers

- **Transakcionalnost s narudžbom** — status fakture i status narudžbe trebaju biti konzistentni unutar iste DB transakcije
- **Jednostavnost modela** — faktura je zaključni dio workflowa narudžbe, ne zasebni agregat
- **Guard uslovi** — slanje na plaćanje nije moguće bez uploadovane fakture; potvrda nije moguća bez slanja

---

## Odluka

`InvoiceWorkflowStatus` enum (`NotStarted | Uploaded | SentForPayment | Paid`) direktno na `AppraisalOrder`. Tri service metode s guard provjerama:

```
UploadInvoiceAsync    → NotStarted     → Uploaded
SendForPaymentAsync   → Uploaded       → SentForPayment
ConfirmPaidAsync      → SentForPayment → Paid
```

`InvoiceWorkflowStatus` je odvojen od `AppraisalOrderStatus` jer fakturni status može napredovati neovisno od ostatka narudžbe koja je u `ReadyForProcedure` ili `OriginalDelivered`.

---

## Alternativna rješenja

| Opcija | Transakcionalnost | Kompleksnost | Neovisni lifecycle | Zašto nije izabrana |
|--------|-----------------|-------------|-------------------|---------------------|
| **Ugrađeni sub-workflow** ✓ | ✓ Ista DB transakcija | Niska | Parcijalno | — |
| Zasebni Invoice agregat | Cross-aggregate (dvije transakcije) | Visoka | ✓ Puni lifecycle | Eventual consistency između narudžbe i fakture; nema jasnog "ko ima aggregate ownership" za ovaj opseg |
| TaskItem-based praćenje | ✓ | Niska | ✗ | TaskItem nema status koji izražava fakturni tijek; zahtijeva inferiranje stanja iz TaskType+Status kombinacija |

---

## Consequences

### Pozitivne
- Upload fakture, slanje na plaćanje i potvrda su atomski s narudžbom — nema stanja gdje je narudžba u jednom statusu a faktura "negdje između"
- Guard uslovi su eksplicitni u service metodama — nema mogućnosti preskakanja koraka

### Negativne
- `AppraisalOrder` entitet raste s fakturnim poljima — `InvoiceUploadedAt`, `InvoiceAmount`, `InvoiceNumber`, `SentForPaymentAt`, `PaidAt` i `InvoiceWorkflowStatus`
- Ako fakturiranje dobije složeniji lifecycle (npr. reklamacija, djelimično plaćanje), `InvoiceWorkflowStatus` sub-workflow postaje nedovoljan

### Svjesno prihvaćeni kompromisi
- Prihvatamo "wide table" pristup (AppraisalOrder s fakturnim poljima) jer je alternativa (zasebni Invoice agregat) uveo bi eventual consistency za problem koji ne zahtijeva tu složenost.

---

## Tehnički dug

- Nema notifikacije prema Protokol-u ako narudžba stigne u `ReadyForProcedure` a faktura nije uploadovana u X dana
- Fakturna polja na `AppraisalOrder` su nullable bez validacijskih pravila na DB razini — integrity ovisi isključivo o service guard-ovima

---

## Migration Impact

- **Breaking Changes:** Dodavanje novih fakturnih statusa je additive; uklanjanje nije backward-compatible
- **Rollback Plan:** `InvoiceWorkflowStatus` može se resetovati na `NotStarted` za narudžbe u ranim fazama
- **Compatibility:** Nema

---

## Kada revidirati

- Fakturiranje dobije vlastite regulatorne zahtjeve koji zahtijevaju zasebnu revizijsku stopu odvojenu od narudžbe
- Uvede se reklamacijski ili reprogram proces koji ne odgovara linearnom tri-state modelu
