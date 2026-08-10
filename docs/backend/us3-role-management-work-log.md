# US3 — Role Management i Obavještenja — Work Log

## 1. Kratak sažetak

U okviru US3 (Upravljanje rolama i obavještenjima) definirani su backend contracti, DTO-i, interfejsi i pravila za pregled korisnika i njihovih rola. Izabrana je provider/adapter arhitektura koja omogućava lokalni MVP bez Keycloak-a, uz mogućnost dodavanja novih izvora bez promjene Application sloja. Definisana su notification event pravila, razlika između audita i notifikacija, te kompletna dokumentacija za tim.

---

## 2. Lista kreiranih i dopunjenih fajlova

### Application sloj — novi fajlovi (skeleton/contract)

| Fajl | Lokacija | Svrha |
|---|---|---|
| `IUserRoleProvider.cs` | `src/Application/Users/` | Adapter za izvor korisnika i rola |
| `IUserRoleQueryService.cs` | `src/Application/Users/` | Query service — koordinira provider i izračun permissions |
| `UserRoleSourceItem.cs` | `src/Application/Users/Models/` | Sirovi podatak iz providera |
| `UserRoleListRequest.cs` | `src/Application/Users/Models/` | Request s filtrom, search, paginacijom |
| `UserRoleListItemDto.cs` | `src/Application/Users/Models/` | Lagani DTO za listu korisnika |
| `UserRolesDetailDto.cs` | `src/Application/Users/Models/` | Detaljan DTO s rolama i permissions |
| `UserAssignedRoleDto.cs` | `src/Application/Users/Models/` | Jedna rola s CanRemove i RemoveBlockedReason |
| `IRoleManagementNotificationService.cs` | `src/Application/Notifications/` | Interfejs za notifikacije o role promjenama |
| `RoleManagementNotificationEvent.cs` | `src/Application/Notifications/Models/` | Event model za notifikacije |

### Dokumentacija — novi fajlovi

| Fajl | Lokacija | Svrha |
|---|---|---|
| `us3-user-role-provider-decision.md` | `docs/backend/` | Decision dokument: trade-off analiza, izabrani pristup |
| `us3-role-management-notifications-rules.md` | `docs/backend/` | Kompletna pravila za US3 (BR, EC, contracti) |
| `us3-role-management-work-log.md` | `docs/backend/` | Ovaj fajl — mapa rada i lokacija |
| `us3-role-management-acceptance-checklist.md` | `docs/backend/` | Acceptance checklist |
| `us3-role-management-review-checklist.md` | `docs/backend/` | Review checklist za Hamzinu implementaciju |

### Postojeći fajlovi (pregledani, nisu mijenjani)

| Fajl | Lokacija | Status |
|---|---|---|
| `AppRoles.cs` | `src/Application/Security/` | ✅ Kompletno |
| `AppPermissions.cs` | `src/Application/Security/` | ✅ 17 permissions |
| `AppPolicies.cs` | `src/Application/Security/` | ✅ Kompletno |
| `RolePermissionMatrix.cs` | `src/Application/Security/` | ✅ Kompletno |
| `IRoleManagementService.cs` | `src/Application/Security/Interfaces/` | ✅ Skeleton postoji |
| `AuditActions.cs` | `src/Application/Audit/` | ✅ Sve audit akcije postoje |
| `role-permission-rules.md` | `docs/backend/` | ✅ Kompletno (codebooks.manage dopisan ranije) |
| `role-permission-work-log.md` | `docs/backend/` | ✅ Kompletno |

---

## 3. Šta je definisano

| Komponenta | Status |
|---|---|
| Role/permission policy provjera | ✅ ZAVRŠENO |
| IUserRoleProvider interfejs | ✅ Kreiran |
| IUserRoleQueryService interfejs | ✅ Kreiran |
| UserRoleSourceItem, UserRoleListRequest, DTO-i | ✅ Kreirani |
| IRoleManagementNotificationService | ✅ Kreiran |
| RoleManagementNotificationEvent | ✅ Kreiran |
| Provider/adapter decision dokument | ✅ Kreiran |
| Business rules BR-US3-01 do BR-US3-20 | ✅ Dokumentovano |
| Edge caseovi EC-US3-01 do EC-US3-24 | ✅ Dokumentovano |
| Notification event pravila | ✅ Dokumentovano |
| Audit vs notification razlika | ✅ Dokumentovano |
| Acceptance checklist | ✅ Kreiran |
| Review checklist | ✅ Kreiran |

---

## 4. Tok autorizacije za US3 read endpoint-e

