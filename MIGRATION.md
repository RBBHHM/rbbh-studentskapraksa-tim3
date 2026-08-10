# RBI React migracija — Tema 3

## Šta je urađeno

Originalni projekat je sačuvan, a migracija se radi u kopiji
`studentskapraksaTema3-rbi-migrated`. Novi RBI React frontend nalazi se u
`src/Web`. Postojeći `src/BlazorApp` ostaje historijska funkcionalna referenca;
`src/Api`, `src/Application`, `src/Domain` i `src/Infrastructure` ostaju postojeći
backend i poslovna logika.

```text
Preglednik
   │
   ▼
src/Web (React + TanStack Router + RBI design system)
   │  jedan HTTP klijent; u razvoju Vite /api proxy
   ▼
src/Api (:5000, Minimal API + OpenAPI + JWT validacija)
   │
   ▼
src/Application → src/Domain
   │
   ▼
src/Infrastructure → PostgreSQL / Keycloak / spremište / vanjski sistemi
```

## Zašto je ovaj projekat drugačiji od Teme 2

Tema 3 već ima zaseban HTTP API i Clean Architecture slojeve. Zato nije potrebno
izmišljati `/api/frontend/*` endpointe niti kopirati Blazor servise u React.
Postojeći endpointi kao `/api/orders`, `/api/tasks/my`, `/api/protocol/orders`,
`/api/appraisers` i administracijski endpointi predstavljaju ispravnu granicu.

Poslovni ekrani koriste jedan centralni HTTP klijent, OpenAPI-generisane tipove i
TanStack Query cache. Kompatibilni unwrap transportnog odgovora postoji samo u
centralnom klijentu, pa komponente ne uvode vlastite API envelope ili
ProblemDetails modele.

Migrirani su dashboard, narudžbe i puni workflow, dokumenti i verzije, odabir
vještaka i ponude, mišljenja, faktura, protokol, zadaci, notifikacije, vještaci s
import/exportom, šifarnici, korisnici, role i permissioni, audit, izvještaji,
zajednički dokumenti, poslovnice i health pregled.

## Autentikacija

React koristi javni Keycloak SPA klijent sa Authorization Code + PKCE. Client
secret se ne nalazi u browseru, token se ne čuva u `localStorage`, a API i dalje
samostalno validira JWT, permissione i aktivnu poslovnu rolu.

## Lokalno pokretanje frontenda

```powershell
cd src\Web
pnpm install
pnpm dev
```

Vite ispisuje adresu, uobičajeno `http://localhost:8080/app`. API se pokreće u
drugom terminalu:

```powershell
dotnet run --project src\Api
```

OpenAPI tipovi se generišu tek kada API radi:

```powershell
cd src\Web
pnpm openapi:generate
```

API je na `http://127.0.0.1:5000`, a razvojni proxy sprječava hardkodiranje URL-a
po komponentama.

## Provjera u firmi

- prijava i odjava preko korporativno dostupnog Keycloak-a;
- uloge i dozvole za svaki postojeći poslovni profil;
- liste, paginacija, filteri i detalji narudžbi;
- kreiranje nacrta, autosave, predaja i otkazivanje narudžbe;
- workflow zadaci i protokol;
- upload, download i verzionisanje dokumenata;
- obavještenja, revizijski trag i izvještaji;
- PostgreSQL migracije i health endpointi;
- ponašanje nakon isteka i osvježavanja sesije.

## Granica trenutne migracije

Navigacija, dizajn, dark mode, lokalizacijska osnova, centralni HTTP sloj i stvarni
read endpointi su pripremljeni. Kompleksne forme i workflow akcije nisu proglašene
završenim samo zato što postoji njihova ruta. Njih treba migrirati vertikalno,
feature po feature, uz OpenAPI tipove i provjeru u poslovnoj mreži.

## Zatečeno stanje provjera

- .NET Release build prolazi bez grešaka, uz 76 upozorenja iz postojećeg koda.
- `Microsoft.OpenApi 2.0.0` ima prijavljenu ranjivost visoke ozbiljnosti
  (`NU1903`) i treba ga planski nadograditi uz regenerisanje i provjeru OpenAPI-ja.
- `AngleSharp 1.2.0` ima prijavljenu ranjivost umjerene ozbiljnosti (`NU1902`).
- Test projekt traži `bunit 1.37.9`, ali NuGet razrješava `1.38.5` (`NU1603`).
- Postoji konflikt EF Core Relational verzija `9.0.1` i `9.0.5` u API testovima.
- Od 2.087 .NET testova, 2.086 prolazi. Jedan postojeći Application test pada:
  rola `AM` sadrži `orders.sign-consent`, ali ta vrijednost nije registrirana u
  `AppPermissions.All`. Poslovno pravilo nije automatski promijenjeno migracijom.
