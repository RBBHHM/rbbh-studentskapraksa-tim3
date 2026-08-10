# Docker smjernice

## Fajlovi

| Fajl | Svrha |
|------|-------|
| `docker/docker-compose.yml` | Produkcijska konfiguracija (api, web, db) |
| `docker/docker-compose.override.yml` | Lokalni razvoj (+ keycloak, nginx, dev overrides) |
| `docker/api.Dockerfile` | Multi-stage build za Clean Architecture API |
| `docker/web.Dockerfile` | Build Blazor WASM + nginx serving |
| `docker/Dockerfile.api` | Legacy API (GIT.TransactionIdempotency) |
| `docker/Dockerfile.web` | Legacy Blazor Server app |

## Pokretanje

```bash
# Lokalni razvoj (sve uključeno)
docker compose -f docker/docker-compose.yml \
               -f docker/docker-compose.override.yml up --build

# Produkcija (samo api + web + db)
docker compose -f docker/docker-compose.yml up -d

# Zaustavljanje
docker compose -f docker/docker-compose.yml down

# Logovi u živo
docker compose -f docker/docker-compose.yml logs -f api
```

## Multi-stage Docker build

Svi Dockerfile-ovi koriste multi-stage build za optimalni image size:

1. `build` stage — SDK image, kompajlira kod
2. `final` stage — Runtime image (manja), samo publish output

## Produkcijsko postavljanje

Sljedeće historijske upute odnosile su se na raniji Hetzner VPS. Docker Compose se
sada koristi samo lokalno; aktuelni produkcijski postupak je opisan u
[`../deployment/OCP-IIS.md`](../deployment/OCP-IIS.md).

Za historijski Hetzner VPS deployment:
1. Kopiraj `docker-compose.yml` na server
2. Postavi `.env` sa pravim production vrijednostima
3. `docker compose pull` (ili build lokalno i push na GHCR)
4. `docker compose up -d`

Detalji: [deployment.md](deployment.md)

## Healthcheck

Baza ima healthcheck konfigurisan u docker-compose. API `depends_on: db: condition: service_healthy` čeka da je baza zdrava prije pokretanja.
