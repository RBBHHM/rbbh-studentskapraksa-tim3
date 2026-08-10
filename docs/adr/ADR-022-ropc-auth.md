# ADR-022: ROPC dual auth path

**Status:** ⚠ Needs Review  
**Kategorija:** D — Sigurnost i autorizacija  
**Owner:** Arhitekta / Security Engineer  
**Datum donošenja:** Oktobar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Kada OIDC redirect tok postane prihvatljiv za sve korisnike na intranet okruženju  
**Zahvaćeni moduli:** BlazorApp (Login stranica), Infrastructure (Auth)  
**User Stories:** Login flow za sve korisnike

---

## Kontekst

OAuth 2.1 deprecira Resource Owner Password Credentials (ROPC) grant. Standardni OIDC Authorization Code Flow + PKCE je preporuka.

Međutim, BlazorApp koristi OIDC cookie sesiju s automatskim redirectom na Keycloak login stranicu. U intranet okruženju, ovaj redirect može biti spor ili problematičan za neke korisnike zbog mrežnih konfiguracija. ROPC omogućava direktnu prijavu unutar BlazorApp Login stranice bez redirecta na vanjski IdP.

---

## Decision Drivers

- **UX u intranet okruženju** — redirect na Keycloak stranicu (koja je na drugom Docker containeru) može uzrokovati kašnjenje pri prvom login-u
- **OAuth 2.1 compliance** — ROPC je depreciran; dugoročno ga treba eliminisati
- **Sigurnosni rizik** — ROPC zahtijeva da aplikacija prima plaintext lozinku, što je anti-pattern u OAuth 2.0+

---

## Odluka

Obje auth putanje su dostupne:

1. **OIDC Authorization Code Flow** — primarni, preporučeni tok. Redirect na Keycloak; Keycloak autentificira; JWT token vraćen kroz authorization code.
2. **ROPC grant** — sekundarni tok. BlazorApp Login stranica prima username/password i poziva Keycloak Token Endpoint direktno.

**Kompenzacijske mjere za ROPC**:
- Rate limit: 5 pokušaja u minuti po IP adresi (ASP.NET Core `AddRateLimiter`)
- Email sanitizacija: `a@b.com` → parsovan i re-formatiran prije prosljeđivanja Keycloak-u
- Logging: svaki ROPC pokušaj (uspješan i neuspješan) se auditira s IP adresom

---

## Alternativna rješenja

| Opcija | UX | OAuth 2.1 compliance | Phishing zaštita | Operativna složenost | Zašto nije izabrana |
|--------|----|--------------------|-----------------|---------------------|---------------------|
| **Dual path (OIDC + ROPC)** ✓ | ✓ (direktan login) | ✗ Depreciran ROPC | ✗ (kompenzovano rate limitom) | Niska | — |
| Samo OIDC redirect | ✗ (sporiji UX) | ✓ | ✓ | Niska | Prihvatljiva alternativa; odbačena zbog UX zahtjeva intranet okruženja |
| Custom form → JWT proxy | ✓ | ✗ | ✗ | Visoka | Kompleksnija od ROPC; ne rješava temeljni problem |

---

## Consequences

### Pozitivne
- Korisnici mogu odabrati direktnu prijavu bez redirecta
- OIDC flow ostaje dostupan kao primarni, sigurniji tok

### Negativne
- BlazorApp prima plaintext lozinku — phishing risk ako je aplikacija kompromitovana
- ROPC grant ne podržava MFA kroz standardni flow
- OAuth 2.1 deprecacija ROPC-a znači da budući Keycloak release može ukloniti podršku

### Svjesno prihvaćeni kompromisi
- Prihvatamo ROPC za intranet korisničku bazu dok se UX alternativa ne implementira. Kompenzacijski rate limit štiti od brute-force napada koji su primarni rizik.

---

## Tehnički dug

🟢 **NIZAK PRIORITET**: Planirati migraciju prema isključivom OIDC flow-u:
1. Istražiti Keycloak Identity Brokering za seamless SSO unutar intranet-a
2. Poboljšati UX redirecta (loading indikator, brža Keycloak response)
3. Po postizanju prihvatljivog OIDC UX-a, ukloniti ROPC login formu

---

## Migration Impact

- **Breaking Changes:** Uklanjanje ROPC flow-a zahtijeva UI promjenu na Login stranici
- **Rollback Plan:** ROPC je konfigurabilna Keycloak opcija — može biti onemogućena bez promjene koda
- **Compatibility:** Nema

---

## Kada revidirati

- OIDC redirect UX postane prihvatljiv za sve intranet korisnike
- Buduća verzija Keycloak-a ukloni podršku za ROPC grant
- Identifikuje se sigurnosni incident vezan za ROPC flow
