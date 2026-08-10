# Infrastructure/Persistence

EF Core setup za PostgreSQL.

## Struktura

- `ApplicationDbContext.cs` — DbContext koji sadrži sve DbSet-ove
- `Configurations/` — `IEntityTypeConfiguration<T>` klase za svaki entitet (Fluent API, bez atributa na entitetima)
- `Migrations/` — EF Core migracije (generisane automatski, ne mijenjati ručno)

## Migracije

```bash
# Kreiranje nove migracije
dotnet ef migrations add InitialCreate --project src/Infrastructure --startup-project src/Api

# Primjena migracija na bazu
dotnet ef database update --project src/Infrastructure --startup-project src/Api
```

## Napomena

DbContext je SAMO u Infrastructure — nikada u Domain ili Application.
