# Dokumentacija & Modovi — Vodič za Sve Članove

**Cilj:** Centralno mjesto gdje možeš pronaći sve što trebaš znati kao član tima tokom studentske prakse.

---

## Brzi Start (5 minuta)

1. **Zašto smo ovdje?**  
   Analiziraj projekt i kreiramo full-stack .NET 10 + Blazor web aplikaciju sa Keycloak auth-om tokom 8 sedmica.

2. **Koja je moja uloga?**  
   Pregled: [ROLES.md](#uloge)

3. **Što trebam prvo?**  
   Počni sa: [INITIAL_SETUP.md](./INITIAL_SETUP.md) — ima korak po korak instrukcije za tvoju ulogu.

4. **Trebam AI pomoć?**  
   Koristi: [AI_AGENTS_SETUP.md](./ai/AI_AGENTS_SETUP.md) — 8+ AI agent prompt-a sa primjerima.

5. **Trebam znati šta se desava?**  
   Pogledaj: [SPRINT_1_PLAN.md](./SPRINT_1_PLAN.md) — raspored zadataka po sedmicama.

---

## Dokumentacijska Struktura

```
docs/
├── INDEX.md (ovdje si)
├── PROJECT_STRUCTURE.md ← Arhitektura aplikacije
├── INITIAL_SETUP.md ← Setup po ulogama (KRENI OVDJE!)
├── SPRINT_1_PLAN.md ← 2-sedmični plan sa zadacima
├── ROLES.md ← Detaljne odgovornosti po ulozi
├── ai/
│   ├── AI_AGENTS_SETUP.md ← 8+ AI agent modova
│   └── agents/
│       ├── tech-lead.agent.md
│       ├── backend-developer.agent.md
│       ├── frontend-developer.agent.md
│       ├── qa-tester.agent.md
│       ├── devops-engineer.agent.md
│       ├── security-reviewer.agent.md
│       ├── database-engineer.agent.md
│       └── code-reviewer.agent.md
└── ...
```

---

## Uloge

| Uloga | Osoba | Fokus | Počni Ovdje |
|---|---|---|---|
| Tech Lead | 1 osoba | Koordinacija, GitHub, code review | [INITIAL_SETUP.md](./INITIAL_SETUP.md#-tech-lead-uloga) |
| Backend Dev | 2 osobe | API, servisi, testovi | [INITIAL_SETUP.md](./INITIAL_SETUP.md#-backend-developer-uloga) |
| Frontend Dev | 1-2 osobe | Blazor, UI, auth | [INITIAL_SETUP.md](./INITIAL_SETUP.md#-frontend-developer-uloga) |
| DevOps | 1 osoba | Docker, Keycloak, deployment | [INITIAL_SETUP.md](./INITIAL_SETUP.md#-devops-uloga) |
| QA Tester | 1 osoba | Testovi, validacija, QA | [INITIAL_SETUP.md](./INITIAL_SETUP.md#-qa-tester-uloga) |
| Security | 1 osoba | Keycloak, JWT, sigurnost | [INITIAL_SETUP.md](./INITIAL_SETUP.md#-security-reviewer-uloga) |
| Database | 1 osoba | EF Core, entiteti, migracije | [INITIAL_SETUP.md](./INITIAL_SETUP.md#-database-engineer-uloga) |

---

## Planovi Po Sprintu

- **Sprint 1 (Sedmica 1-2):** Setup, Docker, Keycloak, Hello World  
   [SPRINT_1_PLAN.md](./SPRINT_1_PLAN.md)

- **Sprint 2 (Sedmica 3-4):** CRUD, Services, Database, Testi  
   [SPRINT_2_PLAN.md](./SPRINT_2_PLAN.md) — dolazi

- **Sprint 3 (Sedmica 5-6):** GitHub Actions, Nginx, Hetzner deployment  
   [SPRINT_3_PLAN.md](./SPRINT_3_PLAN.md) — dolazi

- **Sprint 4 (Sedmica 7-8):** Finalizacija, testovi, prezentacija  
   [SPRINT_4_PLAN.md](./SPRINT_4_PLAN.md) — dolazi

---

## AI Pomoć — Odaberite Vašu Ulogu

**Princip:** Svaka uloga ima unaprijed definisan AI "agent" koji zna kako da razmisli za vašu ulogu.

**Kako se koristi?**

1. Otvori [AI_AGENTS_SETUP.md](./ai/AI_AGENTS_SETUP.md)
2. Pronađi svoju ulogu
3. Kopiraj agent prompt
4. Otvori GitHub Copilot / Claude / ChatGPT
5. Zalijepiti prompt
6. Dodaj svoj konkretan zadatak
7. Pročitaj rezultat kritički
8. Logiraj AI interakciju sa `npm run research:log`

**8+ Agent Modova:**

- [Tech Lead Agent](./ai/AI_AGENTS_SETUP.md#mod-2-tech-lead-agent)
- [Backend Developer Agent](./ai/AI_AGENTS_SETUP.md#mod-3-backend-developer-agent)
- [Frontend Developer Agent](./ai/AI_AGENTS_SETUP.md#mod-4-frontend-developer-agent)
- [QA Tester Agent](./ai/AI_AGENTS_SETUP.md#mod-5-qa-tester--quality-assurance-agent)
- [DevOps Engineer Agent](./ai/AI_AGENTS_SETUP.md#mod-6-devops-engineer-agent)
- [Security Reviewer Agent](./ai/AI_AGENTS_SETUP.md#mod-7-security-reviewer-agent)
- [Database Engineer Agent](./ai/AI_AGENTS_SETUP.md#mod-8-database-engineer-agent)
- [Code Reviewer Agent](./ai/AI_AGENTS_SETUP.md#mod-9-code-reviewer-agent)

---

## Tech Stack — Kratko

```
Backend:     .NET 10 Web API
Frontend:    Blazor Server
Database:    PostgreSQL 16
ORM:         Entity Framework Core 10
Auth:        Keycloak (OIDC/OAuth2, JWT)
Testing:     xUnit + TestContainers
Docker:      Docker Compose (local dev)
CI/CD:       GitHub Actions
Cloud:       Hetzner VPS (production)
Research:    Node.js CLI (za praćenje AI rada)
AI:          GitHub Copilot, Claude, ChatGPT (sa AI agents)
PM:          Trello (sprint planning)
```

---

## Checklist — Prije Početka Sprint 1

- [ ] Instalacija: .NET 10 SDK, Docker Desktop, Node.js 16+, VS Code + C# ekstenzija
- [ ] GitHub: Repo kloniran, branch konfigurisan, SSH key postavljen
- [ ] Copilot: GitHub Copilot instaliran i aktiviran
- [ ] Provjera: `dotnet --version`, `docker --version`, `node --version`
- [ ] Procitaj: PROJECT_STRUCTURE.md, INITIAL_SETUP.md za tvoju ulogu
- [ ] Trello: Prijavljen si na board, vidiš Sprint 1 kartice
- [ ] Setup: Završio/la sam sve korake iz INITIAL_SETUP.md
- [ ] Research: Aktivirao/la sam research agent (`npm run research:start`)

---

## Ključne Komande

### Setup & Build

```bash
# Kopira environment template
cp .env.example .env

# Pokreće Docker stack (PostgreSQL, API, Web, Keycloak)
docker-compose -f docker/docker-compose.yml up -d

# Build .NET projekat
dotnet build

# Pokreće lokalni development
dotnet run
```

### Testing

```bash
# Pokreće sve testove
dotnet test

# Pokreće samo jedan test fajl
dotnet test --filter "ClassName"
```

### Git Workflow

```bash
# Kreiraj feature branch
git checkout -b feature/my-feature

# Postavi promjene
git add .
git commit -m "feat: opis promjene"

# Pošalji na GitHub
git push origin feature/my-feature

# Otvori PR na GitHub
# https://github.com/[org]/[repo]/pull/new/feature/my-feature
```

### Research Agent (praćenje AI rada)

```bash
# Pokreće watcher (ostavi otvoreno cijeli dan)
npm run research:start

# Na kraju dana: logiraj AI interakcije
npm run research:log -- \
  --tool=copilot \
  --category=backend \
  --duration=30 \
  --time-saved=60 \
  --task="Implementacija produkta CRUD-a"
```

---

## Detaljna Dokumentacija

- **Arhitektura:** [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
  - Pregled koda
  - Slojevi (API, BL, DL)
  - Tech stack detaljno
  - Sigurnost & environment

- **Setup:** [INITIAL_SETUP.md](./INITIAL_SETUP.md)
  - Setup po ulogama
  - Korak po korak instrukcije
  - Problemi i rješenja

- **Sprint 1:** [SPRINT_1_PLAN.md](./SPRINT_1_PLAN.md)
  - 8 Epic-a
  - Raspodjela po uloge
  - Sedmični raspored
  - Acceptance kriteriji

- **AI Agenti:** [AI_AGENTS_SETUP.md](./ai/AI_AGENTS_SETUP.md)
  - 8+ agent modova
  - Kako koristiti
  - Primjeri
  - Best practices

---

## 🎓 Best Practices

### Kodiranje

```
DO:
- Koristi async/await (ne .Result ili .Wait())
- DTO za API responses (ne entitete direktno)
- Poslovna logika u Services, ne u Controllers
- Validiraj sve ulaze (frontend + backend)
- Backend je AUTHORITY za sigurnost

DON'T:
- Hardkodirati lozinke ili API keys
- SQL queries bez parameterized queries (koristim EF Core)
- .Result ili .Wait() na async kodom
- Error poruke koje otkrivaju interne detaljе
- Trust frontendu za validaciju
```

### Git & Code Review

```
DO:
- Kreiraj feature branches (feature/*)
- Kreiraj male, fokusirane PR-e
- Napišite jasne commit poruke
- Traži review prije merge-a
- Obradi sve review komentare

DON'T:
- Direktno push na main ili develop
- Veliki PR-evi sa 100+ changed fajlova
- "Fixed bug" commit poruke
- Merge bez review-a
- Ignoriraj feedback
```

### AI Korištenje

```
DO:
- Koristite AI agent prompts iz dokumentacije
- Čitaj AI output kritički, ne slijepo
- Testiraj rezultat prije nego što commitaj
- Logiraj AI interakcije (npm run research:log)
- Kombiniraj sa tim za brainstorming

DON'T:
- Slijepo kopira AI kod
- Pokušaj AI da napravi sve (90%+ koda)
- Ignoriraj compile/test greške
- Pestiraj AI output bez razmatranja
- Koristi AI za šalte ili plagijat
```

### Komunikacija

```
DO:
- Daily Standup: što radiš, što si radio/la, jesi li blokiran/a
- Trello: update kartice svakodnevno
- PR Comments: objasni ZAŠTO, ne samo ŠTA
- Pitaj prije nego što počneš dugi rad
- Dijeli znanje sa timom

DON'T:
- Radi u tišini nedelju dana
- Ignoriraj Team feedback
- Bitka se oko Trello kartice
- Pretpostavka šta trebam raditi
- Skrivaj probleme
```

---

## Trebam Pomoć!

### Česta Pitanja

**P: Gdje početi ako sam novi na .NET-u?**  
O: Kreni sa [INITIAL_SETUP.md](./INITIAL_SETUP.md) za tvoju ulogu. Svi zadaci su korak-po-korak.

**P: Kako koristim GitHub Copilot?**  
O: Kreni sa [AI_AGENTS_SETUP.md](./ai/AI_AGENTS_SETUP.md). Ima primjera za svaku ulogu.

**P: Gdje pronađem status Sprint 1?**  
O: [SPRINT_1_PLAN.md](./SPRINT_1_PLAN.md) ima sve kartice, deadline-e i assignment-e.

**P: Docker ne pokreće se. Što sada?**  
O: Pogledaj "Problemi i Rješenja" u [INITIAL_SETUP.md](./INITIAL_SETUP.md#-problemi-i-rješenja).

**P: Trebam logijem AI interakciju?**  
O: `npm run research:log -- --tool=copilot --category=backend --duration=30 --time-saved=60 --task="Opis"`

### Kontakt

- **Tech Lead:** Za arhitekturu, code review, probleme
- **DevOps:** Za Docker, Keycloak, environment
- **Backend Lead:** Za API, servise, bazu
- **Frontend Lead:** Za Blazor, UI, auth
- **QA Lead:** Za testove, validaciju

---

## Sprint Timeline

```
Sprint 1 (Sedmica 1-2)
├── Ponedjeljak: Setup & Planning
├── Utorak-Četvrtak: Development
├── Petak: Sprint Review & Retro
│
Sprint 2 (Sedmica 3-4)
├── CRUD, Services, Database
│
Sprint 3 (Sedmica 5-6)
├── CI/CD, Docker, Deployment
│
Sprint 4 (Sedmica 7-8)
└── Finalizacija, Testing, Prezentacija
```

---

## Checklist — Nakon Završetka Sprint 1

- [ ] Docker stack radi bez greške
- [ ] API je dostupan sa JWT auth-om
- [ ] Blazor aplikacija je dostupna sa Keycloak loginom
- [ ] Sve kartice su završene ili blokirane
- [ ] Sve kartice imaju PR sa review-om
- [ ] GitHub Actions CI pipeline je zelena
- [ ] Unit testovi prolaze
- [ ] Retrospektiva je obavljena
- [ ] Team je razumio AI agent pristup
- [ ] Research agent je aktiviran i data se bilježi

---

## Sretno!

Jeste li spremi da krenete?

1. Čitajte [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
2. Krećete sa [INITIAL_SETUP.md](./INITIAL_SETUP.md) za vašu ulogu
3. Pregledate [SPRINT_1_PLAN.md](./SPRINT_1_PLAN.md)
4. Krećete sa prvi AI agent iz [AI_AGENTS_SETUP.md](./ai/AI_AGENTS_SETUP.md)
5. Logirate AI rad sa `npm run research:log`

**Cilj:** Na kraju prakse — funkcionalna aplikacija, iskustvo sa modernim tech stack-om i saznanja kako AI alati stvarno pomažu razvoju softvera.

**Sretno!**

---

## Svi Dokumenti Na Jednom Mjestu

| Dokument | Svrha | Vrijeme Čitanja |
|---|---|---|
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Arhitektura | 15 min |
| [INITIAL_SETUP.md](./INITIAL_SETUP.md) | Setup korak-po-korak | 30 min |
| [SPRINT_1_PLAN.md](./SPRINT_1_PLAN.md) | Sprint 1 detalji | 20 min |
| [AI_AGENTS_SETUP.md](./ai/AI_AGENTS_SETUP.md) | AI modovi | 30 min |
| [ROLES.md](./ROLES.md) | Detaljne uloge | 25 min |

**Ukupno:** ~2 sata čitanja + 2-3 sata prakti setup-a = Spreman za razvoj! 

