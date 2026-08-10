# Sprint 1 Plan — Setup i Osnove (Sedmica 1-2)

**Faza:** FAZA 1: Postavljanje i Osnove  
**Trajanje:** 2 sedmice (10 radnih dana)  
**Cilj:** Funkcionalan "Hello World" API sa autentifikacijom kroz Keycloak

---

##  Sprint Cilj

Na kraju Sprint 1:
-  Svi članovi tima imaju podešeno lokalno okruženje
-  PostgreSQL, Keycloak i .NET API rade u Docker Compose-u
-  Jednostavan "Hello World" endpoint sa JWT autentifikacijom
-  Blazor Web aplikacija se uspješno pokreće
-  GitHub repozitorij je konfigurisan sa branch protection rules
-  GitHub Copilot je aktiviran za sve članove
-  Trello(Jira) board je postavljen i prilagođen
-  Research agent je aktiviran za praćenje AI rada

---

## Sprint Backlog

Ukupno: **8 kartica** (Epic breakdown)

---

## EPIC: Lokalni Development Setup

### Kartica 1.1: Postavljanje Razvojnog Okruženja
**Vlasnik:** DevOps + svi članovi  
**Tip:** Setup  
**Story Points:** 3  
**Prioritet:** CRITICAL

#### User Story
```
Kao član tima,
Zelim da imam instaliran .NET 10 SDK, Docker Desktop i ostali alati,
Kako bi mogao da pokrenem projekat lokalno bez problema.
```

#### Acceptance Kriteriji
- [ ] .NET 10 SDK je instaliran (`dotnet --version` pokazuje 10.x.x)
- [ ] Docker Desktop je instaliran i pokrenut
- [ ] Node.js 16+ je instaliran (za research CLI)
- [ ] Git je konfigurisan sa SSH ključevima
- [ ] VS Code ili Visual Studio je instaliran sa C# ekstenzijom
- [ ] GitHub Copilot ekstenzija je instalirana u editoru
- [ ] Svaki član je u mogućnosti da pokrene `docker-compose up -d` bez greške

#### Podzadaci
- [ ] Download & Install .NET 10 SDK
- [ ] Download & Install Docker Desktop
- [ ] Configure SSH keys sa GitHub
- [ ] Install IDE ekstenzije
- [ ] Test svaki alat sa `--version` komandom
- [ ] Dokumentujem setup proces

#### Checklist Prije Završetka
- [ ] `dotnet --version` radi
- [ ] `docker --version` radi
- [ ] `git --version` radi
- [ ] GitHub SSH konekcija je testirana (`git clone` radi)

#### Procijenjeno Vrijeme
- Backend dev: 30 min
- Frontend dev: 30 min
- DevOps: 30 min
- QA: 30 min

---

### Kartica 1.2: GitHub Repo Setup i Branch Strategy
**Vlasnik:** Tech Lead + DevOps  
**Tip:** Setup  
**Story Points:** 5  
**Prioritet:** CRITICAL

#### User Story
```
Kao Tech Lead,
Zelim da je GitHub repozitorij pravilno konfigurisan sa branch protection,
Kako bi tim radio siguran i ne bi slučajno merkao u main bez provjere.
```

#### Acceptance Kriteriji
- [ ] GitHub organizacija je kreirana (ako nije već)
- [ ] Repozitorij je kreiran sa `.gitignore` za .NET + Node
- [ ] Branch struktura je postavljena:
  - `main` — production branch
  - `develop` — development branch
  - `feature/*` — feature branches
- [ ] Branch protection rules su na `main` i `develop`:
  - Obavezno minimalno 1 PR review
  - CI pipeline mora proći
  - Zastarjele branch-e se automatski brišu
- [ ] Code owners su definirani (`.github/CODEOWNERS`)
- [ ] Pull request template je kreiran (`.github/pull_request_template.md`)
- [ ] Svi članovi tima su dodani kao collaborators

#### Podzadaci
- [ ] Kreiranje GitHub organizacije/tima
- [ ] Inicijalizacija repozitorija
- [ ] Konfiguracija branch protection rules
- [ ] Kreiranje PR template-a
- [ ] Dodavanje svih članova tima
- [ ] Test: Pokušaj direktnog push-a na main → trebalo bi biti odbijeno

