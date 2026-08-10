# ADR-003: Keycloak / OIDC autentifikacija

**Status:** Accepted  
**Kategorija:** A — Osnovna arhitektura  
**Owner:** Arhitekta / Security Engineer  
**Datum donošenja:** Oktobar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako organizacija uvede vlastiti Identity Provider ili ako Keycloak operativni teret postane neprihvatljiv  
**Zahvaćeni moduli:** Api, BlazorApp, Infrastructure (Auth), Docker  
**User Stories:** US-2 (upravljanje ulogama), sve — svaki endpoint zahtijeva autentifikaciju

---

## Kontekst

Bankarski intranet sistem zahtijeva centralizovano upravljanje identitetima: kreiranje naloga, dodjela rola, suspenzija korisnika, SSO s potencijalnim budućim sistemima, i kompletna revizijska stopa svakog login eventi. Vlastita implementacija autentifikacije u bankarskom kontekstu nije prihvatljiva opcija — standard industrije je delegiranje Identity Provideru.

Aplikacija ima dva konzumenta autentifikacijskih token: BlazorApp koji koristi OIDC cookie session, i Api koji prima JWT Bearer token. Ovi slučajevi su strukturno različiti i zahtijevaju drugačiji pristup.

---

## Decision Drivers

- **Regulatorni zahtjev** — bankarska regulativa (ZoZB i interna politika) zahtijeva centralizovani audit login eventi i centralizovano upravljanje korisničkim pristupom
- **SSO kapacitet** — budući sistemi unutar iste organizacije trebaju moći koristiti isti Identity Provider
- **Self-hosted** — podaci o korisnicima ne smiju napustiti organizacijsku infrastrukturu
- **MFA podrška** — zahtjev koji ne implementiramo sami
- **Docker-native** — rješenje mora funkcionisati unutar postojećeg Docker compose okruženja

---

## Odluka

**Keycloak** kao Identity Provider s **OpenID Connect** protokolom.

Tok autentifikacije po tipu klijenta:
- **BlazorApp**: Authorization Code Flow + PKCE s Keycloak realm-om. Token se čuva u server-side OIDC cookie sesiji. Browser nikad ne vidi JWT Bearer direktno.
- **Api**: JWT Bearer validacija. Keycloak emituje token; Api validira potpis bez pozivanja Keycloak-a per-request.
- **ROPC flow**: Dostupan kao sekundarni path za direktnu prijavu unutar BlazorApp-a (intranet use case). Detalji u [ADR-022](ADR-022-ropc-auth.md).

Keycloak konfiguracija: realm `bankarski-sistem`, klijent `blazor-client` (confidential) i `api-client` (bearer-only). Korisnici, role i grupe upravljaju se isključivo kroz Keycloak Admin API — baza podataka ne drži lokalne kopije korisnika.

---

## Alternativna rješenja

| Opcija | Self-hosted | SSO | MFA Out-of-box | Operativna složenost | Docker ready | Zašto nije izabrana |
|--------|------------|-----|----------------|----------------------|-------------|---------------------|
| **Keycloak OIDC** ✓ | ✓ | ✓ | ✓ | Srednja (Java runtime) | ✓ | — |
| ASP.NET Core Identity | ✓ | ✗ (zahtijeva custom rad) | ✗ (zahtijeva custom rad) | Niska | ✓ | Implementacija MFA-a i SSO-a u bankarskom kontekstu je sigurnosno rizična; neprihvatljivo za produkciju |
| Azure AD / Entra ID | ✗ | ✓ | ✓ | Niska (managed) | ✓ | Vendor lock-in Microsoft Azure; podaci o korisnicima izlaze iz organizacijske infrastrukture; troškovi skaliraju s brojem korisnika |
| Auth0 | ✗ | ✓ | ✓ | Niska (managed) | ✓ | SaaS zavisnost; podaci o korisnicima na stranom serveru; neprihvatljivo za bankarski sektor |

---

## Consequences

### Pozitivne
- Centralizovano upravljanje korisnicima — dodavanje, suspenzija i upravljanje rolama kroz Keycloak Admin konzolu bez promjene aplikacije
- MFA, politike lozinki, sesijsko istjecanje i audit login eventi su Keycloak odgovornosti, ne naše
- API ne treba pozivati vanjski servis pri svakom requestu — JWT Bearer validacija je lokalna operacija (provjera potpisa s JWKS endpoint-om koji se kešira)
- SSO je slobodan bonus — svi budući sistemi koji se povežu na isti Keycloak realm dobivaju SSO automatski

### Negativne
- Java runtime u Docker compose okruženju — Keycloak zahtijeva znatno više memorije od .NET servisa (minimalno 512MB, praktično 1-2GB za produkciju)
- Operativna odgovornost — Keycloak upgrade, backup baze podataka (Keycloak ima vlastitu PostgreSQL instancu), HA konfiguracija za produkciju su naša odgovornost
- Razvoj ovisi o Keycloak-u koji mora biti pokrenut lokalno — developer ne može pokrenuti aplikaciju bez Docker compose okruženja
- Token refresh logika je kompleksnija: BlazorApp mora upravljati OIDC cookie refreshom transparentno kroz RequestMessageHandler

### Svjesno prihvaćeni kompromisi
- Prihvatamo operativnu složenost Java JVM servisa kao cijenu za self-hosted identitetsku infrastrukturu koja zadovoljava bankarske regulatorne zahtjeve. Za produkciju to znači HA Keycloak cluster s zasebnom PostgreSQL instancom i backup procedurom — investicija koja je manji rizik od SaaS rješenja ili vlastite implementacije.

---

## Tehnički dug

- Produkcija zahtijeva HA Keycloak cluster (minimalno 2 node s PostgreSQL) — nije implementirano u trenutnom Docker compose stacku koji pokreće single-node Keycloak
- Keycloak Admin API pozivi iz aplikacije (UserSuspensionService, KeycloakUserRoleProvider) nisu pokriveni retry/circuit-breaker logikom — Keycloak downtime može uzrokovati 500 greške na korisničkim endpointima

---

## Migration Impact

- **Breaking Changes:** Promjena Identity Provider-a je radikalna promjena — svi tokeni postaju nevažeći, korisnici moraju biti migrirani
- **Rollback Plan:** Nije praktičan bez planiranog migracijskog prozora
- **Compatibility:** Keycloak implementira OIDC standard — aplikacija koristi standardne .NET OIDC biblioteke, ne Keycloak-specifičan SDK. Zamjena s drugim OIDC-kompatibilnim IdP-om bi zahtijevala konfiguracijsku promjenu, ne izmjenu koda.

---

## Kada revidirati

- Organizacija uvede vlastiti, centralni Identity Provider koji podržava OIDC (npr. organizacijski Active Directory Federation Services ili sl.)
- Keycloak operativni teret (upgrade, backup, HA) postane neprihvatljiv za dostupne DevOps kapacitete
- Pojave se sigurnosne ranjivosti u Keycloak verziji koja se koristi, a upgrade nije izvediv bez breaking changes
