# 📄 Dokumentacija Setup — Sažetak

**Datum:** 23. maj 2026  
**Kreiran za:** Studentska Praksa 2026 — Grupa A-D  
**Cilj:** Kompletna dokumentacija sa AI agent modovima i Sprint 1 planom

---

## Kreirani Dokumenti

### 1. 📚 **INDEX.md** — Centralni Hub
- Pregled cijele dokumentacije
- Brz start (5 minuta)
- Linkovi na sve dokumente
- Best practices
- Sprint timeline

**Gdje:** `docs/INDEX.md`  
**Čitanje:** 10 minuta  
**Važnost:** KRITIČNO — Početna tačka za sve!

---

### 2. **PROJECT_STRUCTURE.md** — Arhitektura Aplikacije
- Pregled repozitorija (struktura mapira)
- Arhitekturni pregled (slojevi: API → BL → DL)
- Tech stack detaljno
- Okruženja (local dev, production)
- Ključne datoteke
- Početne obveze po ulozi

**Gdje:** `docs/PROJECT_STRUCTURE.md`  
**Čitanje:** 15 minuta  
**Čitaj:** Svi članovi

---

### 3. **INITIAL_SETUP.md** — Setup Po Ulogama
- Procesa pre-setup checklist
- Korak-po-korak instrukcije za SVAKU ulogu:
  - Tech Lead
  - Backend Developer
  - Frontend Developer
  - DevOps Engineer
  - QA Tester
  - Security Reviewer
  - Database Engineer
- Konkretni primjeri koda
- Problemi i rješenja

**Gdje:** `docs/INITIAL_SETUP.md`  
**Čitanje:** 30-60 minuta (ovisi o ulozi)  
**Čitaj:** Prema svojoj ulozi — **OBAVEZNO!**  
**Akcija:** Praktični setup nakon čitanja

---

### 4. **SPRINT_1_PLAN.md** — 2-Sedmični Plan
- Sprint cilj
- 8 Epic-a sa 8 kartica
- Detaljni acceptance kriteriji za svaku karticu
- Podzadaci i checklist-ovi
- Raspodjela po ulogama
- Sedmični raspored
- Success kriteriji

**Gdje:** `docs/SPRINT_1_PLAN.md`  
**Čitanje:** 20 minuta  
**Čitaj:** Tech Lead (obavezno), svi članovi (pregled)  
**Akcija:** Populacija Trello board-a

---

### 5. **ROLES.md** — Detaljne Uloge
- Specifične odgovornosti po ulozi
- Dnevni ritam za svaku ulogu
- Best practices (kod, testiranje, Git)
- Tools i komande
- Success kriteriji po ulozi
- Kako dobiti pomoć

**Gdje:** `docs/ROLES.md`  
**Čitanje:** 25 minuta  
**Čitaj:** Prema svojoj ulozi  
**Akcija:** Razumjeti što se očekuje

---

### 6. **AI_AGENTS_SETUP.md** — 8+ AI Agent Modova
- 8+ kompletnih AI agent prompt-a:
  - MOD 1: Solution Architect
  - MOD 2: Tech Lead
  - MOD 3: Backend Developer
  - MOD 4: Frontend Developer
  - MOD 5: QA Tester
  - MOD 6: DevOps Engineer
  - MOD 7: Security Reviewer
  - MOD 8: Database Engineer
  - MOD 9: Code Reviewer
- Primjeri kako koristiti
- Očekivani output format
- Best practices
- Kada se koristi svaki agent

**Gdje:** `docs/ai/AI_AGENTS_SETUP.md`  
**Čitanje:** 30 minuta  
**Čitaj:** Prema svojoj ulozi  
**Akcija:** Kopiranje agent prompt-a u AI alat, korištenje sa svojom karticon

---

### 7. **QUICK_REFERENCE.md** — Brz Vodič
- First day setup (15 min)
- Daily standup template
- Trello workflow
- Git workflow
- Problem solving (ako nešto krene po zlu)
- Keycloak test
- PostgreSQL test
- EOD checklist
- Emergency contacts

**Gdje:** `docs/QUICK_REFERENCE.md`  
**Čitanje:** 10 minuta  
**Čitaj:** Svi članovi — print-aj ili bookmark-aj!  
**Akcija:** Referenca tokom rada

---

## Ukupna Dokumentacija

