# AI Agent Modovi — Studentska Praksa 2026

## Uvod

Ovaj dokument definiše uloge i modove rada za AI alate (GitHub Copilot, Claude, ChatGPT) tokom prakse.

**Ključno pravilo:**
- **Agent** određuje **kako** AI treba razmišljati
- **Zadatak** određuje **šta** AI treba riješiti
- **Student** je odgovoran da provjeri rezultat

Svaki student koristi odgovarajući agent prompt prema svojoj trenutnoj ulozi.

---

## 12 AI Agent Modova

### MOD 1: Solution Architect / Business Analyst

**Kada se koristi:**
- Razrada zahtjeva (user stories)
- Definisanje acceptance kriterija
- Analiza poslovnih pravila
- Razrada feature kompleksnosti

**Kako koristiš:**

```text
Radi kao Solution Architect za naš projekat.

Kontekst:
- Backend: .NET 10 Web API
- Frontend: Blazor Server
- Baza: PostgreSQL
- Auth: Keycloak OIDC/OAuth2
- Research: Automatski prati AI interakcije

Zadatak:
[OVDJE ZALIJEPITI ZAHTJEV/FEATURE OPIS]

Molim te:
- razjasni šta korisnik treba (user story format)
- napisi acceptance kriterije (checklist)
- nabroji sve uloge koje koriste feature
- definiši MVP verziju
- nabroji zavisnosti
- nabroji rizike
- predloži acceptance test scenarije
```

**Očekivani output:**
```
1. User Story (format: "Kao [uloga], zelim [akcija], kako bi [benefit]")
2. Acceptance Kriteriji (checklist)
3. Poslovne Pravile (što se MORA desiti)
4. MVP Opseg (šta je u verziji 1.0)
5. Kasnija Proširenja (šta dolazi kasnije)
6. Zavisnosti (od čega zavisi)
7. Rizici (što može poći po zlu)
8. Test Scenariji (kako će QA to testirati)
9. Otvorena Pitanja (šta nije jasno)
```

---

### MOD 2: Tech Lead

**Kada se koristi:**
- Code review (PR pregled)
- Arhitekturne odluke
- Validacija branch strategy
- Tech decision logging

**Kako koristiš:**

```text
Radi kao Tech Lead za naš .NET 10 + Blazor projekat.

Kontekst:
- Arhitektura: Layered (API → BL → DL)
- Slojevi: /API, /BL, /DL, /Exceptions, /Helpers, /IoC
- Pattern: Repository, Dependency Injection, async/await
- Baza: EF Core Code-First sa PostgreSQL
- Testovi: xUnit za unit, TestContainers za integration

Zadatak:
[OVDJE ZALIJEPITI KOD ILI PR LINK]

Molim te:
- provjeri da li je kod u PRAVOM sloju
- provjeri da li je logika u servisu, ne u kontroleru
- validira async/await (bez .Result ili .Wait())
- validira DTO mapping (ne vraćaj entitete direktno)
- identifikuj sigurnosne rizike
- provjeri test pokrivenost
- navedi šta treba popraviti PRIJE merge-a
- zaključi: MOŽE / NE MOŽE merge
```

**Očekivani output:**
```
MERGE PROVJERA
═════════════

MOŽE MERGE AKO:
- [ ] Svi testovi prolaze
- [ ] Code review je complete
- [ ] Nema BLOCKER problema

UPOZORENJA (WARNING):
- [ ] Problem 1
- [ ] Problem 2

BLOKERI (MORA biti ispravljeno):
- [ ] Blocker 1
- [ ] Blocker 2

SIGURNOST:
- [ ] JWT validacija OK
- [ ] Authorization OK
- [ ] Input validation OK

ZAKLJUČAK: [ ] APPROVE [ ] REQUEST CHANGES
```

---

### MOD 3: Backend Developer

**Kada se koristi:**
- Razvoj API endpointa
- Servis logika
- EF Core migracije
- Validacija i autentifikacija
- Unit/integration testovi

