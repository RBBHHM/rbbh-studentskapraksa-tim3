# Struktura Projekta — Studentska Praksa 2026

## Pregled Repozitorija

Ovo je full-stack .NET 10 aplikacija sa research agent tooling-om za praćenje AI-asistiranog razvoja.

---

## Direktorijumska Struktura

```
studentskapraksaTema3/
├── .github/
│   ├── copilot-instructions.md      ← Globalne Copilot instrukcije
│   └── workflows/                   ← GitHub Actions CI/CD
├── .research/                       ← Research agent data (ne commituj)
├── docs/
│   ├── ai/                          ← AI agent modovi (kreiraj)
│   ├── github-best-practices.md
│   └── PROJECT_STRUCTURE.md         ← Ovaj fajl
├── docker/
│   ├── docker-compose.yml           ← Local development stack
│   ├── Dockerfile.api               ← .NET API image
│   └── Dockerfile.web               ← Blazor web image
├── research-cli/                    ← CLI za praćenje AI rada
│   ├── commands/
│   ├── lib/
│   └── maintenance/
├── src/
│   ├── GIT.TransactionIdempotency/  ← Backend API (.NET 10)
│   │   ├── API/                     ← Controllers, endpoints
│   │   ├── BL/                      ← Business logic layer
│   │   ├── DL/                      ← Data layer (EF Core, repos)
│   │   ├── Exceptions/              ← Exception handling
│   │   ├── Helpers/                 ← Utilities, constants
│   │   ├── IoC/                     ← Dependency injection
│   │   ├── Middlewares/             ← Request/response middleware
│   │   ├── Properties/              ← Launch settings
│   │   ├── Program.cs               ← App bootstrap
│   │   └── *.csproj                 ← Project file
│   ├── BlazorApp/                   ← Frontend (Blazor Server)
│   │   ├── Auth/                    ← Authentication/OIDC
│   │   ├── Components/              ← Razor components
│   │   ├── Pages/                   ← Page components
│   │   ├── Services/                ← API clients, state
│   │   ├── Shared/                  ← Shared layout
│   │   ├── wwwroot/                 ← Static assets
│   │   ├── Program.cs
│   │   └── *.csproj
│   ├── IntegrationTests/            ← Integration tests (xUnit + TestContainers)
│   │   └── Tests/
│   ├── UnitTests/                   ← Unit tests (xUnit)
│   │   ├── Controllers/
│   │   ├── Services/
│   │   └── Helpers/
│   └── README.md
├── Makefile                         ← Task runner (build, test, run)
├── package.json                     ← Node.js research CLI
├── CLAUDE.md                        ← AI instrukcije za rad
├── README.md                        ← Main project README
└── .env.example                     ← Environment template
```

---

## Arhitektura

### Backend: GIT.TransactionIdempotency

**Framework:** .NET 10  
**Pattern:** Layered architecture (API → BL → DL)  
**Database:** PostgreSQL (EF Core Code-First)  
**Auth:** Keycloak (OIDC/OAuth2, JWT)

#### Slojevi:

1. **API Layer** (`/API`)
   - REST endpoints (Controllers ili Minimal API)
   - Request validation
   - Response mapping (DTO-to-Entity)
   - HTTP status codes

2. **Business Logic Layer** (`/BL`)
   - Service classes
   - Domain rules
   - Business workflows
   - Transaction management

3. **Data Layer** (`/DL`)
   - EF Core DbContext
   - Repository pattern
   - Database migrations
   - Seed data

4. **Cross-Cutting** 
   - Exception handling (`/Exceptions`)
   - Middleware (`/Middlewares`)
   - Helpers & Utils (`/Helpers`)
   - Dependency injection (`/IoC`)

### Frontend: BlazorApp

**Framework:** Blazor Server  
**Language:** C# with Razor Components  
**Auth:** Keycloak OIDC integration  
**State:** Component state + shared services

#### Struktura:

