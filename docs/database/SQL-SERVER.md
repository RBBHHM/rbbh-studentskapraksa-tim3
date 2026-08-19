# SQL Server i SSMS

Tema 3 koristi Microsoft SQL Server za EF Core i SQL Server primitives za distribuirani lock i atomske brojače. Bez konfiguracije u Development okruženju koristi se EF Core InMemory baza. Tada se seeduju poslovnice, šifarnici, role, vještaci, narudžbe, dokumentni šabloni i dijeljeni dokumenti.

## Windows prijava

```text
ConnectionStrings__Default=Server=localhost;Database=rbbh_collateral_appraisal;Trusted_Connection=True;Encrypt=True;TrustServerCertificate=True;MultipleActiveResultSets=True
```

Alternativno postavi `COLLATERAL_APPRAISAL_SERVER_NAME`, `COLLATERAL_APPRAISAL_DATABASE`, `COLLATERAL_APPRAISAL_TRUSTED_CONNECTION=true` i `COLLATERAL_APPRAISAL_TRUST_SERVER_CERTIFICATE=true`. Za SQL Authentication dodaj `COLLATERAL_APPRAISAL_DB_USER` i `COLLATERAL_APPRAISAL_DB_PASSWORD`.

U SSMS-u koristi isti server i Windows Authentication. Na novoj praznoj bazi aplikacija kreira trenutnu šemu i idempotentno dodaje referentne podatke. Produkcijske tajne se isporučuju kroz OCP Secret/environment varijable.
