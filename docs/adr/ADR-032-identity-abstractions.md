# ADR-032: ICurrentUserService vs IUserRoleProvider — dvije identity apstrakcije

**Status:** Accepted  
**Kategorija:** E — Servisna arhitektura  
**Owner:** Arhitekta  
**Datum donošenja:** Novembar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako se promijeni izvor identitetskih podataka (zamjena Keycloak-a)  
**Zahvaćeni moduli:** Application (interfejsi), Infrastructure (implementacije), svi servisi  
**User Stories:** Sve — oba interfejsa se koriste u svakom servisu koji treba identity kontekst

---

## Kontekst

Sistem treba dva različita tipa identitetskih podataka s potpuno različitim karakteristikama:

1. **"Ko sam ja?"** — trenutni korisnik, njegova uloga, njegovi permissions. Ovi podaci su dostupni iz JWT claims — sinhrono, u O(1), bez ijednog poziva prema vanjskim servisima.

2. **"Ko su svi korisnici u ovoj ulozi?"** — potrebno za role fan-out notifikacije, upravljanje ulogama, pregled korisnika. Ovi podaci se nalaze isključivo u Keycloak-u — zahtijevaju HTTP poziv prema Keycloak Admin API.

Bez eksplicitne podjele na dva interfejsa, developeri bi mogli pokušati koristiti isti interfejs za oba scenarija — što bi ili uvelo nepotrebni HTTP poziv na svakom requestu, ili limitiralo funkcionalnost koja zahtijeva listu korisnika.

---

## Decision Drivers

- **Performance** — autorizacijska provjera ("ima li ova osoba permission?") ne smije pozivati HTTP endpointe
- **Explicitnost** — jasna razlika između "moji podaci" i "podaci o svim korisnicima" mora biti vidljiva u tipu interfejsa
- **Testabilnost** — `ICurrentUserService` mora biti trivijalno mockabilan u testovima; `IUserRoleProvider` može biti stubovan

---

## Odluka

Dva odvojena interfejsa s jasno različitim karakteristikama:

| | `ICurrentUserService` | `IUserRoleProvider` |
|--|----------------------|---------------------|
| **Izvor** | JWT claims (`IHttpContextAccessor`) | Keycloak Admin REST API |
| **Lifetime** | Scoped (per-request) | Scoped (per-request) |
| **Brzina** | Sinhrono, O(1) | Async, HTTP latencija ~100ms |
| **Vrsta** | "Ja" | "Svi korisnici" |
| **Koristi se za** | Audit userId, autorizacijska provjera, `CreatedByUserId` | Role fan-out, upravljanje ulogama, pregled korisnika |
| **Pri nedostupnosti Keycloak-a** | Nema efekta | HTTP greška |

```csharp
// ICurrentUserService — sinhrono, uvijek dostupno dok je JWT validan:
string UserId { get; }
string? ActiveRole { get; }
bool IsAuthenticated { get; }
bool HasPermission(string permission);

// IUserRoleProvider — async, Keycloak API poziv:
Task<PagedResult<UserRoleSourceItem>> GetUsersWithRolesAsync(UserRoleListRequest request, CancellationToken ct);
Task<UserRoleSourceItem?> GetUserWithRolesAsync(string userId, CancellationToken ct);
```

---

## Alternativna rješenja

| Opcija | DB/HTTP per-request | Performanse | Eksplicitnost | Zašto nije izabrana |
|--------|--------------------|-----------|--------------|--------------------|
| **Dva odvojena interfejsa** ✓ | ✗ za ICurrentUser | Visoke za auth | ✓ | — |
| Jedan interfejs s oba scenarija | Da (uvijek HTTP za sve operacije) | Niske | ✗ | Svaka autorizacijska provjera bi čekala na Keycloak — neprihvatljiva latencija |
| DB tabela korisnika (lokalna kopija) | Nije potrebno | Visoke | Parcijalna | Sinkronizacija s Keycloak-om je kompleksna; risk divergencije između lokalnih i Keycloak podataka |

---

## Consequences

### Pozitivne
- Autorizacijska provjera u svakom servisu je O(1) — `_user.HasPermission("orders.create")` je lookup u claims
- Testovi koji trebaju samo "ko je korisnik" mockuju `ICurrentUserService` s 3 linije koda — nema potrebe za stubovanjem HTTP poziva
- Tip interfejsa je dokumentacija — developer koji vidi `IUserRoleProvider` u servisu zna da taj servis radi HTTP poziv

### Negativne
- Keycloak Admin API poziv u `IUserRoleProvider` nema retry logiku niti circuit-breaker — Keycloak downtime direktno propagira kao greška u endpointima koji koriste `IUserRoleProvider`
- Podaci u JWT-u mogu biti zastarjeli (do token expiry) — `ICurrentUserService` vraća JWT claim vrijednosti, ne live Keycloak stanje

### Svjesno prihvaćeni kompromisi
- Prihvatamo zastarjelost JWT claims (do isteka tokena) jer alternativa — DB poziv per-request — narušava performance. Za bankarski intranet gdje token traje tipično 15-30 minuta, ovo je prihvatljivo.

---

## Tehnički dug

- `IUserRoleProvider` implementacija nema retry ni circuit-breaker — Keycloak nedostupnost uzrokuje 500 greške
- `GetUsersWithRolesAsync` poziva Keycloak Admin API koji nema caching — pri role fan-out notifikacijama (N korisnika u ulozi), N HTTP poziva prema Keycloak-u

---

## Migration Impact

- **Breaking Changes:** Promjena oba interfejsa je breaking za sve konzumente
- **Rollback Plan:** Nije primjenjivo — ovo je fundamentalna decision o identity apstrakcijama
- **Compatibility:** Nema

---

## Kada revidirati

- Zamjena Keycloak-a s drugim IdP-om koji ima drugačiji Admin API — `IUserRoleProvider` implementacija mora biti zamijenjena
- Identifikuje se potreba za caching-om `IUserRoleProvider` odgovora (npr. za role fan-out s velikim brojem korisnika)
