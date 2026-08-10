# ADR-006: Audit strategija — multi-sink i transakcioni outbox

**Status:** Accepted  
**Kategorija:** A — Osnovna arhitektura  
**Owner:** Arhitekta / Compliance Engineer  
**Datum donošenja:** Novembar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako volumen audit događaja premaši kapacitet outbox drain workera ili ako se uvede zahtjev za real-time audit streaming  
**Zahvaćeni moduli:** Infrastructure (Audit), Api (GlobalExceptionHandler)  
**User Stories:** Sve — svaka akcija koja mijenja stanje mora biti auditirana

*Ova odluka konsoliduje ex-ADR-004 (multi-sink audit) i ex-ADR-070 (transakcioni outbox).*

---

## Kontekst

Bankarski regulativni zahtjevi nalažu kompletnu revizijsku stopu: ko je šta napravio, kada, s kojim podacima, i s kojim ishodom. Ovo nije nice-to-have — bez audit loga, sistem ne može proći regulatornu reviziju.

Postoje dva dodatna zahtjeva koja su se pojavila tokom razvoja:

1. **Durability**: Audit log se mora sačuvati čak i kada dođe do restarta aplikacije između moment pisanja poslovnih podataka i pisanja audit zapisa. Jednostavni in-memory red gubi sve zapise pri restartu.

2. **Dostupnost**: Kada je PostgreSQL nedostupan (kratkotrajna smetnja), audit zapisi ne smiju biti izgubljeni — moraju biti privremeno pohranjeni na disku.

---

## Decision Drivers

- **Regulatorna usklađenost** — bankarska politika zahtijeva audit trail za sve operacije promjene stanja
- **Durability kroz restart** — ne smijemo izgubiti audit zapise pri aplikacijskom restartu
- **Fallback pri nedostupnosti DB** — kratkotrajna nedostupnost baze ne smije rezultirati izgubom audit zapisa
- **Latencija** — operacija ne smije čekati na dovršetak audit pisanja; audit je asinhroni concern
- **PII zaštita** — audit log ne smije sadržavati plaintext lozinke ili potpune identifikacijske podatke (GDPR, interna politika)

---

## Odluka

**Dvostepeni audit sistem: transakcioni outbox + multi-sink drain.**

### Tok pisanja audit zapisa

```
1. Service izvršava poslovnu operaciju (mijenja AppraisalOrder, itd.)
2. U ISTOJ DB transakciji: DbAuditLogQueue.EnqueueAsync() upisuje
   AuditOutboxEntry u tabelu audit_outbox
3. Transakcija se commita — ili obje promjene (poslovna + outbox), ili nijedna
4. IAuditService.RecordAsync() odmah vraća kontrolu (non-blocking)

5. AuditLogQueueWorker (BackgroundService, 10s interval):
   - Čita batch AuditOutboxEntry zapisa
   - Pokušava pisati u DatabaseAuditSink (PostgreSQL audit_logs tabela)
   - Pri DB grešci: FallbackAuditSink preusmjerava na FileAuditSink
     (lokalni fajl: /app/logs/audit-YYYY-MM-DD.jsonl)
   - Briše uspješno procesiran batch iz audit_outbox
```

### Sink hijerarhija

| Sink | Kada se koristi | Storage | Keširan |
|------|----------------|---------|---------|
| `DatabaseAuditSink` | Primarni — uvijek | PostgreSQL `audit_logs` | Ne |
| `FileAuditSink` | Fallback pri DB nedostupnosti | Lokalni fajl JSONL | Ne |
| `FallbackAuditSink` | Orchestrator | — (delegira) | Ne |

### AuditEvent struktura

Svaki audit event sadrži: `Action`, `OperationType`, `Module`, `EntityType`, `EntityKey`, `EntityDisplayName`, `ActorUserId`, `ActorEmail` (maskirano), `ActorActiveRole`, `OldValues` (JSONB), `NewValues` (JSONB), `ChangedFields` (JSONB), `Status`, `Severity`, `Reason`, `CorrelationId`, `IpAddress`, `UserAgent`.

PII masking se primjenjuje kroz `AuditValueSanitizer` prije upisivanja. Vidi [ADR-023](ADR-023-pii-masking.md).

