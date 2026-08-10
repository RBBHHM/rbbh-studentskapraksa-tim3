# ADR-004: CQRS sa MediatR — pipeline, validacija i thin-handler pattern

**Status:** Accepted  
**Kategorija:** A — Osnovna arhitektura  
**Owner:** Arhitekta  
**Datum donošenja:** Oktobar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako overhead Command+Handler+Validator trojke postane neprihvatljiv za jednostavne CRUD operacije  
**Zahvaćeni moduli:** Application, Infrastructure, Api  
**User Stories:** Sve — svaka korisničkа operacija prolazi kroz ovaj pipeline  

*Ova odluka konsoliduje ono što je ranije bilo dokumentovano u trima odvojenim zapisima: CQRS sa MediatR (ex-ADR-006), MediatR tri-slojni pipeline (ex-ADR-049) i thin-handler pattern (ex-ADR-084).*

---

## Kontekst

Application sloj mora distribuirati inbound zahtjeve prema odgovarajućoj poslovnoj logici uz konzistentnu primjenu cross-cutting concerns: logovanje svakog zahtjeva, validacija ulaznih podataka, i audit za operacije koje mijenjaju stanje. Bez centralizovanog mehanizma, svaki servis implementira ove aspekte ad-hoc s rizikom propuštanja.

Istovremeno, razlikujemo dvije kategorije operacija: one koje mijenjaju stanje (Commands) i one koje ga čitaju (Queries). Read modeli (lista narudžbi, detalji narudžbe, lista taskova) imaju drugačije optimizacijske potrebe od write operacija.

---

## Decision Drivers

- **Centralizovana primjena cross-cutting concerns** — logovanje, validacija i audit moraju biti primijenjeni konzistentno, bez oslanjanja na disciplinu svakog developera
- **Testabilnost** — svaki handler mora biti unit testabilan bez HTTP konteksta
- **Separation of Concerns** — handler ne treba znati kako se primjenjuje validacija ili kako se piše audit log
- **SRP na razini handlera** — jedan handler = jedan use case, bez rasta u "God Services"
- **Traceability zahtjeva** — svaka korisniška operacija treba biti logovana s vremenskim trajanjem

---

## Odluka

**CQRS kroz MediatR** s tri pipeline behaviora u fiksnom redoslijedu i thin-handler konvencijom.

### Pipeline behaviori (redoslijed je bitan)

```
Inbound request
    ↓
1. LoggingBehavior     — svaki request: START, END (sa Stopwatch trajanjem), FAILED (sa exception tipom)
    ↓
2. ValidationBehavior  — ako postoji IValidator<TRequest>: paralelna validacija svih validatora;
                         baca ValidationException(FieldErrors) s machine-readable kodovima
    ↓
3. AuditBehavior       — samo za IAuditableCommand: opt-in; ne svaki request
    ↓
Handler
```

**Zašto audit opt-in a ne svaki request:** Handleri delegiraju servise koji auditiraju s bogatijim kontekstom (entityId, oldValues, newValues, specifičan AuditAction). Pipeline audit bi producirao dualni, manje informativan event. Audit je eksplicitan, ne automatski.

### Thin-handler konvencija

Svaki handler ima 3–4 linije:
```csharp
public async Task<TResponse> Handle(TRequest request, CancellationToken ct)
    => await _service.OperationAsync(request.Field1, request.Field2, ct);
```

Sva logika živi u Infrastructure servisima koji imaju direktan pristup DbContext-u i ostalim zavisnostima. Handler je MediatR dispatch glue, ne lokacija poslovne logike.

### Command vs Query razdvajanje

- **Commands** (mutacije): `CreateOrderCommand`, `SubmitOrderCommand`, `ApproveFinalAppraisalCommand` — svaki vrši promjenu stanja, prolazi kroz sva 3 behaviora
- **Queries** (čitanje): `GetOrdersListQuery`, `GetOrderDetailQuery`, `GetMyTasksQuery` — ne prolaze kroz AuditBehavior; Infrastructure implementacija koristi `AsNoTracking()` upite

---

## Alternativna rješenja

| Opcija | Cross-cutting concerns | Testabilnost | Boilerplate | SRP | Zašto nije izabrana |
|--------|----------------------|-------------|-------------|-----|---------------------|
| **CQRS + MediatR** ✓ | Automatski kroz behaviore | Visoka | Visok | ✓ | — |
| Application Service sloj | Ručno po servisu | Srednja | Srednji | ✗ | Logging, validation, audit moraju biti eksplicitno dodani u svaki servis — propuštanje je samo pitanje vremena; God Services rastu |
| Direktni controller → service | Ručno po controlleru | Nizka | Nizak | ✗ | Cross-cutting concerns su razasuti; testiranje zahtijeva HTTP kontekst |
| Event Sourcing | Automatski | Visoka | Izuzetno visok | ✓ | Operativna složenost event store-a nije opravdana za ovaj opseg; rekonstrukcija stanja iz eventa je preskupa za bankarski sistem koji zahtijeva brze read upite |

---

## Consequences

### Pozitivne
- Novi developer koji doda handler automatski dobiva logging i validaciju bez ijedne linije dodatnog koda
- Svaki handler je testabilan bez HTTP konteksta — samo kreiraj handler, proslijedi command, asertuj rezultat
- `LoggingBehavior` bilježi svaki request s trajanjem — osnova za performance monitoring bez posebnog instrumentiranja
- Razdvajanje Commands od Queries otvara put ka zasebnoj optimizaciji read modela (npr. raw SQL za kompleksne liste) bez komplikovanja write puta

### Negativne
- Svaki novi use case zahtijeva minimum tri fajla: Command/Query klasa, Handler klasa, eventualno Validator. Za jednostavnu CRUD operaciju to je 2-3x više koda nego direktan controller pristup.
- Tracing izvršavanja koda kroz MediatR dispatch mehanizam zahtijeva razumijevanje pipeline-a — nije uvijek očigledno koji handler se poziva za dati command
- AuditBehavior koji je opt-in stvara mogućnost da developer zaboravi implementirati `IAuditableCommand` na operaciji koja bi trebala biti auditirana

### Svjesno prihvaćeni kompromisi
- Prihvatamo visok boilerplate (Command+Handler+Validator trojka) jer je alternative — God Services ili ad-hoc primjena cross-cutting concerns — skuplje u dugoročnom održavanju sistema koji ima regulatorne zahtjeve za konzistentnim auditom i validacijom.

---

## Tehnički dug

- Za jednostavne read operacije (npr. GetAllCodebooks) Command+Handler+Validator je overhead bez koristi — razmotriti minimalni CQRS profil ili direktne endpointe za trivijalne operacije

---

## Migration Impact

- **Breaking Changes:** Nije primjenjivo — inicijalna arhitektonska odluka
- **Rollback Plan:** Nije praktičan; MediatR je prožet kroz cijeli Application sloj
- **Compatibility:** MediatR 12.x (korišćen) ima manji API breaking change u odnosu na MediatR 11.x

---

## Kada revidirati

- Overhead trojke fajlova postane mjerljivo spor pri dodavanju novih feature-a (sprint velocity pada)
- Tim identificira klasu operacija koje ne trebaju nikakav cross-cutting concern i za njih je MediatR dispatch čisti overhead