#### Checklist Prije Završetka
- [ ] Svi članovi mogu pull/push na `develop`
- [ ] Test PR: Ako nema reviews, merge je onemogućen
- [ ] Test PR: Ako CI pipeline padne, merge je onemogućen
- [ ] Code review zahtjev je vidljiv u PR-u

---

### Kartica 1.3: GitHub Copilot Konfiguracija za Tim
**Vlasnik:** Tech Lead  
**Tip:** Setup  
**Story Points:** 3  
**Prioritet:** HIGH

#### User Story
```
Kao Tech Lead,
Zelim da je GitHub Copilot konfigurisan za sve članove tima,
Kako bi svi koristili isti alat sa istim pravilima tokom prakse.
```

#### Acceptance Kriteriji
- [ ] Copilot Chat ekstenzija je instalirana u VS Code/Visual Studio
- [ ] `copilot-instructions.md` je postavljen u `.github/` direktorijumu
- [ ] Svaki član zna kako aktivirati Copilot Chat (`Ctrl+I` ili `Cmd+I`)
- [ ] Svi članovi su prošli kroz onboarding: što je Copilot, kako ga koristiti
- [ ] Postoji dokumentacija o best practices (vidi `CLAUDE.md`)

#### Podzadaci
- [ ] Instalacija GitHub Copilot ekstenzije
- [ ] Kreiranje `.github/copilot-instructions.md`
- [ ] Setup sesije sa svakim članom (15 min per osoba)
- [ ] Dokumentovanje Copilot best practices
- [ ] Provjera: Svaki član može da generiše kod sa Copilot-om

#### Checklist Prije Završetka
- [ ] Copilot je dostupan u editoru za sve članove
- [ ] `copilot-instructions.md` je dostupan
- [ ] Svaki član je demo-irao Copilot (npr. generisao simple funkciju)

---

## 2 EPIC: Docker Compose Setup

### Kartica 2.1: Docker Compose za Lokalni Dev
**Vlasnik:** DevOps  
**Tip:** DevOps  
**Story Points:** 5  
**Prioritet:** CRITICAL

#### User Story
```
Kao DevOps inženjer,
Zelim da je docker-compose.yml pravilno konfigurisan,
Kako bi cijeli stack (PostgreSQL, API, Blazor, Keycloak) mogao pokrenuti sa jednom komandom.
```

#### Acceptance Kriteriji
- [ ] `docker-compose.yml` ima sve servise:
  - PostgreSQL 16 sa persistent volumenom
  - .NET 10 API servis
  - Blazor Web servis
  - Keycloak servis
- [ ] `.env.example` je kreiran sa svim potrebnim varijablama
- [ ] `docker-compose up -d` pokreće sve servise bez greške
- [ ] Health checks su konfigurisani za svaki servis
- [ ] Svi servisi su dostupni na lokalnim portovima:
  - PostgreSQL: `localhost:5432`
  - API: `localhost:5000`
  - Web: `localhost:5001`
  - Keycloak: `localhost:8080`
- [ ] Database je dostupan sa default kredencijala iz `.env`
- [ ] Volumes su persisting (ako restartam container-e, podaci ostaju)

#### Podzadaci
- [ ] Pisanje `docker-compose.yml` sa svim servisima
- [ ] Kreiranje `.env.example` template-a
- [ ] Testiranje `docker-compose up -d` na clean sistemu
- [ ] Testiranje health checks-a
- [ ] Dokumentovanje kako pokrenut/zaustaviti stack

#### Checklist Prije Završetka
- [ ] `docker-compose up -d` radi bez greške
- [ ] Svi servisi su dostupni nakon 30 sekundi
- [ ] Volumi su persisting
- [ ] `docker-compose down` briše kontejnere ali ne volume

---

### Kartica 2.2: PostgreSQL Inicijalizacija
**Vlasnik:** Database Engineer  
**Tip:** Database  
**Story Points:** 3  
**Prioritet:** CRITICAL

#### User Story
```
Kao Database Engineer,
Zelim da je PostgreSQL inicijalizovan sa praznom bazom,
Kako bi Backend dev mogao početi sa EF Core migracijom.
```

