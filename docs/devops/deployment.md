# Deployment na Hetzner VPS (tim3)

## Arhitektura

Server je **dijeljen** između više timova (Model A — vidi komentar u
`docker/docker-compose.app.yml`). Vlasnik servera drži zajedničku infrastrukturu
(Postgres, Keycloak, Nginx) na eksternoj Docker mreži `shared-infra`; tim3 na nju
samo priključuje svoj app sloj (`tim3_api`, `tim3_web`):

```
Internet → nginx (shared, VPS :80/:443) → tim3_web  (interno, shared-infra)
                                         → tim3_api  (interno, shared-infra)
          → keycloak (shared, interno)
          → postgres (shared, interno) — tim3 koristi vlastitu bazu/usera na njemu
```

Nginx, Keycloak i Postgres se **ne** diraju iz ovog repoa — njima upravlja
vlasnik servera. Ovaj repo je odgovoran isključivo za `tim3_api` i `tim3_web`.

> **Compose project ime**: `docker-compose.app.yml` eksplicitno postavlja
> `name: praksa-tim3`. Više timova na ovom dijeljenom serveru koristi identičan
> relativni put `docker/docker-compose.app.yml`, pa bi Compose bez eksplicitnog
> imena grupisao sve njih pod isti auto-generisani "docker" project — a
> `--remove-orphans` bi u tom slučaju mogao obrisati tuđe kontejnere.
> Potvrđeno na serveru (`docker compose ls`) da je taj koliziju stvarno postojala
> prije ove izmjene. **Ne uklanjati `name:` iz compose fajla.**

## Preduvjeti (jednokratno, na VPS-u)

- Docker + Docker Compose v2, non-root sudo user, SSH pristup ključem (vidi
  Sigurnosne zahtjeve u backlogu — root login i password auth su isključeni).
- Ciljni direktorij na serveru (npr. `/opt/tim3/studentskapraksaTema3`) postoji i
  deploy user ima write pristup — CD pipeline tu rsync-uje kod, **ne treba git
  klon na serveru** (repo je privatan, server ne treba GitHub kredencijal).
- `docker/.env.app` popunjen na serveru (kopija `docker/.env.app.example`,
  **nikad commitovan** — vidi `.gitignore`).
- Vanjska Docker mreža `shared-infra` već postoji (kreira je vlasnik servera):
  `docker network create shared-infra` (samo ako još ne postoji).
- Vlasnik servera je na svom nginxu usmjerio tim3 subdomenu (npr.
  `tim3.<base-domain>`) na `tim3_web`/`tim3_api` kontejnere na `shared-infra` mreži.

## Automatski deploy — GitHub Actions (`.github/workflows/cd.yml`)

Svaki push na `main` pokreće CD pipeline sa 5 job-a:

1. **build-and-push-api** i **build-and-push-web** (paralelno, potpuno odvojeni
   job-ovi/runner-i) — build `tim3_api` i `tim3_web` image-a (`docker/Dockerfile.api`,
   `docker/Dockerfile.web`) i push na GHCR, tagirano s `latest` i commit SHA-om
   (SHA tag omogućava rollback — vidi ispod). Odvojeni su namjerno: oba Dockerfile-a
   imaju stage `build` iz istog base image-a, pa bi grade u istom job-u/builderu
   pomiješalo BuildKit cache reference (potvrđeno na live testiranju).
2. **deploy** — `rsync` (preko SSH, sa runner-a koji već ima autentifikovan
   checkout) prenosi radno stablo za taj commit u `DEPLOY_PATH` na serveru
   (`--delete`, uz izuzetke `.git/`, `bin/`, `obj/`, `node_modules/` i
   `docker/.env.app` — potonji se **nikad** ne briše/prepisuje rsync-om). Server
   sam ne treba git pristup GitHubu (repo je privatan). Zatim SSH `docker compose
   -f docker/docker-compose.app.yml --env-file docker/.env.app up -d --build --remove-orphans`,
   pa **odmah zatim, u istoj SSH sesiji**, `docker exec tim3_api curl .../api/health`
   (retry do 120s). Ako API ne vrati HTTP 200, job **PADA** i ispisuje zadnjih 100
   linija logova `tim3_api`. Build se radi **na serveru** iz izvornog koda (ne pull
   gotovog image-a) — dosljedno s tim kako je `docker-compose.app.yml` napisan
   (samo `build:`, bez `image:`). Ovaj interni check ne zavisi od javne domene/nginx-a
   koje drži vlasnik dijeljenog servera, pa je pouzdan i prije nego subdomena za tim3
   bude spojena.
3. **health-check** — dodatna, **best-effort** provjera kroz javni URL
   (`https://<TEAM_PUBLIC_URL>/api/health`, retry do 60s). Pokreće se samo ako je
   `TEAM_PUBLIC_URL` variable postavljena i `continue-on-error: true` — ne obara
   deploy ako nginx/DNS na dijeljenom serveru još nije spojen na tim3 subdomenu,
   samo prijavi status.
