# studentskapraksa – AI Research Agent

## Postavljanje na početku session

```bash
# 1. Provjeri da li je research agent aktivan
cat .env | grep RESEARCH_MODE
# Ako nije: node research-cli/maintenance/enable.js

# 2. Provjeri aktivni zadatak
cat .research/tasks/active-task.json 2>/dev/null || echo "Nema aktivnog zadatka"
```

## Tok rada sa studentom

### Početak zadatka
```bash
node research-cli/commands/start-task.js "Naziv zadatka"
```

### Logovanje AI interakcije (radi ovo na kraju svake session)
```bash
node research-cli/commands/log-ai.js \
  --tool=ALAT \
  --category=KATEGORIJA \
  --time-saved=MINUTE \
  --duration=MINUTE \
  --task="Kratki opis šta je urađeno" \
  --prompt="Originalni prompt koji je student poslao"
```

Vrijednosti za `--tool`:

| Agent | `--tool` |
|---|---|
| GitHub Copilot | `copilot` |
| Claude (Anthropic) | `claude_code` |
| ChatGPT | `chatgpt` |
| Cursor AI | `cursor` |
| Google Gemini | `gemini` |
| Windsurf / Codeium | `windsurf` |
| Ostali | `other` |

**`--task`** — uvijek popuni s kratkim opisom šta je student pitao/urađeno (npr. `"Blazor login forma s validacijom"`, `"Fix null reference u ItemService"`)

**`--duration`** — stvarno trajanje razgovora u minutama

**`--time-saved`** — procijeni koliko bi student sam potrošio bez AI pomoći:
- Kratko pitanje / objašnjenje koncepta → `5`
- Napisao/ispravio 1 funkciju ili komponentu → `15`
- Napisao više funkcija, kompletnu komponentu → `25`
- Kompleksan debug koji je trajao više poruka → `35`
- Kompletan feature (endpoint + model + UI) → `60`

Kategorije: `code_generation` | `debugging` | `testing` | `documentation` | `code_review` | `optimization` | `learning` | `infra_setup` | `api_design` | `other`

Za infrastrukturni rad dodaj i `--project` flag:
```bash
node research-cli/commands/log-ai.js \
  --tool=claude_code \
  --category=infra_setup \
  --time-saved=30 \
  --project=infra \
  --task="Docker compose networking između containera"
```

### Završetak zadatka
```bash
node research-cli/commands/end-task.js
```

## Korisne komande

```bash
npm run research:today      # Statistike danas
npm run research:insights   # Personalni uvidi (sve vrijeme)
npm run research:doctor     # Health check agenta
npm run research:submit     # Pošalji sedmične podatke (petak)
```

## Detekcija kategorije

| Što student traži | Kategorija |
|---|---|
| "napiši funkciju / klasu / modul" | `code_generation` |
| "zašto ovo ne radi / error / bug" | `debugging` |
| "napiši test / spec / mock" | `testing` |
| "dokumentiraj / objasni kod" | `documentation` |
| "pregledaj / review moj kod" | `code_review` |
| "optimizuj / refaktoriši / ubrzaj" | `optimization` |
| "objasni mi / kako radi / što je" | `learning` |

## Procjena ušteđenog vremena

- Kratko objašnjenje (< 2 min) → 5 min
- Generisanje koda (5–10 min) → 15–30 min
- Debug problema (10–20 min) → 30–60 min
- Kompleksan zadatak (30+ min) → 60–120 min

## Hetzner Cloud infrastruktura

### Inicijalizacija praćenja (jednom, kad student dobije server IP)
```bash
npm run infra:setup -- init 1.2.3.4 naziv-servera
```

### Označavanje završenih koraka
```bash
npm run infra:setup -- done server_created
npm run infra:setup -- done ssh_configured
npm run infra:setup -- done docker_installed
npm run infra:setup -- done repo_cloned
npm run infra:setup -- done env_configured
npm run infra:setup -- done app_deployed
npm run infra:setup -- done containers_healthy
npm run infra:setup -- done nginx_configured
npm run infra:setup -- done ssl_configured
npm run infra:setup -- done domain_configured

# Sa napomenom:
npm run infra:setup -- done docker_installed --notes="Docker 26.1, Compose v2"
```

### Provjera stanja servera (s laptopa studenta)
```bash
npm run infra:check     # HTTP health check na sve servise
npm run infra:setup -- status   # Napredak setup koraka
```

### Ako je student imao problem tokom infra setup-a – logiraj AI pomoć:
```bash
node research-cli/commands/log-ai.js \
  --tool=claude_code --category=infra_setup \
  --time-saved=20 --project=infra \
  --notes="Docker compose networking između containera"
```

### Napomene za studenta
- Server IP i config se čuvaju u `.research/infra/config.json` (gitignored)
- SSH ključ generišeš lokalno: `ssh-keygen -t ed25519 -C "student@praksa"`
- Na Hetzner Console dodaješ public key u SSH Keys sekciji
- Na serveru uvijek koristiš `docker compose` (v2), ne `docker-compose` (v1)

## Pravila privatnosti

Nikada ne uključuj u output ili commit: lozinke, API ključeve, email adrese, interne URL-ove.
Fajl `.env` je u `.gitignore` – nikad ga ne commitovaj.
