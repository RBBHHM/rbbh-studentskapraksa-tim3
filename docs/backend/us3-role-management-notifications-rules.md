# US3 — Upravljanje rolama i obavještenjima — Pravila i Edge Caseovi

## 1. User Story 3

**Kao administrator aplikacije, želim kreirati, pregledati i dodjeljivati role korisnicima, te dobijati jasna obavještenja o važnim promjenama, kako bih kontrolisao pristup podacima i sigurnost sistema.**

---

## 2. Scope ovog dokumenta

| U scopeu | Van scopea |
|---|---|
| Pregled korisnika i rola (read-only) | Keycloak konfiguracija (Ernad) |
| Provider/adapter arhitektura | Frontend ekran za upravljanje rolama |
| Request/response kontrakt | Frontend notifikacije |
| Permission pravila za pregled | Login redirect / defaultRoute |
| Search, filter, paginacija | QA testovi |
| Notification event pravila | Šifarnici / search US |
| Audit vs notification razlika | Kompletna assign/remove implementacija (Hamza) |
| Business rules BR-US3-01 do BR-US3-20 | |
| Edge caseovi EC-US3-01 do EC-US3-24 | |

---

## 3. Status role/permission policy provjere

Role/permission policy je ranije definisan (BE-ROLE-01) i status je:

**ZAVRŠENO** — svi fajlovi postoje:
- `AppRoles.cs` — tri role: Administrator, Unosnik, Verifikator
- `AppPermissions.cs` — 17 permission-a uključujući `users.view`, `roles.view`, `roles.assign`, `roles.remove`, `roles.transfer-admin`
- `AppPolicies.cs` — policy nazivi = permission konstante
- `RolePermissionMatrix.cs` — matrica sa `GetPermissionsForRoles()` metodom

Nema scope creep rola. Jedine role su Administrator, Unosnik, Verifikator.

Detaljna matrica: [role-permission-rules.md](role-permission-rules.md)

---

## 4. Pregled korisnika i rola

### Endpoint contract (Hamzina implementacija)

```
GET /api/role-management/users
→ AppPolicies.UsersView
→ IUserRoleQueryService.GetUsersWithRolesAsync(request)
→ PagedResult<UserRoleListItemDto>

GET /api/role-management/users/{userId}/roles
→ AppPolicies.UsersView
→ IUserRoleQueryService.GetUserRolesAsync(userId)
→ UserRolesDetailDto | 404
```

Alternativa ako projekat koristi drugačiji API prefiks: uskladiti s `api-standards.md`.

### Ovo je isključivo read-only pregled

Ovi endpointi ne mijenjaju role, ne dodjeljuju, ne uklanjaju. Samo čitaju.

---

## 5. Provider/Adapter arhitektura

```
GET /api/role-management/users
        │
        ▼
IUserRoleQueryService.GetUsersWithRolesAsync()
        │
        ├─ Validira request (Role filter, paginacija)
        ├─ Poziva IUserRoleProvider.GetUsersWithRolesAsync()
        │           │
        │           ▼
        │   Konkretan provider (Infrastruktura):
        │   LocalDatabaseUserRoleProvider (MVP)
        │   KeycloakUserRoleProvider (buduće)
        │   ExternalDatabaseUserRoleProvider (buduće)
        │
        ├─ Prima PagedResult<UserRoleSourceItem>
        ├─ Za svaki item:
        │   - EffectivePermissions = RolePermissionMatrix.GetPermissionsForRoles(item.Roles)
        │   - Označava nepoznate role kao IsSupported=false
        │   - Popunjava CanRemove / RemoveBlockedReason
        │   - Popunjava CanManageRoles
        ▼
PagedResult<UserRoleListItemDto>
```

---

## 6. Request i response kontrakt

### UserRoleListRequest

```csharp
Search   → pretraga po username, displayName, email (case-insensitive, trimovan)
Role     → filter po roli (mora biti AppRoles.All — nepoznata → 400)
IsActive → true/false/null (null = svi)
Page     → >= 1
PageSize → 1-100 (default 20)
```

### UserRoleListItemDto (lista)

```csharp
UserId              string
Username            string
DisplayName         string?
Email               string?
IsActive            bool
Roles               IReadOnlyList<string>
EffectivePermissions IReadOnlyList<string>
CanManageRoles      bool
```

### UserRolesDetailDto (detalj)

