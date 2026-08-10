# ADR-029: Dual-channel notifikacije — in-app i SMTP s role fan-out

**Status:** Accepted  
**Kategorija:** E — Servisna arhitektura  
**Owner:** Arhitekta  
**Datum donošenja:** Novembar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako se uvede push notifikacija (mobile/browser push) ili integracija sa Slack/Teams  
**Zahvaćeni moduli:** Application (INotificationService, INotificationProvider), Infrastructure  
**User Stories:** Sve — svaki workflow prijelaz generira notifikacije za relevantne aktere

---

## Kontekst

Workflow narudžbe angažuje šest tipova korisnika. Svaki korak mora biti notifikovan relevantnim akterima. Notifikacije mogu biti:
1. **In-app** — vidljive unutar aplikacije (inbox, badge counter)
2. **Email** — za hitne akcije ili kad korisnik nije u aplikaciji

Problem s naivnim pristupom: isti event može notificirati sve korisnike određene uloge (fan-out), a korisnici ne smiju primati isti email dva puta u kratkom periodu (duplikacija pri concurrent workflow akcijama).

---

## Decision Drivers

- **Dva kanala** — in-app za aktivne korisnike, email za pasivne
- **Role fan-out** — "notificirati sve CA" mora biti implementirano jednom, ne po svakom servisu
- **Deduplication** — isti email ne smije biti poslan dva puta u roku od 5 minuta
- **Decoupling** — notifikacijska logika ne smije biti unutar workflow servisa

---

## Odluka

**Dvije odvojene apstrakcije s različitim odgovornostima**:

| Interfejs | Odgovornost | Implementacija |
|-----------|-------------|----------------|
| `INotificationService` | In-app inbox (pisanje i čitanje) | DB tabela `notifications` |
| `INotificationProvider` | Outbound kanal (email, buduće) | `EmailNotificationProvider` (MailKit) |

### Role fan-out

`IUserRoleProvider.GetUsersInRoleAsync(role)` → lista korisnika → `INotificationProvider.SendAsync(users, message)`. Fan-out implementiran u `NotificationService.NotifyRoleAsync()` — jedan poziv, N primatelja.

### Email deduplication

Zapis u `notifications` tabeli s `SentAt` poljem. Provjera: ako isti korisnik ima zapis s istim `TemplateKey` unutar 5 minuta → preskoči slanje emaila. In-app notifikacija se i dalje kreira.

### Notifikacijski eventi (selektovano)

| Workflow akcija | Ko prima |
|----------------|---------|
| Narudžba podnesena | Sve CA u sistemu |
| Vještak dodijeljen | Vještak (direktno) |
| Procjena zaprimljena | CO koji ima narudžbu u reviziJi |
| Procjena odobrena | AM/SM/UB koji je kreirao narudžbu |
| Faktura uploadovana | Likvidatura/Računovodstvo |

---

## Alternativna rješenja

| Opcija | In-app inbox | Deduplication | Fan-out | Decoupling | Zašto nije izabrana |
|--------|-------------|--------------|--------|-----------|---------------------|
| **Dual-channel + role fan-out** ✓ | ✓ | ✓ DB-based | ✓ | ✓ | — |
| Samo email | ✗ | Ručno | ✓ | Srednje | Nema in-app inbox; korisnici moraju pratiti email za svaki workflow korak |
| Message broker (RabbitMQ pub/sub) | ✓ | Zahtijeva custom | ✓ | ✓ | Uvodi message broker zavisnost za feature koji PostgreSQL može servirati |
| Inline u svakom servisu | ✗ | ✗ | ✗ | ✗ | Fan-out logika duplicirana u svakom servisu; nemoguće testirati konzistentno |

---

## Consequences

### Pozitivne
- Workflow servisi pozivaju `INotificationService` i `INotificationProvider` — ne znaju za email implementaciju
- Dodavanje novog kanala (push notifikacija) zahtijeva novu `INotificationProvider` implementaciju — bez promjene workflow servisa
- Deduplication sprječava "email storm" pri concurrent workflow akcijama

### Negativne
- Role fan-out zahtijeva pozivanje Keycloak Admin API-ja da bi se dobila lista korisnika za ulogu — Keycloak downtime znači propuštene notifikacije
- In-app inbox ne podržava real-time push — korisnik mora refreshati stranicu ili klinti ikonu (Blazor SignalR bi mogao biti korišćen ali nije implementirano)

### Svjesno prihvaćeni kompromisi
- Prihvatamo polling umjesto real-time SignalR push za in-app inbox. Za intranet sistem, polling (na refresh stranice) je prihvatljiv UX.

---

## Tehnički dug

- Keycloak Admin API poziv za role fan-out nema retry logiku — Keycloak downtime znači propuštene email notifikacije bez ikakve indikacije
- Nema monitoring dašborda koji prikazuje neisporučene notifikacije

---

## Migration Impact

- **Breaking Changes:** Promjena notifikacijske sheme (TemplateKey) može uticati na deduplication logiku
- **Rollback Plan:** Notifikacije su "nice to have" — workflow funkcioniše i bez notifikacija
- **Compatibility:** Nema

---

## Kada revidirati

- Uvede se real-time zahtjev (korisnik ne želi refreshati stranicu da vidi novu notifikaciju)
- Keycloak downtime postane mjerljiv problem za notifikacije
- Uvede se integracija sa vanjskim messaging sustavom (Teams, Slack)