#### Acceptance Kriteriji
- [ ] PostgreSQL container se pokreće uspješno
- [ ] Baza podataka sa nazivom iz `.env` je kreirana
- [ ] Konekcija je dostupna na `localhost:5432`
- [ ] Nema inicijalnih tabela (čista baza)
- [ ] Backup fajl postoji (ako je potreban seed za kasnije)

#### Podzadaci
- [ ] Konfiguracija PostgreSQL u docker-compose.yml
- [ ] Testiranje konekcije sa `psql` client-om
- [ ] Kreiranje `.env` iz `.env.example`
- [ ] Dokumentovanje connection string-a

#### Checklist Prije Završetka
- [ ] `psql -h localhost -U student -d studentskapraksa` radi bez greške
- [ ] Baza je prazna (nema tabela)

---

## 3 EPIC: .NET 10 API Setup

### Kartica 3.1: Kreiranje .NET 10 Web API Projekta
**Vlasnik:** Backend Dev  
**Tip:** Backend  
**Story Points:** 5  
**Prioritet:** CRITICAL

#### User Story
```
Kao Backend Dev,
Zelim da je .NET 10 Web API projekat kreiran sa osnovnom strukturom,
Kako bi mogao početi sa endpoint razvojem.
```

#### Acceptance Kriteriji
- [ ] `.NET 10 Web API` projekat je kreiran (Minimal API ili Controllers, tebi izbor)
- [ ] Projekat struktura je uspostavljena:
  ```
  GIT.TransactionIdempotency/
  ├── API/
  │   └── Controllers/ (ili Endpoints/)
  ├── BL/
  │   └── Services/
  ├── DL/
  │   ├── DbContext.cs
  │   ├── Entities/
  │   └── Repositories/
  ├── Exceptions/
  ├── Helpers/
  ├── IoC/
  ├── Middlewares/
  ├── Properties/
  ├── Program.cs
  └── appsettings.json
  ```
- [ ] `Program.cs` ima:
  - Dependency Injection konfiguraciju
  - Middleware pipeline setup
  - Keycloak JWT konfiguraciju (zasnjesku će biti implementiran kasnije)
- [ ] `appsettings.Development.json` ima connection string
- [ ] Projekat se kompajlira bez greške (`dotnet build`)
- [ ] Projekat se pokreće bez greške (`dotnet run`)

#### Podzadaci
- [ ] `dotnet new webapi -n GIT.TransactionIdempotency`
- [ ] Kreiranje direktorijumske strukture
- [ ] Konfiguracija `Program.cs` sa DI i middleware-om
- [ ] Postavljanje `appsettings.json`
- [ ] Test: `dotnet build` i `dotnet run`

#### Checklist Prije Završetka
- [ ] `dotnet build` kompajlira bez warning-a
- [ ] `dotnet run` pokreće API na `http://localhost:5000`
- [ ] Direktorijumska struktura je jasna

---

### Kartica 3.2: "Hello World" Endpoint
**Vlasnik:** Backend Dev  
**Tip:** Backend  
**Story Points:** 3  
**Prioritet:** HIGH

#### User Story
```
Kao Backend Dev,
Zelim da kreiram jednostavan GET /api/health endpoint koji vraća "OK",
Kako bi testiram da API radi i je dostupan.
```

#### Acceptance Kriteriji
- [ ] Endpoint `GET /api/health` je dostupan
- [ ] Vraća JSON: `{ "status": "OK", "timestamp": "2026-05-23T12:00:00Z" }`
- [ ] HTTP Status je 200 OK
- [ ] Endpoint je dostupan bez autentifikacije (za sada)
- [ ] Može se testirati sa `curl` ili Postman-om

#### Podzadaci
- [ ] Kreiranje `HealthController.cs` ili `HealthEndpoint.cs`
- [ ] Implementacija GET /api/health metode
- [ ] Test sa `curl localhost:5000/api/health`

#### Checklist Prije Završetka
- [ ] `curl http://localhost:5000/api/health` vraća 200 sa JSON-om
- [ ] Endpoint je u Swagger/OpenAPI (ako je konfigurisan)

---

## 4 EPIC: Keycloak Setup

### Kartica 4.1: Keycloak Konfiguracija
**Vlasnik:** DevOps + Security  
**Tip:** DevOps/Security  
**Story Points:** 8  
**Prioritet:** CRITICAL

