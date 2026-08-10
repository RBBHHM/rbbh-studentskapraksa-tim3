# BE-SEARCH-01 — Case-Insensitive Pretraga

**Verzija:** 1.0  
**Status:** Implementirano (scaffold — čeka entitete)  
**Odgovornost:** Amina (arhitektura, normalizacija, provider), Hamza (per-entitet integracija)

---

## 1. Uvod i kontekst

Aplikacija mora podržavati pretragu entiteta (klijenti, nekretnine, zahtjevi) na način koji je:

- **Case-insensitive**: "sarajevo" = "SARAJEVO" = "Sarajevo"
- **Dijakritički svjesno** (NE accent-insensitive): "Šarić" ≠ "Saric"
- **Performansno**: ne učitava tabele u memoriju, koristi indekse
- **SQL injection sigurno**: parametrizovani upiti, ne string interpolacija
- **Provider-agnostično**: Application sloj ne zna koji DB se koristi
- **Centralizirano**: jedna implementacija normalizacije, ne rasuta po servisima

---

## 2. Zašto dijakritički svjesno, a ne accent-insensitive

Accent-insensitive pretraga (NFD + uklanjanje diakritika) izjednačava znakove koji su
u bosanskom/hrvatskom/srpskom jeziku semantički različiti:

| Accent-insensitive (POGREŠNO) | Dijakritički svjesno (ISPRAVNO) |
|---|---|
| "Šarić" = "Saric" | "Šarić" ≠ "Saric" |
| "Čović" = "Covic" | "Čović" ≠ "Covic" |
| "Đokić" = "Dokic" | "Đokić" ≠ "Dokic" |

Pretraga po imenu i prezimenu mora razlikovati ove slučajeve — iste osobe s i bez
diakritika su različite osobe u matičnim knjigama i pravnim dokumentima.

---

## 3. Algoritam normalizacije

### 3.1 Slobodni tekst (Text)

```
input → Trim() → Unicode FormC → ToUpperInvariant → stored/searched value
```

| Korak | Opis | Primjer |
|---|---|---|
| Trim | Ukloni vodeće/završne razmake | `" Šarić "` → `"Šarić"` |
| FormC | Kanonska kompozicija (konzistentni diakritici) | `"Ś"` → `"Š"` |
| ToUpperInvariant | Velika slova, invariant culture | `"šarić"` → `"ŠARIĆ"` |

**Rezultat**: `"ŠARIĆ"` (diakritici sačuvani, verzija i razmaci eliminirani)

### 3.2 Identifikatori (Identifier)

```
input → Trim() → zadržati samo cifre → stored/searched value
```

| Primjer unosa | Normalizirano |
|---|---|
| `"13-01-1990-1234-5"` | `"130119901234 5"` → `"1301199012345"` |
| `"4200 123 456 789"` | `"4200123456789"` |
| `"  1234567890  "` | `"1234567890"` |

Primjena: JMBG, porezni broj, matični broj, registarski broj.

---

## 4. Normalized kolone — pattern

Svaki entitet koji podržava pretragu treba dedicated normalized kolone:

```
Entity tabela:
├── name           VARCHAR(200)   — originalna vrijednost (prikazuje se korisniku)
├── name_search    VARCHAR(200)   — normalizirana verzija (za pretragu)
├── jmbg           VARCHAR(20)    — originalni JMBG
└── jmbg_search    VARCHAR(13)    — samo cifre (za pretragu)
```

### Pravila za normalized kolone:

1. **Uvijek popunjavati** pri INSERT i UPDATE koristeći `ISearchNormalizer`
2. **Uvijek indeksirati** — bez indeksa pretraga je puna table scan
3. **Nikad direktno mijenjati** iz koda izvan servisa koji je odgovoran za entitet
4. **B-tree indeks** dovoljan za Prefix i Exact mod
5. Za Contains mod razmotriti GIN full-text indeks ako tabela ima milione zapisa

```csharp
// EF Core konfiguracija (primjer):
builder.Property(x => x.NameSearch)
       .HasColumnName("name_search")
       .HasMaxLength(200)
       .IsRequired(false);

builder.HasIndex(x => x.NameSearch)
       .HasDatabaseName("ix_clients_name_search");
```

```csharp
// Popunjavanje pri upisu (primjer):
entity.NameSearch = _normalizer.NormalizeText(request.Name);
entity.JmbgSearch = _normalizer.NormalizeIdentifier(request.Jmbg);
```

---

## 5. SearchMode — načini pretrage