```csharp
UserId              string
Username            string
DisplayName         string?
Email               string?
IsActive            bool
Roles               IReadOnlyList<UserAssignedRoleDto>
EffectivePermissions IReadOnlyList<string>
```

### UserAssignedRoleDto

```csharp
Role                string
Label               string
IsSupported         bool
IsSystemRole        bool
CanRemove           bool
RemoveBlockedReason string?
```

---

## 7. Permission pravila za pregled

| Endpoint | Permission |
|---|---|
| `GET /api/role-management/users` | `users.view` |
| `GET /api/role-management/users/{userId}/roles` | `users.view` |

Administrator ima `users.view` i `roles.view` → ima pristup oba endpoinata.
Unosnik i Verifikator nemaju → 403 Forbidden.

---

## 8. Search, filter i paginacija

### Search

- Pretraži `username`, `displayName`, `email`
- Case-insensitive
- Input se trimuje
- Koristiti `ISearchNormalizer` ako postoji u projektu (postoji u `Infrastructure/Search/SearchNormalizer.cs`)
- Ne raditi in-memory search nad kompletnom tabelom — filter mora biti na bazi

### Filter po roli

- Samo poznate role iz `AppRoles.All`
- Nepoznata rola → 400 Bad Request
- Primjer poruke: "Nepoznata rola: 'Agent'. Dozvoljene role: Administrator, Unosnik, Verifikator."
- `UserRoleListRequest.HasUnknownRoleFilter` je helper property za ovu provjeru

### Paginacija

- Obavezna — ne vraćati sve korisnike bez paginacije
- ValidatedPage: ako Page < 1 → koristi 1
- ValidatedPageSize: ako PageSize < 1 ili > 100 → koristi 20
- Odgovor: `PagedResult<T>` s `TotalCount`, `Page`, `PageSize`, `Items`

---

## 9. Sensitive data pravila

Endpoint **ne smije vraćati**:
- password hash
- refresh token
- access token
- security stamp
- Keycloak client secret
- interne sistemske podatke

Endpoint **vraća samo**:
- userId, username, displayName, email (ako potreban)
- IsActive
- Roles, EffectivePermissions
- CanManageRoles, CanRemove, RemoveBlockedReason (UI helpers)

---

## 10. CanManageRoles i CanRemove logika

### CanManageRoles (na nivou liste)

```
true  ako: trenutni korisnik ima roles.assign ILI roles.remove
false ako: nema nijednog od ovih permission-a
```

### CanRemove (na nivou pojedinačne role)

```
false ako:
  - trenutni korisnik nema roles.remove permission
  - rola je Administrator I korisnik je jedini aktivni Administrator
  - rola je sistemska i zaključana
  - korisnik je neaktivan i promjene su blokirane
  - postoji drugo poslovno ograničenje

true  u svim ostalim slučajevima
```

> **VAŽNO:** `CanRemove=true` ne znači da remove uvijek uspijeva.
> Remove endpoint mora sam provjeriti sve poslovne uvjete.
> `CanRemove` je samo UI hint za prikaz/skrivanje dugmeta.

### RemoveBlockedReason primjeri

| Situacija | RemoveBlockedReason |
|---|---|
| Jedini Administrator | "Nije moguće ukloniti posljednjeg Administratora iz sistema." |
| Sistemska rola | "Ova rola je sistemska i ne može se ukloniti." |
| Korisnik neaktivan | "Korisnik je neaktivan. Izmjene rola nisu dozvoljene." |

---

## 11. Notification event pravila

Notification nije isti sistem kao audit. Audit je interni trag, notification je user-facing ili admin-facing poruka.

### Događaji

| EventType | Severity | Kada | Kome |
|---|---|---|---|
| `ROLE_ASSIGNED` | Info | Rola dodijeljena | Actor admin + target korisnik |
| `ROLE_REMOVED` | Info | Rola uklonjena | Actor admin + target korisnik |
| `ADMIN_ROLE_TRANSFERRED` | Critical | Admin rola prenesena | Actor + target + security kanal |
| `LAST_ADMIN_REMOVAL_BLOCKED` | Critical | Blokiran pokušaj uklanjanja posljednjeg admina | Actor admin + security kanal |
| `ROLE_CHANGE_BLOCKED` | Warning | Promjena blokirana (nije last admin) | Actor admin |
| `ROLE_CHANGE_FAILED` | Warning | Tehnička greška | Actor admin |

### Pravila slanja

