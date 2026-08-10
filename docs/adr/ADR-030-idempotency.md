# ADR-030: Idempotentnost kritičnih operacija

**Status:** Accepted  
**Kategorija:** E — Servisna arhitektura  
**Owner:** Arhitekta  
**Datum donošenja:** Novembar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako se uvede client-side retry logika koja zahtijeva idempotency ključeve  
**Zahvaćeni moduli:** Domain, Application, Infrastructure, BlazorApp  
**User Stories:** Sve workflow operacije (Submit, Approve, Accept, Upload)

---

## Kontekst

Korisnici rade na sporim intranet vezama. Dvostruki klik na "Podnesi narudžbu" ili spor internet koji uzrokuje timeout i automatski retry mogu rezultirati duplim izvršavanjem kritičnih operacija. U bankarskom kontekstu, duplirana operacija može uzrokovati poslovni incident.

---

## Decision Drivers

- **Poslovna ispravnost** — "Narudžba podnesena" smije se desiti tačno jednom, ne dva puta
- **User experience** — korisnik ne smije dobiti grešku zbog dvostrukog klika; sistem treba gracefully rukovati
- **Consistency** — mehanizmi zaštite moraju biti konzistentni i ne mogu ovisiti o frontend disciplini

---

## Odluka

Idempotentnost je implementirana kroz pet komplementarnih mehanizama na različitim razinama:

### Mehanizam 1 — State machine guard (Domain)

Svaka tranzicija metoda poziva `EnsureValidTransition()`. Drugi poziv Submit-a nad Submitted narudžbom baca `InvalidStateTransitionException → HTTP 409`. Ovo je primarna zaštita.

### Mehanizam 2 — IsLocked na TaskItem (Domain)

Prihvatanje zadatka (`TaskItem.Accept()`) provjerava `IsLocked`. Drugi poziv baca `ConflictException("TASK_ALREADY_ACCEPTED")`. Štiti od concurrent prihvatanja od dva korisnika.

### Mehanizam 3 — InvoiceWorkflowStatus guard (Domain)

Svaka fakturna operacija provjerava da je prethodna faza završena. Drugi upload fakture u statusu `Uploaded` baca 409.

### Mehanizam 4 — Acting flag (BlazorApp UI)

```csharp
private bool _acting = false;
async Task OnConfirm()
{
    if (_acting) return;  // Drugi klik ignorisan
    _acting = true;
    try { await service.SubmitAsync(); }
    finally { _acting = false; }
}
```

UI "Confirm" dugmad su onemogućena tokom izvršavanja. Ovo je UX optimizacija, ne sigurnosna mjera.

### Mehanizam 5 — Email deduplication (Infrastructure)

Isti email ne šalje se dvaput u 5-minutnom prozoru (vidi ADR-029).

---

## Alternativna rješenja

| Opcija | Nivo zaštite | Infrastruktura | Latencija | Zašto nije izabrana |
|--------|-------------|---------------|-----------|---------------------|
| **Multi-layer (state machine + lock + UI)** ✓ | Višestruki | Nema | Nula (state machine je in-memory) | — |
| Idempotency key header (per-request UUID) | API nivo | IMemoryCache / Redis | Minimalna | Zahtijeva klijenta koji generira i šalje UUID; ne štiti od server-side duplicata bez klijentske koperacije |
| Optimistički concurrency za sve entitete | DB nivo | Nema extra | Nula | Concurrency samo štiti od parallel competing writes; ne štiti od sekvencijalnih duplikata |
| Baza podataka unique constraint | DB nivo | DB constraint | Nula | Primjenjivo samo za entitete s uniqueness karakteristikama; nije generično rješenje |

---

## Consequences

### Pozitivne
- State machine guard je najjači mehanizam — baca 409 čak i ako Frontend ne zaštiti
- Dvostruki klik je elegantno ignorisan na Blazor razini bez vidljive greške korisniku
- Svaki mehanizam štiti od specifičnog scenarija — zajedno pokrivaju sve identificirane slučajeve

### Negativne
- `IsLocked` na TaskItem štiti od concurrent prihvatanja ali nije zaštita od retry-a koji dolazi sekvencijalno (isti korisnik, mali vremenski razmak)
- Nema centralizovanog idempotency key mehanizma — svaki tip operacije ima vlastiti mehanizam

### Svjesno prihvaćeni kompromisi
- Prihvatamo heterogene mehanizme umjesto jednog globalnog idempotency rješenja (npr. UUID key) jer domain-specifični mehanizmi (state machine, IsLocked) su prirodniji za domenski model. UUID key je prihvatljiviji za REST API s external klijentima, što ovaj sistem trenutno nema.

---

## Tehnički dug

- Nema centralizovanog audit loga koji bilježi "duplikat ignorisan" slučajeve — nemoguće je naknadno analizirati koliko duplikata se dešava

---

## Migration Impact

- **Breaking Changes:** Nema
- **Rollback Plan:** Nema (mehanizmi su fundamentalni za ispravnost sistema)
- **Compatibility:** Nema

---

## Kada revidirati

- Sistem dobije external REST klijente koji implementiraju retry logiku s Idempotency-Key headerom — tada centralizovani UUID mehanizam postaje preporučen
- Monitoring pokaže značajan broj 409 grešaka koje indiciraju problem s korisničkim iskustvom (ne zaštitu od duplikata)