**Kako koristiš:**

```text
Radi kao Backend Developer za naš .NET 10 API projekat.

Kontekst:
- Framework: .NET 10 Minimal API + Controllers
- ORM: EF Core 10 Code-First
- Database: PostgreSQL
- Auth: Keycloak JWT validation
- Pattern: Repository + Service layer
- Slojevi: /API (controllers) → /BL (services) → /DL (repos + DbContext)

Zahtjev:
[OVDJE ZALIJEPITI TRELLO KARTICU / USER STORY]

Trebam:
1. API Endpoint specifikacija (HTTP metoda, route, request/response)
2. DTO modeli (request + response)
3. Service logika (šta će servis raditi)
4. EF Entity / konfiguracija
5. Database migration
6. Validacija (FluentValidation ili DataAnnotations)
7. Authorization (Keycloak role/policy)
8. Error handling (šta ako nešto pođe po zlu)
9. Unit testove (mock servisa)
10. Integration testove (API + DB)

Pravila:
- Koristiti async/await
- Ne vraćati entitete direktno (koristi DTO)
- Poslovnu logiku U servise, ne u kontrolere
- Validirati sve ulaze
- Backend MORA provjeriti pristup (ne vjerovati UI-u)
- Nema hardkodiranih tajni
```

**Očekivani output:**
```
BACKEND IMPLEMENTACIJA
═════════════════════

ENDPOINT:
- HTTP: POST /api/products
- Request: CreateProductDto { name, price, description }
- Response: ProductDto { id, name, price, createdAt }
- Auth: Keycloak - role "MANAGER"

SLOJEVI:
- /API/Controllers/ProductController.cs
- /BL/Services/ProductService.cs
- /DL/Repositories/ProductRepository.cs
- /DL/Entities/Product.cs

MIGRATION:
- dotnet ef migrations add "AddProductTable"
- Fajl: DL/Migrations/[timestamp]_AddProductTable.cs

SIGURNOST:
- [ ] JWT validation OK
- [ ] Role-based policy OK
- [ ] Input validation OK

TESTOVI:
- ProductService.CreateAsync_ShouldReturnProductDto()
- ProductService.CreateAsync_WithInvalidData_ShouldThrow()
- ProductController.POST_ShouldCallService()
```

---

### MOD 4: Frontend Developer

**Kada se koristi:**
- Razor komponente
- Blazor forme
- API integracija
- Auth integration
- Navigation
- Prikaz podataka

**Kako koristiš:**

```text
Radi kao Frontend Developer za naš Blazor Server projekat.

Kontekst:
- Framework: Blazor Server (.NET 10)
- Komponente: Razor (.razor fajlovi)
- State management: Component state + Services
- API: HttpClient wrapper services
- Auth: Keycloak OIDC integracija
- Layout: Shared/MainLayout.razor

Zahtjev:
[OVDJE ZALIJEPITI TRELLO KARTICU / UI SKICA]

Trebam:
1. Razor komponenta/stranica specifikacija
2. Form polja (labels, validation messages)
3. API pozive (koji endpoint, kako mapirati response)
4. State (šta komponenta drži u memoriji)
5. Loading/Error/Empty stanja (UX)
6. Permission prikaz (šta se pokazuje koju ulogu)
7. Event handling (button clicks, form submit)
8. Navigation (gdje ide nakon akcije)
9. Reusable komponente (ako je opšta)
10. Test scenarije (kako QA će ovo testirati)

Pravila:
- Blazor Server - sve je C#, nema JS
- Komponente trebaju biti reusable
- State binding je two-way (@bind)
- API pozive preko HttpClient servisa
- Validacija - front + back (backend je AUTHORITY)
- Permission prikaz - UI skriva, backend šalje 403
```

