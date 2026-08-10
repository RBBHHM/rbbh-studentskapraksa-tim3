# Arhitektonske odluke — Pregled

> Digitalizacija narudžbi procjene nekretnina · .NET 10 · Blazor Server · PostgreSQL · Keycloak  
> **36 arhitektonskih odluka** · Juli 2026  
> Detalji po odluci → individualni ADR fajlovi · Inženjerske konvencije → [engineering-standards.md](engineering-standards.md)

---

## Šira slika — sve odluke na jednom mjestu

| ADR | Naziv | Kategorija | Status | Kratki opis |
|-----|-------|-----------|--------|-------------|
| [001](ADR-001-monorepo.md) | Monorepo struktura | Arhitektura | ✅ Accepted | Jedan Git repo za sve slojeve; atomski commit API+UI |
| [002](ADR-002-clean-architecture.md) | Clean Architecture | Arhitektura | ✅ Accepted | Domain→Application→Infrastructure→Api/UI; nema zavisnosti prema gore |
| [003](ADR-003-keycloak-oidc.md) | Keycloak / OIDC | Arhitektura | ✅ Accepted | Self-hosted IdP; Authorization Code Flow za Blazor; JWT Bearer za API |
| [004](ADR-004-cqrs-mediatr.md) | CQRS + MediatR | Arhitektura | ✅ Accepted | Commands/Queries kroz MediatR; pipeline Logging→Validation→opt-in Audit |
| [005](ADR-005-ports-and-adapters.md) | Ports & Adapters | Arhitektura | ✅ Accepted | Svaki vanjski resurs ima interfejs u Application; implementacija u Infrastructure |
| [006](ADR-006-audit-strategy.md) | Audit strategija | Arhitektura | ✅ Accepted | Multi-sink (DB+file fallback); transakcioni outbox za durability; PII masking |
| [007](ADR-007-state-machine.md) | Workflow state machine | Domen | ✅ Accepted | Centralizovani graph dozvoljenih prijelaza; 25+ statusa; EnsureValidTransition() |
| [008](ADR-008-taskitem-workflow.md) | TaskItem model | Domen | ✅ Accepted | Operativni sloj uz state machine; "Moji zadaci", SLA rokovi, ekskluzivna brava |
| [009](ADR-009-workflow-type-discriminator.md) | WorkflowType diskriminator | Domen | ✅ Accepted | Enum FL/PL kao kanonski diskriminator; IsFL()/IsPL() umjesto string poređenja |
| [010](ADR-010-soft-delete.md) | Soft delete | Domen | ✅ Accepted | IsDeleted flag + EF query filter; bankarska politika zabranjuje fizičko brisanje |
| [011](ADR-011-optimistic-concurrency.md) | Optimistički concurrency | Domen | ✅ Accepted | IConcurrencyAware + PostgreSQL xmin; selektivno samo za AppraisalOrder i TaskItem |
| [012](ADR-012-invoice-subworkflow.md) | Invoice sub-workflow | Domen | ✅ Accepted | Tri-state (NotStarted→Uploaded→SentForPayment→Paid) embeddiran na narudžbi |
| [013](ADR-013-quoterequest-bidding.md) | QuoteRequest bidding | Domen | ✅ Accepted | PL workflow: CA šalje ponude na N vještaka; CO bira najpovoljnijeg |
| [014](ADR-014-appraiser-blacklist.md) | Per-order blacklista | Domen | ✅ Accepted | Odbijeni/timeout vještak ne može biti ponovo odabran za istu narudžbu |
| [015](ADR-015-sequential-identifiers.md) | Atomičnost identifikatora | Domen | ⚠️ Djelimično | Protokolni broj: UPSERT ✅ · Broj narudžbe: COUNT+1 ❌ kritičan race condition |
| [016](ADR-016-document-versioning.md) | Document versioning | Domen | ✅ Accepted | CreateNewVersion pattern; svaka verzija trajno dostupna; IsCurrentVersion flag |
| [017](ADR-017-ef-core-direct.md) | Direktan EF Core | Persistencija | ✅ Accepted | DbContext direktno u servisima; bez Generic Repository; InMemory za testove |
| [018](ADR-018-ef-migrations.md) | EF migracije | Persistencija | ⚠️ Needs Review | In-process pri startapu; race condition za multi-instance — treba init container |
| [019](ADR-019-branch-normalization.md) | Branch normalizacija | Persistencija | ⚠️ Needs Review | CityId+BranchId FK; BranchCatalog statična lista treba biti zamijenjena DB upitom |
| [020](ADR-020-permission-rbac.md) | Permission-based RBAC | Sigurnost | ✅ Accepted | Permission claims u JWT; RolePermissionMatrix SSOT; bez DB per-request |
| [021](ADR-021-layered-security.md) | Slojeviti sigurnosni model | Sigurnost | ✅ Accepted | 5 slojeva: mreža→auth→autorizacija→podaci→aplikacija; STRIDE mapiranje |
| [022](ADR-022-ropc-auth.md) | ROPC dual auth | Sigurnost | ⚠️ Needs Review | ROPC zadržan za UX; rate limit 5/min; depreciran u OAuth 2.1 — planirati uklanjanje |
| [023](ADR-023-pii-masking.md) | PII masking | Sigurnost | ✅ Accepted | Trostepeni regex: credentials→email→JMBG/telefon; parcijalni, ne potpuni masking |
| [024](ADR-024-rate-limiting.md) | Rate limiting | Sigurnost | ✅ Accepted | Selektivni per-endpoint filter; IDistributedRateLimiter; Redis upgrade path |
| [025](ADR-025-validation-ssot.md) | Dvostepena validacija | Servisna arh. | ✅ Accepted | FluentValidation po Commandu; statička OrderRequestValidator kao SSOT |
| [026](ADR-026-service-split-facade.md) | Servisni split — Facade | Servisna arh. | ✅ Accepted | Facade + fokusirani sub-servisi; backward compat za handlere |
| [027](ADR-027-sla-enforcement.md) | SLA enforcement | Servisna arh. | ⚠️ Needs Review | BackgroundService + IDistributedJobLock; TimeoutWindow hardkodiran — treba konfig |
| [028](ADR-028-codebook-import-twophase.md) | Dvofazni import | Servisna arh. | ✅ Accepted | Preview (Faza 1, Guid token) → Confirm (Faza 2); bez dugotrajnih transakcija |
| [029](ADR-029-notifications.md) | Dual-channel notifikacije | Servisna arh. | ✅ Accepted | In-app inbox + SMTP; role fan-out; 5-min email deduplication |
| [030](ADR-030-idempotency.md) | Idempotentnost | Servisna arh. | ✅ Accepted | State machine guard + IsLocked + acting flag; višeslojna zaštita od duplikata |
| [031](ADR-031-exception-handling.md) | Exception handling | Servisna arh. | ✅ Accepted | 4 tipa (Not Found/Conflict/Forbidden/Validation); GlobalExceptionHandler; ErrorCode |
| [032](ADR-032-identity-abstractions.md) | Identity apstrakcije | Servisna arh. | ✅ Accepted | ICurrentUserService (JWT, sync) vs IUserRoleProvider (Keycloak, async) |
| [033](ADR-033-blazor-server.md) | Blazor Server | Frontend | ✅ Accepted | InteractiveServer rendermod; server-side OIDC; sticky sessions za multi-node |
| [034](ADR-034-blazor-auth-architecture.md) | Blazor auth arhitektura | Frontend | ✅ Accepted | RequestMessageHandler (token refresh) + ActiveRoleState (per-tab) + Result&lt;T&gt; |
| [035](ADR-035-file-storage.md) | File storage | Dokumenti | ⚠️ Needs Review | Lokalni disk za dev; IFileStorageProvider apstrakcija; MinIO treba za produkciju |
| [036](ADR-036-test-strategy.md) | Test strategija | Kvalitet | ✅ Accepted | Test piramida: 2 000 testova, 98.7% pokrivenost; xUnit+NSubstitute+bUnit |