#### User Story
```
Kao DevOps/Security Engineer,
Zelim da je Keycloak konfigurisan sa realm-om, klijentom i testnim korisnicima,
Kako bi Frontend i Backend mogli testirati autentifikaciju.
```

#### Acceptance Kriteriji
- [ ] Keycloak je dostupan na `http://localhost:8080/admin`
- [ ] Realm `studentskapraksa` je kreiran
- [ ] Keycloak klijent `web` je kreiran sa:
  - Client ID: `web`
  - Client Type: `OpenID Connect`
  - Access Type: Public (OIDC)
  - Valid Redirect URIs: `http://localhost:5001/*`
  - Valid Post Logout Redirect URIs: `http://localhost:5001/*`
- [ ] Keycloak klijent `api` je kreiran sa:
  - Client ID: `api`
  - Client Type: Confidential
  - Service Account Roles: ENABLED
  - Valid Redirect URIs: `http://localhost:5000/*`
- [ ] Testni korisnici su kreirani:
  - `admin` / `admin` sa rolom `ADMIN`
  - `manager` / `manager` sa rolom `MANAGER`
  - `user` / `user` sa rolom `USER`
- [ ] Roles su kreirane: `ADMIN`, `MANAGER`, `USER`
- [ ] JWT token je dostupan za testnog korisnika
- [ ] Token se može validirati na `http://jwt.io` sa Keycloak public key-om

#### Podzadaci
- [ ] Pokretanje Keycloak kontejnera
- [ ] Pristup Keycloak admin console-u
- [ ] Kreiranje realm-a
- [ ] Kreiranje client-a za web i api
- [ ] Kreiranje korisnika i uloga
- [ ] Test: Dobivanje JWT tokena za testnog korisnika
- [ ] Dokumentovanje Keycloak setup-a

#### Checklist Prije Završetka
- [ ] Keycloak je dostupan na `localhost:8080`
- [ ] JWT token je dostupan sa `curl` komadom
- [ ] Token sadrži `sub`, `preferred_username`, `realm_access.roles` claims

---

### Kartica 4.2: JWT Validacija u .NET API-ju
**Vlasnik:** Backend Dev + Security  
**Typ:** Backend/Security  
**Story Points:** 5  
**Prioritet:** CRITICAL

#### User Story
```
Kao Backend Dev,
Zelim da .NET API validira JWT token-e iz Keycloak-a,
Kako bi zaštitio protected endpoint-e.
```

#### Acceptance Kriteriji
- [ ] `Program.cs` ima konfiguraciju za JWT validaciju:
  ```csharp
  builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
      .AddJwtBearer(options => {
          options.Authority = "http://localhost:8080/realms/studentskapraksa";
          options.Audience = "api";
          // ... ostale opcije
      });
  ```
- [ ] `[Authorize]` atribut može biti korišten na controller-ima/endpoint-ima
- [ ] Middleware je registriran: `app.UseAuthentication(); app.UseAuthorization();`
- [ ] Protected endpoint vraća 401 Unauthorized ako nema tokena
- [ ] Protected endpoint vraća 200 sa rezultatom ako token je validan
- [ ] Token validacija uključuje:
  - Signatura provjera
  - Expiration provjera
  - Issuer provjera
  - Audience provjera

#### Podzadaci
- [ ] Instalacija NuGet paketa: `Microsoft.AspNetCore.Authentication.JwtBearer`
- [ ] Konfiguracija JWT middleware-a
- [ ] Kreiranje protected endpoint-a sa `[Authorize]`
- [ ] Test sa Postman-om:
  - Bez tokena → 401
  - Sa tokenom → 200
  - Sa invalid tokenom → 401

#### Checklist Prije Završetka
- [ ] `curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/protected` radi sa validnim tokenom
- [ ] Bez tokena vraća 401

---

## 5 EPIC: Blazor Web Setup

### Kartica 5.1: Blazor Web Aplikacija — Osnovna Struktura
**Vlasnik:** Frontend Dev  
**Tip:** Frontend  
**Story Points:** 5  
**Prioritet:** HIGH

#### User Story
```
Kao Frontend Dev,
Zelim da je Blazor Web aplikacija kreirana sa osnovnom strukturom,
Kako bi mogao početi sa komponentama.
```

