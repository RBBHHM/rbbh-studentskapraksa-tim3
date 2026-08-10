# Core Acceptance Checklist

## Auth / Login

- [ ] Login stranica se otvara (`/login`)
- [ ] Klik "Prijava" → redirect na Keycloak (sa konfiguriranim Keycloak)
- [ ] Pogrešna prijava → neutralna poruka (bez tehničkih detalja)
- [ ] `GET /api/me` vraća: userId, username, email, roles, permissions, defaultRoute, availableModules, userStatus
- [ ] Korisnik bez role → userStatus: "NoRole"
- [ ] Nepoznata rola → userStatus: "UnknownRole"
- [ ] Neautentificiran → `GET /api/me` vraća 401
- [ ] Admin korisnik → redirect na `/admin/pristup`

## Role Management

- [ ] `GET /api/admin/roles` vraća listu rola (zahtijeva `roles.manage`)
- [ ] `POST /api/admin/roles` kreira novu rolu + Keycloak sync
- [ ] Sistemske role se ne mogu brisati (blokira sa 409)
- [ ] Minimum 2 administratora — blokira uklanjanje admin role (BR-ROLE-04)
- [ ] Self-suspension blokirana
- [ ] Sve akcije auditirane

## Šifarnici

- [ ] `GET /api/codebooks/{key}/values/active` vraća aktivne vrijednosti
- [ ] `POST /api/codebooks/{key}/values` kreira vrijednost (zahtijeva `codebooks.manage`)
- [ ] Deaktivacija ne briše fizički
- [ ] Vrijednost u upotrebi ne brisati fizički (blokira sa 409)
- [ ] Sistemske vrijednosti se ne brišu

## Audit

- [ ] `GET /api/audit` vraća zapise (zahtijeva `audit.view-security`)
- [ ] Audit sadrži: actor, action, module, entityType, entityKey, status
- [ ] 401 za neautentificirane, 403 za korisnike bez permissiona

## Health

- [ ] `GET /health` vraća status
- [ ] postgres check funkcionalan
- [ ] migrations check prikazuje pending migracije

## Build

- [ ] `dotnet build src/Api/Api.csproj` → 0 grešaka
- [ ] `dotnet build src/BlazorApp/BlazorApp.csproj` → 0 grešaka
- [ ] `dotnet build src/GIT.TransactionIdempotency.sln` → 0 grešaka

## OTVORENA PITANJA (Human must decide)

1. Koji su konačni statusi narudžbe (AppraisalOrderStatus)?
2. Pravilo za four-eyes / maker-checker?
3. Koji korisnici (rola) dobijaju koje email notifikacije?
4. Da li vještak ima login ili samo prima email?
5. Konačna permission matrix po rolama?
