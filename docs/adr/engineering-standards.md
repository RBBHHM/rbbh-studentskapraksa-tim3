# Inženjerski standardi i tehničke konvencije

> Ove odluke su premještene iz ADR kataloga jer predstavljaju **implementacijske detalje i inženjerske konvencije**, ne arhitektonske odluke koje definišu strukturu sistema.  
> Arhitektonske odluke → [README.md](README.md)

---

## Šta čini inženjerski standard (za razliku od ADR-a)?

Inženjerski standard je **implementacijska odluka** koja:
- Ne mijenja strukturu sistema ako se promijeni
- Nema alternativa koje bi vodile do materijalno različitih arhitektura
- Može biti promijenjena bez utjecaja na druge slojeve sistema
- Predstavlja "kako implementiramo X", ne "zašto koristimo X"

---

## A. Persistencija i EF Core

### ES-001: EF Core snake_case mapping (ex-ADR-065)

Eksplicitni `HasColumnName("snake_case")` na svakom EF Core property-u. Nema `EFCore.NamingConventions` NuGet paketa.

**Razlog**: Eksplicitni mapping daje bolji uvid u stvarne nazive kolona pri pisanju migracija. NamingConventions plugin može maskirati neočekivane konvencije.

**Primjer**:
```csharp
builder.Property(x => x.OrderNumber).HasColumnName("order_number");
```

---

### ES-002: AsNoTracking za read-only EF upite (ex-ADR-089)

Svi read-only upiti (GET handleri, query servisi) koriste `.AsNoTracking()`.

**Razlog**: EF Core change tracker overhead eliminiran za upite koji ne vrše izmjene.

**Izuzetak**: Upiti unutar transakcija koje vrše izmjene moraju pratiti entitete.

---

### ES-003: JSONB za audit diff storage (ex-ADR-068)

`OldValues`, `NewValues` i `ChangedFields` kolone u `audit_logs` tabeli su `HasColumnType("jsonb")`.

**Razlog**: PostgreSQL JSONB podržava GIN indeksiranje, server-side JSON operacije i kompresiju. Alternativa `text` nema ni jednu od ovih prednosti.

**Napomena**: Ovo vezuje audit storage za PostgreSQL — svjesno prihvaćeno.

---

### ES-004: Child entity query filter nasljeđuje IsDeleted od parent-a (ex-ADR-067)

```csharp
builder.HasQueryFilter(x => x.AppraisalOrder == null || !x.AppraisalOrder.IsDeleted);
```

**Razlog**: Child entiteti (TaskItem, OrderProtocolEntry) nemaju vlastitu `IsDeleted` kolonu ali ne smiju biti vidljivi uz soft-deleted parent.

**Zamka**: `IgnoreQueryFilters()` preskače ovaj filter — koristi s oprezom u administrative upitima.

---

## B. API i HTTP

### ES-005: Health check konfiguracija (ex-ADR-044)

Četiri domenski specijalizovana health check-a:

| Check | Endpoint | Šta provjerava |
|-------|---------|----------------|
| `DatabaseHealthCheck` | `/api/health/db` | PostgreSQL ping |
| `MigrationHealthCheck` | `/api/health/db` | Nema pending migracija |
| `FileStorageHealthCheck` | `/api/health/storage` | Disk write + 1GB threshold |
| `KeycloakHealthCheck` | `/api/health/auth` | OIDC well-known endpoint, 5s timeout |

---

### ES-006: Correlation ID propagacija (ex-ADR-043)

`CorrelationIdMiddleware` prihvata `X-Correlation-ID` header s max 64 karaktera; generira novi Guid ako nije prisutan.

**Razlog**: 64-char limit sprječava log injection napad s dugim header vrijednostima.

---

### ES-007: OpenAPI samo u Development (ex-ADR-080)

`AddOpenApi()` i `MapOpenApi()` registrovani samo u `Development` environment-u.

**Razlog**: OpenAPI endpoint u produkciji otkriva API strukturu potencijalnim napadačima.

**Alat**: Korišćen je `Microsoft.AspNetCore.OpenApi` (built-in od ASP.NET Core 9) umjesto Swashbuckle-a.

---

### ES-008: PagedResult format (ex-ADR-087)

Svi list endpointi vraćaju `PagedResult<T>` s 1-based page indexingom:

```csharp
public sealed class PagedResult<T>
{
    public IReadOnlyList<T> Items { get; init; }
    public int TotalCount { get; init; }
    public int Page { get; init; }       // 1-based
    public int PageSize { get; init; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasPreviousPage => Page > 1;
    public bool HasNextPage => Page < TotalPages;
}
```

---

### ES-009: Stabilni machine-readable validation error codes (ex-ADR-042)