#### Acceptance Kriteriji
- [ ] Blazor Server aplikacija je kreirana
- [ ] Projekat struktura je postavljena:
  ```
  BlazorApp/
  ├── Auth/
  │   ├── AuthenticationStateProvider.cs
  │   └── PersistingAuthenticationStateProvider.cs
  ├── Components/
  │   └── App.razor (root komponenta)
  ├── Pages/
  │   ├── Home.razor
  │   └── ...
  ├── Shared/
  │   ├── NavMenu.razor
  │   └── MainLayout.razor
  ├── Services/
  │   ├── HttpClientService.cs (za API pozive)
  │   └── ...
  ├── wwwroot/
  │   ├── index.html
  │   ├── css/
  │   └── js/
  ├── Program.cs
  └── *.csproj
  ```
- [ ] `Program.cs` ima Blazor konfiguraciju
- [ ] Blazor app se pokreće bez greške (`dotnet run` ili debug iz VS-a)
- [ ] Root komponenta `App.razor` je vidljiva
- [ ] Osnovna navigacija je dostupna

#### Podzadaci
- [ ] `dotnet new blazorserver -n BlazorApp`
- [ ] Kreiranje direktorijumske strukture
- [ ] Konfiguracija `Program.cs`
- [ ] Test: `dotnet run` i otvori `http://localhost:5001`

#### Checklist Prije Završetka
- [ ] Blazor app se pokreće na `http://localhost:5001`
- [ ] Osnovna stranica je vidljiva
- [ ] NavMenu radi

---

### Kartica 5.2: Keycloak OIDC Integracija u Blazor-u
**Vlasnik:** Frontend Dev + Security  
**Tip:** Frontend/Security  
**Story Points:** 8  
**Prioritet:** CRITICAL

#### User Story
```
Kao Frontend Dev,
Zelim da Blazor aplikacija integriše Keycloak OIDC login,
Kako bi korisnici mogli biti autentikovani.
```

#### Acceptance Kriteriji
- [ ] `Program.cs` ima OIDC konfiguraciju:
  ```csharp
  builder.Services.AddOidcAuthentication(options => {
      options.ProviderOptions.Authority = "http://localhost:8080/realms/studentskapraksa";
      options.ProviderOptions.ClientId = "web";
      options.ProviderOptions.ResponseType = "code";
      options.ProviderOptions.DefaultScopes.Add("profile");
      options.ProviderOptions.DefaultScopes.Add("openid");
  });
  ```
- [ ] Login dugme je dostupno na početnoj stranici
- [ ] Klik na "Login" preusmjerava na Keycloak login stranicu
- [ ] Nakon uspješne prijave, korisnik je preusmjeren na Blazor aplikaciju
- [ ] Korisničko ime je dostupno u komponenti (npr. `@context.User.Identity?.Name`)
- [ ] Logout dugme je dostupno i radi
- [ ] `[Authorize]` direktiva može biti korištena za zaštitu stranica

#### Podzadaci
- [ ] Instalacija NuGet paketa: `Microsoft.AspNetCore.Components.WebAssembly.Authentication`
- [ ] Konfiguracija OIDC u `Program.cs`
- [ ] Kreiranje Login/Logout komponenti
- [ ] Testiranje login toksa
- [ ] Dodavanje `[Authorize]` na test stranicu

#### Checklist Prije Završetka
- [ ] Login redirekcija na Keycloak
- [ ] Logovanje sa `admin` korisnikom je moguće
- [ ] Nakon login-a, korisničko ime je vidljivo
- [ ] Logout funkcionira
- [ ] Protected stranica sa `[Authorize]` zahtijeva login

---

## 6 EPIC: GitHub Copilot & Research Agent

### Kartica 6.1: Research Agent Aktivacija
**Vlasnik:** Tech Lead + DevOps  
**Typ:** Setup  
**Story Points:** 3  
**Prioritet:** HIGH

#### User Story
```
Kao Tech Lead,
Zelim da je research agent aktiviran za sve članove,
Kako bi se automatski bilježila AI interakcija tokom prakse.
```

#### Acceptance Kriteriji
- [ ] `.env` fajl je postavljen sa `RESEARCH_MODE=enabled`
- [ ] `research-cli/` direktorijum je dostupan
- [ ] Komanda `npm run research:start` pokreće watcher
- [ ] Watcher automatski bilježi izmjene u `.research/` direktorijumu
- [ ] Komanda `npm run research:log` je dostupna za logovanje AI interakcija
- [ ] Svaki član zna kako logiram AI rad na kraju dana

