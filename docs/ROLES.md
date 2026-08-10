# 👥 Uloge i Odgovornosti — Detaljni Opis

**Cilj:** Jasno je definisano šta očekujemo od svake uloge tokom prakse.

---

## TECH LEAD — Koordinator & Arhitekt

### Glavna Odgovornost
**Osigurava da tim radio u dobrom smjeru, korisnik arhitekture, održava standarde koda.**

### Sprint 1 Konkretni Zadaci

| Sedmica | Aktivnosti | Trajanje |
|---|---|---|
| 1 | • GitHub setup (branch protection, PR template)<br>• Copilot instrukcije<br>• Trello board setup<br>• Sprint Planning<br>• Dnevni standup | 8-10h |
| 2 | • Daily standup (svi dani)<br>• Mid-sprint review<br>• Code review PR-ova<br>• Sprint review + retro<br>• Support za blokirane kartice | 6-8h |

### Dnevne Aktivnosti

- **Ponedjeljak:** Sprint Planning (30 min sa mentorem)
- **Utorak-Četvrtak:** Daily standup (15 min), code review PR-ova
- **Petak:** Sprint Review (1h) + Retrospektiva (30 min)

### Code Review Checklist

```
PRIJE SVAKOG MERGE-A:
- [ ] Kod je u PRAVOM sloju (API → BL → DL)
- [ ] Nema .Result ili .Wait() (async/await)
- [ ] Entiteti se ne vraćaju direktno (koristi DTO)
- [ ] Validacija je na mjestu
- [ ] Testovi su napisani
- [ ] Nema hardkodiranih tajni
- [ ] Error handling je ispravan
- [ ] CI pipeline je zelena

AKO SVE PROLAZI:
- [ ] Approve PR
- [ ] Merge sa "Squash and merge" ako su 1-2 commita
- [ ] Obriši feature branch
```

### Trello Manage

```
Sprint Planning:
1. Otvori "Sprint Backlog" listu
2. Dodaj sve kartice iz SPRINT_1_PLAN.md
3. Postavi assignee-e (kognitivnost, experience)
4. Set Due date (Petak toga sedmice)

Tijekom Sprinta:
1. Daily: Pogledaj "In Progress" listu (max 1-2 po osoba)
2. Daily: Pogledaj "Blokirano" listu (odmah rješavaj)
3. Četvrtak: Mid-sprint review (jesmo li na right tracku?)
4. Petak: Pomakni "Gotovo" kartice (samo one sa PR-om)
```

### Komunikacija

- **Sa mentorem:** Sedmično
- **Sa timom:** Dnevno (standup)
- **Sa svakim članom:** Sedmično (ako trebaš)

---

## BACKEND DEVELOPER — API & Services Arhitekt

### Glavna Odgovornost
**Razvija .NET API, servise, logiku, testove. Backend je AUTHORITY za sigurnost.**

### Sprint 1 Konkretni Zadaci

| Kartica | Zadatak | Story Points |
|---|---|---|
| 3.1 | Kreiranje .NET 10 API strukture | 5 |
| 3.2 | Hello World endpoint | 3 |
| 4.2 | JWT validacija middleware | 5 |
| 8.1 | Unit testovi setup (ako je Backend + QA) | 3 |

**Ukupno:** ~16 story points za 2 osobe = 8 po osoba (realno za 2 sedmice)

### Dnevni Ritam

```
Ponedjeljak:
1. Pročitaj karticu na Trello-u
2. Kreiraj feature branch: git checkout -b feature/task-name
3. Počni sa kodom
4. Commit često: git commit -m "feat: opis"

Utorak-Četvrtak:
1. Daily standup (15 min)
2. Nastavi sa kodom
3. Provjera: `dotnet build` i `dotnet test` prolaze
4. Commit sa opisom

Petak:
1. Završi zadatak
2. Kreiraj PR: git push origin feature/task-name
3. Otvori PR na GitHub
4. Zatraži review od Tech Lead-a
5. Address review feedback (ako ima)
```

