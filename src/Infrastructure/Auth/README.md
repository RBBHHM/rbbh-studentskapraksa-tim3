# Infrastructure/Auth

Keycloak integracija i servis za pristup trenutnom korisniku.

| Klasa | Opis |
|-------|------|
| `CurrentUserService` | Čita korisnika iz JWT token claims (sub, preferred_username) |
| `KeycloakOptions` | POCO konfiguracija za Keycloak authority/audience/realm |

## Konfiguracija (appsettings.Development.json)

```json
{
  "Keycloak": {
    "Authority": "http://localhost:8080/realms/praksa",
    "Audience": "praksa-api",
    "Realm": "praksa",
    "RequireHttpsMetadata": false
  }
}
```

## Registracija (u DependencyInjection.cs)

```csharp
services.Configure<KeycloakOptions>(configuration.GetSection(KeycloakOptions.SectionName));

services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var kc = configuration.GetSection(KeycloakOptions.SectionName).Get<KeycloakOptions>()!;
        options.Authority = kc.Authority;
        options.Audience = kc.Audience;
        options.RequireHttpsMetadata = kc.RequireHttpsMetadata;
    });
```