- Ne slati duple notifikacije za isti `CorrelationId`
- Ne uključivati osjetljive podatke (tokeni, lozinke, hash-evi) u poruke
- Ako notification servis ne uspije → promjena role može ostati uspješna ali greška se mora logovati
- Critical eventi trebaju fallback ili retry logiku
- Pregled korisnika (`USER_ROLES_VIEWED`) se ne notificira — izbjegavati notification noise

### MVP: NullRoleManagementNotificationService

Za MVP se implementira null/stub servis koji samo loguje pozive ali ništa ne šalje.
Interfejs: `IRoleManagementNotificationService` (postoji u `Application/Notifications/`)

---

## 12. Audit vs Notification razlika

| Aspekt | Audit | Notification |
|---|---|---|
| Svrha | Interni trag, forenzika, compliance | Informisanje korisnika/admina |
| Kome | Internoj audit tabeli | Korisniku, adminu, security kanalu |
| Kada | Uvijek za osjetljive promjene | Po potrebi, kad pravilo to traži |
| Primjer | `IAuditService.RecordAsync(...)` | `IRoleManagementNotificationService.NotifyRoleAssignedAsync(...)` |
| Greška | Audit greška ne ruši operaciju | Notification greška ne ruši operaciju |
| Redundantnost | Svaka promjena | Samo relevantni eventi |

**Pravilo:** Za role-management promjene audit je obavezan ako audit sistem postoji. Notification je dodatni sloj.

Audit akcije u `AuditActions.cs`:
- `UserRoleAssigned` ✅
- `UserRoleRemoved` ✅
- `AdminRoleTransferred` ✅
- `LastAdminRoleRemovalBlocked` ✅

---

## 13. LocalDatabaseUserRoleProvider — MVP

Preporučena MVP implementacija. Implementira `IUserRoleProvider` i čita iz lokalne baze.

```
Infrastructure/Users/LocalDatabaseUserRoleProvider.cs
```

Minimalni read model:
- `Users` tabela: Id, Username, DisplayName, Email, IsActive
- `UserRoles` tabela: UserId, Role

Search se radi SQL-om (WHERE LIKE ili normalizovane kolone).
Paginacija SQL OFFSET/LIMIT.

**Hamza implementira ovo.**

---

## 14. Keycloak i External provider kao buduće opcije

### KeycloakUserRoleProvider

```
Infrastructure/Users/KeycloakUserRoleProvider.cs
```

- Application sloj NE smije zavisiti od Keycloak SDK-a
- Ernad treba potvrditi: da li Keycloak Admin API podržava search/filter po potrebi
- Napomena: Keycloak Admin API može imati paginacijska ograničenja

### ExternalDatabaseUserRoleProvider

```
Infrastructure/Users/ExternalDatabaseUserRoleProvider.cs
```

- Mapira eksterni model na `UserRoleSourceItem`
- Ako eksterni izvor ne podržava efikasan search, dokumentovati ograničenje
- Ne povlačiti ogromne skupove u memoriju

---

## 15. Business rules

| ID | Pravilo |
|---|---|
| BR-US3-01 | Pregled korisnika i njihovih rola je read-only funkcionalnost |
| BR-US3-02 | Pregled zahtijeva `users.view` permission |
| BR-US3-03 | Dodjela, uklanjanje i transfer rola nisu dio read-only pregleda |
| BR-US3-04 | Application sloj ne smije zavisiti od konkretne baze ili Keycloak-a |
| BR-US3-05 | Konkretan izvor korisnika implementira se kroz `IUserRoleProvider` |
| BR-US3-06 | Provider vraća korisničke podatke i role, ali ne računa permission-e |
| BR-US3-07 | Effective permissions se računaju centralno putem `RolePermissionMatrix` |
| BR-US3-08 | Lista korisnika mora biti paginirana |
| BR-US3-09 | Search mora biti case-insensitive |
| BR-US3-10 | Endpoint ne smije vraćati osjetljive korisničke podatke |
| BR-US3-11 | Nepoznata rola ne smije srušiti sistem i ne daje permission-e |
| BR-US3-12 | Korisnik s više rola dobija zbir permission-a bez duplikata |
| BR-US3-13 | `CanManageRoles` i `CanRemove` su UI pomoćna polja, nisu sigurnosna zaštita |
| BR-US3-14 | Osjetljive role-management promjene moraju biti auditirane ako audit postoji |
| BR-US3-15 | Role-management promjene trebaju notification event ako notification sistem postoji |
| BR-US3-16 | Admin transfer je critical notification event |
| BR-US3-17 | Pokušaj uklanjanja posljednjeg Administratora mora biti blokiran, auditiran i označen critical/warning |
| BR-US3-18 | Notification ne zamjenjuje audit |
| BR-US3-19 | Za MVP se preporučuje `LocalDatabaseUserRoleProvider` |
| BR-US3-20 | Keycloak i vanjske baze se dodaju kroz nove providere bez promjene Application sloja |

