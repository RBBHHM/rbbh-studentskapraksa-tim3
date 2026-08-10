# ADR-021: Slojeviti sigurnosni model

**Status:** Accepted  
**Kategorija:** D — Sigurnost i autorizacija  
**Owner:** Arhitekta / Security Engineer  
**Datum donošenja:** Oktobar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako se promijeni trust boundary (npr. uvođenje external API klijenata)  
**Zahvaćeni moduli:** Svi  
**User Stories:** Sve — ovo je cross-cutting sigurnosni okvir

---

## Kontekst

Bankarski sistem zahtijeva sistematičan pristup sigurnosti koji nije ad-hoc. Umjesto da svaki developer razmišlja o sigurnosnim aspektima svog feature-a, sigurnost je ugradena u arhitektonski model na više razina — svaka razina brani od specifičnih klasa napada.

Ovaj ADR dokumentuje sigurnosne mjere i razloge donošenja svake, a referira na ostale ADR-ove gdje su detaljno opisane konkretne implementacije.

---

## Decision Drivers

- **Defense in Depth** — kompromitacija jednog sloja ne smije kompromitirati cijeli sistem
- **STRIDE model** — sustavna identifikacija prijetnji prije implementiranja kontrola
- **Bankarski regulatorni zahtjevi** — audit trail, kontrola pristupa i zaštita podataka su zahtjevi, ne opcije

---

## Odluka

Sigurnost je implementirana u pet slojeva koji se međusobno nadopunjuju:

### Sloj 1 — Mrežna razina

| Mjera | Implementacija |
|-------|---------------|
| HTTPS everywhere | `UseHttpsRedirection()` + Keycloak TLS |
| Rate limiting | `IDistributedRateLimiter` — per-endpoint (vidi [ADR-024](ADR-024-rate-limiting.md)) |
| Reverse proxy trust | `ForwardedHeaders` middleware s konfigurabilnom listom pouzdanih proksija |

### Sloj 2 — Autentifikacija

| Mjera | Implementacija |
|-------|---------------|
| OIDC / JWT | Keycloak (vidi [ADR-003](ADR-003-keycloak-oidc.md)) |
| Token validacija | JWT potpis verificiran lokalno s JWKS endpoint-om (bez DB poziva) |
| Session management | Server-side OIDC cookie za Blazor; Bearer token za API |
| ROPC mitigacija | Rate limit 5/min po IP-u (vidi [ADR-022](ADR-022-ropc-auth.md)) |

### Sloj 3 — Autorizacija

| Mjera | Implementacija |
|-------|---------------|
| Permission-based RBAC | Permission claims iz JWT (vidi [ADR-020](ADR-020-permission-rbac.md)) |
| Business-level autorizacija | `OrderAuthorizationGuard` — provjera vlasništva narudžbe i korisnički access |
| Audit odbijenih pristupa | `ForbiddenException` → `GlobalExceptionHandler` → Security audit event |

### Sloj 4 — Podaci

| Mjera | Implementacija |
|-------|---------------|
| PII masking | Trostepeni regex masking u audit logu (vidi [ADR-023](ADR-023-pii-masking.md)) |
| Soft delete | Podaci nikad fizički ne brišu (vidi [ADR-010](ADR-010-soft-delete.md)) |
| Optimistički concurrency | Zaštita od lost update napada (vidi [ADR-011](ADR-011-optimistic-concurrency.md)) |
| JSONB audit storage | Kompletna historija promjena u `audit_logs` tabeli |

### Sloj 5 — Aplikacijska sigurnost

| Mjera | Implementacija |
|-------|---------------|
| X-Active-Role header | Korišćen samo za audit kontekst — nikad za autorizacijske odluke |
| Idempotentnost | State machine guard + IsLocked na TaskItem (vidi [ADR-030](ADR-030-idempotency.md)) |
| Correlation ID | Header s max 64 char limitom za log injection zaštitu |
| ORM za DB pristup | EF Core parametrizovani upiti — SQL injection nije moguć kroz standardne upite |

### STRIDE mapiranje

| Prijetnja | Kontrola |
|-----------|---------|
| Spoofing | Keycloak OIDC + JWT validacija |
| Tampering | RowVersion optimistički concurrency; soft delete (ne može se prepisati) |
| Repudiation | Transakcioni audit outbox — svaka akcija auditirana |
| Information Disclosure | PII masking; permission-based pristup; OpenAPI samo u Development |
| DoS | Rate limiter per-endpoint |
| Elevation of Privilege | Permission claims iz potpisanog JWT; OrderAuthorizationGuard |

---

## Consequences

### Pozitivne
- Kompromitacija jednog sloja (npr. bypass rate limiter-a) ne daje napadaču pristup podacima bez autentifikacije i autorizacije
- Audit trail je kompletan — svaka akcija (uključujući odbijene) je zabilježena
- Developeri dobivaju sigurnosni okvir "by default" — ne moraju individualno razmišljati o svakom sloju

### Negativne
- Svaka nova feature treba biti svjesno smještena unutar ovog modela — nove rute moraju imati `RequireAuthorization()`; novi korisnik podacima mora biti provjeren kroz `OrderAuthorizationGuard`
- Testiranje sigurnosnih slojeva zahtijeva razumijevanje i jediničnih i integracijsikih testova (permission testovi su unit; auth flow testovi su integracijski)

### Svjesno prihvaćeni kompromisi
- Nema WAF (Web Application Firewall) — oslanjamo se na aplikacijski rate limiter i OIDC zaštitu. Za produkciju s internet-facing deployment-om, WAF bi bio preporučen.

---

## Tehnički dug

- `OrderAuthorizationGuard` nema eksplicitni unit test koji verifikuje da svaki endpoint s narudžbom prolazi kroz guard — moguće je dodati novi endpoint bez guard-a
- Nema automated security scan (DAST) u CI/CD pipeline-u

---

## Migration Impact

- **Breaking Changes:** Dodavanje novog sloja sigurnosti je uvijek additive i ne utiče na postojeće tokove
- **Rollback Plan:** Sigurnosne mjere ne mogu biti rollback-ane bez pažljive analize rizika
- **Compatibility:** Sve mjere su kompatibilne s trenutnim tech stackom

---

## Kada revidirati

- Promjena trust boundary (npr. external API klijenti koji nisu zaposlenici banke)
- Penetration testing identifikuje ranjivost u jednom od slojeva
- Promjena regulatornog okvira koji mijenja zahtjeve za zaštitom podataka