| Mod | SQL | Indeks | Primjena |
|---|---|---|---|
| `Exact` | `= 'VALUE'` | Da (B-tree) | JMBG, porezni broj, šifra |
| `Prefix` | `LIKE 'VALUE%'` | Da (B-tree) | Autocomplete, pretraga po početku |
| `Contains` | `LIKE '%VALUE%'` | Ne | Slobodna substring pretraga |

**Preporuka**: koristiti `Prefix` gdje je moguće — jedini mode koji koristi B-tree indeks
i time je efikasan i na velikim tabelama.

---

## 6. SearchFieldType — tipovi polja

| Tip | Normalizacija | Primjena |
|---|---|---|
| `Text` | `NormalizeText` (FormC + upper) | Ime, naziv, adresa |
| `Identifier` | `NormalizeIdentifier` (samo cifre) | JMBG, porezni broj |
| `Number` | Nema (buduća impl.) | Iznos, količina |
| `Date` | Nema (buduća impl.) | Datum nastanka, rok |

---

## 7. Tok pretrage (end-to-end)

```
1. API prima SearchRequest (Page, PageSize, Criteria[])
        ↓
2. Service provjerava permission filtre (npr. createdByUserId filter)
        ↓
3. Service poziva ISearchProvider.ApplySearchFilters(query, criteria, fieldRules)
        ↓
4. EFSearchProvider:
   a) Za svaki criterion pronađi SearchFieldRule po FieldName
   b) Normalizuj Value prema FieldType (NormalizeText ili NormalizeIdentifier)
   c) Gradi LINQ Expression predicate (AND logika)
   d) Primjeni na IQueryable
        ↓
5. Service: CountAsync (total) + Skip/Take + ToListAsync
        ↓
6. Vraća PagedResult<T>
```

---

## 8. Permission filtering

`ISearchProvider` **ne primjenjuje** permission filtere.
Servis koji poziva provajder je odgovoran za primjenu permission filtera **prije** search filtera.

### Pravilo primjene filtera:

```csharp
// ISPRAVNO — permission filter PRIJE search filtera
var query = _db.Records.AsNoTracking();

// 1. Permission filter
if (!_currentUser.HasPermission(AppPermissions.RecordsViewAll))
    query = query.Where(r => r.CreatedByUserId == _currentUser.UserId);

// 2. Search filter
query = _searchProvider.ApplySearchFilters(query, request.Criteria, RecordSearchFields.All);

// 3. Paginacija
var total = await query.CountAsync(ct);
var items = await query.Skip(request.Offset).Take(request.ValidatedPageSize).ToListAsync(ct);
```

### Zašto permission filter ide prvi:

- Manji skup podataka za search skeniranje
- Korisnik ne može vidjeti podatke kojima nema pristup ni kroz pretragu
- CountAsync vraća samo ukupan broj zapisa dostupnih korisniku

---

## 9. Paginacija

```json
GET /api/clients?page=2&pageSize=20&criteria[0].fieldName=name&criteria[0].value=sara&criteria[0].mode=Prefix
```

```json
{
  "items": [...],
  "totalCount": 47,
  "page": 2,
  "pageSize": 20,
  "totalPages": 3,
  "hasPreviousPage": true,
  "hasNextPage": true
}
```

**Default page size**: 20  
**Maksimalni page size**: 100 (zaštita od preopterećenja)  
**Validacija**: vrijednosti izvan raspona se normaliziraju (ne odbacuju se s greškom)

---

## 10. SQL injection sigurnost

`EFSearchProvider` gradi LINQ Expression koji EF Core prevodi u parametrizovani SQL:

```sql
-- SIGURNO (generiše EF Core):
SELECT * FROM clients WHERE name_search LIKE @p0   -- @p0 = '%SARA%'

-- NESIGURNO (zabranjeno):
SELECT * FROM clients WHERE name_search LIKE '%' + @input + '%'
-- Ili još gore:
var sql = $"SELECT * FROM clients WHERE name LIKE '%{term}%'";
```

`Expression.Constant(value)` u LINQ Expression-u → SQL parametar, ne string concatenacija.

---

## 11. Kako dodati pretragu za novi entitet

### Korak 1 — Dodaj normalized kolone u entitet

```csharp
// Domain/Entities/Client.cs
public string? NameSearch   { get; private set; }
public string? JmbgSearch   { get; private set; }
```

### Korak 2 — Definiši SearchFieldRule listu

```csharp
// Application/Features/Clients/ClientSearchFields.cs
public static class ClientSearchFields
{
    public static readonly IReadOnlyList<SearchFieldRule> All =
    [
        new SearchFieldRule
        {
            FieldName            = "name",
            NormalizedColumnName = "NameSearch",
            FieldType            = SearchFieldType.Text,
            AllowedModes         = [SearchMode.Prefix, SearchMode.Contains]
        },
        new SearchFieldRule
        {
            FieldName            = "jmbg",
            NormalizedColumnName = "JmbgSearch",
            FieldType            = SearchFieldType.Identifier,
            AllowedModes         = [SearchMode.Exact, SearchMode.Prefix]
        }
    ];
}
```