#### Podzadaci
- [ ] Konfiguracija `.env` fajla
- [ ] Aktiviranje research agent-a (`node research-cli/maintenance/enable.js`)
- [ ] Testiranje watcher-a (`npm run research:start`)
- [ ] Demo session: Logovanje AI interakcije

#### Checklist Prije Završetka
- [ ] `npm run research:start` pokreće watcher bez greške
- [ ] `.research/` direktorijum je kreiiran
- [ ] Test log: `npm run research:log -- --tool=copilot --category=backend --duration=30 --time-saved=60`

---

### Kartica 6.2: AI Agent Documentation
**Vlasnik:** Tech Lead  
**Typ:** Documentation  
**Story Points:** 5  
**Prioritet:** MEDIUM

#### User Story
```
Kao Tim,
Zelim da je dokumentacija sa AI agent prompts dostupna,
Kako bi znao koji prompt da koristim prema svojoj ulozi.
```

#### Acceptance Kriteriji
- [ ] `docs/ai/AI_AGENTS_SETUP.md` je kreiiran sa:
  - Pregledom svih 8+ agent modova
  - Primjerima kako koristiti svaki agent
  - Best practices
  - Quick start guide
- [ ] Svaki agent mod ima jasnu svrhu i primjere
- [ ] Dokumentacija je dostupna i čitljiva
- [ ] Svi članovi su prošli kroz dokumentaciju

#### Podzadaci
- [ ] Pisanje AI_AGENTS_SETUP.md sa svim modovima
- [ ] Kreiranje example prompt-a za svaki mod
- [ ] Review dokumentacije sa 1-2 člana
- [ ] Finalizacija i merge u repo

#### Checklist Prije Završetka
- [ ] `docs/ai/AI_AGENTS_SETUP.md` je dostupan na `develop` branchu
- [ ] Svi članovi su pročitali minimum prvu stranicu

---

## 7 EPIC: Trello Board Setup

### Kartica 7.1: Trello Board Konfiguracija
**Vlasnik:** Tech Lead  
**Typ:** Project Management  
**Story Points:** 3  
**Prioritet:**  HIGH

#### User Story
```
Kao Tech Lead,
Zelim da je Trello board pravilno konfigurisan sa listama i shablonima,
Kako bi tim mogao jasno pratiti napredak.
```

#### Acceptance Kriteriji
- [ ] Trello board je kreiran za grupu
- [ ] Standardne liste su postavljene:
  - Backlog
  - Sprint Backlog
  - In Progress
  - Code Review
  - Testiranje
  - Gotovo
  - Blokirano
- [ ] Labele (labels) su kreirane:
  - `Backend` (plava)
  - `Frontend` (zelena)
  - `DevOps` (narandžasta)
  - `Bug` (crvena)
  - `Test` (ljubičasta)
- [ ] Svi članovi tima su dodani kao members
- [ ] Power-Up "Custom Fields" je aktiviran (ako dostupno)
- [ ] Sprint Backlog lista je vidljiva za Sprint 1

#### Podzadaci
- [ ] Kreiranje Trello board-a
- [ ] Konfiguracija listi
- [ ] Dodavanje labela
- [ ] Dodavanje članova tima
- [ ] Kreiranje Sprint 1 Backlog liste

#### Checklist Prije Završetka
- [ ] Board je dostupan svim članovima
- [ ] Sve liste su vidljive
- [ ] Sprint 1 kartica je vidljiva u "Sprint Backlog" listi

---

### Kartica 7.2: Trello Sprint 1 Backlog Populacija
**Vlasnik:** Tech Lead  
**Typ:** Project Management  
**Story Points:** 3  
**Prioritet:**  HIGH

#### User Story
```
Kao Tech Lead,
Zelim da sve Sprint 1 kartice budu na Trello board-u,
Kako bi svaki član znao šta treba da radi.
```

#### Acceptance Kriteriji
- [ ] Sve kartice iz Sprint Backlog-a su na Trello-u
- [ ] Svaka kartica ima:
  - Jasan naziv
  - Opis (user story format)
  - Acceptance kriterije (checklist)
  - Zadužena osoba (assignee)
  - Labelu (Backend/Frontend/DevOps)
  - Due date (Petak, kraj sedmice)
  - Procijenjene story points (sa Planning Poker ili broja hours-a)
