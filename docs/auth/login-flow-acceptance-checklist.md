# Login tok — Prihvaćajuća provjera (Acceptance Checklist)

Ova lista se koristi za **manualno testiranje** login toka i preusmeravanja.
Svaka stavka se provjerava u staging/dev okruženju prije finalnog puštanja.

> Verzija dokumenta: 1.0  
> Autor: Amina  
> QA tim je odgovoran za izvršavanje ove liste.

---

## Preduvjeti

- [ ] Keycloak realm je konfiguriran (test okruženje)
- [ ] Kreirana su testna korisnička računa za svaku rolu
- [ ] Backend API je pokrenut i dostupan
- [ ] Blazor frontend je pokrenut i konfigurisan da koristi test Keycloak

---

## AC-01 — Uspješan login za rolu Administrator

**Koraci:**
1. Otvori aplikaciju u browseru
2. Klikni "Prijavi se"
3. Unesi kredencijale korisnika s rolom `Administrator`
4. Potvrdi login na Keycloak stranici

**Očekivano:**
- [ ] Keycloak token je izdan
- [ ] `GET /api/me` vraća status 200
- [ ] `roles` u odgovoru sadrži `"Administrator"`
- [ ] `permissions` uključuje `"admin.access"` i `"codebooks.manage"`
- [ ] `defaultRoute` = `"/admin/dashboard"`
- [ ] Frontend otvara `/admin/dashboard`

---

## AC-02 — Uspješan login za rolu Unosnik

**Koraci:**
1. Prijavi se kao korisnik s rolom `Unosnik`

**Očekivano:**
- [ ] `roles` = `["Unosnik"]`
- [ ] `permissions` uključuje `"records.create"`, `"codebooks.view"`
- [ ] `permissions` NE uključuje `"admin.access"`, `"codebooks.manage"`
- [ ] `defaultRoute` = `"/unosnik/dashboard"`
- [ ] Frontend otvara `/unosnik/dashboard`

---

## AC-03 — Uspješan login za rolu Verifikator

**Koraci:**
1. Prijavi se kao korisnik s rolom `Verifikator`

**Očekivano:**
- [ ] `roles` = `["Verifikator"]`
- [ ] `permissions` uključuje `"records.view-pending-verification"`, `"records.approve"`
- [ ] `permissions` NE uključuje `"records.create"`, `"admin.access"`
- [ ] `defaultRoute` = `"/verifikator/dashboard"`
- [ ] Frontend otvara `/verifikator/dashboard`

---

## AC-04 — Korisnik bez ikakve role

**Koraci:**
1. Kreiraj testni korisnički račun bez dodijeljenih rola u Keycloak-u
2. Prijavi se tim računom

**Očekivano:**
- [ ] Token je izdan (Keycloak prihvata korisnika)
- [ ] `/api/me` vraća `roles: []`, `permissions: []`
- [ ] `defaultRoute` = `"/no-access"`
- [ ] Frontend prikazuje stranicu s porukom "Nemate dodijeljena prava. Kontaktirajte administratora."

---

## AC-05 — Korisnik s više rola (Unosnik + Verifikator)

**Koraci:**
1. Kreiraj testni korisnički račun s rolama `Unosnik` i `Verifikator`
2. Prijavi se tim računom

**Očekivano:**
- [ ] `roles` = `["Unosnik", "Verifikator"]` (redosljed može varirati)
- [ ] `permissions` = unija permission-a obje role
- [ ] `defaultRoute` = `"/verifikator/dashboard"` (Verifikator ima viši prioritet od Unosnik)
- [ ] Korisnik može kreirati zapis (ima `records.create`)
- [ ] Korisnik može pregledati zapis čekajući verifikaciju (ima `records.view-pending-verification`)

---

## AC-06 — Zabrana samoverifikacije (EC-AUTH-13)

**Koraci:**
1. Prijavi se kao korisnik s rolama `Unosnik + Verifikator`
2. Kreiraj novi zapis
3. Pokušaj verificirati vlastiti zapis

**Očekivano:**
- [ ] Backend vraća 403 Forbidden
- [ ] Poruka greške objašnjava zabranu samoverifikacije
- [ ] Zapis ostaje u stanju "čekanje verifikacije"