### Kodovanje Pravila

```csharp
//  DOBRO
public async Task<ProductDto> CreateProductAsync(CreateProductDto dto)
{
    // Validacija
    if (string.IsNullOrWhiteSpace(dto.Name))
        throw new ValidationException("Name is required");
    
    // Logika u servisu
    var product = await _productService.CreateAsync(dto);
    
    // DTO response
    return _mapper.Map<ProductDto>(product);
}

//  LOŠE
public ProductDto CreateProduct(Product entity) // Vraća entitet!
{
    // Logika u controller-u
    if (entity.Price < 0)
        entity.Price = 0;
    
    _context.Products.Add(entity); // Direktno pristup bazi
    _context.SaveChanges(); // Sinkrono!
    
    return entity;
}
```

### Testing Očekivanja

```
Za svaku karticu:
1. Minimalno 1 unit test
2. Minimalno 1 integration test (za kartice sa DB-om)
3. Test ime jasno kaže šta se testira:
   - ServiceName_MethodName_ExpectedResult
   - Npr: ProductService_CreateAsync_WithValidData_ShouldReturnDto()
```

### Sigurnosna Pravila

```
OBAVEZNO:
- [ ] Backend validira sve ulaze
- [ ] Backend provjerava JWT token
- [ ] Backend provjerava role/permission
- [ ] Nema hardkodiranih tajni u kodu
- [ ] Error poruke nisu expose-ati internals
- [ ] SQL querije su parameterized (EF Core)

NIKADA:
- [ ] Don't trust frontend
- [ ] Don't hardcode passwords
- [ ] Don't return entities directly
- [ ] Don't use .Result or .Wait()
- [ ] Don't commit secrets to git
```

### Tools & Commands

```bash
# Build
dotnet build

# Test
dotnet test

# Run
dotnet run

# Add NuGet package
dotnet add package PackageName

# EF Core migration (later)
dotnet ef migrations add MigrationName
dotnet ef database update

# Clean
dotnet clean
rm -rf bin obj
```

---

##  FRONTEND DEVELOPER — UI & UX Arhitekt

### Glavna Odgovornost
**Razvija Blazor komponente, stranice, auth integraciju, UI/UX.**

### Sprint 1 Konkretni Zadaci

| Kartica | Zadatak | Story Points |
|---|---|---|
| 5.1 | Blazor struktura & Home stranica | 5 |
| 5.2 | Keycloak OIDC integracija | 8 |

**Ukupno:** 13 story points (realno za 1-2 osobe)

### Dnevni Ritam

```
Ponedjeljak:
1. Pregled Blazor strukture
2. Kreiraj Pages/ i Components/
3. Feature branch: git checkout -b feature/blazor-pages

Utorak-Četvrtak:
1. Kreiraj Razor komponente
2. Testiraj sa `dotnet run`
3. Integracija sa API-jem (HttpClient)
4. Auth flow testiranje

Petak:
1. Završi integraciju
2. PR + review
```

### Blazor Best Practices

```razor
<!--  DOBRO -->
@page "/products"
@using YourApp.Models
@inject ProductService ProductService
@inject NavigationManager NavManager

<div class="container">
    @if (isLoading)
    {
        <p>Loading...</p>
    }
    else if (products?.Any() == true)
    {
        <ul>
            @foreach (var product in products)
            {
                <li>@product.Name - @product.Price</li>
            }
        </ul>
    }
    else
    {
        <p>No products found.</p>
    }
</div>

@code {
    private List<ProductDto> products = new();
    private bool isLoading = true;
    
    protected override async Task OnInitializedAsync()
    {
        try
        {
            products = await ProductService.GetAllAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
        finally
        {
            isLoading = false;
        }
    }
}

<!--  LOŠE -->
@page "/products"

<button @onclick="LoadProducts">Load</button>

@code {
    public void LoadProducts()
    {
        // Direktan HTTP poziv bez servisa
        // var client = new HttpClient();
        // client.GetAsync("http://localhost:5000/..."); // Hardkodiran URL!
    }
}
```

