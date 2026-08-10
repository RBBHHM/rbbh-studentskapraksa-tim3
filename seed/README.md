# Seed Data

Demo/test podaci za lokalni razvoj. **Ne koristiti u produkciji.**

## Struktura

```
seed/
  users.json           - Testni korisnici (lozinke u Keycloak realm-exportu)
  codebooks.json       - Inicijalni šifarnici
  roles.json           - (TODO) Custom role ako postoje
  permissions.json     - (generisano iz AppPermissions.cs, ne editovati ručno)
```

## Kako se seed pokreće

### Keycloak (realm import sa test korisnicima)

```bash
# 1. Pokrenuti Docker sa realm importom
docker compose up

# Keycloak automatski importuje realm-export.json koji sadrži:
# - Test korisnike iz seed/users.json
# - Realm konfiguraciju (praksa realm)
```

### PostgreSQL (šifarnici iz seed/codebooks.json)

Šifarnici se seeduju putem EF Core migracija (INSERT data u `20260603000000_AddRoleManagement.cs`).

Za lokalni reset:
```bash
# Resetuj i ponovo primijeni sve migracije
dotnet ef database drop --project src/Infrastructure --startup-project src/Api --force
dotnet ef database update --project src/Infrastructure --startup-project src/Api
```

## Test korisnici

| Korisnik | Lozinka | Rola |
|---|---|---|
| admin.test@praksa.ba | Admin1234! | Administrator |
| admin2.test@praksa.ba | Admin1234! | Administrator |
| unosnik.test@praksa.ba | Unosnik1234! | Unosnik |
| verifikator.test@praksa.ba | Verifikator1234! | Verifikator |
| am.test@praksa.ba | AM1234! | AM (segment Prodaja) |
| sm.test@praksa.ba | SM1234! | SM (segment Prodaja) |
| ub.test@praksa.ba | UB1234! | UB (segment Prodaja) |
| kolateraladministrator.test@praksa.ba | KolateralAdministrator1234! | KolateralAdministrator |
| kolateraloficir.test@praksa.ba | KolateralOficir1234! | KolateralOficir |
| vjestak.test@praksa.ba | Vjestak1234! | Vjestak |
| pravnasluzba.test@praksa.ba | PravnaSluzba1234! | PravnaSluzba |
| protokol.test@praksa.ba | Protokol1234! | Protokol |

> **NAPOMENA**: Ove lozinke su samo za dev. Nikada ne koristiti u produkciji.

## Pravila seed podataka

1. Seed ne smije sadržavati produkcijske tajne
2. Test lozinke su samo za dev okruženje
3. Seed se validira pri pokretanju — greška u JSON-u = jasna poruka
4. Seed ne smije biti produkcijski izvor istine