- **Pages/** — Routable components (@page directive)
- **Components/** — Reusable Razor components
- **Services/** — API clients (HttpClient wrapper)
- **Auth/** — OIDC authentication providers
- **Shared/** — Layouts, navigation
- **wwwroot/** — CSS, JS, static files

### Testing

- **UnitTests/** — Service, Helper, Middleware tests
- **IntegrationTests/** — API + Database tests (TestContainers)

---

## Tech Stack

| Komponenta | Tehnologija | Verzija | Uloga |
|---|---|---|---|
| Backend | .NET | 10 | Core API |
| Frontend | Blazor Server | .NET 10 | UI/UX |
| Database | PostgreSQL | 16 | Persistence |
| ORM | Entity Framework Core | 10 | Data access |
| Auth | Keycloak | Latest | Identity provider |
| Testing | xUnit | Latest | Test framework |
| Containers | Docker/Compose | Latest | Local & prod |
| CI/CD | GitHub Actions | - | Automation |
| Research | Node.js CLI | 16+ | AI tracking |
| AI Tools | GitHub Copilot | - | Development |

---

## Okruženja

### Local Development

```bash
# Start: PostgreSQL + Keycloak + API + Web
docker-compose -f docker/docker-compose.yml up -d

# API: http://localhost:5000
# Web: http://localhost:5001
# Keycloak: http://localhost:8080
# DB: localhost:5432
```

### Production (Hetzner)

- Single VPS (CX21: 2vCPU, 4GB RAM)
- Docker Compose stack
- Nginx reverse proxy
- SSL (Let's Encrypt)

---

## Ključne Datoteke

| Fajl | Opis |
|---|---|
| `Program.cs` (API) | DI setup, middleware pipeline, Keycloak config |
| `Program.cs` (Web) | Blazor routing, auth setup |
| `appsettings.json` | Connection strings, auth settings |
| `docker-compose.yml` | Local dev environment |
| `Makefile` | Build, test, run commands |
| `package.json` | Research CLI scripts |
| `.env.example` | Environment variable template |

---

## Početne Obveze po Ulozi

### Tech Lead

- [ ] Provjeri branch protection rules
- [ ] Validiraj repo structure u `.github/`
- [ ] Pripremi code review checklist
- [ ] Kreiraj Sprint 1 Trello board

### Backend Dev

- [ ] Setup .NET 10 SDK lokalno
- [ ] Provjeri appsettings.json za local dev
- [ ] Testiraj `dotnet build` i `dotnet test`
- [ ] Upoznaj se sa DL/BL/API slojevima

### Frontend Dev

- [ ] Setup Blazor environment
- [ ] Provjeri Keycloak auth config
- [ ] Testiraj `BlazorApp` pokretanje
- [ ] Upoznaj se sa page routing

### DevOps

- [ ] Testiraj `docker-compose up`
- [ ] Provjeri PostgreSQL konekciju
- [ ] Setup `.env` iz `.env.example`
- [ ] Provjeri Hetzner pristup

### QA

- [ ] Provjeri test setup (xUnit, TestContainers)
- [ ] Kreiraj test plan template
- [ ] Upoznaj se sa acceptance criteria format
- [ ] Setup Trello QA workflow

---

## Sigurnost & Environment

### Tajna Upravljanja

```bash
# Nikada u repo!
- Database passwords
- Keycloak admin credentials
- API keys
- JWT secrets

# Koristi .env (localno) i GitHub Secrets (CI/CD)
```

### .env Template

```env
POSTGRES_USER=student
POSTGRES_PASSWORD=changeme
POSTGRES_DB=studentskapraksa
ANTHROPIC_API_KEY=...
```

---

## Sljedeće Korake

1. Pregledate ovu dokumentaciju
2. Pročitajte [docs/ai/](./ai/) za AI agent modove
3. Pogledajte Sprint 1 plan
4. Pokrenut setup prema inicijalna instrukcije
