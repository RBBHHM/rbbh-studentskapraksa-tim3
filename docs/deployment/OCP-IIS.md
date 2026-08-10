# OCP backend i IIS frontend deployment

Produkcija je podijeljena na dva nezavisna dijela: .NET backend se gradi kao OCI image i postavlja na OCP, a React frontend se gradi kao statički artifact i objavljuje na IIS.

## Obavezni GitHub workflowi

`.github/workflows` namjerno sadrži isključivo tri neizmijenjena DataProducts workflowa:

1. `build-and-push-artifact.yaml` – gradi `${PROJECT_PATH}/Dockerfile` i šalje image u Artifactory;
2. `deploy-to-ocp.yaml` – postavlja odabrani image tag na OCP;
3. `codeql.yml` – pokreće C# sigurnosnu analizu.

Nazivi i sadržaj tih fajlova moraju ostati identični DataProducts referenci. Frontend IIS deploy zato nije četvrti workflow; izvršava se standardnim IIS release procesom i priloženom skriptom.

## GitHub varijable i secrets

Za svaki repozitorij i Environment `UAT` / `PROD` postaviti:

| Naziv | Namjena |
| --- | --- |
| `PROJECT_PATH` | `.` |
| `SOLUTION_PATH` | Tema 1/2: `src/GIT.TransactionIdempotency.sln`; Tema 3: `studentskapraksa.slnx` |
| `NUGET_CONFIG_PATH` | Tema 1/2: `src/GIT.TransactionIdempotency/nuget.config`; Tema 3: `nuget.config` |
| `DOTNET_VERSION` | .NET SDK image tag dostupan u internom registryju |
| `ARTIFACTORY_REGISTRY` | Registry host bez protokola |
| `ARTIFACTORY_REPOSITORY` | Docker/OCI repository |
| `ARTIFACTORY_USERNAME` | Korisnik koji build workflow čita kao variable |
| `IMAGE_NAME` | Jedinstven naziv backend imagea i OCP resursa |
| `OCP_SERVER` | URL OCP API servera |
| `OCP_PROJECT_NAME` | OCP namespace/project |

Secrets:

- `ARTIFACTORY_TOKEN`;
- `ARTIFACTORY_USERNAME` (deploy workflow ga čita kao secret);
- `OCP_TOKEN`.

## Backend redoslijed

1. Pokrenuti **build and push to artifactory**.
2. Sačuvati immutable tag iz loga (git tag ili kratki commit SHA).
3. Pokrenuti **Deploy to OCP** s tim `image_tag`.
4. Provjeriti rollout, OCP Route i `/health/ready`.
5. Aplikacijsku konfiguraciju i tajne postaviti kroz OCP resurse, nikada u repozitorij.

Root `Dockerfile` postoji jer ga neizmijenjeni workflow očekuje na `${PROJECT_PATH}/Dockerfile`. Container sluša port 8080 i podržava OpenShift arbitrary UID.

## Frontend build i IIS

VITE vrijednosti se ugrađuju tokom builda. Tema 3 dodatno zahtijeva `VITE_KEYCLOAK_URL`, `VITE_KEYCLOAK_REALM` i `VITE_KEYCLOAK_CLIENT_ID`.

```powershell
Set-Location .\src\Web
$env:VITE_API_BASE_URL = 'https://api.example.ba'
pnpm install --frozen-lockfile
pnpm localization:validate
pnpm test
pnpm build
Copy-Item .\deploy\iis\web.config .\.output\public\web.config -Force
```

Kompletan sadržaj `src/Web/.output/public` je IIS artifact. Na IIS serveru, iz administratorskog PowerShella:

```powershell
.\scripts\Deploy-FrontendIis.ps1 `
  -ArtifactPath 'C:\release\frontend' `
  -SitePath 'D:\sites\application' `
  -AppPool 'application-pool' `
  -BackupRoot 'D:\backups\application'
```

IIS mora imati URL Rewrite modul. `web.config` koristi `_shell.html` kao ulaz i podržava direktno otvaranje SPA ruta. IIS HTTPS origin mora biti dozvoljen u backend CORS konfiguraciji.
