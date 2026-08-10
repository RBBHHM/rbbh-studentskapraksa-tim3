# Kako pokrenuti RBI React aplikaciju — Tema 3

Aktivni frontend je `src/Web` (React). `src/BlazorApp` je samo referenca originalnog interfejsa i nije ga potrebno pokretati.

## 1. Lokalna baza i Keycloak

Iz korijena projekta pokrenite pripremljene lokalne servise:

```powershell
docker compose -f docker-compose.local-db.yml up -d
```

Provjerite da kontejneri rade:

```powershell
docker compose -f docker-compose.local-db.yml ps
```

Keycloak je dostupan na `http://localhost:8183`, a realm za aplikaciju je `praksa`.

## 2. Backend API

U prvom PowerShell terminalu, iz korijena projekta:

```powershell
dotnet restore src\Api\Api.csproj
dotnet run --project src\Api\Api.csproj --urls http://127.0.0.1:5000
```

Swagger/OpenAPI dokument mora biti dostupan na:

```text
http://127.0.0.1:5000/openapi/v1.json
```

## 3. OpenAPI tipovi

Ovaj korak se radi nakon pokretanja API-ja i ponavlja se kada se promijeni backend ugovor:

```powershell
cd src\Web
pnpm install
pnpm openapi:generate
```

Greška `ECONNREFUSED 127.0.0.1:5000` znači da API iz prethodnog koraka ne radi.

## 4. React frontend

U drugom terminalu:

```powershell
cd src\Web
pnpm dev
```

Otvorite URL koji Vite ispiše, uobičajeno `http://localhost:8080`. Ako je port zauzet, Vite automatski bira `8081`, `8082` itd. Koristite baš ispisani URL jer mora biti dozvoljen u lokalnom Keycloak klijentu.

## 5. Provjera prije predaje

```powershell
cd src\Web
pnpm lint
pnpm build

cd ..\..
dotnet build src\Api\Api.csproj
```

## Šta koji dio predstavlja

```text
Browser
  └─ src/Web       React stranice, RBI dizajn, forme i API pozivi
       └─ src/Api  autentikacija, autorizacija i HTTP endpointi
            ├─ src/Application     poslovni slučajevi i ugovori
            ├─ src/Domain          poslovni entiteti i pravila
            └─ src/Infrastructure  PostgreSQL, Keycloak, datoteke i integracije
```

React nikada ne pristupa bazi direktno. Svaki poziv ide kroz centralni HTTP klijent prema `.NET` API-ju. Keycloak prijavljuje korisnika putem Authorization Code + PKCE toka, a API provjerava token, aktivnu rolu i permissione.

## Najčešći problemi

- **Data is currently unavailable** — provjerite API na portu `5000`, prijavljenu Keycloak sesiju i Network karticu browsera.
- **Port 8080 is in use** — nije greška; otvorite novi port koji je Vite ispisao.
- **OpenAPI generate ne radi** — prvo pokrenite API i otvorite OpenAPI URL u browseru.
- **401 Unauthorized** — ponovo se prijavite; provjerite realm, SPA client i issuer konfiguraciju.
- **403 Forbidden** — korisnik je prijavljen, ali aktivna rola nema permission za tu operaciju.
- **API build javlja zaključan `.exe`** — zaustavite već pokrenuti API (`Ctrl+C`) pa ponovite build.
