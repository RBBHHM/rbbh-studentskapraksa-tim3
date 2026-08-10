# Lokalni razvoj — Upute

## Preduvjeti

| Alat | Minimalna verzija |
|------|-------------------|
| .NET SDK | 10.0 |
| Docker Desktop | 24.x |
| Git | 2.x |
| Node.js (research agent) | 18.x |

## Postavljanje

```bash
# 1. Klon repoa
git clone <repo-url>
cd studentskapraksaTema3

# 2. Postavi .env fajl
cp .env.example .env
# Otvori .env i popuni vrijednosti
```

## Opcija A — Docker Compose (preporučeno)

Pokreće sve servise odjednom:

```bash
# Pokretanje Clean Architecture stack-a (api + web + db + keycloak + nginx)
docker compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml up --build

# Samo baza i Keycloak (ako developujete lokalno bez Docker-a)
docker compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml up db keycloak
```

| Servis | URL | Opis |
|--------|-----|------|
| API | http://localhost:5000 | ASP.NET Core API |
| Web | http://localhost:5001 | Blazor WASM |
| DB | localhost:5432 | PostgreSQL |
| Keycloak | http://localhost:8080 | Identity Provider |
| nginx | http://localhost:80 | Reverse proxy |

## Opcija B — Direktno pokretanje (.NET CLI)

```bash
# Terminal 1 — API
dotnet run --project src/Api

# Terminal 2 — Web
dotnet run --project src/Web

# Pokrenuti testove
dotnet test studentskapraksa.slnx
```

## EF Core migracije

```bash
# Kreiranje nove migracije
dotnet ef migrations add <ImesMigracije> \
  --project src/Infrastructure \
  --startup-project src/Api

# Primjena migracija
dotnet ef database update \
  --project src/Infrastructure \
  --startup-project src/Api
```

## Research agent

```bash
# Instaliraj Node.js zavisnosti
npm install

# Pokreni watcher (prati promjene fajlova)
npm run research:start

# Na kraju dana — pošalji logove
npm run research:upload -- --student=<tvoj-ID>
```

## Uobičajeni problemi

**Baza se ne pokreće:**
```bash
docker compose -f docker/docker-compose.yml logs db
```

**API ne može da se poveže na bazu:**
Provjeri connection string u `appsettings.Development.json` ili `.env`.

**Keycloak ne startuje:**
Provjeri da li je PostgreSQL zdrav: `docker ps` → `healthy` status.
