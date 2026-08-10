# ADR-002: Clean Architecture — 4-slojni model

**Status:** Accepted  
**Kategorija:** A — Osnovna arhitektura  
**Owner:** Arhitekta  
**Datum donošenja:** Oktobar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako poslovni model postane pretežno CRUD bez domenskih invarijanti, ili ako tim odluči preći na microservise  
**Zahvaćeni moduli:** Svi  
**User Stories:** Sve — ovo je temeljni strukturni okvir

---

## Kontekst

Sistem digitalizira bankarski proces s kompleksnim poslovnim pravilima: 25+ workflow statusa s strogim prijelaznim pravilima, dva odvojena puta (FL i PL), šest tipova aktera s preklapajućim dozvolama, SLA rokovi, per-order blacklista vještaka, dvofazni import šifarnika. Domenska logika nije trivijalna i mijenja se neovisno od infrastrukturnih detalja (baza, SMTP, file storage).

Pitanje je: gdje živi ova logika i kako je zaštititi od infrastrukturnih promjena?

---

## Decision Drivers

- **Izolacija domenskih invarijanti** — pravila kao "narudžba ne može prijeći u AppraisalReceived bez potvrde vještaka" moraju biti testabilna bez baze podataka
- **Zamjenjivost infrastrukture** — storage (lokalni disk → S3), baza podataka (PostgreSQL), notifikacije (SMTP → push) trebaju biti zamjenjivi bez dodirivanja poslovne logike
- **Testabilnost** — unit testovi poslovne logike ne smiju zahtijevati pokrenuti PostgreSQL server
- **Regulatorna stabilnost** — bankarska pravila se mijenjaju sporim tempom; tehnička infrastruktura brže. Ova razlika treba biti reflektovana u arhitekturi.

---

## Odluka

Stroga četiri sloja s jednosmjernim tokom zavisnosti:

```
Domain (nula vanjskih zavisnosti)
  ↑
Application (zavisi samo od Domain)
  ↑
Infrastructure (zavisi od Application + Domain; implementira interfejse)
  ↑
Api / BlazorApp (zavise od Application; ne smiju referencirati Infrastructure direktno)
```

**Domain** sadrži: entitete (AppraisalOrder, TaskItem, Appraiser...), value objekte, domenski enume, OrderStateMachine, domenski izuzetke.

**Application** sadrži: CQRS command/query handlere, FluentValidation validatore, MediatR pipeline behaviore, interfejse za Infrastructure (ICurrentUserService, IFileStorageProvider, IAuditService...), DTO-ove.

**Infrastructure** sadrži: EF Core DbContext i konfiguracije, implementacije svih Application interfejsa, Keycloak klijente, migracije, seedere.

**Api / BlazorApp** sadrže: endpointe, middleware, DI konfiguraciju, Blazor komponente i servise.

---

## Alternativna rješenja

| Opcija | Izolacija domene | Testabilnost | Boilerplate | Team Fit | Zašto nije izabrana |
|--------|-----------------|-------------|-------------|----------|---------------------|
| **Clean Architecture** ✓ | Potpuna | Visoka | Visok | Srednja (kriva učenja) | — |
| N-tier (Controller–Service–Repository) | Parcijalna | Srednja | Nizak | Visoka (poznato) | Logika curi u servise koji direktno zavise od ORM-a; zamjena EF Core-a dirne sve slojeve |
| Vertical Slice Architecture | Parcijalna | Visoka | Nizak | Srednja | Dijeljena domenski logika (state machine, validacija) teže se organizuje bez duplikacije |
| Microservisi | Potpuna po servisu | Visoka | Izuzetno visok | Niska | Operativna složenost (12+ servisa, service mesh, distribuirani tracing) premašuje korist za ovaj opseg projekta |

---

## Consequences

### Pozitivne
- Domain entiteti (AppraisalOrder i state machine) mogu biti unit testirani bez ikakve infrastrukturne zavisnosti
- Prelazak na drugi ORM ili bazu podataka (hipotetički) ne dirne Domain i Application sloj
- Pipeline behaviori (logging, validation, audit) primjenjuju se konzistentno na sve operacije bez ponavljanja koda

### Negativne
- Svaki novi use case zahtijeva minimalno: Command ili Query klasu, Handler klasu, eventualno Validator klasu, DTO. To je između 3 i 5 fajlova za jednu operaciju.
- Početni onboarding novog programera zahtijeva razumijevanje svih slojeva i njihovih granica — nije intuitivno kao flat Service+Controller pristup
- Interfejsi između slojeva uvode indirekciju koja može otežati tracing koda pri debugging-u

### Svjesno prihvaćeni kompromisi
- Prihvatamo visok boilerplate kao cijenu izolacije domenskih invarijanti. Za sistem s kompleksnim workflow pravilima i regulatornim zahtjevima, ta cijena je opravdana: greška u tranziciji stanja narudžbe ima direktan poslovni i regulatorni impakt koji premašuje trošak pisanja Command+Handler para.

---

## Tehnički dug

Nema strukturnog duga koji ova odluka uvodi. Potencijalni dug: ako programeri ne poštuju granicu zavisnosti (npr. direktno refenciraju Infrastructure iz Api sloja), arhitektura degradira prema N-tier modelu. Ovo treba biti spriječeno arhitektonskim testom (ArchUnitNET ili dependency check u CI-u).

---

## Migration Impact

- **Breaking Changes:** Nije primjenjivo — ovo je inicijalna strukturna odluka
- **Rollback Plan:** Nije praktičan bez kompletnog restrukturiranja koda
- **Compatibility:** Nema posebnih zahtjeva

---

## Kada revidirati

- Sistem postane pretežno CRUD aplikacija bez kompleksnih domenskih invarijanti (malo vjerovatno — bankarski procesi su inherentno kompleksni)
- Tim odluči preći na microservise, gdje svaki servis dobije vlastitu Clean Architecture internu strukturu
- ArchUnitNET dependency check ukaže na sistemsko kršenje granica koje je preskupo ispraviti
