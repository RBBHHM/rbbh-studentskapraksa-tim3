# US3 — Decision Dokument: Provider/Adapter Arhitektura za Pregled Korisnika i Rola

## 1. Problem

User Story 3 zahtijeva da Administrator može pregledati korisnike i njihove trenutne role. Sistem treba podržavati testiranje na lokalnoj bazi (MVP), a u budućnosti moći raditi s Keycloak-om kao identitetskim providerom ili s vanjskom bazom. Direktno vezivanje Application sloja za konkretan izvor podataka bi ograničilo fleksibilnost i otežalo testiranje.

---

## 2. Ciljevi

| Cilj | Prioritet |
|---|---|
| Modularnost — laka zamjena izvora podataka | Visok |
| Testabilnost — Application sloj se može testirati s mock providerom | Visok |
| Nezavisnost od baze (Clean Architecture) | Visok |
| Lokalni MVP za demonstraciju | Visok |
| Podrška za Keycloak kao buduće rješenje | Srednji |
| Podrška za vanjsku bazu | Srednji |
| Performanse (paginacija, search na izvoru) | Visok |
| SOLID principi | Visok |
| Jasna podjela odgovornosti | Visok |

---

## 3. Razmatrane opcije

### Opcija A: Lokalna baza only

Application sloj direktno zavisni od `ApplicationDbContext` → čita `Users` i `UserRoles` tabele.

**Prednosti:**
- Najjednostavnija MVP implementacija
- Brz search i paginacija

**Mane:**
- Application sloj zavisi od Infrastructure → narušava Clean Architecture
- Kod se mora mijenjati ako se doda Keycloak
- Nema apstrakcije → teže za testiranje

**Rizici:**
- Zaključanost na EF Core i PostgreSQL
- Svaka promjena u bazi dira Application sloj

**Dobra za:** kratki demo bez planiranja rasta.

---

### Opcija B: Keycloak only

Application sloj poziva Keycloak Admin API direktno ili putem biblioteke.

**Prednosti:**
- Keycloak je source of truth za korisnike
- Native podrška za role u Keycloak-u

**Mane:**
- Application zavisi od Keycloak SDK → narušava DIP
- Keycloak Admin API ima ograničenja za search i paginaciju
- Nema lokalnog testiranja bez Keycloak-a
- Ernad treba konfigurirati Keycloak, a MVP ne smije čekati

**Rizici:**
- API rate limiting
- Keycloak dostupnost
- Teže za unit testiranje

**Dobra za:** projekte gdje je Keycloak od prvog dana source of truth.

---

### Opcija C: Hibridni read model

Lokalna baza drži read model koji se sinhronizira s Keycloak-om.

**Prednosti:**
- Brz search i paginacija
- Nezavisnost od Keycloak dostupnosti
- Application sloj radi s lokalnim modelom

**Mane:**
- Potrebna sinhronizacija (event-driven ili scheduled)
- Složenost implementacije
- Rizik nekonzistentnosti između izvora

**Rizici:**
- Sinhronizacijski bug može rezultirati neispravnim role podacima
- Dva mjesta za update

**Dobra za:** skalabilne produkcione sisteme s visokim zahtjevima za performansama.

---

### Opcija D: Provider/Adapter model ✅ (IZABRANA)

Application sloj definiše `IUserRoleProvider` interfejs. Infrastructure sloj implementira konkretne providere. `IUserRoleQueryService` kordinira logiku.

**Prednosti:**
- Application sloj potpuno neovisan od izvora (DIP)
- MVP: `LocalDatabaseUserRoleProvider` za brz razvoj
- Keycloak: dodaje se `KeycloakUserRoleProvider` bez promjene Application sloja
- Vanjska baza: dodaje se `ExternalDatabaseUserRoleProvider` isto tako
- Testabilnost: mock provider u unit testovima
- Open/Closed: novi izvor = novi adapter, postojeći kod se ne mijenja
- Jasna odgovornost: provider donosi podatke, query service tumači

**Mane:**
- Malo više fajlova
- Dodatan sloj apstrakcije

**Rizici:**
- Minimalni ako se drži jednostavno
- Provider može biti bottleneck ako ne podržava efikasan filter/search

**Dobra za:** sve scenarije gdje se izvor podataka može mijenjati ili kombinovati.

---

## 4. Decision matrix

