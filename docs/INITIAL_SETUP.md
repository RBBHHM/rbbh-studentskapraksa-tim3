# Inicijalni Setup — Brzi Početak za Sprint 1

**Čitaj prvo:** Ako si novi na projektu, kreni sa ovim dokumentom **prije nego što otvoriš kod**.

---

## Pre-Setup Checklist (5 minuta)

- [ ] Čitaj README.md
- [ ] Čitaj PROJECT_STRUCTURE.md
- [ ] Čitaj AI_AGENTS_SETUP.md (minimalno prvu stranicu)
- [ ] Čitaj SPRINT_1_PLAN.md
- [ ] Pimaš Trello link do tvojeg Sprinta

---

## Što Je Tvoja Uloga? Klikni Na Odgovarajući Link

| Uloga | Početne Akcije | Vrijeme |
|---|---|---|
| **Tech Lead** | [Tech Lead Setup](##-tech-lead-uloga) | 1-2h |
| **Backend Dev** | [Backend Dev Setup](##-backend-developer-uloga) | 1-2h |
| **Frontend Dev** | [Frontend Dev Setup](##-frontend-developer-uloga) | 1-2h |
| **DevOps** | [DevOps Setup](##-devops-uloga) | 2-3h |
| **QA Tester** | [QA Setup](##-qa-tester-uloga) | 1h |
| **Security Reviewer** | [Security Setup](##-security-reviewer-uloga) | 1-2h |
| **Database Engineer** | [Database Setup](##-database-engineer-uloga) | 1h |

---

## Tech Lead Uloga

**Fokus:** Koordinacija, GitHub konfiguracija, Trello board, dokumentacija

### Tjedna 1 — Ponedjeljak (Sprint Planning)

#### Zadatak 1: GitHub Repo Validacija

```bash
# Provjeri da li repo ima sve potrebne fajlove
ls -la .github/
ls -la .gitignore
ls -la docs/

# Kreiraj branch protection rules:
# 1. GitHub repo → Settings → Branches
# 2. Add rule za 'main' i 'develop'
# 3. Zahtijevaj minimum 1 review
# 4. Zahtijevaj CI pipeline pass
```

#### Zadatak 2: Kreiraj PR Template

```bash
# Datoteka: .github/pull_request_template.md

## Opis
Kratko opisati šta radi PR.

## Issue
Vezano na Trello karticu: [link]

## Acceptance Kriteriji Ispunjeni?
- [ ] Da

## Testiranje
- [ ] Unit testovi prošireni
- [ ] Integration testovi prošireni
- [ ] Ručno testiran

## Screenshots (ako aplikacija)
N/A

## Code Review Checklist
- [ ] Nema duplicate koda
- [ ] Error handling je na mjestu
- [ ] Comments gdje je trebalo
- [ ] Следи naming conventions
```

#### Zadatak 3: Postavi Copilot Instructions

```bash
# Datoteka: .github/copilot-instructions.md

Radi kao Backend Developer za studentsku praksu 2026.

Kontekst:
- .NET 10, Blazor Server, PostgreSQL
- Architecture: API → BL → DL
- Auth: Keycloak JWT
- Testing: xUnit

Pravila:
- Koristiti async/await
- Nema .Result ili .Wait()
- DTO, ne entitete direktno
- Service logika, ne u controlleru
- Testitaj sve
```

#### Zadatak 4: Kreiraj Sprint Backlog na Trello-u

```bash
# Koristi SPRINT_1_PLAN.md
# Kopiraj sve 8 Epic-a na Trello kao kartice

Struktura:
- List: "Sprint Backlog"
- Svaka kartica:
  - Title: [Broj]. [Epic naziv]
  - Description: [User Story + Acceptance Kriteriji]
  - Labels: [Backend / Frontend / DevOps / Bug / Test]
  - Assignee: [Team Member]
  - Due Date: [Petak toga sedmice]
  - Story Points: [Broj]
```

#### Zadatak 5: Holding Sprint Planning

```bash
# Vrijeme: 30 minuta, sve grupe zajedno ili grupa sa grupa
# Facilitator: Tech Lead-ovi

Agenda:
1. Pregled Sprint 1 cilja (5 min)
2. Svaka grupa izabira svoje kartice (10 min)
3. Q&A (10 min)
4. Start sprint (5 min)
```

### Sedmica 2 — Provjera i Finalizacija

- [ ] Svakodnevno: Daily standup (15 min)
- [ ] Četvrtkom: Mid-sprint review (30 min)
- [ ] Petkom: Sprint review + retrospektiva (90 min)

---

## Backend Developer Uloga

**Fokus:** API struktura, endpointi, servisi, testovi

### Tjedna 1 — Ponedjeljak

#### Zadatak 1: Setup .NET Environment

```bash
# 1. Provjeri .NET verziju
dotnet --version
# Trebalo bi: .NET 10.0.x ili novije

# 2. Ako nema, download sa
# https://dotnet.microsoft.com/download

# 3. Provjeri da li radi
dotnet new --version
```

#### Zadatak 2: Kloniraj Repo i Pokreni Prvo Build-a

```bash
# 1. Clone repo
git clone <URL>
cd studentskapraksaTema3

# 2. Kreiraj .env iz template-a
cp .env.example .env

# 3. Restore NuGet pakete
cd src/GIT.TransactionIdempotency
dotnet restore

# 4. Build
dotnet build

# Trebalo bi biti: "Build succeeded"
```

#### Zadatak 3: Pregled Existing Koda

```bash
# Pregled strukture
cd src/GIT.TransactionIdempotency

# Pogledaj Program.cs
cat Program.cs

# Pogledaj directory strukturu
find . -type d -maxdepth 2 | sort
```

#### Zadatak 4: Kreiraj Prvi API Endpoint

**Kartica: 3.2 — Hello World Endpoint**

```bash
# 1. Kreiraj Controllers dir (ako ne postoji)
mkdir -p API/Controllers

# 2. Kreiraj fajl: API/Controllers/HealthController.cs
# Sadržaj:
```

```csharp
using Microsoft.AspNetCore.Mvc;

namespace GIT.TransactionIdempotency.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "OK",
            timestamp = DateTime.UtcNow
        });
    }
}
```

```bash
# 3. Build i run
dotnet build
dotnet run

# 4. Test sa curl
curl http://localhost:5000/api/health

# Trebalo bi: {"status":"OK","timestamp":"2026-05-23T12:00:00Z"}
```

#### Zadatak 5: Kreiraj PR i Traži Review

```bash
# 1. Kreiraj feature branch
git checkout -b feature/health-endpoint

# 2. Stage changes
git add .

# 3. Commit
git commit -m "feat: add health check endpoint"

# 4. Push
git push origin feature/health-endpoint

# 5. Otvori PR na GitHub
# https://github.com/[org]/[repo]/pull/new/feature/health-endpoint

# 6. Ispuni PR template
# 7. Taguj za review: @tech-lead
```

### Tjedna 2 — Keycloak Integracija

**Kartica: 4.2 — JWT Validacija**

```bash
# 1. Instalacija JWT paketa
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer

# 2. Update Program.cs
```

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;

// U Program.cs, prije var app = builder.Build();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "http://localhost:8080/realms/studentskapraksa";
        options.Audience = "api";
        options.RequireHttpsMetadata = false; // Samo za dev
    });

builder.Services.AddAuthorization();

var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();
```

```bash
# 3. Build i test
dotnet build
dotnet run

# 4. Kreiraj protected endpoint
```

```csharp
[HttpGet("protected")]
[Authorize] // Novi atribut
public IActionResult Protected()
{
    var user = User.Identity?.Name ?? "Unknown";
    return Ok(new { message = "Protected endpoint", user });
}
```

```bash
# 5. Test bez tokena (trebalo bi 401)
curl http://localhost:5000/api/health/protected

# 6. Test sa tokenom (trebalo bi 200)
# Tokena dobiju iz Keycloak-a
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/health/protected
```

---

## Frontend Developer Uloga

**Fokus:** Blazor stranice, komponente, login

### Tjedna 1 — Ponedjeljak

#### Zadatak 1: Setup Blazor Environment

```bash
# 1. Provjeri C# ekstenziju u VS Code
# Extensions → "C#" → Install

# 2. Provjeri Blazor Debug Extension
# Extensions → "Blazor WebAssembly Debugging" → Install

# 3. Testiraj
cd src/BlazorApp
dotnet restore
dotnet build
```

#### Zadatak 2: Pregled Existing Blazor Strukture

```bash
cd src/BlazorApp

# Pogledaj komponente
ls -R Components/
ls -R Pages/
ls -R Shared/

# Pogledaj Program.cs
cat Program.cs
```

#### Zadatak 3: Pokreni Blazor App

```bash
# 1. Start API prvo (u drugom terminal-u)
cd src/GIT.TransactionIdempotency
dotnet run

# 2. U trećem terminal-u, start Blazor
cd src/BlazorApp
dotnet run

# 3. Otvori http://localhost:5001 u browser-u
# Trebalo bi da vidiš Blazor home page
```

#### Zadatak 4: Kreiraj Home Stranicu

**Kartica: 5.1 — Blazor Web Setup**

```bash
# Edit: Pages/Home.razor
# Dodaj:
```

```razor
@page "/"

<div class="container">
    <div class="jumbotron">
        <h1 class="display-4">Studentska Praksa 2026</h1>
        <p class="lead">Full-stack .NET 10 + Blazor aplikacija</p>
        
        <hr class="my-4" />
        
        <p>
            <AuthorizeView>
                <Authorized>
                    <span>Dobrodošli, <strong>@context.User.Identity?.Name</strong>!</span>
                    <br/>
                    <a href="api/auth/logout" class="btn btn-primary btn-lg">Logout</a>
                </Authorized>
                <NotAuthorized>
                    <p>Molim vas prijavite se da biste nastavili.</p>
                    <a href="api/auth/login" class="btn btn-primary btn-lg">Login sa Keycloak-om</a>
                </NotAuthorized>
            </AuthorizeView>
        </p>
    </div>
</div>

@code {
    // Razlog za AuthorizeView je testiranje auth

}
```

#### Zadatak 5: Kreiraj Login Komponentu

**Kartica: 5.2 — Keycloak OIDC Integracija**

```bash
# Instalacija OIDC paketa
dotnet add package Microsoft.AspNetCore.Components.WebAssembly.Authentication

# Update Program.cs
```

```csharp
using Microsoft.AspNetCore.Components.WebAssembly.Authentication;

builder.Services.AddOidcAuthentication(options =>
{
    options.ProviderOptions.Authority = "http://localhost:8080/realms/studentskapraksa";
    options.ProviderOptions.ClientId = "web";
    options.ProviderOptions.ResponseType = "code";
    options.ProviderOptions.DefaultScopes.Add("profile");
    options.ProviderOptions.DefaultScopes.Add("openid");
    options.ProviderOptions.RedirectUri = "http://localhost:5001/authentication/login-callback";
    options.ProviderOptions.PostLogoutRedirectUri = "http://localhost:5001/authentication/logout-callback";
});
```

```bash
# Create Authentication page: Pages/Authentication.razor
```

```razor
@page "/authentication/{action}"
@using Microsoft.AspNetCore.Components.WebAssembly.Authentication
<RemoteAuthenticatorView Action="@Action" />

@code {
    [Parameter]
    public string? Action { get; set; }
}
```

```bash
# Build i test
dotnet build
dotnet run

# Provjeri: http://localhost:5001 trebalo bi prikazati login dugme
```

---

## DevOps Uloga

**Fokus:** Docker, Docker Compose, Keycloak, Environment

### Tjedna 1 — Ponedjeljak

#### Zadatak 0: Docker Setup

```bash
# 1. Provjeri Docker verziju
docker --version
docker-compose --version

# 2. Ako nema, download:
# https://www.docker.com/products/docker-desktop
```

#### Zadatak 1: Kreiraj .env Fajl

```bash
# 1. Kopira template
cp .env.example .env

# 2. Edit .env i postavi vrijednosti
cat .env
```

```env
# Database
POSTGRES_USER=student
POSTGRES_PASSWORD=changeme
POSTGRES_DB=studentskapraksa

# API
ASPNETCORE_ENVIRONMENT=Development
ConnectionStrings__Default=Host=db;Database=studentskapraksa;Username=student;Password=changeme

# Keycloak
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=admin

# Web
ASPNETCORE_URLS=http://+:5001

# Research
RESEARCH_MODE=enabled
RESEARCH_UPLOAD_ENABLED=false
```

#### Zadatak 2: Pregled Docker Compose Fajla

```bash
# Pregled existing fajla
cat docker/docker-compose.yml

# Trebalo bi da vidi:
# - PostgreSQL servis
# - API servis
# - Web servis
# - Keycloak servis (trebalo bi dodati ako nema)
```

#### Zadatak 3: Pokreni Docker Compose Stack

**Kartica: 2.1 — Docker Compose Setup**

```bash
# 1. Provjera da docker daemon radi
docker ps

# 2. Pokreni stack
cd docker
docker-compose up -d

# 3. Čekaj ~30 sekundi

# 4. Provjeri statusim
docker-compose ps

# Trebalo bi da vidiš:
# - db       → Up
# - api      → Up (ili Starting)
# - web      → Up (ili Starting)
# - keycloak → Up (ili Starting)
```

#### Zadatak 4: Provjeri PostgreSQL Konekciju

**Kartica: 2.2 — PostgreSQL Inicijalizacija**

```bash
# 1. Instalacija psql client-a (ako nema)
# macOS: brew install postgresql
# Windows: https://www.postgresql.org/download/windows/
# Linux: apt-get install postgresql-client

# 2. Test konekcije
psql -h localhost -U student -d studentskapraksa -c "SELECT 1;"

# Trebalo bi da vidiš:
# ?column?
# ----------
#        1
```

#### Zadatak 5: Provjeri API & Web Dostupnosti

```bash
# 1. API (trebalo bi 200 ili 401)
curl http://localhost:5000/api/health

# 2. Web (trebalo bi HTML)
curl http://localhost:5001

# 3. Keycloak Admin Console (trebalo bi login)
# Browser: http://localhost:8080/admin
# Username: admin
# Password: admin
```

### Tjedna 2 — Keycloak Konfiguracija

**Kartica: 4.1 — Keycloak Setup**

```bash
# 1. Otvori Keycloak admin console
# http://localhost:8080/admin

# 2. Login sa admin/admin

# 3. Kreiraj realm "studentskapraksa"
# - Left menu: Realms
# - Klikni "Create realm"
# - Name: studentskapraksa

# 4. Kreiraj klijent "web"
# - Realm: studentskapraksa
# - Left: Clients → Create client
# - Name: web
# - Client Type: OpenID Connect
# - Next
# - Client authentication: OFF (Public)
# - Next
# - Valid Redirect URIs: http://localhost:5001/*
# - Valid Post Logout Redirect URIs: http://localhost:5001/*
# - Save

# 5. Kreiraj klijent "api"
# - Repeat korak 4
# - Name: api
# - Client authentication: ON (Confidential)
# - Valid Redirect URIs: http://localhost:5000/*

# 6. Kreiraj testne korisnike
# - Realm: studentskapraksa
# - Left: Users → Create user
# - Username: admin
# - Email: admin@example.com
# - First name: Admin
# - Last name: User
# - Save
# - Credentials tab
# - Set password: admin
# - Not Temporary

# Ponovi za: manager, user

# 7. Kreiraj uloge
# - Left: Realm roles → Create role
# - Role name: ADMIN
# - Create

# Ponovi za: MANAGER, USER

# 8. Dodijeli uloge korisnicima
# - Users → admin
# - Role mapping tab
# - Assign role: ADMIN
```

#### Zadatak 6: Testiraj JWT Token

```bash
# 1. Dobij token
curl -X POST http://localhost:8080/realms/studentskapraksa/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=api" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "grant_type=password" \
  -d "username=admin" \
  -d "password=admin"

# 2. Kopiraj "access_token" vrijednost

# 3. Koristi u API call-u
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/health/protected

# Trebalo bi 200 OK
```

---

## QA Tester Uloga

**Fokus:** Test framework, validacija zahtjeva, dokumentacija

### Tjedna 1

#### Zadatak 1: Setup xUnit Framework

**Kartica: 8.1 — Unit Test Setup**

```bash
# 1. Kreiraj test projekt
dotnet new xunit -n UnitTests -o tests/UnitTests

# 2. Add reference na API projekt
cd tests/UnitTests
dotnet add reference ../../src/GIT.TransactionIdempotency/GIT.TransactionIdempotency.csproj

# 3. Kreiraj prvi test
# Datoteka: CalculatorTests.cs
```

```csharp
namespace UnitTests;

public class CalculatorTests
{
    [Fact]
    public void Add_TwoNumbers_ReturnsSum()
    {
        // Arrange
        var calculator = new Calculator();
        
        // Act
        var result = calculator.Add(2, 3);
        
        // Assert
        Assert.Equal(5, result);
    }
}

public class Calculator
{
    public int Add(int a, int b) => a + b;
}
```

```bash
# 4. Pokreni testove
dotnet test

# Trebalo bi: "1 passed"
```

#### Zadatak 2: Pregled Test Plana za Sprint 1

```bash
# Kreiraj: docs/TEST_PLAN_SPRINT_1.md

# Sadržaj trebalo bi da sadrži test scenarije za:
# 1. Keycloak login
# 2. Protected API endpoint
# 3. Blazor komponente
# 4. Database migracije (kasnije)
```

#### Zadatak 3: Review Acceptance Kriterija

```bash
# Za svaku karticu na Trello-u:
# 1. Provjeri da li su acceptance kriteriji jasni
# 2. Ako nisu: postavi komentar na kartici
# 3. Prijedlozi kako bi trebali biti testirani
```

---

## Security Reviewer Uloga

**Fokus:** Keycloak, JWT, authorization

### Tjedna 1-2

#### Zadatak 1: Keycloak Security Checklist

```bash
# 1. Provjeri Keycloak konfiguraciju
# Keycloak Admin Console
# Realm: studentskapraksa
# Settings tab

# Checklist:
# - [ ] Redirect URIs nisu "*" (specifični su)
# - [ ] Client secrets nisu expose-ati
# - [ ] Token timeout je razumna (15-60 min)
# - [ ] HTTPS je zahtjevano za produkciju

# 2. Provjeri JWT claims
# https://jwt.io/

# Trebalo bi da ima:
# {
#   "sub": "user-id",
#   "preferred_username": "admin",
#   "realm_access": {
#     "roles": ["ADMIN"]
#   }
# }
```

#### Zadatak 2: API Security Provjera

```bash
# 1. Test bez tokena (trebalo bi 401)
curl http://localhost:5000/api/health/protected

# 2. Test sa invalid tokenom (trebalo bi 401)
curl -H "Authorization: Bearer invalid" http://localhost:5000/api/health/protected

# 3. Test sa tuđim user ID-om (trebalo bi biti onemogućeno)
# - Ako ima /api/users/{id}, testiraj sa tuđim ID-om
```

#### Zadatak 3: Kreiraj Security Checklist

```bash
# Datoteka: docs/SECURITY_CHECKLIST.md

Trebalo bi da sadrži:
- JWT validacija
- Authorization policies
- Input validation
- Error handling
- Secrets management
- CORS konfiguracija
```

---

## Database Engineer Uloga

**Fokus:** EF Core, Entity setup (za kasniju fazu)

### Tjedna 1

#### Zadatak 1: EF Core Setup

```bash
# 1. Instalacija EF Core CLI
dotnet tool install --global dotnet-ef

# 2. Instalacija NuGet paketa
cd src/GIT.TransactionIdempotency
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Npgsql
```

#### Zadatak 2: Kreiraj DbContext

```bash
# Datoteka: DL/DbContext.cs
```

```csharp
using Microsoft.EntityFrameworkCore;

namespace GIT.TransactionIdempotency.DL;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // DbSets će doći kada kreiramo entitete
    // public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Fluent API konfiguracije će doći
    }
}
```

#### Zadatak 3: Konfiguracija DbContext-a u Program.cs

```csharp
// U Program.cs
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// Provjera:
dotnet build
```

---

## Finalna Checklist Prije Kraja Sprint 1

```bash
# Za sve grupe

# Tehnički Checklist
docker-compose ps  # Trebalo bi: sve "Up"
curl http://localhost:5000/api/health  # 200
curl http://localhost:5001  # 200
dotnet test  # "X passed"
git log --oneline | head -5  # Trebalo bi commits

# Organizacijski Checklist
# [ ] Sve Sprint 1 kartice su završene ili blokirane
# [ ] Sve kartice imaju PR
# [ ] Code review je approve-ati
# [ ] GitHub Actions CI je zeleni
# [ ] Trello board je updated

# Dokumentacijski Checklist
# [ ] README je updated
# [ ] Testirane komande su dokumentovane
# [ ] Setup problem se logirani
```

---

## Problemi i Rješenja

### Problem: Docker kontejner ne pokreće se

```bash
# Solucija:
docker-compose logs db  # Vidi error
docker-compose down
docker-compose up -d
docker-compose logs

# Ako i dalje problema:
docker system prune  # Očisti stare images
docker-compose up -d --build  # Rebuild sve
```

### Problem: PostgreSQL konekcija odbacuje

```bash
# Provjera connection string-a
grep "Host=db" .env

# Trebalo bi: Host=db (ne localhost)
# Lokalno: Host=localhost

# Test:
psql -h localhost -U student -d studentskapraksa -c "SELECT 1;"
```

### Problem: Keycloak login ne radi

```bash
# Provjera:
# 1. Keycloak je dostupan? http://localhost:8080/admin
# 2. Client redirect URIs?
# 3. Realm je isti kao u kodu?
# 4. Token timeout nije istekao?

# Debug:
curl -X POST http://localhost:8080/realms/studentskapraksa/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=api" \
  -d "grant_type=password" \
  -d "username=admin" \
  -d "password=admin"

# Trebalo bi: access_token
```

---

## Trebam Pomoć!

**Prije nego što pitaš Tech Lead-a:**

1. Pregleda ovaj dokumenta
2. Pogledaj "Problemi i Rješenja" sekciju
3. Pokušaj sa `--help` flagom:
   - `dotnet --help`
   - `docker-compose --help`
4. Traži kod kolega sa istom ulogom

**Kako pitaj za help:**

```text
Uloga: Backend Dev
Problem: dotnet build ne radi
Komanda: cd src/GIT.TransactionIdempotency && dotnet build
Error:
[paste error message here]

Što sam već pokušao:
1. ...
2. ...
3. ...

@tech-lead ili @devops-engineer, trebam pomoć!
```

---

## Čestitam!

Ako si prošao ovaj setup, **spreman si za Sprint 1**!

Što dalje:
1.  Otvori svoju Trello karticu
2.  Pročitaj acceptance kriterije
3.  Kreiraj feature branch
4.  Počni kodirati
5.  Koristi GitHub Copilot
6.  Logiraj AI interakcije (sprint kraju)

**Sretno!**