---

## Status legenda

| Simbol | Značenje |
|--------|---------|
| ✅ Accepted | Odluka je implementirana i stabilna |
| ⚠️ Needs Review | Identificiran problem koji treba biti riješen — vidi akcioni plan |
| ⚠️ Djelimično | Dio odluke je riješen; preostali problem dokumentovan u ADR |

---

## Akcioni plan — šta treba riješiti

| Prioritet | ADR | Problem | Akcija |
|-----------|-----|---------|--------|
| 🔴 Kritičan | [015](ADR-015-sequential-identifiers.md) | Broj narudžbe — race condition (COUNT+1) | Migrirati na PostgreSQL UPSERT pattern |
| 🟠 Visok | [035](ADR-035-file-storage.md) | Lokalni disk nije produkcijski | Implementirati MinioFileStorageProvider |
| 🟠 Visok | [018](ADR-018-ef-migrations.md) | In-process migracija nije multi-instance safe | Migration init container |
| 🟡 Srednji | [027](ADR-027-sla-enforcement.md) | TimeoutWindow hardkodiran; InMemoryJobLock za single-node | WorkflowSlaOptions + RedisJobLock |
| 🟡 Srednji | [019](ADR-019-branch-normalization.md) | BranchCatalog statična lista zahtijeva rekompajl | Zamijeniti DB upitom |
| 🟢 Nizak | [022](ADR-022-ropc-auth.md) | ROPC depreciran u OAuth 2.1 | Planirati uklanjanje kada OIDC UX bude prihvatljiv |

---

## Inženjerski standardi

Odluke na implementacijskom nivou koje nisu arhitektonske prirode premještene su u [engineering-standards.md](engineering-standards.md):

- EF Core snake_case mapping, AsNoTracking, JSONB, child entity query filter
- Health checks, Correlation ID, OpenAPI konfiguracija, PagedResult format
- RolePriorityResolver, AM/SM/UB permission set, OrderAuthorizationGuard
- UI Design Tokens, Fail-fast validacija, Hide vs Gray, Bosanska slova
- X-Active-Role header, Document download audit, Deaktivacija šifarnika
- IClock apstrakcija, Keycloak URL split, Invarijanta minimalno jedan admin