| Dokument | Veličina | Vrijeme Čitanja | Važnost |
|---|---|---|---|
| INDEX.md | 6 KB | 10 min | KRITIČNO |
| PROJECT_STRUCTURE.md | 8 KB | 15 min | KRITIČNO |
| INITIAL_SETUP.md | 25 KB | 30-60 min | KRITIČNO |
| SPRINT_1_PLAN.md | 30 KB | 20 min | HIGH |
| ROLES.md | 35 KB | 25 min | HIGH |
| AI_AGENTS_SETUP.md | 40 KB | 30 min | HIGH |
| QUICK_REFERENCE.md | 10 KB | 10 min | MEDIUM |
| **UKUPNO** | **~154 KB** | **~2h čitanja** | |

---

## Preporučeni Redoslijed Čitanja

### Za Prvog Dana (1-2h)

1. **INDEX.md** (10 min) — Razumijevanje cjeline
2. **PROJECT_STRUCTURE.md** (15 min) — Arhitektura
3. **INITIAL_SETUP.md — Vaša Uloga** (30-45 min) — Praktični setup
4. **QUICK_REFERENCE.md** (10 min) — Bookmarkaj za kasnije

### Za Sprint Planning (Ponedjeljak)

1. **SPRINT_1_PLAN.md** (20 min) — Tech Lead
2. **ROLES.md — Vaša Uloga** (10-15 min) — Svi članovi

### Tokom Razvoja (Prema Potrebi)

1. **AI_AGENTS_SETUP.md** — Kada trebate AI pomoć
2. **QUICK_REFERENCE.md** — Za brze odgovore
3. **ROLES.md** — Za best practices

---

## Što Trebam Uraditi Sada?

### Tech Lead

- [ ] Pročitaj sva dokumenta
- [ ] Popula SPRINT_1_PLAN kartice na Trello
- [ ] Organiziraj Sprint Planning za Ponedjeljak
- [ ] Kreiraj GitHub branch protection rules
- [ ] Postavi Copilot instrukcije
- [ ] Pripremi kod za first demo

### Backend Developer

- [ ] Pročitaj INITIAL_SETUP.md — Backend Dev sekcija
- [ ] Setup .NET environment
- [ ] Pokreni prvi test build
- [ ] Spreman za karticu 3.1

### Frontend Developer

- [ ] Pročitaj INITIAL_SETUP.md — Frontend Dev sekcija
- [ ] Setup Blazor environment
- [ ] Pregled existing strukture
- [ ] Spreman za karticu 5.1

### DevOps

- [ ] Pročitaj INITIAL_SETUP.md — DevOps sekcija
- [ ] Test Docker Compose setup
- [ ] Pokreni Keycloak konfiguraciju
- [ ] Testiraj sve servise dostupni
- [ ] Spreman za kartice 2.1, 2.2, 4.1

### QA Tester

- [ ] Pročitaj INITIAL_SETUP.md — QA sekcija
- [ ] Setup xUnit framework
- [ ] Kreiraj test plan template
- [ ] Spreman za karticu 8.1

### Security Reviewer

- [ ] Pročitaj INITIAL_SETUP.md — Security sekcija
- [ ] Review Keycloak setup (kada je DevOps uradi)
- [ ] Kreiraj security checklist
- [ ] Spreman za kartice 4.1, 4.2

### Database Engineer

- [ ] Pročitaj INITIAL_SETUP.md — Database sekcija
- [ ] Setup EF Core
- [ ] Testiraj DbContext
- [ ] Spreman za kartice 2.2, 3.1 (support)

---

## Kako Koristiti AI Agent Modove

### 1. Kada Trebam Pomoć
```
Otvoriš GitHub Copilot Chat (Ctrl+I)
```

### 2. Kopiraj Agent Prompt Iz docs/ai/AI_AGENTS_SETUP.md
```
npr. MOD 3: Backend Developer Agent
```

### 3. Zalijepiti u Chat
```
[Agent prompt sadržaj]

Zadatak:
[Tvoj konkretan zahtjev — copying iz Trello kartice]
```

### 4. Logiraj Interakciju
```bash
npm run research:log -- \
  --tool=copilot \
  --category=backend \
  --duration=30 \
  --time-saved=60 \
  --task="Kreiranje health endpoint-a"
```

---

## First Week Activities

### Ponedjeljak (1. dan)

- [ ] 10:00 — Sprint Planning (30 min)
- [ ] 10:30 — Setup pomoć (ako trebaju)
- [ ] 11:00 — Development start
- [ ] 17:00 — EOD standup (15 min)

### Utorak-Četvrtak

- [ ] 10:00 — Daily standup (15 min)
- [ ] 10:15 — Development
- [ ] 17:00 — EOD standup (15 min)

### Petak (1. Sprint)

- [ ] 10:00 — Final standup
- [ ] 14:00 — Sprint Review (1h)
- [ ] 15:00 — Retrospektiva (30 min)
- [ ] 16:00 — Podsumavanje