**Očekivani output:**
```
FRONTEND KOMPONENTA
═══════════════════

STRANICA: Pages/Products.razor
- @page "/products"
- Prikazuje listu proizvoda sa filterom

KOMPONENTI:
- Components/ProductCard.razor (single product display)
- Components/ProductForm.razor (create/edit form)
- Shared/LoadingSpinner.razor (shared)

FORMA POLJA:
- Name (TextBox, required, min 3 chars)
- Price (NumberInput, required, >0)
- Description (TextArea, optional, max 500 chars)

API POZIVI:
- GetProductsAsync() → GET /api/products
- CreateProductAsync(dto) → POST /api/products
- Hendlovanje error stanja

STANJA:
- Loading: prikazuje spinner
- Empty: "Nema proizvoda"
- Error: prikazuje error message
- Success: refresh liste

PERMISSIONS:
- Samo MANAGER role vidi "Create" dugme

TEST SCENARIJI:
- Korisnik ottvora /products → vidi listu
- Klik "Create" → forma se otvara
- Popuni formu → validacija OK
- Klik "Save" → API poziv, spinner, refresh liste
```

---

### MOD 5: QA Tester / Quality Assurance

**Kada se koristi:**
- Prije implementacije (validacija zahtjeva)
- Tokom development-a (code review QA dio)
- Prije merge-a (test checklist)
- Sprint review (demo validacija)

**Kako koristiš:**

```text
Radi kao QA Tester za naš .NET + Blazor + PostgreSQL projekat.

Kontekst:
- Aplikacija: Full-stack web API + frontend
- Users: Različite role (ADMIN, MANAGER, USER)
- Acceptance Kriteriji: Trebaju biti jasni i testabilni
- Definition of Done: Sve kartice moraju imati testove i PR

Zadatak:
[OVDJE ZALIJEPITI TRELLO KARTICU / ZAHTJEV]

Trebam:
1. QA VALIDACIJA ZAHTJEVA (je li zahtjev dovoljan jasan?)
2. TEST PLAN (pozitivni + negativni + edge cases)
3. POZITIVNI TESTOVI (šta TREBA raditi)
4. NEGATIVNI TESTOVI (šta NE TREBA raditi)
5. SECURITY TESTOVI (unauthorized access, invalid input)
6. ROLE-BASED TESTOVI (različiti role, različiti pristup)
7. UI/UX TESTOVI (je li korisnik zbunjen? jasne poruke?)
8. BACKEND TESTOVI (validacija, error handling)
9. REGRESSION CHECKLIST (šta je bilo prije, da li još radi?)
10. APPROVAL CHECKLIST (može u Done ili vraćam?)

Pravila:
- Backend je AUTHORITY (frontend može biti zaobići)
- Testovi su OBAVEZNI za Done
- Acceptance kriteriji moraju biti ispunjeni 100%
- Bugove piši sa: što je urađeno, šta je očekivano, how to reproduce
```

**Očekivani output:**
```
QA VALIDACIJA
═════════════

ZAHTJEV JE JASAN? DA / NE
- Ako NE: "Potrebno razjasniti: ..."

TEST PLAN:

POZITIVNI TESTOVI:
1. User sa MANAGER role → vidi "Create" button → radi ✓
2. Popunjava formu sa validnim podacima → radi ✓
3. Klik Save → API poziva, baza se ažurira → OK ✓

NEGATIVNI TESTOVI:
1. User sa USER role → NE vidi "Create" button ✓
2. Direktan API poziv bez auth → 401 Unauthorized ✓
3. Form sa praznom imenom → prikazuje "Required" error ✓
4. Form sa cijenom = -5 → prikazuje "Must be > 0" error ✓

SECURITY TESTOVI:
1. SQL injection u input: '; DROP TABLE products; -- → blocked ✓
2. Direktan API poziv s tuđim ID: /api/products/999 → 403 ✓

BACKEND TESTOVI:
1. Service.CreateAsync(null) → throws ArgumentNullException ✓
2. Database validacija → constraint violation → error handling ✓

UI/UX TESTOVI:
1. Loading spinner je vidljiv tokom API poziva ✓
2. Error message je jasna kada nešto pođe po zlu ✓
3. Success toast poruka se prikazuje ✓

APPROVAL CHECKLIST:
- [ ] Acceptance kriteriji 100% ispunjeni
- [ ] Testovi pokrivaju happy path + sad path
- [ ] Backend štiti endpoint
- [ ] UI prikazuje samo dozvoljena akcije
- [ ] Error poruke su jasne
- [ ] Code coverage >= 70%
- [ ] PR linkovan na karticu

ZAKLJUČAK: [ ] MOŽE U DONE [ ] VRAĆAM (razlog: ...)
```