`ValidationFieldError(Field, Code, Message)` gdje `Code` dolazi iz `ValidationErrorCodes` konstanti (upper-snake-case). Jednom definirani Code nikad ne mijenja svoju vrijednost — breaking change za frontend.

---

## C. Domenski model

### ES-010: Razrješavanje primarne uloge — RolePriorityResolver (ex-ADR-025)

Korisnik može imati više uloga u JWT. `RolePriorityResolver` deterministički bira primarnu:

```
Administrator (100) > KolateralOficir (45) > KolateralAdministrator (40)
> AM/SM/UB (20) > Vještak (8) > PravnaSluzba (5) > Protokol (3) > Likvidatura (2) > SpecijalniRacuni (1)
```

Korisnici s 2+ uloga trebaju `/select-role` stranicu — `RolePriorityResolver` je fallback za sistemski kontekst.

---

### ES-011: AM/SM/UB dijeljeni permission set (ex-ADR-026)

Permission set za AM, SM i UB je identičan. Definisan jednom kao `ProdajaSegmentPermissions` u `RolePermissionMatrix`:

```csharp
[AppRoles.AM] = ProdajaSegmentPermissions,
[AppRoles.SM] = ProdajaSegmentPermissions,
[AppRoles.UB] = ProdajaSegmentPermissions,
```

**Razlog**: Tri odvojene uloge postoje radi audit loga (ko je inicirao narudžbu). Prava su identična.

---

### ES-012: AppraisalOrderStatusGroups domenski koncept (ex-ADR-031)

`AppraisalOrderStatusGroups.ActiveAppraisalStatuses` — statična lista 8 statusa koji označavaju narudžbu u aktivnoj fazi vještačenja. Korišćena za provjeru kapacitetnih ograničenja vještaka.

**Razlog**: Lista se koristi na više mjesta — SSOT sprječava divergenciju.

---

### ES-013: int primarni ključ za sve entitete (ex-ADR-082)

Sve entiteti nasljeđuju `BaseEntity` s `int Id` auto-increment PK. GUID PK nisu korišćeni.

**Razlog**: Intranet sistem s predvidivim brojem entiteta; `int` je kompaktan, effikasan za B-tree indekse, i čitljiv u URL-ovima.

**Kompromis**: `int` nije siguran za distribuirani sistemi s globalnim uniqueness zahtjevima — prihvatljivo za ovaj opseg.

---

### ES-014: Deaktivacija šifarnika — specifičan soft delete pattern (ex-ADR-039)

| Situacija | Ponašanje |
|-----------|-----------|
| Vrijednost nikad nije korištena | Fizičko brisanje dozvoljeno |
| Vrijednost je korištena u narudžbama | Samo deaktivacija (`IsActive = false`) |
| Deaktivirana u dropdown-u | Ne prikazuje se za nove unose |
| Deaktivirana na starim narudžbama | Prikazuje se (historijska vrijednost) |

`ICodebookUsageChecker` registry (OCP pattern) određuje da li je šifarnik korišćen.

---

### ES-015: Audit trail direktno na entitetu (ex-ADR-040)

`CodebookValue` i slični entiteti s direktnim admin pristupom nose `CreatedByUserId`, `CreatedAt`, `LastModifiedByUserId`, `LastModifiedAt` direktno na entitetu.

**Razlog**: Administrator treba direktno u UI vidjeti ko je promijenio šifarnik bez pretraživanja audit loga.

---

### ES-016: Invarijanta — minimalno jedan administrator (ex-ADR-036)

Brisanje ili suspenzija posljednjeg Administrator naloga nije dozvoljeno. Provjera u service sloju baca `ConflictException("LAST_ADMIN")` → HTTP 409.

**Razlog**: Bez admina nije moguće upravljati korisnicima — sistem postaje nezaključan (locked out).

---

### ES-017: ICodebookUsageChecker OCP registry (ex-ADR-079)

Plugin pattern za provjeru korišćenosti šifarnik vrijednosti:
```csharp
public interface ICodebookUsageChecker
{
    string CodebookKey { get; }
    Task<bool> IsValueInUseAsync(int valueId, CancellationToken ct);
}
```
Novi šifarnik = nova klasa + DI registracija. Nema promjena `CodebookService`.

---

## D. Sigurnost

### ES-018: X-Active-Role header konvencija (ex-ADR-051)

`X-Active-Role` header prihvata se i koristi **isključivo** za audit log kontekst (`ActorActiveRole` polje). Nikad se ne koristi za autorizacijske odluke.

**Razlog**: Header nije kriptografski potpisan — napadač ga može postaviti na bilo šta. Permissions iz JWT-a su jedini autoritet.

---

### ES-019: OrderAuthorizationGuard implementacija (ex-ADR-030)

`OrderAuthorizationGuard` cross-cutting servis proverava:
- Da li korisnik ima permission za traženu akciju
- Da li korisnik ima pristup konkretnoj narudžbi (vlasništvo/assignment)

