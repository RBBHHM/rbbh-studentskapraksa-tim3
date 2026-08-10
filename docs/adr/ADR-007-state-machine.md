# ADR-007: Centralizovani workflow state machine

**Status:** Accepted  
**Kategorija:** B — Domen i poslovni model  
**Owner:** Arhitekta / Domain Expert  
**Datum donošenja:** Oktobar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako broj statusa premaši 40 ili ako se pojavi zahtjev za paralelnim granama workflowa unutar jedne narudžbe  
**Zahvaćeni moduli:** Domain, Infrastructure  
**User Stories:** US-1 (FL workflow), US-PL (PL workflow), sve US-vezane za promjene stanja narudžbe

---

## Kontekst

Narudžba procjene nekretnina prolazi kroz 25+ statusa s jasno definiranim dozvoljenim prijelazima. Na primjer: `AppraisalReceived → COApproved` je dozvoljen; `Draft → COApproved` nije. Ovaj graf prijelaza je poslovno pravilo, ne implementacijska slučajnost.

Bez centralizovane definicije ovog grafa, svaki servis koji mijenja status narudžbe mora sam implementirati validaciju ispravnosti prijelaza. To vodi ka: (a) duplikaciji logike, (b) divergenciji između servisa koji implementiraju istu provjeru na drugačiji način, (c) nemogućnosti vizualnog pregleda koji su prijelazi mogući.

U toku razvoja identifikovane su tri greške upravo ovog tipa — prijelazi koji su bili implementirani u jednom servisu ali ne i u drugom koji je neovisno mijenjao status.

---

## Decision Drivers

- **Jedinstven izvor istine** — graf prijelaza mora biti definiran na jednom mjestu
- **Fail-fast** — pokušaj nedozvoljenog prijelaza mora rezultirati izuzetkom odmah, ne tihom greškom
- **Bez bibliotečkih zavisnosti u Domain sloju** — Domain ne smije zavisiti od trećih strana
- **Testabilnost** — kompletan graf mora biti lako testabilan putem jednodimenzionalnih unit testova

---

## Odluka

Statična klasa `OrderStateMachine` u Domain sloju implementira validaciju prijelaza kroz `Dictionary<AppraisalOrderStatus, HashSet<AppraisalOrderStatus>>`.

```csharp
// Poziv iz svake domain metode koja mijenja status:
OrderStateMachine.EnsureValidTransition(currentStatus, targetStatus);
// Baca InvalidStateTransitionException ako prijelaz nije dozvoljen
```

**Svaka domain metoda** koja mijenja status narudžbe mora pozvati `EnsureValidTransition` kao prvu liniju. Ova konvencija je dogovorena i vidljiva kroz unit testove koji eksplicitno testiraju nedozvoljene prijelaze.

### Kompletni graf prijelaza (selektovano)

Dozvoljeni prijelazi uključuju (ne-ekskluzivna lista):
- `Draft → Submitted`
- `Submitted → DocumentationReviewInProgress`
- `DocumentationReviewInProgress → DocumentationApproved | ReturnedForCorrection`
- `DocumentationApproved → AccessCheckApproved | ProtocolCreated`
- `AccessCheckApproved → OrderSentToAppraiser`
- `OrderSentToAppraiser → AppraisalInProgress | AppraiserRejected`
- `AppraisalInProgress → AppraisalReceived | AppraiserRejected | AppraisalReturnedForRework`
- `AppraisalReceived → COApproved | AppraisalReturnedForRework`
- `COApproved → ReadyForProcedure`
- `ReadyForProcedure → OriginalDelivered`
- `OriginalDelivered → ProtocolCreated`
- ... (ukupno 25 statusa, ~35 dozvoljenih prijelaza)

---

## Alternativna rješenja

| Opcija | SSOT grafa | Bez lib. zavisnosti | Vizualizacija | Side-effects | Zašto nije izabrana |
|--------|-----------|---------------------|--------------|-------------|---------------------|
| **Statički dictionary (Domain)** ✓ | ✓ | ✓ | Nije ugrađena | ✗ | — |
| Stateless NuGet biblioteka | ✓ | ✗ (vanjska zavisnost u Domain) | ✓ ugrađena | ✓ | Domain sloj ne smije imati NuGet zavisnosti; biblioteka bi postala zavisnost cijelog projekta |
| Ad-hoc if/switch u svakom servisu | ✗ | ✓ | ✗ | ✗ | Duplikacija koja je već pokazala grešku u razvoju; teška revizija |
| Temporal.io / Hangfire workflow engine | ✓ | ✗ (sasvim vanjska platforma) | ✓ | ✓ | Distributed workflow engine je overkill za monolith; operativna složenost nije opravdana |

---

## Consequences

### Pozitivne
- Svaki pokušaj nedozvoljenog prijelaza baca `InvalidStateTransitionException` s jasnom porukom — ne postoji tiha greška promjene statusa
- Kompletan graf je vidljiv u jednom fajlu — pregled svih dozvoljenih prijelaza je trivijalan
- Dodavanje novog statusa zahtijeva izmjenu samo `OrderStateMachine` i odgovarajućih domain metoda — nije rasprostranjena po servisima
- Unit testovi mogu sistematično testirati sve kombinacije dozvoljenih i nedozvoljenih prijelaza bez HTTP sloja

### Negativne
- Statički dictionary ne generira vizuelni dijagram grafa automatski — developeri moraju ručno vizualizovati prijelaze da bi razumjeli tok workflowa
- Ne postoje side-effects u state machine samoj — svaka tranzicija metoda mora eksplicitno upravljati kreacijom TaskItem-a i notifikacija (što je i odgovornost service sloja, ali može biti propušteno)
- Testiranje completeness grafa je ručno — nema automatizovane provjere da li je svaki status dosežan

### Svjesno prihvaćeni kompromisi
- Prihvatamo odsustvo ugrađene vizualizacije jer je alternativa (biblioteka u Domain sloju) narušila bi Clean Architecture granicu. Graf može biti generisan alatima poput PlantUML na osnovu koda ako je potrebno.

---

## Tehnički dug

- Vizualizacija state machine grafa (PlantUML dijagram) nije automatizovana — pri dodavanju novih statusa developeri moraju ručno ažurirati dokumentaciju
- `OrderStateMachine` nema completeness test koji bi potvrdio da svaki status ima bar jedan ulazni i jedan izlazni prijelaz

---

## Migration Impact

- **Breaking Changes:** Dodavanje novog statusa je backward-compatible. Uklanjanje dozvoljenog prijelaza je breaking change koji može blokirati postojeće narudžbe u tom statusu.
- **Rollback Plan:** Svaka promjena grafa može biti rollback-ata migracijom (vidi ADR-018) jer statusi su čuvani kao stringovi u bazi
- **Compatibility:** AppraisalOrderStatus enum mora biti sinhronizovan s bazom podataka; promjena enum vrijednosti zahtijeva DB migraciju

---

## Kada revidirati

- Broj statusa premaši ~40 — dictionary pristup postaje teško pregledati; razmotriti vizuelni DSL
- Pojavi se zahtjev za paralelnim granama workflowa (npr. istovremeno odvijanje pravnog mišljenja i pristupne provjere) — tada statička mašina postaje nedovoljna i treba workflow engine
- Identifikuje se pattern u kojemu isti prijelaz ima različite side-effects ovisno o kontekstu — signal da state machine treba biti proširena s kontekstualnim guardovima
