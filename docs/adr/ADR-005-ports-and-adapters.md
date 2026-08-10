# ADR-005: Ports & Adapters — zamjenjiva infrastruktura

**Status:** Accepted  
**Kategorija:** A — Osnovna arhitektura  
**Owner:** Arhitekta  
**Datum donošenja:** Oktobar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako se uvede zahtjev za višestrukim istovremenim implementacijama istog porta (npr. hibridni storage)  
**Zahvaćeni moduli:** Application (interfejsi), Infrastructure (implementacije)  
**User Stories:** Sve — svi feature-i koriste barem jedan od ovih portova

---

## Kontekst

Sistem komunicira s vanjskim resursima: SMTP server za e-mail, lokalni disk za fajlove, PostgreSQL za distribuirane brave, Keycloak Admin API za upravljanje korisnicima. Da li te zavisnosti smiju biti direktno pozvane iz Application ili Domain sloja?

Clean Architecture (ADR-002) kaže ne — Domain i Application sloj ne smiju znati za konkretne infrastrukturne implementacije. No to treba biti operacionalizovano kroz konkretne interfejse.

---

## Decision Drivers

- **Testabilnost bez infrastrukture** — unit testovi Application handlera trebaju moći koristiti lažne implementacije (NSubstitute stubs) bez potrebe za pokrenuti PostgreSQL ili SMTP serverom
- **Zamjenjivost** — lokalni disk storage treba biti zamjenjiv S3/MinIO bez promjene koda koji koristi storage; in-memory rate limiter treba biti zamjenjiv Redis implementacijom bez promjene endpointa
- **Eksplicitna granica zavisnosti** — svaka vanjska zavisnost treba biti vidljiva kao interfejs u Application sloju, ne kao konkretna klasa iz Infrastructure paketa

---

## Odluka

Svaki vanjski resurs ima **port** (interfejs) definisan u Application sloju i **adapter** (konkretnu implementaciju) u Infrastructure sloju.

| Port (Application) | Adapter (Infrastructure) | Alternativni adapter |
|---------------------|--------------------------|----------------------|
| `INotificationProvider` | `EmailNotificationProvider` (MailKit SMTP) | — |
| `INotificationService` | `NotificationService` (in-app DB) | — |
| `IFileStorageProvider` | `LocalFileStorageProvider` | `S3FileStorageProvider` (nije implementiran) |
| `IDistributedJobLock` | `PostgresJobLock` (pg_try_advisory_lock) | `InMemoryJobLock` (testovi) |
| `IDistributedRateLimiter` | `InMemoryDistributedRateLimiter` | `RedisDistributedRateLimiter` (nije impl.) |
| `IAuditSink` | `DatabaseAuditSink` + `FileAuditSink` (fallback) | `FallbackAuditSink` (orchestrator) |
| `IClock` | `SystemClock` (produkcija) | `FakeClock` (testovi) |
| `IUserRoleProvider` | `KeycloakUserRoleProvider` | — |
| `IUserSuspensionService` | `UserSuspensionService` (Keycloak Admin) | — |
| `IExcelReportBuilder` | `ClosedXmlExcelReportBuilder` | — |

DI registracija: produkcijski adapteri registrovani u `Infrastructure.DependencyInjection`. Testni adapteri registrovani u `WebApplicationFactory.ConfigureWebHost` (za integracacione testove) ili direktno u unit testovima.

---

## Alternativna rješenja

| Opcija | Testabilnost | Zamjenjivost | Boilerplate | Zašto nije izabrana |
|--------|-------------|-------------|-------------|---------------------|
| **Port + Adapter interfejsi** ✓ | Visoka (stub kroz NSubstitute) | ✓ | Srednji | — |
| Direktno instanciranje (new SmtpClient()) | Nema (ne može se zameniti) | ✗ | Nema | Nemoguće testirati bez živog SMTP servera; zamjena implementacije zahtijeva promjenu svih pozivnih mjesta |
| Statički fasadni wrapper | Parcijalna (ambient context) | Djelimično | Nizak | Ambient context je anti-pattern u višedretnom okruženju (.NET DI Scoped bolje rješava problem) |

---

## Consequences

### Pozitivne
- Integracija testovi API sloja stubuju `IUserRoleProvider`, `IUserSuspensionService` i `IDistributedJobLock` — nema poziva prema Keycloak-u ili PostgreSQL-specifičnim lockovima tokom test runova
- Dodavanje novog audit sinka (npr. Elasticsearch) zahtijeva: novu Infrastructure klasu + DI registraciju, bez promjene IAuditService ili bilo kojeg handlera
- `IClock` apstrakcija omogućava determinističke SLA testove s `FakeClock` bez čekanja stvarnog vremena
- Moguće je pokrenuti aplikaciju s `InMemoryJobLock` u development okruženju gdje Redis nije dostupan

### Negativne
- Svaki novi vanjski resurs zahtijeva dizajniranje interfejsa koji mora biti stabilan — promjena interfejsa je breaking change za sve adaptere
- DI kontejner postaje centralno koordinaciono mjesto; misregistracija u `WebApplicationFactory` može uzrokovati nepredvidive test greške
- Indirekcija kroz interfejse otežava stack trace analizu u nekim scenarijima

### Svjesno prihvaćeni kompromisi
- Prihvatamo trostruku strukturu (port + adapter + DI wiring) za svaki vanjski resurs jer alternativa — direktne zavisnosti na infrastrukturne klase — čini testiranje poslovne logike nemoguće bez živih vanjskih servisa. Na projektu koji ima regulatorne zahtjeve i 2000 automatizovanih testova, to je neprihvatljivo.

---

## Tehnički dug

- `S3FileStorageProvider` i `RedisDistributedRateLimiter` definirani su kao buduće implementacije ali nisu napisani — produkcijski deployment zahtijeva jedan od ta dva (vidi [ADR-035](ADR-035-file-storage.md) i [ADR-024](ADR-024-rate-limiting.md))
- `KeycloakUserRoleProvider` nema retry/circuit-breaker wrapper — Keycloak downtime se direktno propaga kao HTTP 500

---

## Migration Impact

- **Breaking Changes:** Promjena signatre interfejsa je breaking change za sve adaptere. Interfejsi trebaju biti mijenjani uz verzioniranje.
- **Rollback Plan:** Svaka konkretna implementacija može biti zamijenjena drugom kroz DI konfiguraciju bez promjene koda koji koristi port
- **Compatibility:** Svi portovi su .NET interfejsi bez specifičnosti prema vanjskim bibliotekama

---

## Kada revidirati

- Potreban je hibridni storage (npr. lokalni disk za male fajlove, S3 za velike) — tada IFileStorageProvider mora biti revidiran ili split
- Broj portova poraste do mjere gdje DI konfiguracija postane teška za pregled (> 20 portova je signal)