### Permission Prikaz

```razor
<!-- Samo korisnici sa MANAGER role-om vide Create dugme -->
<AuthorizeView Roles="MANAGER">
    <Authorized>
        <button class="btn btn-primary">Create Product</button>
    </Authorized>
    <NotAuthorized>
        <p>You don't have permission to create products.</p>
    </NotAuthorized>
</AuthorizeView>

<!-- Cijela stranica je zaštićena -->
@page "/admin"
@attribute [Authorize(Roles = "ADMIN")]

<h1>Admin Panel</h1>

<!-- Samo ako je prijavljen -->
<AuthorizeView>
    <Authorized>
        <p>Hello, @context.User.Identity?.Name</p>
    </Authorized>
    <NotAuthorized>
        <p>Please login first.</p>
        <a href="api/auth/login">Login</a>
    </NotAuthorized>
</AuthorizeView>
```

### Testing Očekivanja

```
Za svaku stranicu/komponentu:
1. Ručno testiranje (klik kroz UI)
2. Test scenariji:
   - Happy path (sve ide OK)
   - Sad path (greške, loading, empty state)
   - Permission path (ne vidam što ne trebam)

Primjer test scenario-a:
1. Otvorim /products
2. Vide loading spinner (3 sec)
3. Vidi listu proizvoda
4. Klik na "Create" dugme → forma se otvara
5. Popunim formu
6. Klik "Save"
7. Spinner se prikazuje (2 sec)
8. Forma se zatvara
9. Lista se osvježi
```

---

##  DEVOPS ENGINEER — Infrastructure Arhitekt

### Glavna Odgovornost
**Docker, Keycloak, environment, deployment pipeline.**

### Sprint 1 Konkretni Zadaci

| Kartica | Zadatak | Story Points |
|---|---|---|
| 1.1 | Localni dev setup (podršku svima) | 3 |
| 2.1 | Docker Compose setup | 5 |
| 2.2 | PostgreSQL inicijalizacija | 3 |
| 4.1 | Keycloak konfiguracija | 8 |

**Ukupno:** 19 story points (realno za 1 osoba u 2 sedmice = teško, ali moguće)

### Dnevni Ritam

```
Ponedjeljak:
1. Setup .env template
2. Kreiraj docker-compose.yml
3. Test: docker-compose up -d

Utorak-Sreda:
1. PostgreSQL setup & test
2. Keycloak realm/client konfiguracija
3. Debug: Ako kontejneri ne pokreću se

Četvrtak-Petak:
1. JWT token test sa curl
2. Full stack test (API + Web + Keycloak)
3. Dokumentacija: Kako pokrenut lokalni dev
```

### Docker Compose Struktura

```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD", "pg_isready"]
      interval: 5s
      timeout: 3s
      retries: 10

  api:
    build:
      context: ..
      dockerfile: docker/Dockerfile.api
    environment:
      ConnectionStrings__Default: "Host=db;Database=${POSTGRES_DB};Username=${POSTGRES_USER};Password=${POSTGRES_PASSWORD}"
    ports:
      - "5000:5000"
    depends_on:
      db:
        condition: service_healthy

  web:
    build:
      context: ..
      dockerfile: docker/Dockerfile.web
    ports:
      - "5001:5001"
    depends_on:
      - api

  keycloak:
    image: quay.io/keycloak/keycloak:latest
    environment:
      KEYCLOAK_ADMIN: ${KEYCLOAK_ADMIN}
      KEYCLOAK_ADMIN_PASSWORD: ${KEYCLOAK_ADMIN_PASSWORD}
      KC_PROXY: edge
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://db:5432/${POSTGRES_DB}
      KC_DB_USERNAME: ${POSTGRES_USER}
      KC_DB_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "8080:8080"
    depends_on:
      db:
        condition: service_healthy
    command: start-dev

volumes:
  pgdata:
```

