# ADR-027: SLA enforcement — distribuirani background scheduler

**Status:** ⚠ Needs Review  
**Kategorija:** E — Servisna arhitektura  
**Owner:** Arhitekta / DevOps  
**Datum donošenja:** Decembar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Prije multi-instance produkcijskog deploya  
**Zahvaćeni moduli:** Infrastructure (AppraiserTimeoutService, AppraiserAcceptanceTimeoutService)  
**User Stories:** US-1 (vještak ima 24h za prihvatanje), US-PL (QuoteRequest deadline)

---

## Kontekst

Vještak ima 24 sata da prihvati narudžbu od momenta dodjele. Ako to ne uradi u roku, sistem mora automatski:
1. Označiti vještaka kao odbijenog (dodati ga na per-order blacklistu)
2. Pokrenuti auto-reassign ili notificirati CA

Ova akcija mora biti automatska (ne ručna) i mora biti pouzdana u multi-node okruženju.

---

## Decision Drivers

- **Automatizacija** — SLA timeout mora biti bez ručne intervencije
- **Multi-node safety** — dvije API instance ne smiju paralelno procesirati isti timeout
- **Konfigurabilnost** — 24h i 30min interval ne smiju biti hardkodirani u kodu
- **Observability** — timeout akcije moraju biti logovane i auditovane

---

## Odluka

`AppraiserTimeoutService : BackgroundService` s `IDistributedJobLock`:

```csharp
protected override async Task ExecuteAsync(CancellationToken stoppingToken)
{
    while (!stoppingToken.IsCancellationRequested)
    {
        await Task.Delay(CheckInterval, stoppingToken);  // Hardkodirano: 30 min ⚠
        var acquired = await _lock.TryAcquireAsync(LockKey);
        if (!acquired) continue;  // Drugi node procesira
        try { await ProcessTimeoutsAsync(stoppingToken); }
        finally { await _lock.ReleaseAsync(LockKey); }
    }
}
```

**Identificirani problemi**:

1. **TimeoutWindow (24h) je hardkodiran** — nije u `WorkflowSlaOptions` konfiguracijskoj klasi
2. **CheckInterval (30 min) je hardkodiran** — nije konfigurabilno
3. **`InMemoryJobLock` ne radi za multi-node** — u multi-instance deploymentu bez Redis-a, oba instance procesiraju iste timeoutove

---

## Alternativna rješenja

| Opcija | Bez vanjske inf. | Multi-node safe | Konfigurabilnost | Durability | Zašto nije izabrana |
|--------|-----------------|----------------|-----------------|-----------|---------------------|
| **BackgroundService + IDistributedJobLock** ✓ | ✓ (za single-node) | ✓ (uz Redis lock) | ⚠ (hardkodirano) | Parcijalna | — |
| Hangfire / Quartz.NET | ✗ (DB tablice) | ✓ | ✓ | ✓ | Uvodi scheduler infrastrukturu; za jednu background operaciju je overhead |
| pg_cron PostgreSQL extension | ✓ | ✓ | Srednja | ✓ | pg_cron nije standardni PostgreSQL — zahtijeva posebnu instalaciju/konfiguraciju |
| Azure Service Bus / RabbitMQ deferred message | ✗ (message broker) | ✓ | ✓ | ✓ | Uvodi message broker zavisnost za jednu vrstu posla |

---

## Consequences

### Pozitivne
- Background service je jednostavan — bez posebnih infrastrukturnih zavisnosti za single-node deployment
- `IDistributedJobLock` port omogućava zamjenu s Redis-om bez promjene business logike

### Negativne
- Restart aplikacije između check intervala može odgoditi timeout processing za do 30 minuta
- Hardkodiran `TimeoutWindow = 24h` — promijena SLA zahtijeva izmjenu koda i redeploy
- `InMemoryJobLock` nije siguran za multi-node — aktivni bug u distributed scenariju

### Svjesno prihvaćeni kompromisi
- Prihvatamo in-memory lock za current single-node deployment. Multi-node zahtijeva Redis lock — to je poznata zavisnost za horizontalno skaliranje.

---

## Tehnički dug

🟡 **SREDNJI PRIORITET** — Dvije konkretne akcije:

1. Premjestiti `TimeoutWindow` i `CheckInterval` u `WorkflowSlaOptions`:
```csharp
public class WorkflowSlaOptions
{
    public TimeSpan AppraiserAcceptanceTimeout { get; set; } = TimeSpan.FromHours(24);
    public TimeSpan SlaCheckInterval { get; set; } = TimeSpan.FromMinutes(30);
    // ...
}
```

2. Implementirati `RedisJobLock : IDistributedJobLock` kao preduslov za multi-node deployment

---

## Migration Impact

- **Breaking Changes:** Premještanje u konfiguraciju je backward-compatible (iste default vrijednosti)
- **Rollback Plan:** `AppraiserTimeoutService` može biti stopiran kroz `hosted service` deregistraciju
- **Compatibility:** Redis zavisnost za produkcijski multi-node

---

## Kada revidirati

- Planiranje multi-instance produkcijskog deploya — Redis lock postaje preduslov
- Poslovni zahtjev za promjenom 24h roka bez redeployа — tada SlaOptions konfiguracija postaje kritična
