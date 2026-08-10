# docker/keycloak

Keycloak konfiguracija za lokalni razvoj.

## TODO: realm-export.json

Ovaj folder treba sadržavati `realm-export.json` — export Keycloak realm konfiguracije.

### Kako kreirati realm

1. Pokrenuti Keycloak lokalno:
   ```bash
   docker compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml up keycloak db
   ```

2. Otvoriti admin konzolu: http://localhost:8080
   - Korisnik: `admin` / Lozinka: `admin` (iz env)

3. Kreirati novi realm `praksa`:
   - Clients → New client: `praksa-api` (bearer-only), `praksa-web` (public)
   - Roles → Create: `admin`, `user`
   - Users → Kreirati test korisnike

4. Exportovati realm:
   - Realm Settings → Action → Export
   - Sačuvati kao `docker/keycloak/realm-export.json`

5. Odkomentarisati u `docker-compose.override.yml`:
   ```yaml
   KC_IMPORT_REALM: /opt/keycloak/data/import/realm-export.json
   volumes:
     - ./keycloak/realm-export.json:/opt/keycloak/data/import/realm-export.json:ro
   ```

### Keycloak env varijable

Dodajte u `.env`:
```
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=<sigurna-lozinka>
```

**NIKADA ne commitujte stvarne admin lozinke!**