### Keycloak Konfiguracija Checklist

```
REALM:
- [ ] Name: studentskapraksa
- [ ] Enabled: true

CLIENTS:
- [ ] Client: "web"
  - [ ] Type: OpenID Connect
  - [ ] Public
  - [ ] Redirect URIs: http://localhost:5001/*
  
- [ ] Client: "api"
  - [ ] Type: OpenID Connect
  - [ ] Confidential
  - [ ] Service account: ENABLED

USERS:
- [ ] admin / admin (role: ADMIN)
- [ ] manager / manager (role: MANAGER)
- [ ] user / user (role: USER)

ROLES:
- [ ] ADMIN
- [ ] MANAGER
- [ ] USER

ROLES ASSIGNMENT:
- [ ] admin user → ADMIN role
- [ ] manager user → MANAGER role
- [ ] user user → USER role
```

### Commands

```bash
# Start stack
docker-compose up -d

# Stop stack
docker-compose down

# View logs
docker-compose logs -f

# View status
docker-compose ps

# Test PostgreSQL
psql -h localhost -U student -d studentskapraksa

# Test Keycloak
curl http://localhost:8080/admin
# Login: admin/admin

# Get JWT token
curl -X POST http://localhost:8080/realms/studentskapraksa/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=api&grant_type=password&username=admin&password=admin"
```

---

##  QA TESTER — Kvalitet & Validacija

### Glavna Odgovornost
**Validacija zahtjeva, test planovi, unit/integration testovi, bugovi.**

### Sprint 1 Konkretni Zadaci

| Kartica | Zadatak | Story Points |
|---|---|---|
| 1.1 | Podrška za setup (testiranje svim ulogama) | 2 |
| 8.1 | xUnit framework setup | 3 |
| General | Test plan, validacija zahtjeva | 3 |

**Ukupno:** ~8 story points

### Dnevni Ritam

```
Ponedjeljak:
1. Pregled acceptance kriterija svih kartica
2. Provjera: Jesu li jasni?
3. Setup xUnit projekta

Utorak-Četvrtak:
1. Pisanje test-ova
2. Validacija: Acceptance kriteriji su ispunjeni?
3. Bug prijave (ako pronađeš problem)

Petak:
1. Finalna validacija svih kartica
2. Provjera test coverage-a
```

### Test Plan Struktura

```markdown
## Test Plan — Sprint 1

### 1. Setup & Environment
- [ ] Docker stack se pokreće bez greške
- [ ] Svi kontejneri su dostupni
- [ ] Health check su zeleni

### 2. Keycloak & Auth
- [ ] Keycloak je dostupan na localhost:8080
- [ ] Login sa admin radira
- [ ] JWT token je dostupan
- [ ] Token sadrži ispravne claims

### 3. API Endpoints
- [ ] GET /api/health vraća 200 OK
- [ ] GET /api/health/protected bez tokena vraća 401
- [ ] GET /api/health/protected sa tokenom vraća 200

### 4. Blazor UI
- [ ] Web aplikacija se pokreće na localhost:5001
- [ ] Home stranica je dostupna
- [ ] Login link je vidljiv
- [ ] Klik na login preusmjerava na Keycloak

### 5. Regression
- [ ] Svi stari testovi još prolaze
- [ ] Nema regression-a
```

### Bug Prijava Format

```
Title: [Component] Short description

Description:
Steps to reproduce:
1. ...
2. ...
3. ...

Expected result:
...

Actual result:
...

Screenshots:
[if applicable]

Environment:
- OS: Windows 10
- .NET version: 10.0.x
- Browser: Chrome

Severity:
[ ] Critical (application broken)
[ ] High (major feature broken)
[ ] Medium (feature partially broken)
[ ] Low (cosmetic issue)
```

---

##  SECURITY REVIEWER — Sigurnost & Compliance

### Glavna Odgovornost
**JWT, authorization, secrets, input validation, OWASP.**

### Sprint 1 Konkretni Zadaci

