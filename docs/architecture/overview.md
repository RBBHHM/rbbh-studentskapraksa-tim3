# Pregled arhitekture

## Stack

| Sloj | Tehnologija | Verzija |
|------|-------------|---------|
| Backend API | ASP.NET Core Minimal API | .NET 10 |
| Frontend | Blazor WebAssembly | .NET 10 |
| Baza podataka | PostgreSQL | 16 |
| Autentifikacija | Keycloak + JWT | 24.x |
| ORM | Entity Framework Core + Npgsql | 9.x / 10.x |
| Reverse proxy | nginx | alpine |
| Kontejnerizacija | Docker + Docker Compose | v2 |
| CI/CD | GitHub Actions | — |
| Hosting | Hetzner VPS | — |

## Arhitekturni dijagram

```
┌─────────────────────────────────────────────┐
│              Browser / Klijent               │
└────────────────────┬────────────────────────┘
                     │ HTTPS :443
                     ▼
┌─────────────────────────────────────────────┐
│               nginx (reverse proxy)          │
│  /api/*  →  API :5000                       │
│  /*      →  Web (Blazor WASM) :80           │
└──────────┬──────────────────────────────────┘
           │                    │
           ▼                    ▼
┌──────────────────┐  ┌─────────────────────┐
│   ASP.NET API    │  │  Blazor WebAssembly  │
│   (src/Api)      │  │   (src/Web)          │
│   :5000          │  │   statički fajlovi   │
└────────┬─────────┘  └─────────────────────┘
         │
         │ EF Core
         ▼
┌──────────────────┐
│   PostgreSQL     │
│   :5432          │
└──────────────────┘
         ▲
         │ JDBC
┌──────────────────┐
│    Keycloak      │
│    :8080         │
└──────────────────┘
```

## Autentifikacijski tok

1. Korisnik otvori Blazor app → redirect na Keycloak login
2. Keycloak izda JWT token
3. Blazor uključuje token u `Authorization: Bearer` header
4. API validira token (JWT Bearer middleware)
5. `CurrentUserService` čita claims iz tokena

## TODO

- Definisati Keycloak realm i klijente
- Implementirati frontend OIDC flow
- Konfigurirati HTTPS (Let's Encrypt ili self-signed za dev)