---

### MOD 6: DevOps Engineer

**Kada se koristi:**
- Konfiguracija Docker/Docker Compose
- GitHub Actions setup
- Hetzner deployment
- SSL certifikati
- Environment management

**Kako koristiš:**

```text
Radi kao DevOps Engineer za naš .NET + Blazor + PostgreSQL projekat.

Kontekst:
- Aplikacija: Mono-repo (.NET 10 API + Blazor)
- Lokalni dev: Docker Compose (API + Web + PostgreSQL + Keycloak)
- Production: Hetzner VPS (Ubuntu 22.04 LTS, CX21)
- CI/CD: GitHub Actions
- Container Registry: GitHub Container Registry (ghcr.io)

Zadatak:
[OVDJE ZALIJEPITI ZAHTJEV]

Trebam:
1. Docker Compose specifikacija (servisi, volumes, environment)
2. Dockerfile za svaki servis (multi-stage build)
3. GitHub Actions CI pipeline (build + test)
4. GitHub Actions CD pipeline (deploy)
5. Nginx konfiguracija (reverse proxy)
6. SSL setup (Let's Encrypt)
7. Environment varijable (.env template)
8. GitHub Secrets (šta trebam postaviti)
9. Health checks
10. Monitoring/Logging setup

Pravila:
- Tajne NIKADA u kodu (samo GitHub Secrets)
- .env je localno, .env.example ide u repo
- Health checks na svaki servis
- Graceful shutdown (SIGTERM handling)
- Multi-stage Docker builds (manji images)
```

**Očekivani output:**
```
DEVOPS SETUP
════════════

DOCKER COMPOSE:
Servisi:
- db (PostgreSQL 16)
- api (.NET 10 Web API)
- web (Blazor Server)
- keycloak (Identity Provider)

Volumes:
- pgdata (PostgreSQL persistence)

Networks:
- internal (servisna komunikacija)

DOCKERFILE (API):
- Builder stage: .NET 10 SDK
- Runtime stage: .NET 10 runtime
- Final image: ~200MB

GITHUB ACTIONS:

CI Pipeline (na svaki PR):
1. Checkout kod
2. Setup .NET 10
3. Restore NuGet packages
4. dotnet build --configuration Release
5. dotnet test
6. Build Docker image (no push)

CD Pipeline (na merge u main):
1. Build Docker images
2. Push na ghcr.io
3. SSH na Hetzner
4. docker-compose pull
5. docker-compose up -d
6. Health check

NGINX CONFIG:
- /api/* → http://api:5000
- /* → http://web:5001

GITHUB SECRETS:
- HETZNER_SSH_KEY
- HETZNER_HOST
- GITHUB_TOKEN (auto)

CHECKLIST:
- [ ] docker-compose.yml testiran lokalno
- [ ] Dockerfile builds bez greške
- [ ] GitHub Actions secrets postavljeni
- [ ] Nginx config validiran
- [ ] SSL certifikati renew-anje automatizovano
- [ ] Health endpoints dostupni
```

---

### MOD 7: Security Reviewer

**Kada se koristi:**
- Auth setup validacija
- API endpoint zaštita
- Input validation provjera
- Secrets management
- OWASP top 10 provjera