| Kartica | Zadatak | Story Points |
|---|---|---|
| 4.1 | Keycloak security review | 3 |
| 4.2 | JWT validacija review | 2 |
| 5.2 | OIDC integracija review | 2 |

**Ukupno:** ~7 story points

### Dnevni Ritam

```
Ponedeljak-Utorak:
1. Pregled Keycloak setup-a
2. Checklist: Redirect URIs, client secrets, timeouts
3. Dokumentovanje sigurnosne konfiguracije

Srednja-Četvrtak:
1. JWT validacija provjera
2. Authorization policy provjera
3. Input validation provjera

Petak:
1. Finalna sigurnosna provjera
2. Izrada sigurnosnog checklist-a
```

### Security Checklist

```
AUTHENTICATION:
- [ ] JWT token je validiran
- [ ] Issuer je provjeran
- [ ] Expiration je provjeren
- [ ] Signature je provjerena
- [ ] Token timeout je razumna (15-60 min)

AUTHORIZATION:
- [ ] Svaki protected endpoint ima [Authorize]
- [ ] Role-based policies su definirane
- [ ] User ne može pristupiti tuđim resursima
- [ ] Admin panel je samo za ADMIN role

INPUT VALIDATION:
- [ ] Backend validira sve ulaze
- [ ] Nema SQL injection rizika
- [ ] Nema XSS rizika

SECRETS:
- [ ] Nema hardkodiranih tajni u kodu
- [ ] Nema secrets u git-u
- [ ] Koristi se .env ili GitHub Secrets

ERROR HANDLING:
- [ ] Greške ne otkrivaju internal detaljе
- [ ] Korisnik vidi jasnu poruku
- [ ] Server loguje detalje (dev log)

HTTPS (later):
- [ ] SSL certifikati su validni
- [ ] Nema mixed content (HTTP+HTTPS)
- [ ] CORS je pravilno konfigurisan
```

---

##  DATABASE ENGINEER — Data Architecture

### Glavna Odgovornost
**EF Core, entiteti, migracije, schema, performance.**

### Sprint 1 Konkretni Zadaci

| Kartica | Zadatak | Story Points |
|---|---|---|
| 1.1 | PostgreSQL setup (podrška) | 1 |
| 2.2 | PostgreSQL inicijalizacija | 3 |
| General | EF Core setup & DbContext | 3 |

**Ukupno:** ~7 story points

### Dnevni Ritam

```
Ponedjeljak:
1. Pregled PostgreSQL u Docker
2. Konfiguracija connection string-a
3. Setup EF Core

Utorak-Četvrtak:
1. Kreiranje DbContext
2. Planiranje entiteta (za sprint 2)
3. Seed data inicijalizacija

Petak:
1. Validacija: DbContext radi sa bazom
2. Test migrations
```

### EF Core Best Practices

```csharp
// DbContext
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    // DbSets (nakon sprint 1)
    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Fluent API konfiguracije
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(200);
            entity.Property(e => e.Price)
                .HasPrecision(10, 2)
                .IsRequired();
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("NOW()");
        });
    }
}

// Entity
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

// Repository
public class ProductRepository : IRepository<Product>
{
    private readonly ApplicationDbContext _context;

    public ProductRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Product> GetByIdAsync(int id)
    {
        return await _context.Products.FindAsync(id);
    }

    public async Task<IEnumerable<Product>> GetAllAsync()
    {
        return await _context.Products.ToListAsync();
    }

    public async Task AddAsync(Product entity)
    {
        await _context.Products.AddAsync(entity);
        await _context.SaveChangesAsync();
    }
}
```

### Migrations

```bash
# Kreiraj migraciju
dotnet ef migrations add "AddProductTable"

# Primijeni migraciju
dotnet ef database update

# Pogledaj SQL koji će se pokrenuti
dotnet ef migrations script

# Ukloni posljednju migraciju (ako grešiš)
dotnet ef migrations remove
```

---

##  Sažetak Uloga

