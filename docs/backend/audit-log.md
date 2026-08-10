# Audit Log — Backend smjernice

## Svrha

Generički audit log bilježi **sve značajne akcije** u sistemu — korisničke, sistemske i akcije iz vanjskih izvora.

## Kako koristiti

### U Application handleru

```csharp
public class CreateItemCommandHandler
{
    private readonly IAuditService _audit;
    private readonly ICurrentUserService _user;

    public async Task Handle(CreateItemCommand cmd, CancellationToken ct)
    {
        // ... kreiraj item ...

        await _audit.LogAsync(new AuditEvent
        {
            UserId        = _user.UserId ?? "system",
            UserName      = _user.UserName ?? "system",
            Action        = AuditActions.Create,
            Module        = AuditModules.Users,  // ili vaš modul
            OperationType = AuditOperationTypes.UserInitiated,
            Status        = AuditStatuses.Success,
            Severity      = AuditSeverity.Low,
            EntityType    = "Item",
            EntityKey     = newItem.Id.ToString(),
            NewValues     = JsonSerializer.Serialize(newItem)
        }, ct);
    }
}
```

### Sanitizacija

`AuditValueSanitizer` automatski maskira polja: `password`, `secret`, `token`, `iban`, `pin`, `cvv`, `cardnumber`.

Proširite listu u `Infrastructure/Audit/AuditValueSanitizer.cs`.

## DB shema — `audit_logs` tabela

| Kolona | Tip | Opis |
|--------|-----|------|
| `id` | bigint (PK) | Auto-increment |
| `user_id` | varchar(128) | Keycloak sub claim |
| `user_name` | varchar(256) | preferred_username |
| `action` | varchar(64) | CREATE, UPDATE, DELETE... |
| `module` | varchar(64) | USERS, EXTERNAL_DATA... |
| `operation_type` | varchar(64) | USER_INITIATED, SYSTEM... |
| `status` | varchar(64) | SUCCESS, FAILURE... |
| `severity` | varchar(32) | LOW, MEDIUM, HIGH, CRITICAL |
| `entity_type` | varchar(128) | Tip entiteta |
| `entity_key` | varchar(256) | Ključ entiteta |
| `source_system` | varchar(128) | Vanjski sistem (nullable) |
| `source_table` | varchar(256) | Tabela u izvoru (nullable) |
| `old_values` | jsonb | Vrijednosti prije promjene |
| `new_values` | jsonb | Vrijednosti nakon promjene |
| `additional_data` | jsonb | Slobodni kontekst |
| `correlation_id` | varchar(64) | X-Correlation-ID header |
| `ip_address` | varchar(64) | IP adresa klijenta |
| `user_agent` | varchar(512) | Browser/client info |
| `occurred_at` | timestamp | UTC timestamp eventa |

## Indeksi

- `user_id` — pretraga po korisniku
- `occurred_at` — pretraga po vremenu
- `(entity_type, entity_key)` — pretraga po entitetu
- `correlation_id` — traciranje zahtjeva