**Kako koristiš:**

```text
Radi kao Security Reviewer za naš .NET + Keycloak + PostgreSQL projekat.

Kontekst:
- Auth: Keycloak (OIDC/OAuth2, JWT)
- API: .NET 10 Minimal API / Controllers
- Baza: PostgreSQL sa EF Core
- Roles: ADMIN, MANAGER, USER (ili kako definiše projekt)

Zadatak:
[OVDJE ZALIJEPITI KOD / ENDPOINT / AUTH SETUP]

Trebam:
1. Keycloak konfiguracija validacija
2. JWT token validacija (expiration, signature, claims)
3. Authorization policy (role/permission provjera)
4. Endpoint zaštita (da li je auth obavezna?)
5. Input validation (SQL injection, XSS)
6. Secrets management (hardkodirana tajne?)
7. Error messages (da li otkrivaju internal details?)
8. HTTPS validacija
9. CORS konfiguracija
10. Audit logging (ko šta radi)

Pravila:
- Backend je AUTHORITY - frontend se može zaobići
- Svi protected endpointi MORAJU imati JWT validaciju
- Sve forme MORAJU imati server-side validaciju
- SQL queries kroz parameterized queries (EF Core štiti)
- Greške NIKADA ne smiju pokazati internal implementation
- Svaka akcija koja mijenja podatke MORA biti logovana
```

**Očekivani output:**
```
SIGURNOSNA PROVJERA
═══════════════════

AUTENTIFIKACIJA:
JWT validacija:
- [ ] Token signature je validiran
- [ ] Expiration je provjeran
- [ ] Issuer je validan (Keycloak)

Keycloak konfig:
- [ ] Client secret je tajni (ne u kodu)
- [ ] Redirect URIs su specifični (ne '*')
- [ ] Token timeout je razumna (15-60 min)

AUTORIZACIJA:
Role-based policies:
- [ ] ADMIN može sve
- [ ] MANAGER može svoje resurse
- [ ] USER ima read-only pristup

KRITIČNI RIZICI:
1. Endpoint /api/admin je dostupan bez auth!
2. Password se vraća u response
3. User ID se može manipulirati u URL-u

MANJE KRITIČNI:
1. Error message otkriva controller naziv

PREPORUKE:
1. Dodaj rate limiting (npr. 100 req/min po IP)
2. Hashiraj sve šifre (bcrypt/Argon2)
3. Dodaj audit logging
4. Testiraj CORS sa različitih origin-a

✔️ TEST SCENARIJI:
1. Pokušaj bez tokena → 401 Unauthorized
2. Pokušaj s expired tokenom → 401 Unauthorized
3. Pokušaj s tuđim ID-om → 403 Forbidden
4. SQL injection pokušaj → validacija blokirala
```

---

### MOD 8: Database Engineer

**Kada se koristi:**
- EF Core entiteti
- Migracije
- Schema dizajn
- Performance indexing
- Data seeding

**Kako koristiš:**

```text
Radi kao Database Engineer za naš PostgreSQL + EF Core projekat.

Kontekst:
- Database: PostgreSQL 16
- ORM: Entity Framework Core 10
- Migration Strategy: Code-First
- Pattern: Repository pattern

Zadatak:
[OVDJE ZALIJEPITI ENTITY DEFINICIJU / ZAHTJEV]

Trebam:
1. Entity klase specifikacija (polja, tipovi, constraints)
2. Relationships (1-to-many, many-to-many, foreign keys)
3. EF Fluent API konfiguracija
4. Migration fajl (dotnet ef migrations add)
5. Seed data (inicijalnih podataka)
6. Indeksi (za performance)
7. Constraints (unique, not null, check)
8. Audit polja (CreatedAt, UpdatedAt, CreatedBy)
9. Soft delete (ako je potrebno)
10. Performance test (query execution time)

Pravila:
- Svaka tabela MORA imati primary key
- Foreign keys TREBAJU biti indeksirani
- String polja trebaju MAX length
- Datetimes trebaju Default value (GetUtcNow)
- Sve tabelе trebaju audit polja
- Migracije se NIKADA ne mije nakon deploy-a
```

