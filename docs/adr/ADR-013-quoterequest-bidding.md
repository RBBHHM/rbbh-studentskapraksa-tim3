# ADR-013: QuoteRequest — PL multi-vještak bidding model

**Status:** Accepted  
**Kategorija:** B — Domen i poslovni model  
**Owner:** Arhitekta / Domain Expert  
**Datum donošenja:** Januar 2026  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako PL workflow uvede automatski odabir vještaka po cijeni (bez CO intervencije)  
**Zahvaćeni moduli:** Domain, Infrastructure (QuoteRequestService)  
**User Stories:** US-PL (PL workflow — bidding faza), US-PL-CO (CO odabir vještaka)

---

## Kontekst

PL (pravna lica) workflow za odabir vještaka razlikuje se od FL pristupa: umjesto direktnog automatskog odabira jednog vještaka (FL), CA šalje zahtjev za ponudu na više vještaka koje CO identificira. Vještaci odgovaraju s ponudom (cijena + rok), a CO bira najpovoljnijeg.

Ovaj bidding proces mora biti eksplicitno modeliran — status narudžbe sam po sebi ne može izraziti koji su vještaci kontaktirani, koji su odgovorili, i s kojim ponudama.

---

## Decision Drivers

- **Čuvanje historije ponuda** — sve ponude (prihvaćene i odbijene) moraju biti dostupne za CO odluku i naknadnu reviziju
- **Praćanje statusa po vještaku** — jedan QuoteRequest = jedan vještak; status po svakom vještaku je zasebna informacija
- **Queryabilnost** — pregled svih ponuda za narudžbu mora biti jednostavan upit

---

## Odluka

`QuoteRequest` je zasebni domenski entitet s vlastitim životnim ciklusom:

```
QuoteRequest
  ├── AppraisalOrderId  (FK na narudžbu)
  ├── AppraiserId       (FK na vještaka)
  ├── Status            (Sent → Responded → Selected | ThankYouSent | Expired)
  ├── SentAt / Deadline (kad je poslan i do kada vrijedi)
  ├── OfferedPrice      (nullable — popunjava vještak)
  ├── OfferedDays       (nullable — popunjava vještak)
  └── RespondedAt       (kad je vještak odgovorio)
```

**Tok** (PL narudžba u DocumentationApproved ili AccessCheckApproved statusu):
1. CA odabire vještake i šalje QuoteRequest za svakoga (`SendQuoteRequestsAsync`)
2. Vještaci odgovaraju s ponudom (`RespondToQuoteAsync`) — status → Responded
3. CO bira jednog (`SelectAppraiserAsync`) — odabrani → Selected, ostali → ThankYouSent
4. Narudžba prelazi u `OrderSentToAppraiser` status

**Guard uslovi**:
- `SendQuoteRequestsAsync`: samo PL narudžbe, samo u dozvoljenima statusima (DocumentationApproved / AccessCheckApproved / ProtocolCreated)
- Zahtjev za ponudu ne može biti poslan ako već postoje aktivni QuoteRequest zapisi
- CO mora odabrati jednog od onih koji su odgovorili

---

## Alternativna rješenja

| Opcija | Historija ponuda | Queryabilnost | Rich domain model | Zašto nije izabrana |
|--------|----------------|--------------|-----------------|---------------------|
| **QuoteRequest entitet** ✓ | ✓ Sve ponude persistirane | ✓ Jednostavan upit | ✓ | — |
| TaskItem za svaki bid | ✗ (TaskItem nema PriceOffer polja) | ✓ | ✗ (misuse TaskItem namjene) | TaskItem je operativni model; ne bi trebao nositi poslovne podatke o ponudi |
| JSONB kolona na narudžbi | ✗ (teška query) | ✗ | ✗ | Nije queryable; ne podržava zasebni status po vještaku |

---

## Consequences

### Pozitivne
- Istorija svih ponuda ostaje dostupna za reviziju čak i nakon odabira vještaka
- Status po vještaku (ko je odgovorio, ko nije, ko je odabran) je eksplicitno modeliran
- Vještaci koji nisu odabrani primaju zahvalnicu (ThankYouSent status) — poslovni zahtjev koji zahtijeva eksplicitni state

### Negativne
- Vještak koji nije odgovorio na QuoteRequest u roku treba biti automatski Expired — zahtijeva background worker (vidi ADR-027 za timeout servis)
- QuoteRequest zapisi akumuliraju se s brojem narudžbi; nema arhivacijske procedure

### Svjesno prihvaćeni kompromisi
- Prihvatamo zasebni QuoteRequest entitet (kompleksniji model) jer alternativa — TaskItem s ponudom ili JSONB — gubi rich domain model koji je neophodan za reviziju i CO odabir.

---

## Tehnički dug

- Timeout za neodgovorene QuoteRequest-ove (Expired status) još nije implementiran u `AppraiserTimeoutService` — radi se ručno (CA mora pratiti)
- Nema notifikacije prema CA kada svi vještaci odgovore (ili kada istekne deadline bez odgovora)

---

## Migration Impact

- **Breaking Changes:** Dodavanje polja na QuoteRequest zahtijeva DB migraciju
- **Rollback Plan:** QuoteRequest zapisi mogu se obrisati bez gubitka podataka narudžbe
- **Compatibility:** Nema

---

## Kada revidirati

- Uvede se automatski odabir vještaka po najnižoj cijeni — tada CO intervencija nestaje i model se može pojednostaviti
- Pojavi se zahtjev za pregovaranjem (counter-offer) između CO i vještaka — tada linear Sent→Responded flow nije dovoljan