---

## AC-07 — Pristup zaštićenom modulu bez permission-e

**Koraci:**
1. Prijavi se kao `Unosnik`
2. Ručno navigiraj na `/admin/dashboard` u browseru

**Očekivano:**
- [ ] Backend vraća 403 za sve API pozive koji zahtijevaju `admin.access`
- [ ] Frontend prikazuje "Nemate pristup ovoj stranici" ili redirect na vlastiti dashboard

---

## AC-08 — Pogrešni kredencijali

**Koraci:**
1. Unesi pogrešnu lozinku na Keycloak login stranici

**Očekivano:**
- [ ] Keycloak prikazuje poruku greške
- [ ] Token nije izdan
- [ ] Aplikacija ostaje na login stranici

---

## AC-09 — Keycloak nedostupan

**Koraci:**
1. Zaustavi Keycloak servis (ili simuliraj nedostupnost)
2. Pokušaj se prijaviti

**Očekivano:**
- [ ] Frontend prikazuje grešku "Servis za autentifikaciju trenutno nije dostupan"
- [ ] Poruka nudi korak "Pokušajte ponovo"
- [ ] Aplikacija ne ostaje u beskonačnom loadingu

---

## AC-10 — Token istekao tokom sesije

**Koraci:**
1. Prijavi se normalno
2. Pričekaj da access token istekne (ili skrati expiry u Keycloak-u za testiranje)
3. Napravi API poziv

**Očekivano:**
- [ ] Backend vraća 401
- [ ] Frontend automatski koristi refresh token za obnovu access tokena
- [ ] API poziv se ponavlja automatski
- [ ] Korisnik ne primjećuje prekid

---

## AC-11 — Refresh token istekao (EC-AUTH-15)

**Koraci:**
1. Prijavi se normalno
2. Ostavi aplikaciju neaktivnom dok i refresh token ne istekne
3. Pokušaj navigirati na novu stranicu

**Očekivano:**
- [ ] Frontend prepoznaje da refresh token nije valjan
- [ ] Redirect na login stranicu
- [ ] Prikazana poruka "Vaša sesija je istekla. Prijavite se ponovo."

---

## AC-12 — Odjava (logout)

**Koraci:**
1. Prijavi se normalno
2. Klikni "Odjava" u aplikaciji

**Očekivano:**
- [ ] Blazor briše lokalni token / sesiju
- [ ] Keycloak sesija je terminirana (Single Sign-Out ako je konfigurisano)
- [ ] Browser redirect na login stranicu
- [ ] Stari token nije prihvaćen pri pokušaju API poziva

---

## AC-13 — `/api/me` bez tokena (EC-AUTH-14)

**Koraci:**
1. Direktno pozovi `GET /api/me` bez Authorization headera (npr. Postman/curl)

**Očekivano:**
- [ ] Backend vraća 401 Unauthorized
- [ ] Tijelo odgovora je ProblemDetails format

---

## AC-14 — Tampered JWT token (EC-AUTH-11)

**Koraci:**
1. Uzmi validan JWT token
2. Izmijeni payload (npr. promijeni role)
3. Pošalji izmijenjeni token u Authorization headeru

**Očekivano:**
- [ ] Backend odbacuje token → 401 Unauthorized
- [ ] Backend **ne koristi** podatke iz tampered tokena

---

## AC-15 — Administrator pristupa Unosnik modulima (EC-AUTH-10)

**Koraci:**
1. Prijavi se kao `Administrator`
2. Navigiraj na `/unosnik/dashboard`

**Očekivano:**
- [ ] Pristup dozvoljen (Administrator ima `records.create` permission)
- [ ] Funkcionalnosti Unosnik modula rade normalno za Administratora
- [ ] (Napomena: rute nisu blokirane po roli nego po permission-u)

---

## Napomene za QA tim

- Svaki AC item treba biti potvrđen u **staging** okruženju
- Rezultati se bilježe u projektni task tracking sistem
- Greške se prijavljuju s koracima za reprodukciju i screenshot-om
- AC-06 (samoverifikacija) i AC-05 (multi-role) su kritični business pravila — prioritet testiranja
