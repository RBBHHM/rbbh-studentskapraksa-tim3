# Studentska praksa — ETF 2026

> **RBI React aplikacija:** aktivni frontend je u [`src/Web`](src/Web). Poslovne
> funkcionalnosti originalnog Blazor interfejsa migrirane su na React, dok je
> [`src/BlazorApp`](src/BlazorApp) zadržan samo kao historijska referenca.

Full-stack aplikacija izgrađena prema Clean Architecture principima.

**Stack:** React 19 · TypeScript · TanStack · Vite · .NET 10 Minimal API · PostgreSQL · Keycloak

---

## Struktura projekta

```
studentskapraksaTema3/
├── src/
│   ├── Api/            — ASP.NET Core Web API (Minimal API)  ← backend
│   ├── Application/    — Poslovna logika, interfejsi, use cases
│   ├── Domain/         — Entiteti, value objects, domenski eventi
│   ├── Infrastructure/ — EF Core, Keycloak, Audit, External connectors
│   ├── Web/            — React + RBI design system  ← AKTIVNI frontend
│   ├── BlazorApp/      — originalni Blazor UI, historijska referenca
│   └── GIT.TransactionIdempotency/  — [LEGACY] stari API, ne koristi se
│
├── tests/
│   ├── Api.Tests/          — Integracijski testovi API-ja
│   └── Application.Tests/  — Unit testovi Application sloja
│
├── docker/             — Docker Compose i Dockerfiles
├── docs/               — Arhitekturna dokumentacija
├── studentskapraksa.slnx — Root solution (Clean Architecture)
└── src/GIT.TransactionIdempotency.sln — Legacy solution
```

Detaljna struktura: [docs/architecture/repository-structure.md](docs/architecture/repository-structure.md)

---

## Pokretanje (Docker Compose)

```bash
# Kopiraj i popuni env varijable
cp .env.example .env

# Pokreni sve servise (api + web + db + keycloak + nginx)
docker compose -f docker/docker-compose.yml \
               -f docker/docker-compose.override.yml up --build
```

| Servis | URL |
|--------|-----|
| API | http://localhost:5000 |
| Web (React dev server) | http://localhost:8080 |
| Keycloak | http://localhost:8183 |
| nginx | http://localhost:80 |

> **Login:** otvorite URL koji ispiše Vite, kliknite **Prijava** i prijavite se na Keycloak stranici.

### Test korisnici

| Korisnik | Lozinka | Rola |
|---|---|---|
| admin.test | Admin1234! | Administrator |
| admin2.test | Admin1234! | Administrator |
| unosnik.test | Unosnik1234! | Unosnik |
| verifikator.test | Verifikator1234! | Verifikator |
| prodaja.test | Prodaja1234! | Prodaja |
| kolateraladministrator.test | KolateralAdministrator1234! | KolateralAdministrator |
| kolateraloficir.test | KolateralOficir1234! | KolateralOficir |
| vjestak.test | Vjestak1234! | Vjestak |
| pravnasluzba.test | PravnaSluzba1234! | PravnaSluzba |
| protokol.test | Protokol1234! | Protokol |

> Lozinke su definisane u [docker/keycloak/realm-export.json](docker/keycloak/realm-export.json) i samo su za dev/test okruženje.

---

## Pokretanje (lokalno, bez Docker-a)

> Zahtijeva .NET 10 SDK. Ako lokalno imate samo .NET 9, koristite Docker put iznad.

```bash
# Terminal 1 — API
dotnet run --project src/Api

# Terminal 2 — React frontend
cd src/Web
pnpm install
pnpm dev
```

Detaljna uputa za lokalnu bazu, Keycloak, API i React: [HOW-TO-RUN.md](HOW-TO-RUN.md).

---

## Build

```bash
# Clean Architecture solution
dotnet build studentskapraksa.slnx --configuration Release

# React
cd src/Web
pnpm lint
pnpm build
```

---

## Testovi

```bash
# Clean Architecture testovi
dotnet test studentskapraksa.slnx --verbosity normal

# Legacy testovi
dotnet test src/GIT.TransactionIdempotency.sln --verbosity normal
```

---

## EF Core migracije

```bash
dotnet ef migrations add <ImeMigracije> \
  --project src/Infrastructure \
  --startup-project src/Api

dotnet ef database update \
  --project src/Infrastructure \
  --startup-project src/Api
```

---

## Dokumentacija

| Dokument | Opis |
|----------|------|
| [Architecture overview](docs/architecture/overview.md) | Stack i dijagram arhitekture |
| [Clean Architecture](docs/architecture/clean-architecture.md) | Zavisnosti slojeva |
| [Repository structure](docs/architecture/repository-structure.md) | Objašnjenje foldera |
| [ADR 0001 — Monorepo](docs/adr/0001-monorepo-structure.md) | Odluka o mono-repo |
| [ADR 0002 — Clean Architecture](docs/adr/0002-clean-architecture.md) | Arhitekturna odluka |
| [ADR 0003 — Keycloak](docs/adr/0003-keycloak-auth.md) | Auth odluka |
| [ADR 0004 — Generički audit](docs/adr/0004-generic-application-audit.md) | Audit strategija |
| [Backend smjernice](docs/backend/backend-guidelines.md) | Coding standardi |
| [API standardi](docs/backend/api-standards.md) | REST konvencije |
| [Audit log](docs/backend/audit-log.md) | Generički audit scaffold |
| [Frontend smjernice](docs/frontend/frontend-guidelines.md) | Blazor konvencije |
| [Lokalni razvoj](docs/devops/local-development.md) | Setup upute |
| [Docker](docs/devops/docker.md) | Docker smjernice |
| [Deployment](docs/deployment/OCP-IIS.md) | API na OCP-u i React frontend na IIS-u |

---

## Research agent

Za praćenje AI interakcija tokom prakse:

```bash
npm install
npm run research:start        # pokreni watcher
npm run research:upload -- --student=<ID>  # pošalji logove mentoru
npm run research:doctor       # health check
```

Detalji u originalnom README-u sačuvanom u [docs/INITIAL_SETUP.md](docs/INITIAL_SETUP.md).

---

## Licenca

MIT
# Produkcijski deployment

Novi ciljni model je odvojeni deployment: .NET API ide kao container na OCP, a React
frontend kao statički artifact na IIS. Workflowi, potrebne GitHub/OCP varijable,
redoslijed isporuke i rollback opisani su u
[`docs/deployment/OCP-IIS.md`](docs/deployment/OCP-IIS.md).