---

## 16. Edge caseovi

| ID | Scenarij | Očekivanje |
|---|---|---|
| EC-US3-01 | Admin s `users.view` pregleda listu | Paginirana lista korisnika i rola |
| EC-US3-02 | Korisnik bez `users.view` pokušava pregled | 403 Forbidden |
| EC-US3-03 | Zahtjev bez tokena | 401 Unauthorized |
| EC-US3-04 | Page < 1 | 400 Bad Request ili ValidatedPage=1 prema API standardu |
| EC-US3-05 | PageSize > 100 | 400 ili ValidatedPageSize=20 prema API standardu |
| EC-US3-06 | Search s velikim/malim slovima | Case-insensitive rezultat |
| EC-US3-07 | Filter po nepoznatoj roli (`"Agent"`) | 400 Bad Request |
| EC-US3-08 | Korisnik ima više rola | Sve role prikazane, permissions sabrani bez duplikata |
| EC-US3-09 | Korisnik ima nepoznatu rolu | `IsSupported=false`, bez permission-a za tu rolu |
| EC-US3-10 | Korisnik nema nijednu rolu | Prazne `Roles` i `EffectivePermissions` liste |
| EC-US3-11 | Korisnik je neaktivan | `IsActive=false`, role vidljive, `CanRemove` po pravilima |
| EC-US3-12 | Korisnik ne postoji | 404 Not Found |
| EC-US3-13 | Korisnik je jedini aktivni Administrator | `CanRemove=false` za Administrator rolu, `RemoveBlockedReason` objašnjava |
| EC-US3-14 | Frontend sakrije remove, neko ručno pozove API | Remove endpoint sam odbija — nije problem read endpointa |
| EC-US3-15 | Provider nije dostupan | Standardizovana 500 greška i logovanje |
| EC-US3-16 | Eksterni provider ne podržava filter po roli | Dokumentovati ograničenje; ne učitavati ogromne skupove |
| EC-US3-17 | Provider vrati duple role | Query service uklanja duplikate |
| EC-US3-18 | Provider vrati null role listu | Tretirati kao praznu listu |
| EC-US3-19 | Role assigned event se generiše | Audit + notification event ako sistem postoji |
| EC-US3-20 | Role removed event se generiše | Audit + notification event ako sistem postoji |
| EC-US3-21 | Admin role transferred | Critical audit + critical notification event |
| EC-US3-22 | Pokušaj uklanjanja posljednjeg Administratora | Blokirano, auditirano, warning/critical notification event |
| EC-US3-23 | Notification servis ne uspije nakon uspješne promjene | Promjena ostaje uspješna, greška se loguje |
| EC-US3-24 | Dupli notification event za isti correlationId | Ne slati duplikate ako sistem podržava deduplikaciju |

---

## 17. Šta Hamza implementira

- `LocalDatabaseUserRoleProvider` u `Infrastructure/Users/`
- `UserRoleQueryService` implementacija (može biti u Infrastructure ili Application)
- `NullRoleManagementNotificationService` u `Infrastructure/Notifications/`
- `GET /api/role-management/users` endpoint
- `GET /api/role-management/users/{userId}/roles` endpoint
- Registracija u `Infrastructure/DependencyInjection.cs`
- Konkretne assign/remove/transfer endpoint-e (po potrebi i zadatku)

---

## 18. Šta Ernad potvrđuje

- Da li Keycloak Admin API podržava search/filter koji odgovara potrebama
- Flat claim format `"role": "Administrator"` (potvrđen za PermissionClaimsTransformation)
- Da li se Keycloak koristi kao source of truth za korisnike ili lokalna baza

---

## 19. Šta nije dio ovog taska

- Login redirect i `defaultRoute` (auth user story)
- `/api/me` `availableModules` (auth user story)
- Frontend ekran za upravljanje rolama
- Frontend notifikacije
- Keycloak realm konfiguracija
- QA testovi
- Šifarnici
- Search user story
