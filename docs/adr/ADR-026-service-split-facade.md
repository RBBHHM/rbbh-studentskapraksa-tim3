# ADR-026: Fizički servisni split — Facade + fokusirani sub-servisi

**Status:** Accepted  
**Kategorija:** E — Servisna arhitektura  
**Owner:** Arhitekta  
**Datum donošenja:** Decembar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako se uvede zahtjev za zasebnim deploymentom sub-servisa (microservice split)  
**Zahvaćeni moduli:** Infrastructure (AppraisalOrderService, AppraiserAssignmentService i sub-servisi)  
**User Stories:** US-1 (kreiranje i podnošenje narudžbe), US-appraiser (dodjela vještaka)

---

## Kontekst

`AppraisalOrderService` i `AppraiserAssignmentService` narasli su na 600–800 linija koda. Svaki service klasi narušavao je SRP — jedna klasa je bila odgovorna za kreiranje, validaciju, podnošenje, otkazivanje, i ažuriranje narudžbe. To je otežavalo:
- Pronalazak relevantnog koda pri debugging-u
- Razumijevanje odgovornosti servisa pri onboarding-u
- Pisanje fokusiranih unit testova

---

## Decision Drivers

- **Single Responsibility Principle** — svaka klasa treba imati jednu odgovornost koja se mijenja iz jednog razloga
- **Backward kompatibilnost** — handleri koji referenciraju `IAppraisalOrderService` ne smiju biti mijenjani
- **Čitljivost** — developer treba moći pronaći kod za "kreiranje narudžbe" bez listanja 800 linija

---

## Odluka

Fizički split uz Facade pattern koji zadržava backward kompatibilnost:

```
IAppraisalOrderService (facade interfejs)
    └── AppraisalOrderService (facade implementacija)
            ├── IOrderCreateService
            │     └── OrderCreateService   (Create, CreateDraft, UpdateDraft)
            └── IOrderSubmitService
                  └── OrderSubmitService  (Submit, Cancel)

IAppraiserAssignmentService (facade interfejs)
    └── AppraiserAssignmentService (facade implementacija)
            ├── IFlAppraiserSelectionService
            │     └── FlAppraiserSelectionService  (AutoSelect za FL)
            └── IPlAppraiserSelectionService
                  └── PlAppraiserSelectionService  (GetCandidates, ManualSelect za PL)
```

**Facade implementacija** delegira direktno na sub-servise:
```csharp
// AppraisalOrderService.CreateOrderAsync() = IOrderCreateService.CreateOrderAsync()
public Task<int> CreateOrderAsync(...) => _createService.CreateOrderAsync(...);
```

Sub-servisi su dostupni za direktnu injekciju u slučajevima gdje samo jedna podoperacija je potrebna.

---

## Alternativna rješenja

| Opcija | SRP | Backward compat | Testabilnost | Zašto nije izabrana |
|--------|-----|----------------|-------------|---------------------|
| **Facade + sub-servisi** ✓ | ✓ | ✓ Facade wrapper | Visoka (fokusirani testovi) | — |
| Monolitni servis | ✗ (800 linija) | ✓ | Srednja | Status quo koji je identificiran kao problem |
| Direktni split bez Facade | ✓ | ✗ | Visoka | Zahtijeva ažuriranje svih handlera koji referenciraju stari interfejs — velik scope promjene |
| Microservisi | ✓ | ✗ | Visoka | Prijevremena ekstrakcija microservisa za sistem koji još nije identificirao runtime split kao potreban |

---

## Consequences

### Pozitivne
- `OrderCreateService` je 150 linija fokusiranih na kreiranje — čitljivost i testabilnost dramatično poboljšani
- Handleri koji koriste `IAppraisalOrderService` nisu mijenjani — Facade je transparentan
- Sub-servisi mogu biti direktno injektirani u handler koji treba samo tu specifičnu operaciju

### Negativne
- Višestruki interfejsi i klase za iste konceptualne operacije (IAppraisalOrderService + IOrderCreateService)
- Facade klasa je "pass-through" bez stvarne logike — potencijalna zbunjenost

### Svjesno prihvaćeni kompromisi
- Prihvatamo duplikaciju interfejsa (IAppraisalOrderService + IOrderCreateService) kao privremenu cijenu backward kompatibilnosti. U budućoj verziji, handleri se mogu direktno prebaciti na sub-servise.

---

## Tehnički dug

- Handleri koji trebaju samo operacije kreiranja i dalje injektuju cijeli `IAppraisalOrderService` — moguća buduća optimizacija

---

## Migration Impact

- **Breaking Changes:** Nema — Facade čuva postojeći interfejs
- **Rollback Plan:** Sub-servisi mogu biti merged nazad u monolitnu klasu
- **Compatibility:** Nema

---

## Kada revidirati

- Tim identificira novu servisnu klasu koja narasta — primijeniti isti split pattern
- Microservice razgovor postane konkretan — sub-servisi su prirodna jedinica ekstrakcije
