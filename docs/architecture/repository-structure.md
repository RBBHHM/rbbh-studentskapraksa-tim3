# Struktura repozitorija

Mono-repo koji sadrži Clean Architecture backend, Blazor WASM frontend i legacy projekte koji se postepeno migriraju.

```
studentskapraksaTema3/
│
├── .github/
│   └── workflows/
│       ├── build-and-push-artifact.yaml — backend image u Artifactory
│       ├── deploy-to-ocp.yaml           — backend deploy na OpenShift
│       └── codeql.yml                   — C# sigurnosna analiza
│
├── docker/
│   ├── docker-compose.yml          — produkcija: api, web, db
│   ├── docker-compose.override.yml — lokalni razvoj: + keycloak, nginx
│   ├── api.Dockerfile              — Clean Architecture API
│   ├── web.Dockerfile              — Blazor WASM (nginx servira)
│   ├── Dockerfile.api              — Legacy API (GIT.TransactionIdempotency)
│   ├── Dockerfile.web              — Legacy Web (BlazorApp)
│   ├── nginx/
│   │   └── nginx.conf              — reverse proxy konfiguracija
│   └── keycloak/
│       └── README.md               — uputstvo za realm konfiguraciju
│
├── docs/
│   ├── architecture/               — arhitekturne odluke i dijagrami
│   ├── adr/                        — Architecture Decision Records
│   ├── backend/                    — backend smjernice i standardi
│   ├── frontend/                   — frontend smjernice i UI/UX standardi
│   └── devops/                     — lokalni razvoj, Docker, deployment
│
├── src/
│   │
│   ├── Api/                        — [NOVI] ASP.NET Core Web API (Clean Architecture)
│   ├── Application/                — [NOVI] Poslovna logika, interfejsi, use caseovi
│   ├── Domain/                     — [NOVI] Entiteti, value objects, domenski eventi
│   ├── Infrastructure/             — [NOVI] EF Core, Keycloak, Audit, External connectors
│   ├── Web/                        — [NOVI] Blazor WebAssembly frontend
│   │
│   ├── GIT.TransactionIdempotency/ — [LEGACY] Postojeći monolitni API
│   ├── BlazorApp/                  — [LEGACY] Postojeći Blazor Server frontend
│   ├── UnitTests/                  — [LEGACY] Testovi za legacy API
│   ├── IntegrationTests/           — [LEGACY] Integracijski testovi za legacy API
│   └── GIT.TransactionIdempotency.sln — [LEGACY] Solution za legacy projekte
│
├── tests/
│   ├── Api.Tests/                  — [NOVI] Integracijski testovi za Clean Architecture API
│   └── Application.Tests/          — [NOVI] Unit testovi za Application sloj
│
├── studentskapraksa.slnx           — [NOVI] Root solution (Clean Architecture projekti)
├── .editorconfig                   — Coding style konfiguracija
├── .env.example                    — Template env varijabli
└── README.md                       — Uvod i upute za pokretanje
```

## Strategija migracije

Legacy projekti (`GIT.TransactionIdempotency`, `BlazorApp`) ostaju netaknuti. Novi razvoj ide u Clean Architecture projekte. Postepena migracija se planira po tiketima.

Vidi: [ADR 0001 — Monorepo struktura](../adr/0001-monorepo-structure.md)
