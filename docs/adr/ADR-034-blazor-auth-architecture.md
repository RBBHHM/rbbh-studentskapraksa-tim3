# ADR-034: Blazor auth i circuit-scoped state arhitektura

**Status:** Accepted  
**Kategorija:** F — Frontend  
**Owner:** Arhitekta  
**Datum donošenja:** Oktobar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako se uvede Blazor WebAssembly (tada cijela ova arhitektura pada)  
**Zahvaćeni moduli:** BlazorApp (Auth, Services, State)  
**User Stories:** Login flow, sve komponente koje pozivaju API

*Ova odluka konsoliduje ex-ADR-074 (file download proxy), ex-ADR-075 (RequestMessageHandler), ex-ADR-076 (ActiveRoleState) i ex-ADR-077 (Result\<T\> monad).*

---

## Kontekst

Blazor Server koristi server-side OIDC cookie sesiju za autentifikaciju. API prima JWT Bearer token. Blazor HTTP servisi koji pozivaju API moraju na svaki poziv dodati aktuelni Bearer token, a taj token može isteći i trebati biti refreshan. Korisnici s više uloga moraju čuvati izabranu aktivnu ulogu per-browser-tab. Greška u HTTP pozivu prema API-ju ne smije srušiti Blazor SignalR circuit.

---

## Decision Drivers

- **Transparentni token refresh** — korisnik ne smije znati da je Bearer token istekao i bio refreshan
- **Per-tab state** — aktivna uloga korisnika mora biti izolirana po browser tabu, ne globalna
- **Circuit safety** — nekontrolisana iznimka u HTTP pozivu ne smije srušiti SignalR konekciju
- **Bez JavaScript** — sve mora biti implementirano u C# bez JavaScript interop-a

---

## Odluka

Četiri međusobno povezana mehanizma:

### 1 — RequestMessageHandler (transparentni token refresh)

```csharp
public class RequestMessageHandler : DelegatingHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(request, ct)
    {
        await _oidcRefresher.ValidateOrRefreshCookieAsync(...);  // Refresh ako treba
        var token = await _tokenProvider.GetAccessTokenAsync();
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return await base.SendAsync(request, ct);
    }
}
```

Registrovan kao `DelegatingHandler` za sve HTTP klijente u Blazor aplikaciji — transparentan za svih 17+ API servisa.

### 2 — ActiveRoleState (per-circuit state)

```csharp
builder.Services.AddScoped<ActiveRoleState>();
// Scoped = jedna instanca po SignalR circuit-u = jedna instanca po browser tabu
```

**Zašto Scoped a ne Singleton**: Singleton bi dijelio stanje aktivne uloge između SVIH korisnika na serveru — katastrofalna greška. Scoped garantuje izolaciju po browser tabu.

Komentar u kodu: *"NE koristi se za autorizacijske odluke — samo za audit kontekst i UI prikaz. Backend mora uvijek provjeriti permissions iz JWT-a."*

### 3 — Result\<T\> monad (circuit safety)

Svi API servisi nasljeđuju `BaseApiService` koji wraupuje HTTP pozive:

```csharp
// Umjesto: var order = await _http.GetFromJsonAsync<Order>(...);  // ← može srusiti circuit
// Koristimo:
var result = await GetAsync<Order>(...);  // ← vraća Result<Order>
if (result) { ... }  // implicit bool
```

`Result<T>` sadrži ili uspješan odgovor ili grešku (`ErrorMessage`, `StatusCode`). Komponenta može elegantno prikazati grešku bez try-catch bloka koji bi mogao propagirati iznimku kroz Blazor render tree.

### 4 — Blazor file download proxy (cookie→JWT bridge)

Browser direktni download link prema API-ju vraća 401 jer browser ne šalje Bearer token (samo OIDC cookie). Rješenje:

```
Browser klik → Blazor Server route /files/documents/{id}
  → Blazor Server doda Bearer token
  → Forward HTTP zahtjev prema Api
  → Stream response prema browseru
```

Ovo je suboptimalno za veliki volumen downloada (load na Blazor Server) ali je jednostavno bez JavaScript-a. Alternativa: pre-signed URL (zahtijeva S3/MinIO).

---

## Consequences

### Pozitivne
- Token refresh je potpuno transparentan — developer API servisa ne mora razmišljati o token expiry-u
- `ActiveRoleState` per-circuit garantuje per-tab izolaciju bez ijedne linije custom state managementa
- `Result<T>` eliminira potrebu za try-catch u Blazor komponentama — kod je čišći i ne može slučajno propagirati iznimku prema SignalR-u

### Negativne
- File download proxy povećava load na Blazor Server — svaki download fajla prolazi kroz server; za 100 istovremenih downloada, server mora pufferovati sve
- `RequestMessageHandler` poziva OIDC refresh sync — ako Keycloak nije dostupan, svaki HTTP poziv prema API-ju failuje s auth greškom
- `Result<T>` implicit bool operator može biti zbunjujuć za developera koji nije naviknut na monadski pristup

### Svjesno prihvaćeni kompromisi
- Prihvatamo file download proxy overhead kao prihvatljiv za trenutni volumen downloada. Alternativa (pre-signed URL) zahtijeva S3/MinIO koji nije implementiran.

---

## Tehnički dug

- File download proxy postaje bottleneck pri velikom volumenu — migrirati na pre-signed URL kada S3/MinIO bude implementiran
- `RequestMessageHandler` nema fallback pri Keycloak downtime-u — sve Blazor HTTP akcije failuju

---

## Migration Impact

- **Breaking Changes:** Migracija na Blazor WebAssembly bi zahtijevala kompletnu reimplementaciju ovog sloja (JavaScript OIDC, React Query ili sl.)
- **Rollback Plan:** Nije primjenjivo
- **Compatibility:** Kompatibilno s .NET 10 i Blazor Server arhitekturom

---

## Kada revidirati

- S3/MinIO implementacija postane dostupna — tada file download proxy treba biti zamijenjen pre-signed URL-ovima
- Identifikuje se Keycloak availability problem koji uzrokuje masovne greške u Blazor UI-u