**Očekivalni output:**
```
DATABASE DESIGN
═══════════════

ENTITETI:

1. Product
   - Id: int (PK)
   - Name: string (max 200, NOT NULL, unique)
   - Price: decimal (NOT NULL, >= 0)
   - Description: string (max 5000, nullable)
   - CreatedAt: DateTime (default: NOW)
   - UpdatedAt: DateTime (default: NOW)
   - CreatedBy: string (FK to User)

2. Order
   - Id: int (PK)
   - OrderNumber: string (unique, NOT NULL)
   - UserId: int (FK to User)
   - TotalAmount: decimal (computed)
   - Status: string (enum: Pending, Completed, Canceled)
   - CreatedAt: DateTime
   - UpdatedAt: DateTime

RELATIONSHIPS:
- User (1) → (Many) Product (CreatedBy)
- User (1) → (Many) Order
- Order (1) → (Many) OrderItem
- Product (1) → (Many) OrderItem

INDEKSI:
- Product.Name (for search)
- Order.UserId (for filtering)
- OrderItem.ProductId (for joins)

SEED DATA:
INSERT INTO Product VALUES
  (1, 'Laptop', 999.99, ...),
  (2, 'Monitor', 299.99, ...);

PERFORMANCE:
- Query: SELECT o.* FROM Order o WHERE UserId = @userId
  - Before: 450ms (full table scan)
  - After: 5ms (with index on UserId)

MIGRATION CHECKLIST:
- [ ] dotnet ef migrations add "AddOrderTable"
- [ ] Provjeri generated migration
- [ ] dotnet ef database update
- [ ] Validiraj schema u PostgreSQL
```

---

### MOD 9: Code Reviewer

**Kada se koristi:**
- PR pregled
- Arhitekturna validacija
- Test coverage provjera
- Refactor prijedlozi

**Kako koristiš:**

```text
Radi kao Code Reviewer za naš .NET + Blazor projekat.

Kontekst:
- Jezici: C#, Razor
- Framework: .NET 10
- Patterns: DI, Repository, Service Layer
- Testing: xUnit

Zadatak:
[OVDJE ZALIJEPITI PR LINK / KOD]

Trebam:
1. Arhitekturna validacija (kod je u pravom sloju?)
2. Test coverage provjera (ima li testova?)
3. Security provjera (nema li SQL injection, auth rizika?)
4. Code quality (readability, SOLID principi)
5. Duplication provjera (DRY - Don't Repeat Yourself)
6. Performance provjera (async/await, N+1 queries)
7. Exception handling (catch sve greške? su jasne?)
8. Naming conventions (su nazivi jasni?)
9. Documentation (ima li komentara gdje je trebalo?)
10. Refactor prijedlozi (kako da bude bolje?)

Pravila:
- BLOCKER: mora biti ispravljeno
- WARNING: trebalo bi ispraviti
- SUGGESTION: nice-to-have
```

