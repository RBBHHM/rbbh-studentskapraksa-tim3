# ADR-024: Distribuirani rate limiting — selektivni per-endpoint pristup

**Status:** Accepted  
**Kategorija:** D — Sigurnost i autorizacija  
**Owner:** Arhitekta / Security Engineer  
**Datum donošenja:** Novembar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako se uvede horizontalno skaliranje API-ja (tada je Redis implementacija preduslov)  
**Zahvaćeni moduli:** Api (endpointi), Infrastructure (IDistributedRateLimiter, InMemoryDistributedRateLimiter)  
**User Stories:** Login flow, upload dokumenta, generisanje izvještaja

---

## Kontekst

Određeni endpointi su ranjivi na abuse: login endpoint (brute-force napadi), document upload (storage exhaustion), report generisanje (CPU exhaustion). Globalni rate limiter bi zaštitio sve endpointe ali bi uveo nepotrebno kašnjenje za benigne read operacije (GET narudžbi, GET šifarnika).

---

## Decision Drivers

- **Selektivna zaštita** — samo osjetljivi endpointi trebaju rate limiting; standardni read endpointi ne
- **Testabilnost** — rate limiter mora biti zamjenjiv u test okruženju
- **Multi-node ready** — in-memory implementacija je prihvatljiva za single-node; Redis implementacija mora biti dostupna za multi-node
- **Opt-in dizajn** — developer mora svjesno odlučiti da doda rate limiting, ne da ga zaboravi ukloniti

---

## Odluka

Dvostepena implementacija:

### Aplikacijski nivo — za ROPC login

`ASP.NET Core AddRateLimiter` s per-IP sliding window: 5 login pokušaja u 60 sekundi. Ovo je jedini global middleware rate limiter — specifično za login endpoint.

### Endpoint filter nivo — za ostale osjetljive endpointe

`RateLimitEndpointFilter : IEndpointFilter` korišćen kao `.AddEndpointFilter<RateLimitEndpointFilter>()` isključivo na identificiranim osjetljivim endpointima:
- `POST /api/documents/upload`
- `POST /api/orders/*/approve`
- `GET /api/reports/*`

**`IDistributedRateLimiter` port (ADR-005)**:
- `InMemoryDistributedRateLimiter` — development / single-node produkcija
- `RedisDistributedRateLimiter` — **nije implementiran** — preduslov za multi-node

---

## Alternativna rješenja

| Opcija | Granularnost | Dev experience | Multi-node | Testabilnost | Zašto nije izabrana |
|--------|-------------|---------------|-----------|-------------|---------------------|
| **Per-endpoint filter (opt-in)** ✓ | Visoka | Svjesna odluka | ✓ (uz Redis) | ✓ | — |
| Global middleware | Niska | Automatski | ✓ (uz Redis) | Parcijalna | Benigne GET operacije (lista narudžbi, šifarnici) ne trebaju rate limiting; uvodi nepotreban overhead |
| Nginx / API Gateway rate limiting | Visoka | Infrastrukturna odluka | ✓ Nativno | ✗ (infrastruktura) | Uvodi infrastrukturnu zavisnost; application-level throttling je bolje za domenski-specifična pravila |

---

## Consequences

### Pozitivne
- `GET /api/orders` (česta operacija) nema rate limiter overhead
- Developer koji dodaje novi sensitivan endpoint mora svjesno odlučiti o rate limiting-u — opt-in dizajn
- `IDistributedRateLimiter` port omogućava zamjenu implementacije bez promjene endpoint koda

### Negativne
- Opt-in dizajn znači da je moguće zaboraviti dodati rate limiter na novi osjetljivi endpoint
- `InMemoryDistributedRateLimiter` ne radi za multi-node — deploy više API instanci bez Redis-a znači da svaka instanca ima vlastiti counter

### Svjesno prihvaćeni kompromisi
- Prihvatamo `InMemoryDistributedRateLimiter` za single-node deployment. Za multi-node, `RedisDistributedRateLimiter` je preduslov — ali Redis uvodi novu infrastrukturnu zavisnost koja nije opravdana za current single-node deployment.

---

## Tehnički dug

🟢 **NIZAK PRIORITET**: Implementirati `RedisDistributedRateLimiter`:
```csharp
public sealed class RedisDistributedRateLimiter : IDistributedRateLimiter
{
    // INCR + EXPIRE pattern
}
```

Ovo je preduslov za horizontalno skaliranje API sloja.

---

## Migration Impact

- **Breaking Changes:** Nema za korisnike — rate limiting je transparentan (429 response)
- **Rollback Plan:** `AddEndpointFilter` može biti uklonjen bez promjene business logike
- **Compatibility:** `IDistributedRateLimiter` interfejs je stabilan; zamjena implementacije je DI konfiguracija

---

## Kada revidirati

- Planiranje multi-node API deploya — `RedisDistributedRateLimiter` postaje preduslov
- Monitoring pokaže da su benigne operacije usporene zbog neočekivanog rate limitinga
- Identifikuje se novi osjetljivi endpoint koji nedostaje na listi zaštićenih
