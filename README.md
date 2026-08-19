# RBBH Collateral Appraisal

Poslovna aplikacija za kompletan tok procjene kolaterala: kreiranje naloga, dodjelu procjenitelja, dokumentaciju, mišljenja, odobravanje, fakture, protokol, izvještaje, šifarnike i audit.

## Struktura

- `src/Domain` — poslovni entiteti i pravila bez infrastrukturnih zavisnosti.
- `src/Application` — use-case ugovori, komande, upiti i validacija.
- `src/Infrastructure` — EF Core, SQL Server, dokumenti, audit, Keycloak adapteri i seed.
- `src/Api` — .NET HTTP ulaz, OpenAPI, health i sastavljanje aplikacije.
- `src/Web` — React frontend, dizajn sistem, lokalizacija i jedinstveni HTTP klijent.
- `tests` — domenske, aplikacijske, infrastrukturne, API i E2E provjere.

## Lokalno pokretanje

Preduvjeti su .NET SDK 10, Node.js i pnpm 9. Docker nije potreban.

```powershell
# Terminal 1
dotnet restore RBBH.CollateralAppraisal.slnx
dotnet run --project src/Api/RBBH.CollateralAppraisal.Api.csproj

# Terminal 2
cd src/Web
pnpm install
pnpm dev
```

Development bez SQL Server postavki koristi seedovanu InMemory bazu. Bez Keycloak postavki koristi se lokalni identitet uz upozorenje. Produkcija zahtijeva stvarnu bazu i autentifikaciju.

## SQL Server

```powershell
$env:ConnectionStrings__Default='Server=(localdb)\MSSQLLocalDB;Database=rbbh_collateral_appraisal;Trusted_Connection=True;Encrypt=True;TrustServerCertificate=True;MultipleActiveResultSets=True'
```

Alternativno se koriste `COLLATERAL_APPRAISAL_SERVER_NAME`, `COLLATERAL_APPRAISAL_DATABASE`, `COLLATERAL_APPRAISAL_TRUSTED_CONNECTION`, `COLLATERAL_APPRAISAL_DB_USER` i `COLLATERAL_APPRAISAL_DB_PASSWORD`.

## Provjera i isporuka

```powershell
dotnet build RBBH.CollateralAppraisal.slnx --configuration Release
dotnet test RBBH.CollateralAppraisal.slnx --configuration Release
cd src/Web
pnpm lint
pnpm build
```

Backend ide na OCP, frontend kao statički IIS paket. Više: [arhitektura](docs/architecture/README.md), [lokalni razvoj](docs/development/LOCAL-DEVELOPMENT.md), [konvencije](docs/CONVENTIONS.md) i [deployment](docs/deployment/OCP-IIS.md).
