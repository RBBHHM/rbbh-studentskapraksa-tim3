# Sprint 1 — Audit, popravke i odluke

> Historijski dokument iz perioda prije RBI React migracije. Tvrdnje da je
> `src/Web` prazan skeleton i da je BlazorApp aktivni frontend više ne važe;
> trenutno stanje opisano je u root `README.md`, `HOW-TO-RUN.md` i `MIGRATION.md`.

Dokument bilježi puni audit Sprinta 1, primijenjene popravke i arhitekturne odluke
donesene kad su dokumentacija i implementacija bile u koliziji.

## Status Sprint 1 stories

| Story | Stanje | Napomena |
|---|---|---|
| 1. Prijava + redirect prema roli | ✅ Radi end-to-end | Login je bio potpuno neispravan u Dockeru; popravljen kompletan OIDC lanac |
| 2. Upravljanje rolama + prenos admina | ✅ Radi | Dodan Keycloak service-account; popravljena serializacija role-mapping poziva |
| 3. Validacije (JMBG/porez/afrikati/case-insensitive) | ✅ Radi | Validatori ispravni (JMBG i kontrolna cifra); diakritici Š Đ Č Ć Ž podržani |
| 4. Upravljanje šifarnicima + audit | ✅ Radi | Dodan idempotentan seeder; deaktivacija/zaštita sistemskih vrijednosti; audit |

## Kako pokrenuti i testirati

```bash
docker compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml up -d --build
# Frontend: http://localhost:5001  → "Prijava" → Keycloak
```

Testni korisnici (realm `praksa`):

| Korisnik | Lozinka | Rola |
|---|---|---|
| admin.test | Admin1234! | Administrator |
| admin2.test | Admin1234! | Administrator |
| unosnik.test | Unosnik1234! | Unosnik |
| verifikator.test | Verifikator1234! | Verifikator |

> `admin2.test` je dodan jer prenos administratorske role i pravilo o minimumu
> administratora zahtijevaju barem dva administratora za smislen test.

## Kritične popravke (P0 — login je bio neupotrebljiv u Dockeru)

Cijeli auth lanac je bio prekinut. Popravljeno redom:

1. **OIDC discovery URL (web)** — kontejner je radio server-side discovery na
   `localhost:8080` (nedostupno unutar mreže). Dodano `KeycloakInternalUrl=http://keycloak:8080/...`
   uz javni `Authority=localhost:8080`. (`docker-compose.override.yml`)
2. **Audience** — API traži `aud=praksa-api`, a realm nije imao mapper → svaki API
   poziv 401. Dodan audience protocol mapper na `praksa-web`. (`realm-export.json`)
3. **Role claim** — Keycloak emituje role u `realm_access.roles` (nested), a backend je
   čitao samo flat `roles` → prazne role, 403 svuda. Dodan flat realm-roles mapper +
   defenzivni parser `realm_access.roles` u `ClaimsPrincipalExtensions`.
4. **Login dugme** — `Login.razor` je ručno gradio Keycloak URL bez state/nonce/PKCE →
   callback bi pao na "Correlation failed". Sada ide kroz `/api/login` challenge endpoint.
5. **response_mode** — `form_post` (cross-site POST) nije slao SameSite=Lax correlation
   cookie → "Correlation failed". Prebačeno na `response_mode=query` + `SecurePolicy=SameAsRequest`
   (radi i preko HTTP-a u dev-u).
6. **offline_access** — traženo, a korisnici nemaju rolu → "Offline tokens not allowed".
   Uklonjeno (refresh token vezan za SSO sesiju je dovoljan, primjerenije za banku).
7. **userinfo 401** — `GetClaimsFromUserInfoEndpoint=true` rušio callback. Isključeno;
   svi claim-ovi (username, email, roles) stižu u id_token-u.
8. **Issuer** — API prihvata i interni (`keycloak:8080`) i javni (`localhost:8080`) issuer.

## Story 2 — Keycloak admin

- Dodan **confidential service-account klijent `praksa-api`** (client_credentials) sa
  realm-management rolama: `view-users`, `query-users`, `view-realm`, `manage-users`.
  Bez njega listanje korisnika i dodjela rola nisu mogli raditi.
- Konfigurisano u API kontejneru: `KeycloakAdmin__BaseUrl/Realm/ClientId/ClientSecret`.
- Popravljena serializacija role-mapping poziva: Keycloak traži `{id,name}` (camelCase),
  a slano je `{Id,Name}` (PascalCase) → 400. (`RoleManagementService`)

## Story 4 — Seed šifarnika

- Šifarnik vrijednosti se nisu nigdje punile (samo migracije). Dodan idempotentan
  `CodebookSeeder` koji čita ugrađeni (embedded) `Seed/codebooks.json` i puni vrijednosti
  pri startupu. Pokreće se nakon migracija.

## Odluke kod kolizije dokumentacije i implementacije

| Tema | Konflikt | Odluka |
|---|---|---|
| Aktivni frontend | README/`.slnx`/arh. docs navode `src/Web` (Blazor WASM); tim gradi i deploya `src/BlazorApp` (Blazor Server) | **BlazorApp je kanonski** (to se deploya preko `web.Dockerfile`). README i `.slnx` ažurirani. `src/Web` je prazan skeleton. |
| Login forma | SA decision log opisuje in-app formu sa lozinkom; arhitektura nalaže Keycloak OIDC redirect (backend ne barata lozinkama) | **OIDC redirect** (sigurnije, usklađeno s backend pravilima). Branded login stranica ostaje, ali predaje prijavu Keycloak-u; email se šalje kao `login_hint`. |
| Vidljivost modula | Story 1 acceptance: "neaktivni moduli vidljivi ali sivi"; DL-SA01-01: nedozvoljeni moduli se **ne prikazuju** | Slijedi se **decision log** (skrivanje). Siva/onemogućena ostaju samo prikazana polja koja se ne smiju mijenjati (DL-SA02-02). |
| Minimum administratora | DL: "ne smije ostati bez najmanje **jednog** administratora"; Story 2 acceptance: "svaka rola min **2** korisnika" | Implementirano **min 2 administratora** (`RoleManagementService`), uz audit blokade. |

## Preostali rizici / preporuke (van Sprint 1 obima)

- **Čišćenje repozitorija:** ukloniti neiskorištene `src/Web`, `src/GIT.TransactionIdempotency`,
  commitovani `dist/`, i duplikat root `docker-compose.yml` (drugačiji DB kredencijali).
- **Keycloak dijeli bazu s aplikacijom** (`KC_DB` = ista PostgreSQL baza). Za produkciju
  razdvojiti u zasebnu bazu/šemu.
- **HTTPS/TLS** nije konfigurisan (nginx ima TODO za 443). Obavezno za produkciju;
  tada cookie-ji automatski postaju Secure (SecurePolicy=SameAsRequest).
- **Lista kategorija šifarnika je hardkodirana** u `CodebookManagement.razor` (mock).
  Vrijednosti se učitavaju s API-ja, ali listu kategorija treba izvući iz API-ja.
- **Tajne u realm-export i compose** (`praksa-api-secret-dev`, KC admin/admin) su dev
  vrijednosti — za produkciju koristiti GitHub Secrets / environment varijable.
- **403 (neovlašteni pristup) se ne auditira** jer policy odbija prije servisa; ako je
  potrebno auditirati pokušaje, dodati middleware/handler.
- **Swagger/OpenAPI** nije uključen (TODO u `Program.cs`).
- **Lokalni build** zahtijeva .NET 10 SDK; trenutno radi samo kroz Docker.