- [ ] Kartice su raspoređene po ulozi:
  - Backend Dev: 3-4 kartice
  - Frontend Dev: 2-3 kartice
  - DevOps: 3-4 kartice
  - QA: 1-2 kartice (testiranje existinga koda)
  - Tech Lead: 2-3 kartice (setup, board, documentation)

#### Podzadaci
- [ ] Kopiranje svih 8 kartica sa ovog plana na Trello
- [ ] Prilagođavanje za vašu grupu (broj članova)
- [ ] Review sa Tech Lead-om
- [ ] Finalizacija pre nego što krene Sprint

#### Checklist Prije Završetka
- [ ] Sve kartice su na Trello-u
- [ ] Svaka kartica ima zaduženu osobu
- [ ] Ukupno je realno da se završi u 2 sedmice

---

## 8️⃣ EPIC: Inicijalni Testovi

### Kartica 8.1: Unit Test Setup (xUnit)
**Vlasnik:** QA / Backend Dev  
**Typ:** Testing  
**Story Points:** 3  
**Prioritet:**  MEDIUM

#### User Story
```
Kao QA inženjer,
Zelim da je xUnit test framework postavljen,
Kako bi mogao početi pisati testove.
```

#### Acceptance Kriteriji
- [ ] `UnitTests.csproj` je kreiiran kao `xunit` template
- [ ] Prvi unit test je napisan (npr. kalkulatora ili helper-a)
- [ ] `dotnet test` pokreće sve testove uspješno
- [ ] Test explorer je dostupan u VS Code/Visual Studio
- [ ] Test coverage je vidljiv (npr. sa `coverlet`)

#### Podzadaci
- [ ] `dotnet new xunit -n UnitTests -o tests/UnitTests`
- [ ] Pisanje first test-a (npr. `CalculatorTests.cs`)
- [ ] `dotnet test` output je čitljiv
- [ ] Setup code coverage (opciono za Sprint 1)

#### Checklist Prije Završetka
- [ ] `dotnet test` pokreće sve testove
- [ ] Minimalno 1 test je zeleno ("passing")

---

##  Raspored Sprint 1 (10 radnih dana)

### Sedmica 1 (5 radnih dana)

| Dan | Ceremonija | Zadaci | Vlasnik |
|---|---|---|---|
| **Ponedjeljak** | Sprint Planning (30 min) | Svi rade na kartici 1.1 (Local Setup) i 1.2 (GitHub Setup) | Tech Lead + svi |
| **Utorak** | - | Backend: 3.1, Frontend: 5.1, DevOps: 2.1 | Svi po ulozi |
| **Srijeda** | Daily Standup (15 min) | Nastava radova, Support za Blokirane kartice | Tech Lead |
| **Četvrtak** | Mid-Sprint Provjera (30 min) | DevOps: 2.2, Backend: 4.1, Frontend: 4.2 | Tech Lead + relevant |
| **Petak** | - | Završavanje Sprint week 1, Code review ako ima PR-a | Relevantne osobe |

### Sedmica 2 (5 radnih dana)

| Dan | Ceremonija | Zadaci | Vlasnik |
|---|---|---|---|
| **Ponedjeljak** | - | Backend: 3.2, Frontend: 5.2, DevOps: 4.2 | Svi po ulozi |
| **Utorak** | - | Tech Lead: 6.1 + 7.2, QA: 8.1 | Relevantne osobe |
| **Srijeda** | Daily Standup (15 min) | Završavanje svih kartica | Tech Lead |
| **Četvrtak** | - | Code review i testiranje | Svi |
| **Petak** | Sprint Review (1h) + Retrospektiva (30 min) | Demo svega što je urađeno | Sve grupe |

---

## 👥 Raspodjela Zadataka po Ulogi (za grupu od 7 osoba)

### Tech Lead (1 osoba)
- 1.2: GitHub Repo Setup
- 6.1: Research Agent Aktivacija
- 6.2: AI Agent Documentation
- 7.1: Trello Board Setup
- 7.2: Trello Backlog Populacija
- Support: Daily Standups, Code Reviews

