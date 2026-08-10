# Auth Pravila

## Login flow

1. Korisnik otvara `/login` stranicu
2. Klika "Prijava" — redirect na Keycloak authorize endpoint
3. Keycloak prikazuje login formu
4. Uspješna prijava → Keycloak redirect nazad sa authorization code
5. BlazorApp izmjenjuje code za token (OIDC flow)
6. Frontend poziva `GET /api/me` za inicijalizaciju sesije
7. Frontend dobija: userId, roles, permissions, defaultRoute, availableModules, userStatus
8. Redirect na defaultRoute prema roli

## Prioritet redirect-a

1. Administrator → `/admin/pristup`
2. CA → `/narudzbe`
3. CO → `/narudzbe`
4. PravnaSluzba → `/narudzbe`
5. Verifikator → `/verifikacija`
6. Unosnik → `/nova-narudzba`

## Poruke grešaka (sigurnosno neutralne)

| Situacija | Poruka korisniku |
|---|---|
| Pogrešni kredencijali | "Neispravni pristupni podaci. Provjerite unos i pokušajte ponovo." |
| Korisnik bez role | "Nemate dodijeljena ovlaštenja za pristup aplikaciji. Molimo kontaktirajte administratora sistema." |
| Nepoznata rola | "Vaša korisnička rola nije prepoznata u sistemu. Molimo kontaktirajte administratora." |
| Server greška | Generička poruka, bez tehničkih detalja |

**NIKADA prikazivati**: stack trace, Keycloak poruke, SQL greške, user ID, interne exception poruke.

## JWT / OIDC konfiguracija

Postavke u `appsettings.json`:
```json
{
  "Keycloak": {
    "Authority": "http://localhost:8080/realms/praksa",
    "Audience": "praksa-api",
    "RequireHttpsMetadata": false
  }
}
```

Za produkciju: `RequireHttpsMetadata: true`, koristiti stvarni domain.

## PermissionClaimsTransformation

- Čita role iz JWT tokena
- Za **sistemske role** → statički `RolePermissionMatrix` (brzo, bez DB)
- Za **custom role** → `IMemoryCache` (TTL 5 min) → DB fallback
- Cache se invalidira kada se promijene permissioni role
- Dodaje "permission" claim-ove u `ClaimsPrincipal`
- Marker "permissions_transformed" sprečava duplikate

## OIDC aktivacija (za dev sa Keycloak-om)

Pogledati: `docs/how-to-enable-oidc.md`
