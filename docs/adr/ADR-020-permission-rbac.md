# ADR-020: Permission-based RBAC — claims-first model

**Status:** Accepted  
**Kategorija:** D — Sigurnost i autorizacija  
**Owner:** Arhitekta / Security Engineer  
**Datum donošenja:** Oktobar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako se uvede dinamično upravljanje permission-ima po korisniku (ne samo po ulozi)  
**Zahvaćeni moduli:** Api (policies), Infrastructure (IClaimsTransformation, UserPermissionService), Application (AppPermissions, RolePermissionMatrix)  
**User Stories:** Sve — svaki zaštićeni endpoint koristi ovaj model

*Ova odluka konsoliduje ex-ADR-008 (RBAC model) i ex-ADR-078 (IClaimsTransformation mehanizam).*

---

## Kontekst

Sistem ima 12 uloga s kompleksnim, preklapajućim dozvolama. AM, SM i UB imaju identičan skup dozvola ali moraju ostati zasebne uloge radi audit loga. CO i CA imaju djelomično preklapajuće dozvole. Administrator ima nadzorne dozvole koje se ne poklapaju s operativnim ulogama.

Čisto role-based autorizacija (`[Authorize(Roles = "CA")]`) ne može izraziti ove finozrnate razlike i nije proširiva bez promjene koda.

---

## Decision Drivers

- **Granularnost** — endpoint koji je dostupan i CA i CO ali ne i AM treba biti izražen kroz dozvolu, ne unijom rola
- **Bez DB poziva per-request** — autorizacijska provjera ne smije pozivati bazu podataka pri svakom HTTP zahtjevu
- **Statički model** — permission-rola mapping je stabilan i može biti definisan u kodu, ne bazi
- **Extensibility** — dodavanje novog permission-a ne smije zahtijevati promjenu infrastrukturne logike

---

## Odluka

**Permission claims ubrizgani u JWT** pri svakom requestu kroz dvostepenu `IClaimsTransformation`.

### Korak 1 — Sistemske uloge (statički, bez DB)

```csharp
// RolePermissionMatrix — SSOT za sistemske role
public static IReadOnlyList<string> GetPermissionsForRoles(IEnumerable<string> roles)
```

`Administrator` → ~50 permissions; `KolateralAdministrator` → ~30 permissions; etc.

### Korak 2 — Prilagođene uloge (IMemoryCache, 5 min TTL, DB fallback)

Za uloge koje nisu u `AppRoles.All` (prilagođene uloge kreirane kroz admin UI), permissions se dohvataju iz `role_permissions` tabele s 5 minuta TTL cache-om.

### TransformedMarker

`"permissions_transformed"` claim sprječava dvostruku transformaciju unutar iste sesije.

### Autorizacijske politike

Svaki permission se automatski registruje kao ASP.NET Core policy:
```csharp
// Auto-registracija u AuthorizationExtensions:
foreach (var perm in AppPermissions.All)
    options.AddPolicy(perm, p => p.RequireClaim("permission", perm));
```

Endpoint deklaracija:
```csharp
.RequireAuthorization(AppPermissions.OrdersCreate)
```

---

## Alternativna rješenja

| Opcija | DB poziv per-request | Granularnost | Dinamičnost | Zašto nije izabrana |
|--------|---------------------|-------------|------------|---------------------|
| **Permission claims (dvostepeno)** ✓ | ✗ (samo pri cache miss) | Visoka | 5 min lag | — |
| Role-based Authorize | ✗ | Niska (uloge, ne akcije) | ✓ | `[Authorize(Roles = "CA,CO")]` na svakom endpointu ne može izraziti finozrnate razlike; postaje neodrživо s 12 uloga |
| DB lookup per-request | ✓ | Visoka | ✓ Instant | DB latencija na svakom requestu; N+1 problem pri paralelnim zahtjevima |
| JWT embed permissions (u Keycloak tokenu) | ✗ | Visoka | Zahtijeva re-login | Keycloak mapper bi trebalo konfigurirati za svaki permission; složenija Keycloak konfiguracija; permissions su aplikacijska logika, ne Keycloak concern |

---

## Consequences

### Pozitivne
- Autorizacijska provjera je O(1) lookup u claims collection — nema DB poziva
- Dodavanje novog permission-a: (1) konstanta u `AppPermissions`, (2) dodaj u `RolePermissionMatrix`, (3) policy je automatski registrovana
- 50+ permission konstanti su compile-time provjerene — typo u policy imenu uhvaćen pri kompilaciji

### Negativne
- Promjena permission seta uloge ne reflektuje se odmah — korisnici s aktivnim sesijama vide stari set do sljedećeg refresh-a tokena (auth flow) ili do cache expiry-a (prilagođene uloge, 5 min)
- `RolePermissionMatrix` je kod koji mora biti održavan u sinhronizaciji s poslovnom dokumentacijom o dozvolama

### Svjesno prihvaćeni kompromisi
- Prihvatamo do 5 minuta kašnjenja pri promjeni permissiona za prilagođene uloge. Za sistemske uloge (promjena `RolePermissionMatrix`), promjena zahtijeva redeploy — korisnik mora se odjaviti i ponovo prijaviti. Za bankarski intranet s planiranim changeovima, ovo je prihvatljivo.

---

## Tehnički dug

- `RolePermissionMatrix` nema automatizovanu provjeru konzistentnosti s dokumentacijom o rolama
- Nema audit loga koji bilježi promjene permission matrice između deploya

---

## Migration Impact

- **Breaking Changes:** Promjena naziva postojećeg permission-a je breaking change — svi endpointi koji ga referenciraju i svi tokeni koji ga sadrže moraju biti ažurirani
- **Rollback Plan:** Dodavanje permission-a je backward-compatible; uklanjanje permission-a koji je korišćen na endpointu blokira pristup dok se endpoint ne ažurira
- **Compatibility:** `"permission"` claim format mora biti konzistentan između `IClaimsTransformation` i endpoint politika

---

## Kada revidirati

- Pojavi se zahtjev za per-user permission overrides (ne samo per-role) — tada `RolePermissionMatrix` nije dovoljan
- Tim identificira case gdje 5-min lag permission promjene uzrokuje poslovni problem
- Broj permission-a premaši ~100 — tada JWT token postaje prevelik