```
GET /api/role-management/users
  │
  ├─ Bearer token obavezan → 401 ako nema
  ├─ PermissionClaimsTransformation → permission claims
  ├─ RequireAuthorization(AppPolicies.UsersView)
  │   → provjeri "permission" claim = "users.view"
  │   → 403 ako nema
  │
  ▼
IUserRoleQueryService.GetUsersWithRolesAsync(request)
  │
  ├─ Validira request.HasUnknownRoleFilter → 400 ako nepoznata rola
  │
  ├─ IUserRoleProvider.GetUsersWithRolesAsync(request)
  │   → LocalDatabaseUserRoleProvider (MVP)
  │   → PagedResult<UserRoleSourceItem>
  │
  ├─ Za svaki item:
  │   EffectivePermissions = RolePermissionMatrix.GetPermissionsForRoles(item.Roles)
  │   IsSupported po svakoj roli (AppRoles.All.Contains)
  │   CanRemove = poslovna logika (jedini admin, sistemska rola, itd.)
  │
  ▼
PagedResult<UserRoleListItemDto>  →  200 OK
```

---

## 5. Koji pristup je izabran i zašto

**Provider/Adapter arhitektura.**

Razlozi:
- Application sloj ne ovisi o bazi ni Keycloak-u (Clean Architecture / DIP)
- LocalDatabaseUserRoleProvider za MVP bez čekanja Keycloak-a
- KeycloakUserRoleProvider se dodaje bez promjene Application sloja (Open/Closed)
- Lako testiranje s mock providerom
- EffectivePermissions uvijek centralizovane u RolePermissionMatrix

Decision dokument: [us3-user-role-provider-decision.md](us3-user-role-provider-decision.md)

---

## 6. Šta ostaje Hamzi

- [ ] `LocalDatabaseUserRoleProvider` u `Infrastructure/Users/`
- [ ] `UserRoleQueryService` implementacija (Infrastructure ili Application)
- [ ] `NullRoleManagementNotificationService` u `Infrastructure/Notifications/`
- [ ] `GET /api/role-management/users` endpoint → `AppPolicies.UsersView`
- [ ] `GET /api/role-management/users/{userId}/roles` endpoint → `AppPolicies.UsersView`
- [ ] Registracija u `Infrastructure/DependencyInjection.cs`
- [ ] `POST /api/roles/assign`, `/remove`, `/transfer-admin` (ako su Hamzin task)

---

## 7. Šta ostaje Ernadu

- [ ] Potvrda: da li Keycloak Admin API može poslužiti kao `IUserRoleProvider` izvor
- [ ] Potvrda flat claim formata `"role": "Administrator"`
- [ ] Eventualna `KeycloakUserRoleProvider` implementacija ako je Keycloak source of truth
- [ ] JWT Bearer middleware konfiguracija (TODO postoji u `ServiceCollectionExtensions.cs`)

---

## 8. Šta ostaje frontend timu

- [ ] Ekran za pregled korisnika i njihovih rola
- [ ] Paginacija i search na UI-u
- [ ] Prikaz `CanRemove` / `RemoveBlockedReason` za akcijska dugmad
- [ ] Prikaz `EffectivePermissions`
- [ ] Notifikacijski toast/UI za role-management promjene

---

## 9. Šta ostaje QA timu

- [ ] Test case-ovi za EC-US3-01 do EC-US3-24
- [ ] 401/403/400/404 provjere za read endpoint-e
- [ ] Search case-insensitive provjera
- [ ] Paginacija provjera
- [ ] Multi-role edge cases
- [ ] CanRemove=false za posljednjeg Administratora

---

## 10. Kako novi član tima treba čitati dokumentaciju

```
1. us3-role-management-work-log.md          ← Ovaj fajl (brzi pregled)
2. us3-user-role-provider-decision.md       ← Zašto provider/adapter, trade-off analiza
3. us3-role-management-notifications-rules.md ← Sve BR pravila, EC edge case-ovi, contract
4. src/Application/Users/IUserRoleProvider.cs  ← Interface s komentarima
5. src/Application/Users/IUserRoleQueryService.cs ← Interface s komentarima
6. src/Application/Security/RolePermissionMatrix.cs ← Kako se računaju permissions
7. docs/backend/role-permission-rules.md    ← Sve role/permission matrice
```

---

## 11. Build status

Svi novi `.cs` fajlovi su kompajlirani: **0 grešaka, 0 upozorenja** (`dotnet build Application.csproj`).
Dokumentacija (`.md`) ne utječe na build.