4. **notify** — opciona Slack notifikacija o statusu (uključi je preko
   `SLACK_NOTIFICATIONS_ENABLED` varijable, tek kad `SLACK_WEBHOOK_URL` secret postoji).
   Javlja i status `deploy` job-a (interni health check) i status javnog health-check-a.

Isti workflow se može ručno pokrenuti (`workflow_dispatch`) s input-om `git_ref`
za deploy proizvoljnog commit-a/branch-a/taga — to je i mehanizam za rollback.

### Potrebni GitHub Secrets

Repo → Settings → Secrets and variables → Actions → **Secrets**:

| Secret | Opis |
|--------|------|
| `HETZNER_HOST` | IP adresa VPS-a (`167.233.59.205`) |
| `HETZNER_USER` | Non-root SSH deploy user |
| `HETZNER_SSH_KEY` | Privatni SSH ključ deploy usera (public key mora biti u `~/.ssh/authorized_keys` na serveru) |
| `SLACK_WEBHOOK_URL` | (opciono) Slack incoming webhook za notifikacije |

`GITHUB_TOKEN` za GHCR login je automatski dostupan u svakom workflow run-u —
ne treba ga ručno kreirati.

### Potrebne GitHub Variables

Repo → Settings → Secrets and variables → Actions → **Variables** (nisu tajne,
ali su specifične za okruženje pa ne idu hardkodirane u workflow):

| Variable | Opis |
|----------|------|
| `DEPLOY_PATH` | Apsolutna putanja repoa na serveru, npr. `/opt/tim3/studentskapraksaTema3` |
| `TEAM_PUBLIC_URL` | (opciono) Javni hostname tima za dodatni health-check, npr. `tim3.167-233-59-205.nip.io`. Ako nije postavljen, javni health-check se preskače — interni (`docker exec`) health-check u `deploy` job-u i dalje uvijek radi. |
| `SLACK_NOTIFICATIONS_ENABLED` | `"true"` da uključi notify job (opciono) |

Aplikacijski secreti (DB lozinka, Keycloak client secreti, `BASE_DOMAIN`) **ne
prolaze kroz GitHub Actions** — žive isključivo u `docker/.env.app` na serveru
(vidi `docker/.env.app.example`), jer deploy build radi lokalno na serveru iz
tog fajla, a ne prima vrijednosti iz CI-ja.

## Ručni prvi deploy (prije nego CI/CD proradi)

Repo je privatan, pa `git clone` direktno na serveru zahtijeva GitHub kredencijal
tamo — jednostavnije je samo pripremiti direktorij i pustiti da prvi CD run
(rsync) odradi prenos koda:

```bash
ssh <user>@167.233.59.205
mkdir -p /opt/tim3/studentskapraksaTema3/docker
cd /opt/tim3/studentskapraksaTema3
cp docker/.env.app.example docker/.env.app   # ako .env.app.example vec postoji lokalno; inace ga kreiraj rucno
# popuni docker/.env.app stvarnim vrijednostima (dobiti od vlasnika servera)
```

Zatim pokreni CD workflow (`gh workflow run cd.yml`) — rsync korak će prenijeti
kod, pa build+deploy proći normalno.

## Rollback

Deploy je SHA-baziran (rsync radnog stabla za taj commit), pa je rollback isti
mehanizam kao deploy, samo s prethodnim SHA-om:

```bash
# Opcija A — kroz GitHub Actions (preporučeno, isti pipeline, uključuje health-check):
gh workflow run cd.yml -f git_ref=<prethodni-dobri-sha>

# Opcija B — ručno na serveru, ako Actions nije dostupan (treba lokalni klon repoa):
git clone https://github.com/rbbhofficial/studentskapraksaTema3.git /tmp/rollback-src
cd /tmp/rollback-src && git checkout <prethodni-dobri-sha>
rsync -az --delete --exclude='.git/' --exclude='docker/.env.app' \
  ./ <user>@167.233.59.205:/opt/tim3/studentskapraksaTema3/
ssh <user>@167.233.59.205 \
  "cd /opt/tim3/studentskapraksaTema3 && docker compose -f docker/docker-compose.app.yml --env-file docker/.env.app up -d --build --remove-orphans"
```

GHCR image-i su dodatno tagirani sa commit SHA-om (`ghcr.io/rbbhofficial/studentskapraksa-api:<sha>`)
kao trag/audit toga šta je izgrađeno za svaki deploy, čak i kad se sam deploy
radi build-om na serveru a ne pull-om gotovog image-a.

> Napomena: ovaj dokument opisuje i testira mehanizam pipeline-a; stvarno
> izvršavanje na živom, dijeljenom VPS serveru (167.233.59.205) zahtijeva SSH
> pristup koji nije dostupan u ovom okruženju — prvi ručni deploy i popunjavanje
> GitHub Secrets/Variables mora odraditi neko s pristupom serveru.
