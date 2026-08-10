# GitHub Best Practices

## Branches

### Kada praviti branch

**Uvijek** pravi novi branch za svaki task, feature ili bugfix. Nikad ne commitaš direktno na `main`.

```bash
git checkout main
git pull origin main          # uvijek počni od ažurnog maina
git checkout -b tip/naziv     # kreiraj i prebaci se na novi branch
```

### Konvencija imenovanja brancheva

```
feat/naziv-featurea         # novi feature
fix/kratak-opis-buga        # ispravka greške
chore/zadatak               # setup, konfiguracija, tooling
docs/sta-se-dokumentuje     # samo dokumentacija
refactor/sta-se-mijenja     # refactoring bez promjene funkcionalnosti
test/sta-se-testuje         # pisanje testova
```

**Primjeri:**
```
feat/login-forma
fix/null-reference-item-service
chore/docker-compose-setup
docs/api-endpoints
refactor/items-repository
test/item-endpoints-integration
```

### Pravila za brancheve

- Ime branche treba opisivati **šta se radi**, ne ko to radi (`feat/login`, ne `mirza-login`)
- Koristi **kebab-case** (crtice, ne underscore, ne velika slova)
- Branch briši nakon što je mergean u main
- Jedan branch = jedan logički zadatak

---

## Commit poruke

### Format

```
tip(scope): kratki opis u imperativu (max 72 znaka)

Opcionalno: duže objašnjenje zašto (ne šta, to se vidi iz koda).
Ako je fix, navedi koji bug je ispravljen.
```

### Tipovi commit poruka

| Tip | Kada |
|-----|------|
| `feat` | Nova funkcionalnost |
| `fix` | Ispravka greške |
| `chore` | Setup, konfiguracija, dependenciji |
| `docs` | Samo dokumentacija |
| `refactor` | Refactoring bez promjene ponašanja |
| `test` | Dodavanje ili izmjena testova |
| `style` | Formatiranje, razmaci (bez logičkih promjena) |
| `perf` | Optimizacija performansi |

### Primjeri dobrih commit poruka

```
feat(items): dodaj DELETE endpoint za brisanje stavke

fix(auth): ispravi null reference kad token istekne

chore: dodaj .dockerignore za brži build

test(items): dodaj integration test za POST /api/items

docs: ažuriraj README s uputama za Docker
```

### Česte greške (izbjegavaj)

```
# Preširoko — ne govori ništa
git commit -m "izmjene"
git commit -m "fix"
git commit -m "WIP"

# Prošlo vrijeme — koristi imperativ
git commit -m "dodao sam login"       ❌
git commit -m "feat: dodaj login"     ✅

# Previše u jednom commitu
git commit -m "feat: login, fix null ref, refactor service, update docs"  ❌
```

### Zlatno pravilo commita

**Svaki commit treba biti logički zaokružen** — ako radiš i feature i bugfix, to su **dva odvojena commita**. Commiti treba da budu mali i česti, ne jednom dnevno s gomilom izmjena.

---

## Pull Requests (PR)

### Kada otvarati PR

- Kad je feature/fix završen i spreman za review
- **Ne čekaj** da bude "savršeno" — otvori PR čim je funkcionalno
- Ako task traje duže od dana, otvori **Draft PR** odmah — vidljiv je napredak

### Naslov PR-a

Naslov prati istu konvenciju kao commit poruka:

```
feat(chat): dodaj streaming odgovor iz Anthropic API
fix(items): ispravi 500 grešku kod praznog body-ja
```

### Opis PR-a — šta pisati

```markdown
## Šta je promijenjeno

Kratko objašnjenje šta je implementirano i zašto.

## Kako testirati

1. Pokreni `dotnet run --project src/Api`
2. Pošalji POST na `/api/items` s praznim body-jem
3. Treba vratiti 400, ne 500

## Screenshots (ako ima UI promjena)

[priloži screenshot]

## Checklist

- [ ] Kod kompajlira bez grešaka
- [ ] Testovi prolaze (`dotnet test`)
- [ ] Nema hardcodiranih kredencijala
```

### Veličina PR-a

- **Idealno**: manje od 400 linija izmjena
- Veliki PR-ovi su teški za review — podijeli u više manjih PR-ova ako možeš
- Ako moraš imati veliki PR, objasni strukturu u opisu

### Code review — kako davati komentare

**Kao reviewer:**
```
# Sugestija (nije obavezno mijenjati)
Nit: moglo bi se skratiti s LINQ-om

# Pitanje (treba pojašnjenje)
Zašto ovdje koristimo async ako odmah čekamo rezultat?

# Problem (treba ispraviti)
Bug: ovo će baciti NullReferenceException ako je item null
```

**Kao autor:**
- Na svaki komentar odgovori ili napravi izmjenu
- Ako ne prihvataš sugestiju, objasni zašto
- Ne merge-aj dok nisu razriješeni svi otvoreni komentari

---

## Git flow — tipičan tok rada

```bash
# 1. Počni od ažurnog maina
git checkout main
git pull origin main

# 2. Kreiraj branch
git checkout -b feat/nova-funkcija

# 3. Radi izmjene, commitaj često
git add src/Api/Endpoints/ItemEndpoints.cs
git commit -m "feat(items): dodaj paginaciju u GET /api/items"

git add src/Api.Tests/ItemEndpointTests.cs
git commit -m "test(items): dodaj test za paginaciju"

# 4. Pushaj branch
git push origin feat/nova-funkcija

# 5. Otvori Pull Request na GitHubu

# 6. Nakon merge-a — obriši lokalni branch
git checkout main
git pull origin main
git branch -d feat/nova-funkcija
```

---

## .gitignore — šta ne commitovati

Nikad ne commitaj:
- `.env` fajlove s tajnama (API ključevi, lozinke)
- `bin/`, `obj/` direktorije (.NET build outputi)
- `node_modules/`
- Privatne certifikate i ključeve
- Lokalne IDE fajlove (`.vs/`, `.idea/`)

Provjeri `.gitignore` prije prvog commita u novom projektu.

---

## Korisne Git komande

```bash
git status                    # šta je izmijenjeno
git diff                      # konkretne izmjene (ne stagean)
git diff --staged             # stagean izmjene
git log --oneline -10         # zadnjih 10 commitova
git stash                     # privremeno sačuvaj izmjene
git stash pop                 # vrati sačuvane izmjene
git reset HEAD~1              # poništi zadnji commit (izmjene ostaju)
git branch -a                 # sve brancheve
```
