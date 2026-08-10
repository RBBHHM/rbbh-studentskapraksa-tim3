# ADR-033: Blazor Server — InteractiveServer arhitektura

**Status:** Accepted · ⚠ Needs Review za horizontalno skaliranje  
**Kategorija:** F — Frontend  
**Owner:** Arhitekta  
**Datum donošenja:** Oktobar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako se uvede zahtjev za horizontalnim skaliranjem (više API/Blazor instanci)  
**Zahvaćeni moduli:** BlazorApp  
**User Stories:** Sve — UI sloj za sve korisnike

---

## Kontekst

Frontend je potreban za bankarski intranet sistem s Keycloak OIDC autentifikacijom. Tim je .NET-primarni, bez dedikovanog JavaScript/TypeScript developera. Keycloak OIDC Authorization Code Flow server-side je složeniji za implementaciju u SPA aplikacijama.

---

## Decision Drivers

- **Jedinstven tech stack** — tim poznaje C# i .NET; nema potrebe za JavaScript/TypeScript znanjem
- **Server-side auth** — Keycloak OIDC cookie sesija je prirodna za server-side rendered aplikacije
- **Razvojna brzina** — Blazor Server komponente i Blazor API servisi u istom tech stacku
- **Sigurnost** — JWT Bearer token nikad nije eksponiran browseru (drži ga Blazor Server)

---

## Odluka

**Blazor Server s `InteractiveServer` rendermodom** za sve komponente koje trebaju interaktivnost. OIDC autentifikacija kroz server-side cookie sesiju.

Svaka Blazor Server sesija dobiva vlastiti SignalR circuit koji živi na jednoj instanci servera. Stanje komponenti je server-side.

---

## Alternativna rješenja

| Opcija | C# stack | Server-side auth | Offline | Skalabilnost | Zašto nije izabrana |
|--------|----------|-----------------|---------|-------------|---------------------|
| **Blazor Server** ✓ | ✓ | ✓ | ✗ | ✗ (sticky sessions) | — |
| Blazor WebAssembly | ✓ | ✗ (složeno s Keycloak PKCE) | ✓ | ✓ | OIDC auth s Keycloak za WASM zahtijeva JavaScript interop za secure token storage; kompleksna implementacija |
| React / Angular SPA | ✗ (JavaScript) | ✗ (JavaScript OIDC) | ✓ | ✓ | Zahtijeva JavaScript/TypeScript know-how koji tim nema; duplira validacijsku logiku između C# API i JS frontend-a |
| Razor Pages / MVC | ✓ | ✓ | ✗ | ✓ | Ne podržava rich interaktivne komponente (drag-and-drop, real-time updates) bez JavaScript-a |

---

## Consequences

### Pozitivne
- Cijeli stack je C# / .NET — validacijska logika i tipovi dijele se između API-ja, Application sloja i Blazor komponenata
- Keycloak OIDC cookie sesija je prirodna za Blazor Server — nema JavaScript PKCE complexity-a
- Serveri-side rendering znači da korisnik uvijek vidi aktualne podatke pri navigaciji bez client-side state managementa
- Brza iteracija UI-a — Blazor Hot Reload radi za server-side komponente

### Negativne
- **Sticky sessions** — svaki Blazor klijent drži persistentnu WebSocket vezu s jednim serverom. Load balancer mora preusmjeravati zahtjeve istog klijenta uvijek na isti server (sticky session / session affinity). Horizontalno skaliranje zahtijeva Redis-backed distributed state (SignalR backplane + distributed cache za Blazor state).
- Restart servera prekida sve aktivne SignalR sesije — korisnici gube unsaved UI stanje (ne poslovna data — ta su u bazi)
- Server nosi stanje svake aktivne sesije — memorija raste s brojem korisnika. Za 100 istovremenih korisnika s bogatim UI stanjem, ovo postaje mjerljiv faktor.
- Offline nije podržan — bez interneta, aplikacija ne funkcioniše

### Svjesno prihvaćeni kompromisi
- Prihvatamo single-node ograničenje za inicijalni deployment kao prihvatljiv kompromis za bankarski intranet s predvidivim brojem korisnika (~50-100 istovremenih). Horizontalno skaliranje je poznati put naprijed: Redis backplane za SignalR + distributed cache za Blazor state.

---

## Tehnički dug

🟡 **SREDNJI PRIORITET (za multi-instance)**: Redis-backed distributed state:
1. SignalR Azure/Redis backplane (`services.AddSignalR().AddStackExchangeRedis()`)
2. Zamijeniti `IMemoryCache` s `IDistributedCache` (Redis) za import token i ostalo per-server state

---

## Migration Impact

- **Breaking Changes:** Migracija na Blazor WebAssembly bila bi re-implementacija Blazor UI-a — nije planirana
- **Rollback Plan:** Nije primjenjivo
- **Compatibility:** .NET 10 Blazor Server s `InteractiveServer` rendermodom — nema poznatih breaking changes pri upgrade-u

---

## Kada revidirati

- Broj istovremenih korisnika premaši kapacitet jedne instance (tipično > 200-300 na standardnom serveru)
- Uvede se zahtjev za multi-region deployment-om
- Tim dobije JavaScript/TypeScript developer koji može voditi SPA migraciju
