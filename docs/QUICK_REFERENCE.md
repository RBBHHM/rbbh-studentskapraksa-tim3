#  Quick Reference Guide — Sprint 1

**Za kada trebaš brz odgovori bez čitanja 10 stranica.**

---

##  First Day Setup (15 minuta)

```bash
# 1. Verificiraj alate
dotnet --version      # trebalo bi: 10.x.x
docker --version      # trebalo bi: 24.x.x
node --version        # trebalo bi: 16+

# 2. Kloniraj repo
git clone <URL>
cd studentskapraksaTema3

# 3. Postavi .env
cp .env.example .env

# 4. Pokreni stack
docker-compose -f docker/docker-compose.yml up -d

# 5. Čekaj 30 sec, pa test
docker-compose ps       # trebalo bi: sve "Up"
curl http://localhost:5000/api/health  # trebalo bi: {"status":"OK"}
curl http://localhost:5001  # trebalo bi: HTML
```

 **Ako sve prolazi:** Spreman si za dev!

---

##  Daily Standup (15 min, svakodnevno)

**Što trebam reći:**

```
Ono što sam radio/la:
- ...

Što ću raditi danas:
- ...

Jesam li blokiran/a?
- [ ] Ne
- [x] Da — problem: ...
```

**Gdje:** Trello board ili video call  
**Kada:** Srijeda 10h (ili kako definira grup)

---

##  Trello Workflow

```
1. Otvori Trello board
2. Pronađi karticu sa tvojim imenom
3. Pročitaj acceptance kriterije
4. Pomakni je u "In Progress"
5. Kreiraj feature branch
6. Radi...
7. Napravis PR
8. Traži review (tag: @tech-lead)
9. Nakon approval: merge
10. Pomakni karticu u "Gotovo"
```

**Key:** Svaka kartica MORA imati PR link prije nego što ide u "Gotovo"

---

##  Git Workflow (za sve)

```bash
# 1. Kreiraj branch
git checkout -b feature/task-name
# Primjer: git checkout -b feature/health-endpoint

# 2. Radi, commit često
git add .
git commit -m "feat: opis promjene"
# Primjeri:
# git commit -m "feat: add health endpoint"
# git commit -m "fix: jwt validation"
# git commit -m "test: add product service tests"

# 3. Push
git push origin feature/task-name

# 4. Otvori PR na GitHub
# GitHub će predložiti "Create Pull Request"
# Ispuni PR template

# 5. Čekaj review
# Tech Lead će komentirati ili approve

# 6. Address feedback (ako ima)
git add .
git commit -m "refactor: address review feedback"
git push

# 7. Nakon approval: merge
# Klikni "Merge" dugme na GitHub-u

# 8. Obriši branch (GitHub će ponuditi)
git branch -d feature/task-name
```

**Commit message format:**
- `feat:` — nova feature
- `fix:` — bug fix
- `test:` — testovi
- `refactor:` — promjena bez nove feature
- `docs:` — dokumentacija

---

## Ako nešto krene oo zlu

### Docker kontejneri ne pokreću se

```bash
# 1. Vidi error
docker-compose logs

# 2. Zaustavi sve
docker-compose down

# 3. Očisti
docker system prune

# 4. Kreni ispočetka
docker-compose up -d --build
```

### Greška pri build-u

```bash
# .NET
dotnet clean
dotnet restore
dotnet build

# Ako i dalje problema:
rm -rf bin obj
dotnet build
```

### "Port already in use"

```bash
# macOS/Linux
lsof -i :5000
kill -9 PID

# Windows
netstat -ano | findstr :5000
taskkill /PID PID /F
```

### Git merge conflict

```bash
# 1. Otvori fajl sa <<<<<<< >>>>>>>
# 2. Ručno bira što trebam
# 3. Obriši <<< === >>> linije
# 4. git add .
# 5. git commit -m "Resolve merge conflict"
```

---

## GitHub Copilot (brzo korištenje)

### 1. Otvorite chat

```
VS Code: Ctrl+I (ili Cmd+I na Mac-u)
Visual Studio: Ctrl+I
```

### 2. Kopirajte AI agent prompt

```text
Radi kao Backend Developer za studentsku praksu.

Kontekst:
- .NET 10, Blazor, PostgreSQL
- Architecture: API → BL → DL
- Auth: Keycloak JWT

Trebam:
[TVOJ KONKRETAN ZADATAK]
```

Vidi: [docs/ai/AI_AGENTS_SETUP.md](./ai/AI_AGENTS_SETUP.md)

### 3. Testiraj rezultat

```bash
# Build prije nego što commit-uj
dotnet build
dotnet test  # ako ima testova

# Review rezultat s kolega ako je kompleksan
```