Pri odbijanju: emituje Security/AccessDenied audit event + baca `ForbiddenException`.

---

## E. Frontend — Blazor

### ES-020: Hide vs Gray — UI vidljivost na osnovu permissiona (ex-ADR-033)

| Situacija | Ponašanje |
|-----------|-----------|
| Korisnik nema permission za modul/akciju | **Sakriva se** |
| Polje postoji ali nije izmjenjivo po poslovnom pravilu | **Onemogućeno (gray)** |
| Direktan URL/API bez permissiona | **403 od backend-a** |

**Napomena**: Sakrivanje u UI nije sigurnosna mjera. Backend mora provjeravati svaki zahtjev.

---

### ES-021: Fail-fast + inline validacija (ex-ADR-034)

Greška se prikazuje pri napuštanju polja (onBlur). Inline poruka ispod konkretnog polja. Pop-up/toast samo za sistemske greške. HTTP 422 mapira se na inline poruke per-polje.

**Napomena**: Frontend validacija je UX mjera, ne zamjena za backend validaciju.

---

### ES-022: Role-based redirect i /select-role stranica (ex-ADR-035)

| Situacija | Ponašanje |
|-----------|-----------|
| 1 uloga | Direktan redirect na role-specifičan dashboard |
| 2+ uloge | `/select-role` stranica (eksplicitni izbor) |
| Bez uloge | Poruka: "Nemate dodijeljena ovlaštenja." |
| Nepoznata uloga | Poruka: "Vaša uloga nije prepoznata." |

---

### ES-023: Podrška za bosanska slova + case-insensitive pretraga (ex-ADR-037)

- Validatori koriste Unicode regex `[\p{L}\p{M}\s\-'.]+`
- PostgreSQL pretraga koristi `ILIKE`
- Baza kreirana s UTF-8 collation (`en_US.utf8`)

**Kompromis**: `ILIKE` onemogućava standardni B-tree indeks za pretragu — prihvatljivo za predviđeni volumen.

---

### ES-024: UI Design Tokens (ex-ADR-057)

| Token | Vrijednost | Pravilo |
|-------|-----------|---------|
| CTA / primarna dugmad | Žuta (#FEE600) | RBI brand boja |
| Success | Zelena | **Samo** za uspješne akcije |
| Warning | Amber | **Samo** za upozorenja |
| Error/Danger | Crvena | **Samo** za greške i destruktivne akcije |
| Border radius kartice | 8px | Konzistentno kroz UI |

**Pravilo**: Boje uvijek nose semantičko značenje — nisu dekoracija.

---

### ES-025: MudBlazor kao UI Design System (ex-ADR-017)

MudBlazor je primarna UI biblioteka. Vlastite reusable komponente u `Components/Shared/` i `Components/Orders/`.

**Razlog**: Jedina Blazor-native open-source biblioteka s kompletnim enterprise komponent setom (DataGrid, Dialog, Snackbar, Form...).

---

## F. Keycloak i autorizacija

### ES-026: Keycloak URL split za Docker okruženje (ex-ADR-073)

Keycloak ima javni URL (`http://localhost:8080`) i Docker-interni URL (`http://keycloak:8080`).

- `MetadataAddress = keycloakInternal` za server-side OIDC discovery
- `ValidIssuers` prihvata oba URL-a
- `OnRedirectToIdentityProvider` zamjenjuje interni hostname s javnim za browser redirect

**Razlog**: Bez razdvajanja, ili server ne može dosegnuti Keycloak (ako se koristi javni URL) ili browser dobiva neresolvabili redirect (ako se koristi Docker interni URL).

---

### ES-027: IClock apstrakcija za testove (ex-ADR-014)

```csharp
public interface IClock { DateTime UtcNow { get; } }
// SystemClock (produkcija): DateTime.UtcNow
// FakeClock (testovi): fiksni 2026-01-15 10:00:00 UTC
```

**Razlog**: Direktni `DateTime.UtcNow` pozivi čine testove koji asertuju SLA rokove nedeterminističnim.

**Napomena**: FakeClock s fiksnim datumom ne oponaša prolaz vremena — testovi koji trebaju vremensku razliku moraju eksplicitno manualno pomjerati sat.

---

### ES-028: Document download audit (ex-ADR-063)

Svaki download i preview dokumenta auditiran je: userId, documentId, versionNumber, IP, timestamp.

Preview se auditira odvojeno od download-a (`Content-Disposition: attachment` za download, bez za preview).

---

*Ovaj dokument reflektuje inženjerske konvencije koje su primijenjene u projektu. Konvencije se mogu mijenjati kroz tim dogovor bez formalnog ADR procesa, za razliku od arhitektonskih odluka.*
