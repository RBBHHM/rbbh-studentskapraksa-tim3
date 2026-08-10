# ADR-017: Direktan EF Core bez Repository pattern

**Status:** Accepted  
**Kategorija:** C — Persistencija  
**Owner:** Arhitekta  
**Datum donošenja:** Oktobar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako se uvede potreba za zamjenom EF Core-a s drugim ORM-om ili raw SQL pristupom  
**Zahvaćeni moduli:** Infrastructure (svi servisi koji koriste ApplicationDbContext)  
**User Stories:** Sve — svaka operacija s bazom prolazi kroz DbContext

---

## Kontekst

Da li Infrastructure servisi trebaju koristiti `ApplicationDbContext` direktno, ili intermedijarni Repository sloj koji apsrahira pristup bazi?

Repository pattern je popularan u .NET ekosistemu, no EF Core `DbContext` već implementira Unit of Work i Repository pattern interno. Dodavanje još jednog sloja Repository-a je potencijalni "leaky abstraction" koji skriva EF Core specifičnosti bez realne koristi.

---

## Decision Drivers

- **Iskorištenost EF Core mogućnosti** — kompleksni JOIN upiti, projekcije, eager loading su prirodno izraženi kroz `IQueryable<T>` bez omotavanja
- **Testabilnost** — EF Core InMemory provider omogućava unit/integracijsko testiranje bez mockiranja Repository-a
- **Jednostavnost** — jedan sloj manje znači manje koda za maintainirati

---

## Odluka

Infrastructure servisi direktno konzumiraju `ApplicationDbContext`. Servis je odgovoran za vlastite upite, ne shared repository.

```csharp
// Direktno u servisu:
var order = await _db.AppraisalOrders
    .AsNoTracking()
    .Include(x => x.TaskItems)
    .FirstOrDefaultAsync(x => x.Id == orderId, ct);
```

**Testiranje**: EF Core InMemory provider korišćen u svim unit i integracijskim testovima. WebApplicationFactory koristi `UseInMemoryDatabase` za integracijsko testiranje Api sloja.

**Napomena o raw SQL**: Dvije infrastructure klase koriste raw SQL koji nije kompatibilan s InMemory provajderom:
- `ProtocolService` (atomski UPSERT za protokolni broj)
- `OrderNumberGenerator` (COUNT — vidi ADR-015, problem u toku rješavanja)

Testovi za ove servise mockaju interfejse (`IProtocolService`) umjesto direktnog testiranja.

---

## Alternativna rješenja

| Opcija | EF Core pristup | Testabilnost | Boilerplate | Zamjenjivost ORM-a | Zašto nije izabrana |
|--------|----------------|-------------|-------------|-------------------|---------------------|
| **Direktan DbContext** ✓ | Pun | InMemory provider | Minimalan | Zavisi od EF Core API-ja | — |
| Generic Repository\<T\> | Ograničen (IQueryable "leaks") | Mock IRepository | Visok | Teorijska (u praksi i dalje EF-specific) | Generic Repository ne može izraziti domain-specific upite bez proliferacije custom metoda; leaky abstraction jer IQueryable curinja EF specifičnosti |
| Specific Repositories | Dobar | Mock IXxxRepository | Visok | Parcijalna | N repository klasa za N entiteta; svaka promjena upita zahtijeva promjenu interfejsa i implementacije |

---

## Consequences

### Pozitivne
- Kompleksni upiti s višestrukim JOIN-ovima, `.Select()` projekcijama i `AsNoTracking()` optimizacijama prirodno su izraženi bez omotavanja
- `ApplicationDbContext` je jedina infrastrukturna zavisnost za testove koji koriste InMemory provider
- Nema dupliranja — svaki upit je napisan jednom u Infrastructure servisu koji ga posjeduje

### Negativne
- Infrastructure servisi direktno ovise o EF Core API-ju — zamjena ORM-a zahtijeva promjenu svih servisa (ali zamjena EF Core-a na .NET projektu nije realni scenarij)
- Raw SQL dijelovi (UPSERT, pg_try_advisory_lock) nisu testabilni kroz InMemory provider — zahtijevaju mockirane interfejse

### Svjesno prihvaćeni kompromisi
- Prihvatamo direktnu zavisnost Infrastructure sloja na EF Core jer alternative (Generic Repository) ne nude stvarnu apstrakciju — EF Core specifičnosti (AsNoTracking, Include, ExecuteSqlRaw) i dalje bi "curljale" kroz Repository interfejs. Jedina stvarna korist Repository-a bila bi unificiran interfejs za zamjenu ORM-a, što nije plan za ovaj projekt.

---

## Tehnički dug

- Nema. Ova odluka ne uvodi tehnički dug — direktna je i konzistentna kroz cijeli Infrastructure sloj.

---

## Migration Impact

- **Breaking Changes:** Nije primjenjivo
- **Rollback Plan:** Nije primjenjivo — ovo je početna arhitektonska odluka
- **Compatibility:** EF Core 9.x; upgrade na 10.x ne zahtijeva promjenu ovog pristupa

---

## Kada revidirati

- Tim odluči uvesti Dapper za specifične high-performance upite uz EF Core — tada treba konzistentna strategija za hibridni pristup
- Zamjena PostgreSQL-a s bazom koja nema dobru EF Core podršku (malo vjerojatno)
