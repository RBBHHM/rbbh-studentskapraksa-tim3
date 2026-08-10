# Infrastructure/Audit

Implementacije Application/Audit interfejsa.

| Klasa | Interfejs | Opis |
|-------|-----------|------|
| `AuditService` | `IAuditService` | Koordinira sve sink-ove, sanitizira vrijednosti |
| `DatabaseAuditSink` | `IAuditSink` | Upisuje audit log u PostgreSQL |
| `AuditValueSanitizer` | `IAuditValueSanitizer` | Maskira osjetljiva polja u JSON |

## Dodavanje novog sink-a

```csharp
public class SplunkAuditSink : IAuditSink
{
    public async Task WriteAsync(AuditEvent evt, CancellationToken ct)
    {
        // TODO: slanje u Splunk
    }
}

// U DependencyInjection.cs:
services.AddScoped<IAuditSink, SplunkAuditSink>();
```