### 4. Logiraj na kraju dana

```bash
npm run research:log -- \
  --tool=copilot \
  --category=backend \
  --duration=30 \
  --time-saved=60 \
  --task="Opis što si radio"
```

---

##  Testing Commands

```bash
# Build projekat
dotnet build

# Pokreni testove
dotnet test

# Testovi + detaljni output
dotnet test -v normal

# Samo jedan test
dotnet test --filter "TestName"

# Test coverage
dotnet test /p:CollectCoverage=true /p:CoverageFormat=opencover
```

---

##  Keycloak — Brz Test

### Dobij JWT token

```bash
curl -X POST http://localhost:8080/realms/studentskapraksa/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=api" \
  -d "grant_type=password" \
  -d "username=admin" \
  -d "password=admin"

# Rezultat: {"access_token":"eyJ...", ...}
```

### Koristi token za API

```bash
TOKEN="eyJ..."  # Paste access_token odavdje

curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/health/protected

# Trebalo bi: 200 OK sa podacima
```

### Admin Console

```
URL: http://localhost:8080/admin
Username: admin
Password: admin
```

---

##  PostgreSQL — Brz Test

```bash
# Konekcija
psql -h localhost -U student -d studentskapraksa

# Popis tabela
\dt

# Izlaz
\q
```

---

##  Kontakti — Koga Pitati

| Problem | Pitaj |
|---|---|
| Arhitektura, code review | Tech Lead |
| .NET API, servisi | Backend Dev Lead |
| Blazor, UI | Frontend Dev Lead |
| Docker, Keycloak | DevOps |
| Testovi | QA Lead |
| Sigurnost | Security Reviewer |
| Baza, EF Core | Database Engineer |
| Opšte pitanje | Mentor |

**Format:** `@person Trebam pomoć sa... [detaljno]`

---

##  EOD (End of Day) Checklist

Prije nego što izađeš:

```
Tehnički:
- [ ] `dotnet build` prolazi
- [ ] `dotnet test` prolazi (ako je relevatno)
- [ ] Sve promjene su committed-ane
- [ ] Branch je push-ovan

Organizacijski:
- [ ] Trello kartica je updated
- [ ] PR je otvoren (ili pripreman)
- [ ] Team zna što ćeš raditi sutra

AI:
- [ ] Ako si koristio Copilot, logiram
- [ ] `npm run research:log -- ...`
```

---

##  Sedmični Ritam

| Dan | Aktivnost | Vrijeme |
|---|---|---|
| Ponedjeljak | Sprint Planning | 30 min |
| Utorak-Četvrtak | Development + Daily Standup | 6-8h |
| Petak | Sprint Review + Retrospektiva | 1.5h |

---

##  Sprint 1 Deadline

```
Sprint Planning: Ponedjeljak 10h
Daily Standup:  Srijeda 10h
Mid-Sprint:     Četvrtak 15h
Sprint Review:  Petak 14h
Retrospektiva:  Petak 15:30h

Svi Taskovi Trebaju Biti "Gotovo" Do: Petak 17h
```

---

##  Emergency Contacts

- **Mentor:** [email]
- **Tech Lead:** [name]
- **DevOps:** [name]
- **Slack/Discord:** [link]

---

##  Tips & Tricks

### VS Code

```
Ctrl+Shift+P — Command palette
Ctrl+Shift+F — Find across files
Ctrl+G — Go to line
Ctrl+` — Terminal
```

### Git

```bash
# Vidi što sam radio
git log --oneline -n 5

# Vidi što se promijenilo
git status

# Vidi diff-ove
git diff

# Otkaži promjene (ako ne hoćeš)
git checkout -- fajl.cs
```

### .NET

```bash
# Brza asm restore
dotnet restore --force

# Očisti cache
dotnet nuget locals all --clear
```

---

##  Uspjeh!

Ako:
-  Docker radi
-  API je dostupan
-  Git workflow razumiš
-  Znaš kako koristiti Copilot

**Onda si spreman za Sprint 1! **

**Trebam više?**  
 Čitaj pune documente u `/docs` foldera

---

##  Dokumenti (Redoslijed Čitanja)

1. **INDEX.md** — Pregled svega
2. **PROJECT_STRUCTURE.md** — Kako je organizovan kod
3. **INITIAL_SETUP.md** — Setup za tvoju ulogu (KRENI OVDJE!)
4. **SPRINT_1_PLAN.md** — Što se očekuje
5. **ROLES.md** — Detaljne odgovornosti
6. **ai/AI_AGENTS_SETUP.md** — Kako koristiti AI

---

**Sretno!**

