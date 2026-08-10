# ADR-018: EF migracije — in-process strategija pri startapu

**Status:** ⚠ Needs Review  
**Kategorija:** C — Persistencija  
**Owner:** Arhitekta / DevOps  
**Datum donošenja:** Oktobar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Prije prvog multi-instance produkcijskog deploya — migration init container je preduslova  
**Zahvaćeni moduli:** Infrastructure (migracije), Api (startup), Docker  
**User Stories:** Operativni zahtjev — nije direktno vezan za korisničke priče

---

## Kontekst

EF Core migracije moraju biti primijenjene na bazu podataka pri svakom deploymentu koji sadrži nove migracije. Postoje tri strategije: u samom procesu API-ja pri startapu, u zasebnom init containeru prije pokretanja API-ja, ili kroz CI/CD pipeline.

Za inicijalni razvoj i single-instance deployment, in-process migracija je najjednostavnija. Za produkcijski multi-instance deployment, ona nije sigurna.

---

## Decision Drivers

- **Razvojni komfor** — developer ne treba ručno pokretati migracije; `docker compose up` dovodi bazu u ispravno stanje
- **Self-sufficient deployment** — Docker compose stack mora biti self-sufficient bez ručnih operativnih koraka
- **Multi-instance safety** — race condition između dvije instance koje paralelno primjenjuju iste migracije mora biti spriječen

---

## Odluka

`ApplyMigrationsAsync()` poziva se u `Program.cs` prije `app.Run()`. Seeder failures su **ne-fatalni** — API ostaje funkcionalan čak i ako seeding ne uspije (API može raditi s praznim šifarnicima u degradiranom modu).

```csharp
// Program.cs
await app.ApplyMigrationsAsync();  // Samo za relacijske DB; InMemory preskače
app.Run();
```

Za InMemory provider (testovi): `db.Database.EnsureCreatedAsync()` umjesto `MigrateAsync()`.

**Poznati problem**: EF Core `MigrateAsync()` nema built-in distribuirani lock — dvije API instance koje se pokreću istovremeno mogu paralelno pokušati primijeniti iste migracije. PostgreSQL advisory lock interno koristi EF Core tokom migracije za single-node, ali to nije garantirano za multi-instance.

---

## Alternativna rješenja

| Opcija | Self-sufficient | Multi-instance safe | Operativna složenost | Zašto nije izabrana / status |
|--------|----------------|--------------------|--------------------|------------------------------|
| **In-process startup** ✓ | ✓ | ✗ Race condition | Niska | Korišćeno — adekvatno za current single-node |
| Migration init container | ✓ | ✓ | Srednja | Preporuka za multi-instance produkciju — nije implementirano |
| CI/CD migration step | Parcijalno | ✓ | Visoka (CI/CD kompleksnost) | Zahtijeva pristup produkcijskoj bazi iz CI/CD okruženja — sigurnosni concern |
| Flyway / Liquibase | ✓ | ✓ | Srednja (tool integracija) | Uvodi alat koji nije .NET-native; EF Core migracije su već u projektu |

---

## Consequences

### Pozitivne
- `docker compose up` → aplikacija je odmah u ispravnom stanju s primijenjenim migracijama
- Seeder failures ne blokiraju startanje API-ja — bankarski šifarnici su potrebni ali ne kritični za sve operacije

### Negativne
- **Multi-instance deploymentu nije siguran** — dvije instance koje se pokreću paralelno mogu kreirati race condition pri primjeni migracija
- Startup time se povećava za trajanje migracije pri svakom pokretanju (zanemarivo za migracije ali vidljivo za veliki seeder)

### Svjesno prihvaćeni kompromisi
- Prihvatamo ovaj pristup za development i single-node deployment. Za produkciju s više instanci, migration init container je neophodan preduslov.

---

## Tehnički dug

🟠 **VISOK PRIORITET**: Implementirati migration init container kao zasebni Docker Compose service koji:
1. Pokretanje: `dotnet ef database update`
2. Čeka na uspješan izlaz
3. API instance se pokreću tek nakon što init container uspješno završi

Ovo je preduslov za horizontalno skaliranje.

---

## Migration Impact

- **Breaking Changes:** Nema za current single-node setup
- **Rollback Plan:** EF Core `MigrationBuilder.DropTable()` u Down() metodi svake migracije. NAPOMENA: Down() metode moraju biti implementirane i testovane.
- **Compatibility:** `MigrateAsync()` je idempotentna — može biti pozvana više puta na već-migriranoj bazi bez grešaka

---

## Kada revidirati

- Odmah pri planiranju multi-instance produkcijskog deploya — migration init container je **preduslov**, ne optimizacija
- Ako startup time postane mjerljiv problem zbog broja migracija
