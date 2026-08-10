# Copilot radne instrukcije — studentskapraksa

Ovaj workspace je dio istraživačkog projekta koji mjeri utjecaj AI alata na produktivnost studenata.
**Nakon svake pomoći obavezno logiraj interakciju** u terminal koristeći naredbu ispod.

---

## Obavezno logovanje nakon svake interakcije

Na kraju SVAKE sesije gdje si pomogao studentu, pokreni ovu komandu u terminalu.

Koristi ispravan `--tool` za AI agenta koji je pomogao:

| Agent | `--tool` vrijednost |
|---|---|
| GitHub Copilot | `copilot` |
| Claude (Anthropic) | `claude_code` |
| ChatGPT | `chatgpt` |
| Cursor AI | `cursor` |
| Google Gemini | `gemini` |
| Windsurf / Codeium | `windsurf` |
| Ostali | `other` |

```bash
node research-cli/commands/log-ai.js --tool=ALAT --category=KATEGORIJA --time-saved=MINUTE --duration=MINUTE --task="Kratki opis šta je urađeno" --prompt="Originalni prompt koji je student poslao"
```

**`--task`** — uvijek popuni s kratkim opisom šta je student pitao/urađeno (npr. `"Blazor login forma s validacijom"`, `"Fix null reference u ItemService"`)

**`--duration`** — stvarno trajanje razgovora u minutama (koliko je razgovor trajao)

**`--time-saved`** — procijeni koliko bi student sam potrošio bez AI pomoći:
- Kratko pitanje / objašnjenje koncepta → `5`
- Napisao/ispravio 1 funkciju ili komponentu → `15`
- Napisao više funkcija, kompletnu komponentu → `25`
- Kompleksan debug koji je trajao više poruka → `35`
- Kompletan feature (endpoint + model + UI) → `60`

### Odabir kategorije

| Šta si radio | `--category` |
|---|---|
| Napisao funkciju, klasu, komponentu, endpoint | `code_generation` |
| Pronašao/objasnio grešku, fix | `debugging` |
| Napisao test | `testing` |
| Dokumentovao kod | `documentation` |
| Pregledao/komentarisao kod | `code_review` |
| Optimizovao, refaktorisao | `optimization` |
| Objasnio koncept, kako nešto radi | `learning` |
| Postavio infrastrukturu, Docker, CI | `infra_setup` |

### Primjeri

```bash
node research-cli/commands/log-ai.js --tool=copilot --category=code_generation --time-saved=25 --duration=5 --task="Blazor login forma s validacijom"
node research-cli/commands/log-ai.js --tool=claude_code --category=debugging --time-saved=35 --duration=10 --task="Fix null reference u ItemService.GetById"
node research-cli/commands/log-ai.js --tool=chatgpt --category=learning --time-saved=5 --duration=3 --task="Objašnjenje EF Core lazy loading"
node research-cli/commands/log-ai.js --tool=cursor --category=code_generation --time-saved=20 --duration=5 --task="Implementacija ItemRepository"
```

---

## Praćenje rada (file watcher)

Aktivni watcher bilježi sve izmjene fajlova automatski. Pokreće se sa:

```bash
npm run research:watch
```

---

## Slanje logova mentoru

```bash
npm run research:upload -- --student=12345
```

---

## Tok rada

1. `npm run research:watch` → pokreni na početku dana (ostavi terminal otvoren)
2. Radiš normalno, pitaš agente kad treba
3. Agent loguješ na kraju svake sesije pomoći (komanda iznad)
4. `npm run research:upload -- --student=12345` → pošalji na kraju dana
