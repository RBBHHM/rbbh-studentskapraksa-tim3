# ADR-001: Monorepo struktura repozitorija

**Status:** Accepted  
**Kategorija:** A — Osnovna arhitektura  
**Owner:** Arhitekta / Tech lead  
**Datum donošenja:** Oktobar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Kada tim naraste iznad 5 razvojnih inženjera ili kada API i BlazorApp dobiju nezavisne release cikluse  
**Zahvaćeni moduli:** Svi — Domain, Application, Infrastructure, Api, BlazorApp, tests, docker, docs  
**User Stories:** Sve

---

## Kontekst

Projekat obuhvata backend API (.NET 10 Minimal API), Blazor Server frontend, četiri test projekta, Docker konfiguraciju i dokumentaciju. Tim u inicijalnoj fazi broji jednog do tri razvojna inženjera. Potrebno je odlučiti kako organizovati izvorni kod.

Ključni faktor: API i Blazor klijent dijele tipove iz Application sloja i mijenjaju se zajedno — promjena endpointa skoro uvijek zahtijeva odgovarajuću promjenu UI-a. Ova korelacija je predvidiva i učestala, ne izuzetna.

---

## Decision Drivers

- **Atomski commit** — promjena koja dodiruje API kontrakt i Blazor klijent mora ući u jednu commit cjelinu; dva odvojena repozitorija to ne garantuju
- **Veličina tima** — mali tim nema kapacitet za upravljanje međurepozitorijskim verzioniranjem
- **Zajednički CI/CD** — jedan pipeline koji builduje, testira i deployuje cijeli sistem smanjuje operativni overhead
- **Shared tooling** — `.editorconfig`, `Directory.Build.props`, `global.json` trebaju biti konzistentni kroz cijeli projekt

---

## Odluka

Jedan Git repozitorij s fiksnom strukturom direktorijuma:

```
/
├── src/
│   ├── Domain/
│   ├── Application/
│   ├── Infrastructure/
│   ├── Api/
│   └── BlazorApp/
├── tests/
│   ├── Domain.Tests/        (buduće)
│   ├── Application.Tests/
│   ├── Infrastructure.Tests/
│   ├── Api.Tests/
│   └── BlazorApp.Tests/
├── docker/
├── docs/
│   └── adr/
└── seed/
```

---

## Alternativna rješenja

| Opcija | Kompleksnost | Maintainability | Team Fit | Sinhronizacija | Zašto nije izabrana |
|--------|-------------|-----------------|----------|----------------|---------------------|
| **Monorepo** ✓ | Niska | Visoka | Odlična za mali tim | Atomska | — |
| Polyrepo (zasebni repo po sloju) | Niska po repou | Zahtijeva verzioniranje | Zahtijeva veći tim | Ručna | Sinhronizacija tipa između API i Blazor repoa postaje teret koji premašuje koristi pri ovoj veličini tima |
| Git submoduli | Visoka | Loša (submodule hell) | Loša | Djelimično atomska | Submoduli su poznato krhki; kriva učenja premašuje dobit |

---

## Consequences

### Pozitivne
- Promjena u API kontraktu i odgovarajuća promjena u Blazor klijentskom kodu ulaze u isti commit — nema mogućnosti da jedna strana ostane neažurirana
- Jedan CI/CD pipeline builduje i testira cijeli sistem; nema potrebe za orkestracijom između pipeline-ova
- Zajednički `Directory.Build.props` osigurava konzistentnu verziju .NET-a, NuGet paketa i analyzer pravila kroz sve projekte bez ručne sinhronizacije

### Negativne
- Cijeli repozitorij mora biti kloniran čak i kada programer radi isključivo na jednom sloju
- Bez discipline u branch strategiji, feature granje može postati kompleksno kada više programera radi paralelno
- CI pipeline builduje sve projekte i pokreće sve testove pri svakom push-u, bez mogućnosti selektivnog triggera po promijenjenom sloju

### Svjesno prihvaćeni kompromisi
- Veličina repozitorija raste s projektom. Prihvatljivo jer projekt ima jasno definiran opseg (bancárni intranet sistem, ne platform s neograničenim rastom broja servisa).

---

## Tehnički dug

Nema značajnog tehničkog duga koji ova odluka uvodi. Ako sistem evoluira prema zasebnim deploymentima API-ja i Blazor-a s različitim SLA-ovima, bit će potrebno razmotriti split u polyrepo arhitekturu.

---

## Migration Impact

- **Breaking Changes:** Nema — ovo je inicijalna strukturna odluka
- **Rollback Plan:** Git repozitorij može biti razdvojen u polyrepo (git filter-branch) ako bude potrebno, ali to je skupo u smislu historije
- **Compatibility:** Nema posebnih zahtjeva

---

## Kada revidirati

- Tim naraste iznad 5 razvojnih inženjera i timovi počnu raditi na API-ju i BlazorApp-u neovisno s različitim sprint ciklusima
- API i BlazorApp dobiju zasebne SLA zahtjeve i zasebne deployment procese
- Build vrijeme u CI-u postane neprihvatljivo zbog rasta broja projekata
