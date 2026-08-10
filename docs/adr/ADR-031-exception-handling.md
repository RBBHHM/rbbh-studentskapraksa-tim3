# ADR-031: Exception handling — hijerarhija i HTTP mapping

**Status:** Accepted  
**Kategorija:** E — Servisna arhitektura  
**Owner:** Arhitekta  
**Datum donošenja:** Oktobar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako se uvede novi HTTP status kod koji ne odgovara jednom od četiri tipa  
**Zahvaćeni moduli:** Application (exception klase), Api (GlobalExceptionHandler), Infrastructure  
**User Stories:** Sve — svaki error path

*Ova odluka konsoliduje ex-ADR-041 (Exception→HTTP mapping) i ex-ADR-083 (Exception hijerarhija).*

---

## Kontekst

Application i Infrastructure sloj moraju signalizirati različite kategorije grešaka prema Api sloju koji ih mapira u HTTP odgovore. Bez konzistentnog mehanizma, svaki servis implementira vlastito mapiranje s rizikom neujednačenog ponašanja prema klientima.

Bankarski klijenti (Blazor UI) trebaju konzistentan format odgovora koji mogu programatički procesirati — ProblemDetails RFC 7231 format.

---

## Decision Drivers

- **Konzistentnost** — isti tip greške uvijek producira isti HTTP status
- **Machine-readable** — klijent mora moći identificirati tip greške bez parsiranja poruke
- **Centralizacija** — jedno mjesto za mapiranje grešaka, ne u svakom endpointu
- **Audit za 403** — odbijeni pristup mora biti auditiran automatski

---

## Odluka

**Četiri tipa iznimki** s direktnom nasljednom linijom od `Exception`:

| Tip | HTTP | Kada se baca |
|-----|------|-------------|
| `NotFoundException` | 404 | Entitet ne postoji (narudžba, vještak, dokument) |
| `ConflictException` | 409 | Poslovna pravila ili nedozvoljeni workflow prijelaz |
| `ForbiddenException` | 403 | Autorizacijska provjera ne prolazi + automatski Security audit |
| `ValidationException` | 422 | Neispravni ulazni podaci (FluentValidation FieldErrors) |

Svi nasljeđuju direktno `Exception`. `InvalidStateTransitionException` mapira se na 409. Nema duboke hijerarhije.

**Svaki tip nosi `ErrorCode`** — upper-snake-case string za programmatičku identifikaciju:
```csharp
throw new ConflictException("Narudžba je već podnesena.", "ORDER_ALREADY_SUBMITTED");
```

`ValidationException` ima dual format: `FieldErrors` (per-field greške) i `Errors` (lista poruka) za backward kompatibilnost.

**`GlobalExceptionHandler : IExceptionHandler`** centralizovano mapira sve izuzetke:
```csharp
var (statusCode, ...) = exception switch
{
    NotFoundException e    => (404, ...),
    ConflictException e   => (409, ...),
    ForbiddenException e  => (403, ...),  // + Security audit
    ValidationException _ => (422, ...),
    BadHttpRequestException e => (e.StatusCode, ...),
    _                     => (500, ...)
};
```

RFC 7231 `ProblemDetails` JSON format + `errorCode` extension + `correlationId` extension.

`OperationCanceledException` se tiho ignoriše kada je uzrokovan request cancellationom (`httpContext.RequestAborted.IsCancellationRequested`) — ne producira log niti odgovor.

---

## Alternativna rješenja

| Opcija | Centralizovano | Audit za 403 | Machine-readable | Zašto nije izabrana |
|--------|---------------|-------------|-----------------|---------------------|
| **IExceptionHandler + 4 tipa** ✓ | ✓ | ✓ | ✓ ErrorCode | — |
| Results.Problem() per-endpoint | ✗ | ✗ (ručno) | Parcijalno | Duplira mapiranje logiku; svaki endpoint mora znati sve tipove grešaka |
| Hellang.Middleware.ProblemDetails | ✓ | ✗ (nema domain knowledge) | Parcijalno | Vanjska zavisnost za ono što ASP.NET Core nudi nativno od v8 |

---

## Consequences

### Pozitivne
- Svaki endpoint automatski dobiva konzistentno mapiranje grešaka bez ijedne linije koda
- `ForbiddenException` automatski triggerira Security audit event — nema mogućnosti zaboraviti audit pri odbijenom pristupu
- Frontend može programski reagovati na `errorCode` bez parsiranja poruke (koja se može mijenjati)

### Negativne
- 4 tipa iznimki moraju biti dostatna za sve scenarije — pojava scenarija koji se ne može izraziti s ova 4 tipa zahtijeva proširenje hijerarhije
- `OperationCanceledException` tihim gutanjem maskira potencijalne probleme — razlika između "user cancelled" i "timeout" nije vidljiva bez daljnje analize

### Svjesno prihvaćeni kompromisi
- Prihvatamo 4 tipa kao dovoljan set za ovaj opseg. Alternativa — dublja hijerarhija — uvodi kompleksnost bez stvarne koristi za klijenta koji svejedno treba reagovati samo na 4 HTTP statusa.

---

## Tehnički dug

- Nema. Hijerarhija je jednostavna i konzistentna kroz cijeli projekt.

---

## Migration Impact

- **Breaking Changes:** Promjena `ErrorCode` string vrijednosti je breaking change za klijente
- **Rollback Plan:** Nije primjenjivo
- **Compatibility:** `errorCode` field je extension u ProblemDetails — backward-compatible s klijentima koji ga ignorišu

---

## Kada revidirati

- Identifikuje se scenarij koji zahtijeva novi HTTP status kod (npr. HTTP 429 koji je već posebno tretiran kroz rate limiter)
- Frontend postavi zahtjev za bogatijim error modelom (npr. multiple root causes za jednu 409)
