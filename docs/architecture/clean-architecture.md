# Clean Architecture — Zavisnosti slojeva

## Dijagram zavisnosti

```
┌──────────────────────────────────────────────┐
│                    Api                        │
│  (Program.cs, Endpoints, Middleware)          │
│  ↓ referencira                               │
├──────────────┬───────────────────────────────┤
│ Application  │      Infrastructure           │
│ (Use Cases,  │ (EF Core, Keycloak,           │
│  Interfaces, │  Audit, ExternalSources)      │
│  Exceptions) │ ↓ referencira                │
│ ↓            ├───────────────────────────────┤
├──────────────►        Domain                 │
│              │ (Entities, Value Objects,      │
│              │  Domain Events)               │
└──────────────┴───────────────────────────────┘
```

## Pravila zavisnosti

| Sloj | Referencira | NE referencira |
|------|-------------|----------------|
| `Domain` | ništa | sve ostalo |
| `Application` | `Domain` | `Infrastructure`, `Api`, `Web` |
| `Infrastructure` | `Application`, `Domain` | `Api`, `Web` |
| `Api` | `Application`, `Infrastructure` | direktno `Domain` (osim tipa) |
| `Web` | ništa iz backenda | backend projekte |

## Što ide gdje

### Domain
- Entiteti i value objects
- Domenski eventi
- Bazne klase (`BaseEntity`)
- Domenski interfejsi koji opisuju domenska pravila
- **NEMA:** EF Core atributa, HTTP, Keycloak, vanjskih biblioteka

### Application
- Use case handleri (CQRS Commands/Queries)
- Interfejsi koje Infrastructure implementira (`ICurrentUserService`, `IAuditService`...)
- DTO modeli za use caseove
- Validacijska logika (FluentValidation)
- Poslovni izuzeci (`NotFoundException`, `ForbiddenException`...)
- Audit scaffold
- **NEMA:** EF Core DbContext, HTTP, direktnih poziva baze

### Infrastructure
- EF Core `ApplicationDbContext` i konfiguracije entiteta
- EF Core migracije
- Implementacije Application interfejsa
- Keycloak/JWT adapter
- Audit sink implementacije
- External data konektori
- **NEMA:** poslovne logike, direktnih HTTP response-a

### Api
- `Program.cs` — samo pozivi extension metoda
- Minimal API endpoint grupe
- Middleware (CorrelationId, ErrorHandling...)
- DI konfiguracija (Extension metode)
- API ugovorni modeli (Request/Response)
- **NEMA:** poslovne logike, direktnih EF Core poziva

### Web (Blazor WASM)
- Razor komponente i stranice
- Layout i navigacija
- Frontend servisi koji pozivaju API
- **NEMA:** direktnog pristupa bazi, backend business logike