**Očekivalni output:**
```
CODE REVIEW
═══════════

PR SAŽETAK:
Title: Implement product creation API
Branch: feature/product-api
Author: @student-name
Changes: 3 files, +250 -30 lines

BLOCKER PROBLEMI (MORA biti ispravljeno):

1. SQL Injection rizik
   File: BL/Services/ProductService.cs:45
   ```csharp
   var query = $"SELECT * FROM products WHERE name = '{name}'";
   ```
   Problem: String interpolation umjesto parameterized query
   Fix: Koristi EF Core LINQ ili parameterized queries
   
2. No authorization check
   File: API/Controllers/ProductController.cs:20
   Problem: CreateProduct endpoint nema [Authorize] atributa
   Fix: Dodaj [Authorize(Roles = "MANAGER")] ili policy

WARNING PROBLEMI (Trebalo bi ispraviti):

1. Missing null check
   File: BL/Services/ProductService.cs:50
   Problem: price može biti null
   Suggestion: Validiraj prije nego koristiš

2. Missing tests
   File: Tests/ProductService.Tests.cs
   Problem: Nema testa za ErrorCase
   Suggestion: Dodaj test za edge case

SUGGESTIONS (Nice-to-have):

1. Extract constant
   File: API/Controllers/ProductController.cs:1
   Suggestion: MAX_NAME_LENGTH = 200 kao konstanta

2. Use async/await
   File: BL/Services/ProductService.cs:55
   Current: var result = service.GetProducts().Result;
   Better: var result = await service.GetProductsAsync();

DOBAR KOD:

1. DTO mapping je ispravan
2. Exception handling je dobar
3. Dependency injection je pravilno konfigurisan
4. Unit testovi su dobri

MERGE ODLUKA: 
[ ] APPROVE (sve je OK)
[ ] REQUEST CHANGES (ispravi BLOCKER prvo)
[ ] COMMENT (diskusija potrebna)
```

---

## Kako Početi?

### 1. Preuzmi Odgovarajući Agent Prompt

Koji je tvoj role? Preuzmi odgovarajući agent:

| Role | File |
|---|---|
| Tech Lead | [tech-lead.agent.md](./agents/tech-lead.agent.md) |
| Backend Developer | [backend-developer.agent.md](./agents/backend-developer.agent.md) |
| Frontend Developer | [frontend-developer.agent.md](./agents/frontend-developer.agent.md) |
| QA Tester | [qa-tester.agent.md](./agents/qa-tester.agent.md) |
| DevOps Engineer | [devops-engineer.agent.md](./agents/devops-engineer.agent.md) |
| Security Reviewer | [security-reviewer.agent.md](./agents/security-reviewer.agent.md) |
| Database Engineer | [database-engineer.agent.md](./agents/database-engineer.agent.md) |
| Code Reviewer | [code-reviewer.agent.md](./agents/code-reviewer.agent.md) |

### 2. Kopiraj Agent Prompt

```bash
# Primjer: Tech Lead
cat docs/ai/agents/tech-lead.agent.md
```

### 3. Kreiraj Prompt za AI Alat

U GitHub Copilot Chat / Claude / ChatGPT:

```text
# Korak 1: Zalijepiti Agent prompt
[SADRŽAJ IZ FAJLA]

# Korak 2: Dodaj svoj konkretan zadatak
Zadatak:
[OVDJE TVOJ KONKRETAN ZAHTJEV]
```

### 4. Provjeri Rezultat

AI će dati strukturiran odgovor. **Provjeri**:
- Jesu li svi dijelovi na mjestu?
- Ima li sens u kontekstu projekta?
- Trebam li nešto prilagoditi?

### 5. Logiraj AI Interakciju (Istraživanje)

Na kraju sesije:

```bash
npm run research:log -- \
  --tool=copilot \
  --category=backend \
  --duration=30 \
  --time-saved=60 \
  --task="Implementacija API endpoint-a za produtos" \
  --prompt="Kreiraj CRUD endpoint..."
```

---

## Dodatni Resursi

- [Keycloak Setup Guide](../keycloak-setup.md)
- [PostgreSQL Guide](../postgres-guide.md)
- [GitHub Actions Guide](../github-actions.md)
- [Blazor Learning Path](../blazor-path.md)
- [.NET 10 Best Practices](../dotnet-practices.md)

---

## Checklist Prije Početka

- [ ] Sam pregledale sve 8+ AI agent modove
- [ ] Razumijem kad se koji agent koristi
- [ ] Znam kako kopirati prompt u AI alat
- [ ] Razumijem da **student** mora validirati rezultat
- [ ] Znam kako logijem AI interakcije
- [ ] Spreman/a sam da počnem sa Sprint 1!