---

## Trebam Pomoć?

### Gdje Pronaći Odgovori?

| Pitanje | Gdje Traži |
|---|---|
| Kako početi sa [tech]? | INITIAL_SETUP.md — sekcija za tvoju ulogu |
| Što trebam raditi? | SPRINT_1_PLAN.md — pronađi karticu |
| Kako koristiti Copilot? | AI_AGENTS_SETUP.md — pronađi agent za tvoju ulogu |
| Koji su best practices? | ROLES.md — sekcija za tvoju ulogu |
| Brz odgovor? | QUICK_REFERENCE.md |
| Arhitektura? | PROJECT_STRUCTURE.md |
| Sve zajedno? | INDEX.md |

### Ako I Dalje Ne Nađeš

1. **Google/Stack Overflow** — za tehnička pitanja
2. **GitHub Copilot** — sa AI agent prompt-om
3. **Kolega sa istom ulogom** — za praktičnu pomoć
4. **Tech Lead** — za arhitekturne odluke
5. **Mentor** — za general guidance

---

## Checklist Prije Nego Što Kreneš

**Svi članovi:**
- [ ] Pročitao/la sam INDEX.md
- [ ] Pročitao/la sam PROJECT_STRUCTURE.md
- [ ] Pročitao/la sam INITIAL_SETUP.md — moja uloga
- [ ] Setup je završen (ili plan je jasan)
- [ ] Imam link na Trello board
- [ ] GitHub Copilot je instaliran

**Tech Lead dodatno:**
- [ ] Pročitao/la sam sve dokumente
- [ ] SPRINT_1_PLAN.md je mapirano na Trello
- [ ] Branch protection rules su postavljeni
- [ ] Copilot instrukcije su u .github/
- [ ] Sprint Planning je zakazan

---

## Success Metric za Sprint 1

**Na kraju Sprint 1 trebalo bi:**

 **Tehnički:**
- Docker stack radi bez greške
- API je dostupan sa JWT auth
- Blazor app je dostupna sa Keycloak login-om
- Sve kartice imaju PR-ove
- CI pipeline je zelena

 **Organizacijski:**
- Sve kartice su "Gotovo"
- Svi članovi su razumjeli git workflow
- Svi članovi su koristili GitHub Copilot
- Research agent je logirajući AI rad
- Team je prošao kroz retrospektivu

 **Iskustveni:**
- Svaki član zna što je radio
- Svaki član je pronašao proces koji radi
- Svaki član je koristio AI alate
- Tim je blizu koordiniran

---

## Struktura Fajlova

```
docs/
├── INDEX.md ← POČNI OVDJE
├── PROJECT_STRUCTURE.md
├── INITIAL_SETUP.md ← PRAKTIČNI SETUP
├── SPRINT_1_PLAN.md
├── ROLES.md
├── QUICK_REFERENCE.md
├── ai/
│   └── AI_AGENTS_SETUP.md ← ZA AI POMOĆ
└── [SETUP_SUMMARY.md] ← Ovaj fajl
```

---

##  Zaključak

**Kreirano:**
- 6 komprehenzivnih dokument-a (~154 KB)
- 8+ AI agent modova sa primjerima
- Sprint 1 plan sa 8 Epic-a
- Detaljne upute za svaku ulogu
- Brz reference guide
- Problemi i rješenja
- Best practices i checklist-ovi

**Što trebam uraditi:**
1.  Čitaj dokumentaciju prema redoslijedu
2.  Uradi praktični setup (INITIAL_SETUP.md)
3.  Pripremi se za Sprint Planning (Ponedjeljak)
4.  Počni sa razvojem (kartice na Trello-u)
5.  Koristi AI agent-e za pomoć
6.  Logiraj rad

---

##  Sretno!

**Jeste li spremi?**

→ Krečite sa [docs/INDEX.md](./INDEX.md)

→ Pratite [docs/INITIAL_SETUP.md](./INITIAL_SETUP.md) za praktičan setup

→ Koristite [docs/ai/AI_AGENTS_SETUP.md](./ai/AI_AGENTS_SETUP.md) za AI pomoć

→ Referencirajte [docs/QUICK_REFERENCE.md](./QUICK_REFERENCE.md) tokom rada

**Na kraju prakse — funkcionalna aplikacija + iskustvo sa modernim tech stack-om!** 

---

**Kreirano:** 23. maj 2026  
**Za:** Studentska Praksa 2026 — Grupa A-D  
**Mentor:** [mentor info]  
**Rok:** 8 sedmica (do 18. jula 2026)  

---