**Ukupno:** ~5-8 kartica  
**Fokus:** Setup, koordinacija, dokumentacija

---

### Backend Developer (2 osobe)
- **Backend Dev 1:**
  - 3.1: Kreiranje .NET 10 API Projekta
  - 3.2: "Hello World" Endpoint
  - 4.2: JWT Validacija u API-ju
  - 8.1: Unit Test Setup (čini se da je BL test)

- **Backend Dev 2:**
  - Pomaže sa 3.1, 3.2, 4.2
  - Spreman je za kasniju EF Core setup karticu

**Ukupno:** ~3-4 kartice po osoba  
**Fokus:** API struktura, Keycloak integracija

---

### Frontend Developer (1-2 osobe)
- 5.1: Blazor Web Aplikacija Setup
- 5.2: Keycloak OIDC Integracija

**Ukupno:** ~2 kartice  
**Fokus:** Blazor struktura, Auth integracija

---

### DevOps Engineer (1 osoba)
- 1.1: Localni Development Setup
- 2.1: Docker Compose Setup
- 2.2: PostgreSQL Inicijalizacija
- 4.1: Keycloak Konfiguracija
- 6.1: Research Agent Aktivacija (pomaže Tech Lead-u)

**Ukupno:** ~4-5 kartica  
**Fokus:** Docker, Keycloak, Environment

---

### QA Tester (1 osoba)
- 1.1: Pomaže sa Local Setup
- 8.1: Unit Test Setup
- Testing: Svih ostalih kartice tokom razvoja

**Ukupno:** ~2 kartice + testing support  
**Fokus:** Test framework, validation

---

### Security Reviewer (1 osoba, ako ima)
- 4.1: Keycloak Konfiguracija (review)
- 4.2: JWT Validacija (review)
- 5.2: OIDC Integracija (review)
- Security best practices

**Ukupno:** ~2-3 kartice (plus reviews)  
**Fokus:** Security validacija

---

##  Checklist Prije Kraja Sprint 1

### Tehnički Checklist
- [ ] `docker-compose up -d` pokreće sve servise
- [ ] API je dostupan na `http://localhost:5000`
- [ ] Web je dostupan na `http://localhost:5001`
- [ ] Keycloak je dostupan na `http://localhost:8080`
- [ ] Login sa Keycloak-om funkcionira
- [ ] Protected API endpoint vraća 401 bez tokena
- [ ] Protected API endpoint vraća 200 sa validnim tokenom
- [ ] Unit testovi se pokreću sa `dotnet test`
- [ ] GitHub Actions CI pipeline je aktivna

### Organizacijski Checklist
- [ ] Sve Sprint 1 kartice su završene ili blokirane
- [ ] Sve kartice imaju PR linkove
- [ ] Code review je complete za sve kartice
- [ ] GitHub Copilot je korišten i logiram
- [ ] Research agent je aktiviran
- [ ] Team je prođio kroz AI Agent dokumentaciju
- [ ] Trello board je azurirani
- [ ] Retrospektiva je holding (šta je proslo dobro, šta bolje?)

---

##  Dodatni Resursi za Sprint 1

- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Keycloak Administration Guide](https://www.keycloak.org/guides)
- [.NET 10 Documentation](https://learn.microsoft.com/en-us/dotnet/)
- [Blazor Server Documentation](https://learn.microsoft.com/en-us/aspnet/core/blazor/)
- [GitHub Copilot Best Practices](https://github.com/features/copilot)

---

##  Success Criteria za Sprint 1

**Success znači:**
1.  Svi članovi imaju podeseno lokalno okruženje
2.  Docker Compose radi sa svim servisima
3.  API je dostupan sa JWT autentifikacijom
4.  Blazor app je dostupna sa Keycloak login-om
5.  Sve kartice su završene do kraja Petka (sedmica 2)
6.  Nema kritičnih bug-a u `develop` branchu
7.  Tim razumije AI Agent pristup i koristi ga
8.  Retrospektiva je holding i insights su logirani

---

## Kontakt & Support

Ako ima problem-a tokom Sprint 1:
- **Tech Lead:** Koordinira, radi code review
- **DevOps:** Docker, environment problemi
- **Backend/Frontend Lead:** Logika-specifični problemi
- **Security:** Auth i sigurnosna pitanja

