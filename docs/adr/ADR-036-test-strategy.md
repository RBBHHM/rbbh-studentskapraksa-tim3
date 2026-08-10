# ADR-036: Test strategija — Test piramida

**Status:** Accepted  
**Kategorija:** H — Kvalitet i observability  
**Owner:** Arhitekta / QA Engineer  
**Datum donošenja:** Oktobar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako E2E test suite postane blocker za CI ili ako se pokrivenost smanji ispod 95%  
**Zahvaćeni moduli:** Svi test projekti  
**User Stories:** Sve — ova strategija definira razinu pouzdanosti za cijeli sistem

---

## Kontekst

Enterprise sistem koji prolazi regulatornu reviziju mora imati visok nivo pouzdanosti koda. Testovi moraju biti brzi (feedback loop), pouzdani (ne flaky) i smisleni (testiraju stvarno ponašanje, ne implementacijske detalje).

---

## Decision Drivers

- **Brz feedback loop** — unit testovi moraju biti brzi (< 1s ukupno); developer ne čeka CI pri push-u
- **Realistična validacija** — integracijski testovi s EF Core InMemory validiraju da middleware, auth i pipeline rade zajedno
- **Regulatorna pouzdanost** — 98%+ pokrivenost business logike je target, ne opcionalan cilj
- **Smisleni testovi** — svaki test mora testirati ponašanje koje je važno za korisnika, ne internu implementaciju

---

## Odluka

**Test piramida s četiri projekta**:

| Test projekt | Framework | Šta pokriva | Broj testova |
|-------------|-----------|------------|-------------|
| `Application.Tests` | xUnit + NSubstitute + FluentAssertions | Unit testovi: domain logika, validatori, handleri, security, workflow | ~1 717 |
| `Api.Tests` | xUnit + WebApplicationFactory | Integracijski: HTTP pipeline, auth, EF Core InMemory, endpoint rute | ~181 |
| `Infrastructure.Tests` | xUnit + EF Core InMemory | Gap testovi: Infrastructure servisi direktno (BranchQueryService, converteri...) | ~79 |
| `BlazorApp.Tests` | xUnit + bUnit | bUnit testovi: Blazor komponente (OrderCapabilitiesDto, custom logika) | ~6 |
| `E2E.Tests` | Playwright (C#) + xUnit | E2E browser testovi: FL/PL happy path, login, access control, kreiranje narudžbe | ~21 |
| **Ukupno** | | | **~2 004** |

**Pokrivenost** (Juli 2026): 98.7% line coverage (isključujući EF migracije i Blazor UI sloj koji su pokriveni bUnit i integracijskim testovima).

### Konvencije

- **AAA pattern**: svaki test = Arrange / Act / Assert
- **DAMP, ne DRY**: test helpers se dupliciraju gdje je to čitkije od apstrakcije
- **BVA (Boundary Value Analysis)**: validacijski testovi pokrivaju granične vrijednosti (0, 1, max, max+1)
- **Determinizam**: `FakeClock` za sve testove koji asertuju SLA rokove; Guid u in-memory DB imenu za izolaciju
- **Namjenski NSubstitute stubs** za Infrastructure u Api.Tests (IUserRoleProvider, IUserSuspensionService)

### Coverage ciljevi

| Sloj | Cilj | Dostignuto |
|------|------|-----------|
| Application (business logika) | 98% | 99.6% ✓ |
| Domain | 98% | 98.4% ✓ |
| Infrastructure (bez migracija) | 95% | 98.7% ✓ |
| Api (endpoint routing, auth) | 90% | 98.1% ✓ |

---

## Alternativna rješenja

| Opcija | Feedback brzina | Realnost | Coverage | Zašto nije izabrana / Status |
|--------|----------------|---------|---------|---------------------|
| **Test piramida (unit + integration + E2E)** ✓ | Visoka | Visoka | 98.7% | Implementirano — sva četiri sloja aktivna |
| Samo E2E (Playwright) | Niska (sporo) | Visoka | Parcijalna | E2E testovi su spori i ne mogu pokriti sva edge cases u business logici |
| Samo unit testovi (bez integracijskih) | Visoka | Parcijalna | Visoka (lažna sigurnost) | Unit testovi s mockovima ne otkrivaju probleme u EF Core konfiguraciji, auth ili endpoint ruting-u |

---

## Consequences

### Pozitivne
- 2 000 testova pruža visok nivo povjerenja pri svim refaktoringima i novim feature-ima
- `WebApplicationFactory` s in-memory DB znači da integracijski testovi ne zahtijevaju pokrenuti PostgreSQL ili Keycloak
- FluentAssertions s readable assertion porukama drastično ubrzava debugging failing testova
- 98.7% pokrivenost je mjerljiv indikator koji daje sigurnost pri deployment-u

### Negativne
- Visoka pokrivenost ne garantuje ispravnost — testovi moraju biti smisleni, ne samo ispuniti coverage metriku
- `WebApplicationFactory` testovi su spori (~50ms po testu zbog HTTP overhead-a) — svi Application.Tests moraju ostati brzi
- Svaki novi feature zahtijeva testove koji povećavaju ukupno trajanje test suitea

### Svjesno prihvaćeni kompromisi
- Prihvatamo ~60 sekundi ukupnog test run trajanja (2 000 testova) kao prihvatljiv CI feedback loop. Alternativa — manji test suite — bi smanjila povjerenje u sistem koji ima regulatorne zahtjeve.

---

## Tehnički dug

- **E2E Playwright testovi implementirani** (Juli 2026) — `tests/E2E.Tests/` pokriva FL/PL happy path, login, access control, kreiranje narudžbe, workflow kroz sve role (AM, CA, CO, Vještak). Pokreće se na CI (`e2e-tests` job) uz Keycloak + API + BlazorApp.
- BlazorApp.Tests ima samo 6 testova — Blazor komponente su loše pokrivene bUnit testovima

---

## Migration Impact

- **Breaking Changes:** Nema — ovo je test strategija, ne production artifact
- **Rollback Plan:** Test projekti mogu biti modificirani ili uklonjeni bez uticaja na produkciju
- **Compatibility:** xUnit 2.9.3, NSubstitute 5.3.0, FluentAssertions 6.12.2, bUnit 1.37.x

---

## Kada revidirati

- Test run trajanje pređe 5 minuta u CI za unit/integration suite — tada treba paralelizacija ili test projekt split
- E2E suite postane blocker za CI (flaky ili prespori) — tada razmotriti selective E2E ili test env optimizaciju
- Coverage cilj treba biti podignut iznad 98% radi novih regulatornih zahtjeva