---

## Alternativna rješenja

| Opcija | Durability kroz restart | Latencija | Fallback pri DB grešci | Infrastruktura | Zašto nije izabrana |
|--------|------------------------|-----------|----------------------|----------------|---------------------|
| **DB outbox + multi-sink** ✓ | ✓ (atomski s poslovnim podacima) | Niska (async) | ✓ (FileAuditSink) | Samo PostgreSQL | — |
| In-memory Channel | ✗ (gubi se pri restartu) | Nula | ✗ | Ništa | Regulatorni zahtjev za durabilitiy nije ispunjen |
| Serilog structured logging | ✗ (nije domain audit) | Nula | Parcijalno | Log aggreagator | Ne sadrži entityId, oldValues/newValues; nije lako queryable za regulatorne izvještaje |
| Message broker (RabbitMQ) | ✓ | Niska | ✓ | Poseban broker servis | Uvodi novu infrastrukturnu zavisnost za feature koji PostgreSQL može servirati bez dodatnog servisa |
| Direktno pisanje po akciji | ✓ | ✓ (blokirajuće) | ✗ | Ništa | Blokirajući DB write u hot-path-u poslovne operacije; greška DB pisanja može propagirati kao poslovna greška |

---

## Consequences

### Pozitivne
- Restart aplikacije između poslovnog commita i audit pisanja ne gubi audit zapis — AuditOutboxEntry ostaje u bazi dok drain worker ne procesira
- Kratkotrajna nedostupnost PostgreSQL-a preusmjerava audit u JSONL fajl koji se može naknadno obraditi (replay)
- Poslovna operacija (Submit narudžbe, Approve procjene) ne čeka na audit pisanje — IAuditService.RecordAsync vraća odmah
- Centralizovani `IAuditService` garantuje konzistentan format za sve audit evente bez oslanjanja na disciplinu pojedinog developera

### Negativne
- Audit zapis se ne pojavljuje u audit_logs tabeli odmah — postoji kašnjenje od 0–10 sekundi (drain interval). Real-time audit monitoring nije moguć bez direktnog čitanja iz audit_outbox.
- Tabela `audit_outbox` raste između drain ciklusa — potreban je monitoring njene veličine
- `FileAuditSink` fallback fajlovi zahtijevaju ručnu ili automatsku reimport proceduru nakon povratka baze
- Singleton `AuditLogQueueWorker` u multi-node deploymentu može procesirati isti batch na više instanci — potreban je distribuirani lock (trenutno implementiran kroz `IDistributedJobLock`)

### Svjesno prihvaćeni kompromisi
- Prihvatamo do 10 sekundi kašnjenja između poslovnog eventa i pojave u audit_logs tabeli. Za regulatorne potrebe ovo je prihvatljivo — regulatorna revizija gleda historijske podatke, ne real-time stream. Da je potreban real-time audit, trebalo bi razmotriti CDC (Change Data Capture) pristup.

---

## Tehnički dug

- Multi-node deployment zahtijeva da drain worker ne procesira isti batch na više instanci — implementirani `PostgresJobLock` (pg_try_advisory_lock) ovo rješava, ali je specifičan za PostgreSQL
- `FileAuditSink` nema automatsku reimport proceduru — fajlovi se akumuliraju bez automatskog procesiranja pri povratku DB veze
- Nema monitoring dashboard-a koji bi upozorio ako outbox naraste iznad normalnog (npr. ako drain worker zastane)

---

## Migration Impact

- **Breaking Changes:** Promjena `AuditEvent` strukture može zahtijevati migraciju `audit_logs` tabele
- **Rollback Plan:** U slučaju greške drain workera, audit zapisi ostaju u `audit_outbox` i mogu se naknadno procesirati
- **Compatibility:** `audit_logs` tabela može biti queryana direktno bez promjene aplikacijskog koda za historijsku analizu

---

## Kada revidirati

- Volumen audit događaja preraste kapacitet single-worker drain procesa (monitoring: audit_outbox tabela ne drainira brže nego što se puni)
- Pojavi se zahtjev za real-time audit streaming prema SIEM sistemu
- Multi-node deployment postane standard i `PostgresJobLock` treba zamijeniti s Redis-based lock-om za bolji throughput