| Uloga | Primarni Fokus | Sprint 1 Story Points | Tools |
|---|---|---|---|
| **Tech Lead** | Koordinacija, GitHub, code review | 10 | GitHub, Trello |
| **Backend Dev** (x2) | API, servisi, testovi | 16 (8 po osoba) | VS Code, .NET, Copilot |
| **Frontend Dev** (x1-2) | Blazor, UI, auth | 13 | VS Code, Blazor, Copilot |
| **DevOps** | Docker, Keycloak, env | 19 | Docker, Terminal, Keycloak |
| **QA Tester** | Testovi, validacija | 8 | xUnit, Trello |
| **Security** | Auth, sigurnost | 7 | Keycloak, Postman |
| **Database** | EF Core, schema | 7 | EF Core, PostgreSQL |

**Ukupno:** ~80 story points za grupu od 7-8 osoba = Realno za 2 sedmice 

---

##  Success Criteria po Ulozi

### Tech Lead
- [ ] Svi članovi tima imaju jasnu karticu
- [ ] Nema merge-a bez review-a
- [ ] GitHub Actions je zelena
- [ ] Sprint je završen do kraja Petka

### Backend Dev
- [ ] API se pokreće bez greške
- [ ] Svi endpointi imaju testove
- [ ] Nema .Result ili .Wait()
- [ ] Svi review feedback su address-ati

### Frontend Dev
- [ ] Blazor app se pokreće
- [ ] Login radi
- [ ] Sve stranice imaju permission prikaz
- [ ] Nema hardkodiranih URL-eva

### DevOps
- [ ] `docker-compose up -d` radi
- [ ] Svi servisi su dostupni
- [ ] PostgreSQL je dostupan
- [ ] Keycloak je konfigurisan

### QA Tester
- [ ] Test plan je napisan
- [ ] Unit testovi se pokreću
- [ ] Acceptance kriteriji su validovani
- [ ] Bug liste nema (ili minimalna)

### Security Reviewer
- [ ] JWT je validiran
- [ ] Authorization je na mjestu
- [ ] Nema hardkodiranih tajni
- [ ] Error poruke su sigurne

### Database Engineer
- [ ] DbContext je konfigurisan
- [ ] EF Core je funkcionalan
- [ ] PostgreSQL je dostupan
- [ ] Migracije rade

---

## Kako Dobiti Pomoć

**Ako si blokiran/a:**

1. **Prvo:** Pogledaj dokumentaciju (PROJECT_STRUCTURE.md, INITIAL_SETUP.md)
2. **Drugo:** Pitaj kolegu sa istom ulogom
3. **Treće:** Koristi GitHub Copilot sa odgovarajućim AI agent prompt-om
4. **Četvrto:** Postavi issue na GitHub ili Trello kartica komentar
5. **Peto:** Pitaj Tech Lead-a ili mentora

**Format za traženje pomoći:**

```
Problem: [Kratak opis]
Uloga: [Tvoja uloga]
Kartica: [Link na Trello]
Pokušao/la sam:
1. ...
2. ...
3. ...

Trebam pomoć sa:
[Detaljno pitanje]
```

---

##  Dobrodošli na Praksu!

Evo što će se desiti:
- **Sedmica 1:** Setup, setup, setup 
- **Sedmica 2:** Prvi kod, prvi testovi 
- **Sedmica 3-4:** Pravi razvoj, feature-ovi 
- **Sedmica 5-6:** Deployment, CI/CD 
- **Sedmica 7-8:** Finalizacija, prezentacija 

**Vaša uloga:** Važna je! Svaki dio tima je **kritičan** za uspjeh projekta.

**AI Pomoć:** GitHub Copilot je kao kolega koji nikad ne spava — koristi ga!

**Comunicija:** Daily standup, PR reviews, Trello — sve je vidljivo, sve je javno.

**Cilj:** Na kraju — funkcionalna aplikacija + iskustvo sa modernim tech stack-om + saznanja kako AI zaista pomaže.

**Sretno!**