### Korak 3 — Popuni normalized kolone pri upisu

```csharp
// U Command handleru ili servisu
entity.NameSearch = _normalizer.NormalizeText(request.Name);
entity.JmbgSearch = _normalizer.NormalizeIdentifier(request.Jmbg);
```

### Korak 4 — Dodaj indekse u EF konfiguraciju

```csharp
// Infrastructure/Persistence/Configurations/ClientConfiguration.cs
builder.HasIndex(x => x.NameSearch).HasDatabaseName("ix_clients_name_search");
builder.HasIndex(x => x.JmbgSearch).HasDatabaseName("ix_clients_jmbg_search");
```

### Korak 5 — Koristi u servisu/repozitoriju

```csharp
var query = _db.Clients.AsNoTracking();

// Permission filter
if (!_currentUser.HasPermission(AppPermissions.UsersView))
    throw new ForbiddenException();

// Search
query = _searchProvider.ApplySearchFilters(query, request.Criteria, ClientSearchFields.All);

var total = await query.CountAsync(ct);
var items = await query
    .OrderBy(c => c.NameSearch)
    .Skip(request.Offset)
    .Take(request.ValidatedPageSize)
    .Select(c => new ClientDto(c.Id, c.Name, c.Jmbg))
    .ToListAsync(ct);

return new PagedResult<ClientDto>
{
    Items      = items,
    TotalCount = total,
    Page       = request.ValidatedPage,
    PageSize   = request.ValidatedPageSize
};
```

---

## 12. Raspodjela odgovornosti

| Odgovornost | Ko |
|---|---|
| ISearchNormalizer, ISearchProvider, modeli (SearchRequest, PagedResult...) | Amina ✅ |
| EFSearchProvider implementacija | Amina ✅ |
| Per-entitet SearchFieldRule definicije | Hamza (pri implementaciji entiteta) |
| Normalized kolone + indeksi u EF konfiguraciji | Hamza |
| Popunjavanje normalized kolona pri INSERT/UPDATE | Hamza |
| API endpoint validacija SearchRequest parametara | Hamza |
| QA: pretraga s diakritičkim znakovima | QA team |
| QA: paginacija edge cases (prazni rezultati, poslednja stranica) | QA team |

---

## 13. TODO

- [ ] **Hamza**: implementirati per-entitet SearchFieldRule kada se definiraju entiteti
- [ ] **Hamza**: dodati normalized kolone i indekse u EF migracije
- [ ] **Hamza**: popunjavati normalized kolone pri svim INSERT/UPDATE operacijama
- [ ] **Buduće**: Number i Date pretraga (raspon vrijednosti)
- [ ] **Buduće**: Full-text pretraga za Contains mod na velikim tabelama (PostgreSQL GIN indeks)
- [ ] **Buduće**: Višejezična normalizacija ako se doda engleski UI

---

## 14. Poslovne greške i edge cases

| Situacija | Ponašanje |
|---|---|
| Nepoznato FieldName u kriteriju | Tiho preskočiti (bez greške) |
| Nedozvoljeni SearchMode za polje | Tiho preskočiti |
| Prazna Value u kriteriju | Tiho preskočiti (ne primjenjivati filter) |
| Null Criteria lista | Vraća sve zapise (uz permission filter) |
| PageSize > 100 | Normalizuje se na 100 |
| Page < 1 | Normalizuje se na 1 |
| Nema rezultata | Vraća prazan PagedResult (TotalCount = 0), ne 404 |
| Korisnik nema dozvolu | ForbiddenException (403) — servis je odgovoran, ne provider |

---

## 15. Zabranjeni obrasci

```csharp
// ZABRANJENO — kopira logiku normalizacije, nije konzistentno
.Where(x => x.Name.ToLower().Contains(searchTerm.ToLower()))

// ZABRANJENO — učitava cijelu tabelu u memoriju
var all = await _db.Clients.ToListAsync();
var filtered = all.Where(c => c.Name.Contains(term));

// ZABRANJENO — SQL injection rizik
var sql = $"SELECT * FROM clients WHERE name LIKE '%{term}%'";
_db.Database.ExecuteSqlRaw(sql);

// ZABRANJENO — direktna EF Core zavisnost u Application sloju
.Where(x => EF.Functions.ILike(x.Name, pattern))

// ZABRANJENO — hardkodovana normalizacija po servisu
var normalized = input.ToUpperInvariant();  // ne koristi ISearchNormalizer
```
