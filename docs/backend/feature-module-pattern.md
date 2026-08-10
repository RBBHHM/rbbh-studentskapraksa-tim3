# BE-PLATFORM-01 — Feature Module Pattern (IFeatureModule / IEndpointModule)

## 1. Svrha

T1 (Platforma/Foundation) je pripremio dvije auto-discovery tačke proširenja kako bi
T2-T8 mogli dodavati DI registracije i HTTP endpointe **bez izmjene zajedničkih
fajlova** (`src/Infrastructure/DependencyInjection.cs`,
`src/Api/Extensions/ServiceCollectionExtensions.cs`,
`src/Api/Extensions/WebApplicationExtensions.cs`).

To eliminiše merge konflikte između paralelnih feature grana — svaki feature dodaje
samo nove fajlove u svom dijelu stabla.

Postoje dva nezavisna mehanizma:

| Mehanizam | Interfejs | Auto-discovery | Šta radi |
|---|---|---|---|
| DI registracija | `IFeatureModule` | `AddFeatureModules` | Registruje servise u `IServiceCollection` |
| HTTP rute | `IEndpointModule` | `MapFeatureEndpoints` | Mapira minimal API endpointe |

Oba se pokreću kroz reflection nad zadanim sklopovima (assemblies) pri startup-u.

---

## 2. IFeatureModule — DI registracija servisa

### Interfejs

```csharp
// src/Application/Common/Modules/IFeatureModule.cs
public interface IFeatureModule
{
    void RegisterServices(IServiceCollection services, IConfiguration configuration);
}
```

### Pravila

- Implementacija mora biti **konkretna klasa sa public bezparametarskim
  konstruktorom** (reflection je instancira preko `Activator.CreateInstance`).
- Smjesti je u sloj gdje se servisi i implementiraju — najčešće
  `src/Infrastructure/<Feature>/<Feature>FeatureModule.cs`.
- `RegisterServices` poziva `services.AddScoped<...>()` / `AddSingleton<...>()` /
  `Configure<TOptions>(configuration.GetSection(...))` kao i obična DI registracija.

### Auto-discovery

Poziva se jednom u `ServiceCollectionExtensions.AddApiServices`:

```csharp
services.AddFeatureModules(
    configuration,
    typeof(Praksa.Application.DependencyInjection).Assembly,
    typeof(Praksa.Infrastructure.DependencyInjection).Assembly,
    typeof(Program).Assembly);
```

`AddFeatureModules` (u `src/Application/Common/Modules/FeatureModuleExtensions.cs`)
pronađe sve ne-apstraktne klase koje implementiraju `IFeatureModule` i imaju
bezparametarski konstruktor u navedenim sklopovima, instancira ih i pozove
`RegisterServices`. Redoslijed registracija nije garantovan — moduli ne smiju
zavisiti jedan od drugog.

### Primjer: `NotificationsFeatureModule`

```csharp
// src/Infrastructure/Notifications/NotificationsFeatureModule.cs
public sealed class NotificationsFeatureModule : IFeatureModule
{
    public void RegisterServices(IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IEmailProvider, LogEmailProvider>();
        services.AddScoped<INotificationService, NotificationService>();
    }
}
```

---

## 3. IEndpointModule — mapiranje HTTP ruta

### Interfejs

```csharp
// src/Api/Modules/IEndpointModule.cs
public interface IEndpointModule
{
    void MapEndpoints(IEndpointRouteBuilder app);
}
```

### Pravila

- Implementacija mora biti **konkretna klasa sa public bezparametarskim
  konstruktorom**.
- Smjesti je u `src/Api/Endpoints/<Feature>EndpointModule.cs`.
- `MapEndpoints` koristi `app.MapGroup(...)`, `.MapGet/.MapPost/...` i
  `.RequireAuthorization(AppPolicies.Xyz)` kao i postojeći `*Endpoints` fajlovi.

### Auto-discovery

Poziva se jednom u `WebApplicationExtensions.MapAllEndpoints`, nakon ručno
mapiranih postojećih endpointa:

```csharp
app.MapFeatureEndpoints(typeof(Program).Assembly);
```

`MapFeatureEndpoints` (u `src/Api/Modules/EndpointModuleExtensions.cs`) pronađe sve
ne-apstraktne klase koje implementiraju `IEndpointModule` i imaju bezparametarski
konstruktor u datom sklopu, instancira ih i pozove `MapEndpoints`.

### Primjer: `NotificationsEndpointModule`

```csharp
// src/Api/Endpoints/NotificationsEndpointModule.cs
public sealed class NotificationsEndpointModule : IEndpointModule
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/notifications").WithTags("Notifications");

        group.MapGet("/mine", GetMine)
             .RequireAuthorization(AppPolicies.NotificationsView)
             .WithName("GetMyNotifications");

        group.MapGet("/unread-count", GetUnreadCount)
             .RequireAuthorization(AppPolicies.NotificationsView)
             .WithName("GetUnreadNotificationCount");

        group.MapPost("/{id:int}/read", MarkRead)
             .RequireAuthorization(AppPolicies.NotificationsView)
             .WithName("MarkNotificationRead");
    }

    // ... handler metode (vidi src/Api/Endpoints/NotificationsEndpointModule.cs)
}
```

Ovaj modul izlaže:

- `GET /api/notifications/mine?page=&pageSize=&unreadOnly=` — paginirani inbox.
- `GET /api/notifications/unread-count` — broj nepročitanih, za bell ikonu.
- `POST /api/notifications/{id}/read` — označava notifikaciju pročitanom.

---

## 4. Korak-po-korak za T2-T8

1. **Novi servis (DI)**: kreiraj `src/Infrastructure/<Feature>/<Feature>FeatureModule.cs`
   koji implementira `IFeatureModule` i u `RegisterServices` registruje sve nove
   servise/opcije tvog feature-a.
2. **Novi endpointi**: kreiraj `src/Api/Endpoints/<Feature>EndpointModule.cs` koji
   implementira `IEndpointModule` i u `MapEndpoints` mapira sve rute tvog feature-a,
   zaštićene odgovarajućim `AppPolicies` (vidi `docs/backend/role-permission-rules.md`).
3. **Ne diraj** `DependencyInjection.cs`, `ServiceCollectionExtensions.cs` ni
   `WebApplicationExtensions.cs` — auto-discovery ih pokupi automatski na sljedećem
   pokretanju aplikacije.
4. Ako ti je potreban servis iz drugog feature modula (npr. `INotificationService`,
   `IFileStorageProvider`), samo ga injektuj kroz konstruktor/parametar — DI
   kontejner ne razlikuje da li je servis registrovan ručno ili kroz
   `IFeatureModule`.

---

## 5. Zajednička infrastruktura dostupna iz T1

Pregled svih T1 servisa koje T2-T8 mogu koristiti je u
`docs/backend/role-permission-rules.md` §24.4 (skladište fajlova, notifikacije,
`Opinion` entitet, nove kolone na `AppraisalOrder`).
