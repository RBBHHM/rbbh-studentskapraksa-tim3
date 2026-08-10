# Backend smjernice

## Opšta pravila

1. **Tanak Api sloj** — endpoint handler poziva Application use case, ne piše poslovnu logiku
2. **Dependency Injection** — nema `new` za servise, sve kroz DI kontejner
3. **Async/Await** — svi DB i HTTP pozivi su async
4. **CancellationToken** — proslijedite kroz cijeli call stack
5. **Nullable** — `<Nullable>enable</Nullable>` u svim projektima; hvata null-reference greške u compile-time

## Imenovanje

| Element | Konvencija | Primjer |
|---------|-----------|---------|
| Interfejsi | `I` prefix | `IItemRepository` |
| Komande | `Command` suffix | `CreateItemCommand` |
| Upiti | `Query` suffix | `GetItemByIdQuery` |
| Handleri | `Handler` suffix | `CreateItemCommandHandler` |
| Konfiguracije | `Configuration` suffix | `AuditLogConfiguration` |
| Options | `Options` suffix | `KeycloakOptions` |

## Error handling

Koristite domenske izuzetke umjesto `return null`:

```csharp
// DOBRO
throw new NotFoundException("Item", id);

// LOŠE
return null;
```

API sloj mapira izuzetke na HTTP status kodove putem `IExceptionHandler`.

## Zabrane

- EF Core u Domain ili Application
- Poslovne logike u `Program.cs`
- Hardkodovane connection stringove ili secrets
- `async void` (osim event handlera)