| Opcija | Modularnost | Testabilnost | Performanse | MVP | Keycloak | Ext. baza | Održavanje | Složenost | Preporuka |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
| A: Lokalna baza | 2 | 3 | 5 | 5 | 2 | 2 | 3 | 1 | Demo, ne dugoročno |
| B: Keycloak | 3 | 2 | 3 | 2 | 5 | 2 | 3 | 4 | Ako Keycloak odmah |
| C: Hibrid | 4 | 4 | 5 | 3 | 4 | 3 | 3 | 5 | Dugoročno, složeno |
| **D: Provider/Adapter** | **5** | **5** | **4** | **4** | **5** | **5** | **5** | **3** | **Preporučeno** |

*Skala 1-5, 5=bolje*

---

## 5. Konačna odluka

**Izabrana opcija: D — Provider/Adapter arhitektura**

Za US3 se koristi provider/adapter arhitektura. Application sloj definiše `IUserRoleProvider` i `IUserRoleQueryService`, a Infrastructure sloj implementira konkretan izvor podataka. Za MVP se koristi `LocalDatabaseUserRoleProvider`. Keycloak i External provajderi se dodaju kroz nove adaptere bez promjene poslovne logike.

---

## 6. Posljedice odluke

| Posljedica | Napomena |
|---|---|
| Application sloj ostaje nezavisan od baze | DIP je ispunjen |
| Effective permissions centralizovane u RolePermissionMatrix | Provider ih ne računa |
| Hamza implementira LocalDatabaseUserRoleProvider za MVP | Brz razvoj bez čekanja Keycloak-a |
| Ernad potvrđuje Keycloak format i eventualni Keycloak provider | Nema blokade za MVP |
| Nova baza = novi adapter | Nema promjene Application sloja |
| IUserRoleQueryService može biti u Application ili Infrastructure | Preporučeno: Infrastructure, jer zavisi od IUserRoleProvider implementacije |

---

## 7. Šta ova odluka ne znači

- **Ne znači** da se sada implementiraju svi provideri
- **Ne znači** da Application zavisi od Keycloak-a ili EF Core-a
- **Ne znači** da se assign/remove/transfer implementiraju u ovom tasku
- **Ne znači** da lokalna baza zauvijek mora biti source of truth
- **Ne znači** da se sada gradi hibridni read model s Keycloak sinhronizacijom

---

## 8. Minimalni read model za LocalDatabaseUserRoleProvider (MVP)

```sql
-- Tabela korisnika (prijedlog za MVP)
Users:
  Id          VARCHAR / UUID  PK
  Username    VARCHAR         NOT NULL, UNIQUE
  DisplayName VARCHAR         NULL
  Email       VARCHAR         NULL
  IsActive    BOOLEAN         NOT NULL DEFAULT true
  CreatedAt   TIMESTAMP       NOT NULL

-- Tabela korisničkih rola
UserRoles:
  UserId  VARCHAR  FK → Users.Id
  Role    VARCHAR  NOT NULL
  PK (UserId, Role)

-- Indeksi za performanse
idx_users_username      (Username)
idx_users_email         (Email)
idx_users_is_active     (IsActive)
idx_userroles_userid    (UserId)
idx_userroles_role      (Role)
```

Ovo je prijedlog read modela. Hamza implementira konkretnu strukturu.

---

## 9. Keycloak provider — napomene za Ernada

- Keycloak Admin API može imati rate limiting i paginacijska ograničenja
- Keycloak search može biti ograničen ovisno o verziji i konfiguraciji
- `KeycloakUserRoleProvider` ide u Infrastructure sloj — Application ne smije zavisiti od Keycloak SDK-a
- Ernad treba potvrditi: da li Keycloak drži iste role ili se koristi lokalna baza kao authority?
- Flat claim format `"role": "Administrator"` je potvrđen za PermissionClaimsTransformation

---

## 10. Referentni fajlovi

| Fajl | Lokacija |
|---|---|
| `IUserRoleProvider.cs` | `src/Application/Users/` |
| `IUserRoleQueryService.cs` | `src/Application/Users/` |
| `UserRoleSourceItem.cs` | `src/Application/Users/Models/` |
| `UserRoleListRequest.cs` | `src/Application/Users/Models/` |
| `UserRoleListItemDto.cs` | `src/Application/Users/Models/` |
| `UserRolesDetailDto.cs` | `src/Application/Users/Models/` |
| `UserAssignedRoleDto.cs` | `src/Application/Users/Models/` |
