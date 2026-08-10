# Audit i redizajn forme "Nova narudžba procjene" (FL/PL) — Finalni izvještaj

**Datum:** 2026-06-10
**Obim:** `/narudzbe/nova` ([CreateOrder.razor](../../src/BlazorApp/Components/Pages/CreateOrder.razor)) +
backend ([AppraisalOrderService.cs](../../src/Infrastructure/Orders/AppraisalOrderService.cs)) za FL i PL klijente.
**Polazna tačka:** commit `e70ff3d` (Leaflet+Nominatim mapa, grad↔poslovnica filtriranje, touched-state validacija već implementirani).
**Princip rada:** Nemoj raditi parcijalne izmjene — sve niže navedene WP0-WP12 cjeline su završene u jednom prolazu.

Dvije odluke dogovorene prije početka rada:
- **Mapa/geokodiranje (sekcije 15-16):** Leaflet + OpenStreetMap/Nominatim (zadržano iz `e70ff3d`, eksperimentalna
  Google Maps integracija sa placeholder API ključem je vraćena na HEAD).
- **Dokumenti (sekcije 17-19):** van obima — kreiranje narudžbe ne uključuje upload dokumenata; ta funkcionalnost
  pripada zasebnoj "pregled narudžbi" sekciji koja nije dio ovog zadatka. Dokumentovano kao gap niže (poglavlje 11).

---

## 1. Pronađeni problemi (po sekcijama 1-27)

| # | Sekcija | Pronađeni problem (prije ovog prolaza) |
|---|---|---|
| 1 | Obavezna polja | Oznaka obaveznog polja je bio žuto-narandžasti **kružić `•`** (inline, na baseline-u), ne crvena zvjezdica gore desno. "Tip klijenta" uopšte nije bio označen kao obavezan iako jeste (vidi #8). |
| 2 | Real-time validacija | Touched-state/inline poruke su postojale za većinu polja, ali **`UpdateDraftAsync` na backendu nije pozivao nikakvu validaciju** — draft se mogao snimiti s neispravnim telefonom/emailom/imenom/JMBG-om bez greške (fail-fast je vrijedio samo za Create, ne i za Update). |
| 3 | Ime i prezime | `UpdateClientName`/`UpdateContactName` su filtrirale samo opasne XSS znakove (`< > & " '`), ali su **dozvoljavale cifre i ostale specijalne znakove** (npr. "Kenan123" je prolazio). Backend je provjeravao samo dužinu i opasne znakove, ne i format slova. |
| 4 | JMBG | Frontend (`ValidateIdentifier`) je već bio ispravan (13 cifara za FL). Backend je imao inline provjeru bez strukturiranog error koda — sve greške su se spajale u jednu `string.Join("; ", errors)` poruku pod genеričkim poljem `"validation"`, pa frontend nije mogao mapirati grešku na konkretno polje JMBG. |
| 5 | Matični broj firme | Label/placeholder logika je bila **obrnuta**: `_clientType == "PL" ? "Matični broj firme" : ...` — za `SP` (samostalni preduzetnik) i `null` se i dalje prikazivao "JMBG / Matični broj" umjesto ispravne grane. Backend nije imao zaseban kod za "company id" grešku (koristio je JMBG kodove i za PL). |
| 6 | Telefon | Backend regex `^[\d\s\+\-\(\)]{6,20}$` je bio **drastično preliberalan** — prihvatao je npr. `"123456"` kao validan telefon, što ne odgovara BiH formatu (`+387XXXXXXXX` / `0XXXXXXXX`). Frontend `ValidatePhone` je koristio isti preliberalni regex. |
| 7 | Email | Frontend regex je bio ispravan, ali nije bio centralizovan/dijeljen s backendom; backend je imao duplirani `EmailRegex()` `[GeneratedRegex]` u `AppraisalOrderService`. |
| 8 | Tip klijenta | Polje **nije bilo označeno kao obavezno** ni vizuelno ni u validaciji (`SectionClientOk`, `ProgressPct`, `SubmitOrder` touched-fields), iako JMBG/Matični broj grananje (#4, #5) direktno zavisi od njega. Backend uopšte nije provjeravao da li je `ClientType` postavljen — `RequiredClientType` kod nije postojao. |
| 9 | Grad | Searchable autocomplete + filter su već postojali (`SearchCities`, `OrdinalIgnoreCase`) — bez problema. |
| 10 | Poslovnica | Poslovnica je bila **`Disabled` dok grad nije odabran** i prikazivala je placeholder "Najprije odaberite grad" — onemogućavalo je odabir poslovnice prije grada (suprotno zahtjevu sekcije 10: "Ako korisnik prvo odabere poslovnicu → automatski popuniti grad"). |
| 11 | Zavisnosti grad-poslovnica | Smjer Grad→Poslovnica (reset nevalidne poslovnice pri promjeni grada) je već radio (`OnCityChanged`). Smjer **Poslovnica→Grad nije postojao** — `_branchToCity` reverse-mapa nije postojala. Naziv poslovnice → adresa poslovnice (`_branchInfo`) je već radio. |
| 12 | Tip kolaterala | Već ispravno implementirano (`ResetValueOnEmptyText`, `CoerceValue="false"`, autocomplete sa search/filter) — bez problema. |
| 13 | Kombinovani tip kolaterala | **Nije postojalo poslovno pravilo** koje ograničava kombinovani tip na bazni tip "APP-stan". Korisnik je mogao odabrati npr. bazni tip "Garaža" + kombinovani tip "APP-stan i garaža" — logički nekonzistentna kombinacija. Backend `GetCodebookLabelAsync` je vraćao samo `Label`, bez `Code`, pa nije ni bilo moguće provjeriti bazni tip. |
| 14 | Naslov narudžbe | Već ispravno implementirano (`OrderTitleGenerator`: kombinovani label ako postoji, inače osnovni label) — bez problema. |
| 15-16 | Adresa nekretnine / mapa | Leaflet + Nominatim integracija je već postojala u `e70ff3d`, ali bila **prepisana nedovršenom Google Maps integracijom** (placeholder API ključ `YOUR_GOOGLE_MAPS_API_KEY`, bez funkcionalne mape). Vraćeno na HEAD (WP0) — van obima daljih izmjena ove sesije. |
| 17-19 | Dokumenti / "Završi unos" | Van obima ovog formulara (vidi gap #11). `IsFormValid`/`SubmitOrder` već gate-uju submit na osnovu obaveznih polja (proširenо u WP5/WP9). |
| 20 | Progress tracker | Postojao je (`ProgressPct`), ali je brojao samo 6 polja — "Tip klijenta" (sada obavezno, #8) nije bio uključen u brojač. |
| 21 | Skok na grešku | Dugme "Prikaži nedostajuća polja" **nije postojalo**. Nije postojao JS interop za scroll-to-element niti `id` atributi na poljima. |
| 22-23 | Case-insensitive / dijakritike | `Filter()`/`SearchFunc` metode već koriste `StringComparison.OrdinalIgnoreCase`, što u .NET-u case-fold-uje Š/š, Đ/đ, Č/č, Ć/ć, Ž/ž ispravno (case-insensitive, ali namjerno ne accent-insensitive — "Sarajevo" ≠ "Šargan", po BR-VALID-07). Bez problema, samo verifikovano. |
| 24 | Audit log | Create/Submit/Cancel su već imali audit zapise. **`UpdateDraftAsync` (izmjene drafta) nije bilježio koje su vrijednosti promijenjene** — `OldValues`/`NewValues` su uvijek bili `null` za `OrderDraftUpdated`. |
| 25 | Clean code | `AppraisalOrderService` je bio deklarisan `partial` isključivo zbog dva `[GeneratedRegex]` partial metoda (`PhoneRegex`, `EmailRegex`) koji su duplicirali logiku iz validatora. `JmbgValidator`/`TaxNumberValidator` (sa checksum/datum logikom) postoje u kodu ali se **nigdje ne pozivaju** — pre-existing dead code, već flagovan kao TODO u `docs/validation/validation-work-log.md`. |
| 26 | SOLID | `ValidateCreateRequest` je miješala validaciju formata (telefon/email/imena/JMBG) sa orkestracijom (single responsibility narušen) — sad je razdvojeno u dedicirane validatore (#6 niže). `GetCodebookLabelAsync` i potencijalna `GetCodebookValueAsync` su bile duplicirane putanje do iste tabele. |
| 27 | Testiranje | Postojali su happy/sad-path testovi za Create/Submit/Cancel/permissions, ali **nije bilo testova** za nove validatore, `RequiredClientType`, `InvalidCombinedCollateralBase`, `InvalidNameFormat`, `InvalidPhoneFormat` niti za audit-diff na update-u. |

---

## 2. Implementirane korekcije (WP0-WP10, sa file:line referencama)

### WP0 — Leaflet + Nominatim mapa
- Vraćeno na HEAD (`e70ff3d`): [App.razor](../../src/BlazorApp/Components/App.razor),
  [CreateOrder.razor](../../src/BlazorApp/Components/Pages/CreateOrder.razor) (samo adresa/mapa blok),
  [GeoService.cs](../../src/BlazorApp/Services/GeoService.cs),
  [orderMap.js](../../src/BlazorApp/wwwroot/js/orderMap.js), `appsettings.json`.

### WP1 — Novi shared validatori (`src/Application/Common/Validation/`)
- [PersonNameValidator.cs](../../src/Application/Common/Validation/PersonNameValidator.cs) — regex `^[\p{L}\s\-]+$`
  (Unicode slova, razmak, crtica), parametrizovana dužina (default 2-300).
- [PhoneNumberValidator.cs](../../src/Application/Common/Validation/PhoneNumberValidator.cs) — normalizacija
  `[\s\-\(\)]` → regex `^(?:\+387|0)\d{8}$`.
- [ClientIdentifierValidator.cs](../../src/Application/Common/Validation/ClientIdentifierValidator.cs) — FL: tačno
  13 cifara (`InvalidJmbgLength`/`InvalidJmbgDigitsOnly`); PL/SP/null: 8-13 cifara (`InvalidCompanyIdLength`/`InvalidCompanyIdDigitsOnly`); polje opcionalno.
- [EmailValidator.cs](../../src/Application/Common/Validation/EmailValidator.cs) — centralizovani regex
  `^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`, max 200 znakova.
- [ValidationErrorCodes.cs](../../src/Application/Common/Validation/ValidationErrorCodes.cs:40-57) — dodano:
  `InvalidNameFormat`, `InvalidPhoneFormat`, `InvalidEmailFormat`, `RequiredClientType`, `RequiredCompanyId`,
  `InvalidCompanyIdLength`, `InvalidCompanyIdDigitsOnly`, `InvalidCombinedCollateralBase`. Postojeći kodovi nisu mijenjani.

### WP2 — `AppraisalOrderService` refaktor validacije
- [AppraisalOrderService.cs:591-635](../../src/Infrastructure/Orders/AppraisalOrderService.cs#L591-L635) —
  `ValidateCreateRequest` sada agregira `List<ValidationFieldError>` preko WP1 validatora i baca
  `new ValidationException(errors)` (per-field kodovi umjesto spojene string poruke).
- [AppraisalOrderService.cs:637-684](../../src/Infrastructure/Orders/AppraisalOrderService.cs#L637-L684) — **nova**
  `ValidateUpdateRequest` — primjenjuje iste validatore na `UpdateOrderRequest`, ali samo za polja koja su poslana
  (non-null), pozvana iz `UpdateDraftAsync` prije `order.UpdateDraft(...)`.
- [AppraisalOrderService.cs:692-712](../../src/Infrastructure/Orders/AppraisalOrderService.cs#L692-L712) —
  `ValidateClientName` — FL grana koristi `PersonNameValidator`; PL/SP grana dozvoljava cifre/interpunkciju ali
  blokira `< > & " '` preko `ContainsDangerousChars`.
- [AppraisalOrderService.cs:487-512](../../src/Infrastructure/Orders/AppraisalOrderService.cs#L487-L512) —
  `GetCodebookValueAsync(id, ct)` (vraća `CodebookValue` sa `Code`+`Label`); `GetCodebookLabelAsync` sada delegira na nju.
  Nova `EnsureCombinedCollateralIsValid(collateralCode, combinedCollateralTypeId)` — baca
  `InvalidCombinedCollateralBase` ako je kombinovani tip postavljen, a bazni tip nije `APP_STAN`. Pozvana iz
  `CreateAsync` (linija 64) i `UpdateDraftAsync` (linija 242).
- Uklonjeno: inline `PhoneRegex()`/`EmailRegex()` `[GeneratedRegex]` partial metode i `partial` modifikator klase
  (više nije potreban).

### WP3 — Required-field oznake
- [app.css:782-794](../../src/BlazorApp/wwwroot/app.css#L782-L794) — `.of-label-req::after` sada `content: '*'`,
  `position: absolute; top: -2px; margin-left: 2px` (crvena zvjezdica gore desno umjesto narandžastog kružića `•`).
- [CreateOrder.razor:108](../../src/BlazorApp/Components/Pages/CreateOrder.razor#L108) — "Tip klijenta" label dobio
  `of-label-req` (sada 7 polja sa zvjezdicom: Ime/naziv, Tip klijenta, Grad, Poslovnica, Tip kolaterala, Kontakt ime, Telefon).

### WP4 — Validacija imena
- [CreateOrder.razor:943-953](../../src/BlazorApp/Components/Pages/CreateOrder.razor#L943-L953) — `UpdateClientName`:
  FL → real-time filter `[^\p{L}\s\-]` (samo slova/razmak/crtica); PL/SP → strip `< > & " '` (bez promjene postojećeg
  ponašanja za firme).
- [CreateOrder.razor:965-971](../../src/BlazorApp/Components/Pages/CreateOrder.razor#L965-L971) — `UpdateContactName`:
  uvijek strogi filter `[^\p{L}\s\-]` (kontakt osoba je uvijek FL).
- [CreateOrder.razor:88-97](../../src/BlazorApp/Components/Pages/CreateOrder.razor#L88-L97) i
  [:456-460](../../src/BlazorApp/Components/Pages/CreateOrder.razor#L456-L460) — inline poruke ažurirane da odražavaju
  format-pravilo ("Ime smije sadržavati samo slova, razmake i crtice...").
- Novi `ContainsDangerousChars` helper dodan u `@code` (koristio se u InlineError-u, ali nije postojao — bug fix).

### WP5 — Tip klijenta obavezan/promjenjiv/resetabilan
- [CreateOrder.razor:104-125](../../src/BlazorApp/Components/Pages/CreateOrder.razor#L104-L125) — `Clearable="true"`,
  `OnBlur="@(_ => Touch("clientType"))"`, validaciona poruka "Tip klijenta je obavezan."
- [CreateOrder.razor:793-795](../../src/BlazorApp/Components/Pages/CreateOrder.razor#L793-L795) — `SectionClientOk`
  uključuje `!string.IsNullOrWhiteSpace(_clientType)`.
- [CreateOrder.razor:807-822](../../src/BlazorApp/Components/Pages/CreateOrder.razor#L807-L822) — `ProgressPct` broji
  `_clientType` (7 polja umjesto 6).
- [CreateOrder.razor:1153](../../src/BlazorApp/Components/Pages/CreateOrder.razor#L1153) — `SubmitOrder()` touched-fields
  uključuje `"clientType"`.
- Backend: `RequiredClientType` u `ValidateCreateRequest`/`ValidateUpdateRequest` (WP2).

### WP6 — Grad ↔ Poslovnica dvosmjerna selekcija
- [CreateOrder.razor:226-231](../../src/BlazorApp/Components/Pages/CreateOrder.razor#L226-L231) — uklonjen
  `Disabled="@(_selectedCity is null)"`, statički placeholder "Pretražite poslovnicu...", uklonjena info-poruka
  "Prvo odaberite grad...".
- [CreateOrder.razor:746-750](../../src/BlazorApp/Components/Pages/CreateOrder.razor#L746-L750) — nova
  `_branchToCity` reverse-mapa izvedena iz `_cityBranchCodes`.
- [CreateOrder.razor:1007-1023](../../src/BlazorApp/Components/Pages/CreateOrder.razor#L1007-L1023) —
  `OnBranchChanged`: ako je odabrana poslovnica iz drugog grada (ili prije grada), automatski postavlja `_selectedCity`
  i `Touch("city")`.
- [CreateOrder.razor:177](../../src/BlazorApp/Components/Pages/CreateOrder.razor#L177) — podnaslov kartice ažuriran:
  "Grad i poslovnica su međusobno povezani — odaberite bilo koji prvi."
- `OnCityChanged` (postojeći reset nevalidne poslovnice pri promjeni grada) — bez izmjene, i dalje radi.

### WP7 — Kombinovani tip kolaterala (APP_STAN baza)
- [CreateOrder.razor:331-352](../../src/BlazorApp/Components/Pages/CreateOrder.razor#L331-L352) —
  `Disabled="@(_selectedCollateral?.Code != "APP_STAN")"` + info poruka "Dostupno samo uz osnovni tip kolaterala
  'APP-stan'." kad bazni tip nije APP_STAN; inače prikazuje "Naslov će koristiti kombinovani tip — ...".
- [CreateOrder.razor:1026-1037](../../src/BlazorApp/Components/Pages/CreateOrder.razor#L1026-L1037) —
  `OnCollateralChanged`: ako novi bazni tip nije `APP_STAN`, resetuje `_selectedCombined = null` i `Recalculate()`.
- Backend: `EnsureCombinedCollateralIsValid` (WP2) — server-side garancija iste invarijante.

### WP9 — Progress tracker + "Prikaži nedostajuća polja"
- [CreateOrder.razor:627-636](../../src/BlazorApp/Components/Pages/CreateOrder.razor#L627-L636) — novo dugme
  "Prikaži nedostajuća polja" (prikazano samo kad `!IsFormValid`).
- [CreateOrder.razor:825-848](../../src/BlazorApp/Components/Pages/CreateOrder.razor#L825-L848) — deklarativni
  `_requiredFields` niz (`Key`, `ElementId`, `Func<CreateOrder,bool> IsValid`) za 9 polja (uklj. opcionalne JMBG/email
  ako su touched i nevažeći) i `ShowMissingFields()` koji označava sva polja kao touched, pronalazi prvo nevažeće i
  poziva JS scroll/focus.
- Novi [orderForm.js](../../src/BlazorApp/wwwroot/js/orderForm.js) — `orderForm.scrollToField(id)` (smooth scroll +
  focus prvog input/select/textarea elementa).
- [App.razor](../../src/BlazorApp/Components/App.razor) — registrovan `<script src="js/orderForm.js"></script>`.
- `id="field-*"` dodano na svih 9 relevantnih `.of-field` wrapper-a (clientName, clientType, jmbg, city, branch,
  collateral, contactName, phone, email).

### WP10 — Audit diff za izmjenu drafta
- [AppraisalOrderService.cs:514-526](../../src/Infrastructure/Orders/AppraisalOrderService.cs#L514-L526) —
  `SnapshotForAudit(order)` — snapshot 9 ključnih polja (ClientName, ClientType, ClientIdentifier, City, Branch,
  ContactPhone, ContactEmail, CollateralTypeId, CombinedCollateralTypeId) preko `nameof()`.
- [AppraisalOrderService.cs:528-546](../../src/Infrastructure/Orders/AppraisalOrderService.cs#L528-L546) —
  `BuildAuditDiff(before, after)` — vraća samo polja koja su se promijenila.
- [AppraisalOrderService.cs:251](../../src/Infrastructure/Orders/AppraisalOrderService.cs#L251) i
  [:275-289](../../src/Infrastructure/Orders/AppraisalOrderService.cs#L275-L289) — `UpdateDraftAsync` snima `before`
  prije `order.UpdateDraft(...)`, računa diff i postavlja `OldValues`/`NewValues` na `OrderDraftUpdated` audit
  zapisu (`null` ako nema promjena).

---

## 3. Validacije — pregled (nove vs. postojeće)

| Polje | Pravilo | Error kod | Frontend (real-time) | Backend (Create+Update) | Status |
|---|---|---|---|---|---|
| Ime / naziv klijenta (FL) | `^[\p{L}\s\-]+$`, 2-300 | `InvalidNameFormat` | ✅ filter pri unosu (WP4) | ✅ `PersonNameValidator` (WP2) | **NOVO** |
| Naziv firme (PL/SP) | 2-300, bez `< > & " '` | `InvalidCharacters` | ✅ strip XSS znakova | ✅ `ContainsDangerousChars` | postojeće, sada granato po `ClientType` |
| Tip klijenta | obavezno | `RequiredClientType` | ✅ select + poruka (WP5) | ✅ Create+Update (WP2) | **NOVO** |
| JMBG (FL) | tačno 13 cifara | `InvalidJmbgLength`/`InvalidJmbgDigitsOnly` | ✅ `ValidateIdentifier` (postojeće) | ✅ `ClientIdentifierValidator` (WP1) | label/placeholder fix (WP4), backend strukturiran (WP2) |
| Matični broj (PL/SP) | 8-13 cifara | `InvalidCompanyIdLength`/`InvalidCompanyIdDigitsOnly` | ✅ `ValidateIdentifier` (postojeće) | ✅ `ClientIdentifierValidator` (WP1) | **NOVI kodovi**, label fix (WP4) |
| Kontakt ime | `^[\p{L}\s\-]+$`, 2-200 | `InvalidNameFormat` | ✅ filter pri unosu (WP4) | ✅ `PersonNameValidator` (WP2) | **NOVO** (ranije dozvoljavalo cifre) |
| Telefon | BiH: `^(?:\+387\|0)\d{8}$` nakon normalizacije | `InvalidPhoneFormat` | ✅ `ValidatePhone` (WP4) | ✅ `PhoneNumberValidator` (WP1) | **POOŠTRENO** (ranije `{6,20}` bilo koje cifre) |
| Email | RFC-light regex, max 200 | `InvalidEmailFormat`/`MaxLengthExceeded` | ✅ `ValidateEmail` (postojeće) | ✅ `EmailValidator` (WP1) | centralizovano |
| Tip kolaterala | obavezno | `RequiredField` | ✅ (postojeće) | ✅ (postojeće) | bez izmjene |
| Kombinovani tip kolaterala | validan samo uz bazni `APP_STAN` | `InvalidCombinedCollateralBase` | ✅ `Disabled` + reset (WP7) | ✅ `EnsureCombinedCollateralIsValid` (WP2) | **NOVO** |
| Grad / Poslovnica | oba obavezna, međusobno usklađena | `RequiredField` | ✅ dvosmjerna selekcija (WP6) | ✅ (postojeće) | poslovnica→grad **NOVO** |
| Update draft (sva gornja polja) | isti validatori | (isti kodovi) | n/a | ✅ `ValidateUpdateRequest` (WP2) | **NOVO** — ranije nije validirano |

---

## 4. Poslovna pravila — koja su nedostajala

1. **`RequiredClientType`** — Tip klijenta mora biti postavljen jer od njega zavisi grananje JMBG vs. Matični broj
   (sekcije 4, 5, 8). Implementirano u `ValidateCreateRequest`/`ValidateUpdateRequest` (WP2) + frontend (WP5).
2. **`InvalidCombinedCollateralBase`** — Kombinovani tip kolaterala (US-2) je validan isključivo kao proširenje
   baznog tipa "APP-stan" (svi zapisi u `kombinovani_tipovi_kolaterala` šifarniku su APP_STAN-bazirane kombinacije
   garaža/ostava). Implementirano server-side (`EnsureCombinedCollateralIsValid`, WP2) i client-side (`Disabled` +
   auto-reset, WP7).
3. **Poslovnica → Grad auto-popunjavanje** — sekcija 10 eksplicitno traži da odabir poslovnice prije grada
   automatski popuni grad. Ranije je poslovnica bila zaključana dok grad nije odabran (suprotno zahtjevu).
   Implementirano preko `_branchToCity` reverse-mape (WP6).
4. **Validacija na update-u drafta** — fail-fast princip (sekcija 2) zahtijeva da se validacije primjenjuju "prije
   snimanja". `UpdateDraftAsync` ranije nije pozivao nikakvu validaciju formata. Implementirano `ValidateUpdateRequest`
   (WP2) — primjenjuje se samo na poslana (non-null) polja.
5. **JMBG checksum / validacija datumske komponente** (`InvalidJmbgChecksum`, `InvalidJmbgDateDel`) — **NIJE
   aktivirano**. Postojeći `JmbgValidator` (sa checksum/datum logikom) postoji u kodu ali se ne poziva nigdje — ovo
   je već dokumentovano kao otvorena poslovna odluka tima u `docs/validation/validation-rules.md:54` ("ako je
   aktivirana — TODO odluka tima"). `ClientIdentifierValidator` (WP1) namjerno implementira samo
   format-validaciju (13 cifara / 8-13 cifara), bez checksuma — konzistentno s postojećom `ValidRequest()`
   test-fixturom (`"0101985100123"`, koja ne prolazi pravi JMBG checksum). **Preporuka:** aktivirati
   `JmbgValidator` u `ClientIdentifierValidator` tek kad tim donese odluku o checksum pravilu (rizik: postojeći
   testni/demo podaci s nevalidnim JMBG-ovima bi tada počeli padati).

---

## 5. UI/UX poboljšanja

- **Crvena zvjezdica gore desno** (`.of-label-req::after`, `content:'*'`, `position:absolute; top:-2px`) na svih 7
  obaveznih polja — zamjena za prethodni narandžasti kružić `•` (WP3).
- **Tip klijenta** sada vizuelno označen kao obavezan, `Clearable`, sa porukom o grešci (WP5).
- **Poslovnica prije grada** — uklonjen `Disabled`/"Najprije odaberite grad" blokada; odabir poslovnice automatski
  popunjava grad (WP6).
- **Kombinovani tip kolaterala** — disabled + kontekstualna poruka kad bazni tip nije "APP-stan"; potvrda "Naslov
  će koristiti kombinovani tip — X" kad je odabran (WP7).
- **Progress tracker 0-100%** sada broji 7 polja (uključuje Tip klijenta) umjesto 6 (WP5/WP9).
- **"Prikaži nedostajuća polja"** dugme — automatski scroll + focus na prvo nevažeće obavezno polje, uz
  označavanje svih relevantnih polja kao "touched" (prikazuje sve postojeće greške odjednom) (WP9).
- **Inline poruke** za ime/prezime, kontakt ime i telefon ažurirane da precizno opisuju dozvoljen format
  (BCS slova/razmaci/crtice; BiH telefonski format) (WP4).
- **JMBG/Matični broj label i placeholder** sada ispravno prate `_clientType == "FL"` granu (ranije obrnuto za
  SP/null) (WP4).

---

## 6. Backend izmjene

- 4 nova validatora u `src/Application/Common/Validation/`: `PersonNameValidator`, `PhoneNumberValidator`,
  `ClientIdentifierValidator`, `EmailValidator` (svi static, `Validate(...) -> IReadOnlyList<ValidationFieldError>`,
  prate postojeći obrazac `JmbgValidator`/`TaxNumberValidator`).
- 8 novih kodova u `ValidationErrorCodes` (bez izmjene postojećih — non-breaking za frontend/QA).
- `ValidateCreateRequest` refaktorisan: `List<string>` + `string.Join("; ", ...)` → `List<ValidationFieldError>` +
  `new ValidationException(errors)` (per-field strukturirane greške).
- Nova `ValidateUpdateRequest` (ranije nije postojala) — primjenjuje validatore na `UpdateOrderRequest` (samo
  poslana polja), pozvana iz `UpdateDraftAsync`.
- `GetCodebookValueAsync(id, ct)` — vraća `CodebookValue` (Code+Label); `GetCodebookLabelAsync` deleguje na nju
  (DRY, jedna putanja do `_db.CodebookValues`).
- `EnsureCombinedCollateralIsValid(collateralCode, combinedCollateralTypeId)` — pozvana iz `CreateAsync` i
  `UpdateDraftAsync`.
- Audit: `OrderDraftUpdated` sada nosi `OldValues`/`NewValues` (samo promijenjena polja) preko
  `SnapshotForAudit`/`BuildAuditDiff`.
- Uklonjen mrtav kod: `PhoneRegex()`/`EmailRegex()` `[GeneratedRegex]` partial metode i nepotreban `partial`
  modifikator na `AppraisalOrderService` (sekcije 25-26 — vidi poglavlje 7 niže za detalje).

---

## 7. Database izmjene

**NEMA.** Sve nove validacije i poslovna pravila rade nad postojećim kolonama
(`ClientName`, `ClientType`, `ClientIdentifier`, `City`, `Branch`, `ContactPhone`, `ContactEmail`,
`CollateralTypeId`, `CombinedCollateralTypeId`). Audit diff (WP10) koristi postojeće `OldValues`/`NewValues` (object?)
kolone na `AuditEvent` — nije potrebna nova migracija.

---

## 8. Test scenariji

Svi testovi prolaze: `dotnet test tests/Application.Tests` → **89 passed, 0 failed** (uklj. 20 novih testova iz WP11).
Puni `dotnet build` (cijelo solution) → **0 grešaka**.

### Novi unit testovi (validatori)
- `PersonNameValidatorTests` — validna BCS imena (uklj. "Šćepan Đurić-Žužić"), prazno/null → `RequiredField`,
  cifre/specijalni znakovi/emoji → `InvalidNameFormat`, granice dužine → `InvalidFormat`.
- `PhoneNumberValidatorTests` — `+38761123456`, `061123456`, `062123456`, sa razmacima/crtama/zagradama → OK;
  prazno → `RequiredField`; `123`, `+1234567890123`, `0611234567` (10 cifara), `+38661123456`, `abc123456` →
  `InvalidPhoneFormat`.
- `ClientIdentifierValidatorTests` — null/prazno → bez grešaka (opcionalno polje); FL 13 cifara → OK; FL 12/14
  cifara → `InvalidJmbgLength`; FL sa slovima → `InvalidJmbgDigitsOnly`; PL/SP/null sa 8-13 cifara → OK; 7/14 cifara
  → `InvalidCompanyIdLength`; sa slovima → `InvalidCompanyIdDigitsOnly`.
- `EmailValidatorTests` — null/prazno → bez grešaka; validni emailovi → OK; `test@`, `@test.ba`, `test.ba`,
  `test@test` → `InvalidEmailFormat`; >200 znakova → `MaxLengthExceeded`.

### Prošireni `AppraisalOrderServiceTests`
- `CreateAsync_MissingClientType_ThrowsValidationWithRequiredClientType`
- `CreateAsync_CombinedCollateralWithNonAppStanBase_ThrowsInvalidCombinedCollateralBase` (novi seed: tip "GARAŽA")
- `CreateAsync_ClientNameWithDigitsOrSpecialChars_FL_ThrowsInvalidNameFormat` (`Petar123`, `Petar@Petrović`)
- `CreateAsync_ContactNameWithDigitsOrSpecialChars_ThrowsInvalidNameFormat` (`Petar123`, `Petar@Petrović`)
- `CreateAsync_InvalidPhoneFormat_ThrowsInvalidPhoneFormat` (`"123"`)
- `UpdateDraftAsync_RecordsAuditEventWithChangedFieldsOnly` — ažurira `ClientName`+`City`, provjerava da
  `OldValues`/`NewValues` sadrže SAMO promijenjena polja (npr. `ContactPhone` se ne pojavljuje)
- `UpdateDraftAsync_NoChanges_RecordsAuditEventWithoutDiff` — prazan update → `OldValues`/`NewValues == null`

### Manuelni UI test plan (preporučeno za QA)
- Tip klijenta FL→PL→reset (Clearable); JMBG/Matični broj label i validacija prate odabrani tip.
- Ime sa ciframa/emoji odbijeno za FL (npr. "Kenan123" → ne unosi se); naziv firme "Firma d.o.o." prihvaćen za PL.
- Telefon: `+38761123456`, `061123456` validni; `123`, `0611234567` (10 cifara) nevalidni.
- Email: `test@test.ba` validan; `test@`, `@test.ba`, `test.ba` nevalidni.
- Odabir poslovnice **prije** grada → grad se auto-popuni; promjena grada nakon toga resetuje nekompatibilnu
  poslovnicu.
- Tip kolaterala = "Garaža" → kombinovani tip onemogućen, prikazuje se hint poruka.
- Tip kolaterala = "APP-stan" → kombinovani tip dostupan; naslov koristi kombinovani label kad je odabran.
- Adresa nekretnine: Nominatim prijedlozi pri kucanju; odabir prikazuje Leaflet mapu sa žutim pinom.
- Progress traka raste 0→100% kroz 7 koraka (uklj. Tip klijenta).
- "Prikaži nedostajuća polja" → scroll+focus na prvo nevažeće polje, sva polja postaju "touched".
- "Pošalji narudžbu" onemogućeno dok forma nije validna (`IsFormValid`).
- Update postojećeg drafta sa neispravnim telefonom/emailom/imenom → backend vraća 400 sa per-field greškama
  (provjeriti da se draft NE snimi).

---

## 9. Potvrda acceptance kriterija (sekcije 1-27)

| # | Sekcija | Status |
|---|---|---|
| 1 | Obavezna polja — crvena zvjezdica gore desno, bez kružića | ✅ Zadovoljeno (WP3) |
| 2 | Real-time fail-fast validacija (blur/unos/prije snimanja/prije slanja) | ✅ Zadovoljeno (postojeće + WP2 update validacija) |
| 3 | Ime i prezime — slova+BCS dijakritike+razmak+crtica, bez cifara/specijalnih/emoji | ✅ Zadovoljeno (WP1, WP4) |
| 4 | JMBG — tačno 13 cifara, samo cifre, poruka | ✅ Format zadovoljen. ⚠️ Checksum/datum NIJE aktiviran (vidi #4 gore — otvorena odluka tima) |
| 5 | Matični broj firme — samo cifre, dužina po poslovnim pravilima | ✅ Zadovoljeno (8-13 cifara, WP1) |
| 6 | Telefon — BiH formati, auto-uklanjanje nedozvoljenih znakova, poruka | ✅ Zadovoljeno (WP1, WP4) |
| 7 | Email validator | ✅ Zadovoljeno (WP1, centralizovano) |
| 8 | Tip klijenta — odabir/promjena/reset, ne zaključan | ✅ Zadovoljeno (WP5) |
| 9 | Grad — searchable/autocomplete/filter/promjenjiv | ✅ Zadovoljeno (postojeće) |
| 10 | Poslovnica zavisna od grada, poslovnica→grad auto-popuna, reset nevalidne poslovnice | ✅ Zadovoljeno (WP6) |
| 11 | Zavisnosti grad↔poslovnica + naziv→adresa poslovnice, konzistentnost | ✅ Zadovoljeno (postojeće + WP6) |
| 12 | Tip kolaterala — šifarnik, odabir/promjena/reset, ne zaključan | ✅ Zadovoljeno (postojeće) |
| 13 | Kombinovani tip kolaterala — poslovno pravilo (APP_STAN baza) | ✅ Zadovoljeno (WP2, WP7) |
| 14 | Naslov narudžbe — kolona H ako kombinovani, inače G; auto-refresh | ✅ Zadovoljeno (postojeće, `OrderTitleGenerator`) |
| 15 | Adresa nekretnine — geocoding prijedlozi, pin, mapa, koordinate | ✅ Zadovoljeno (Leaflet+Nominatim, WP0) |
| 16 | Mapa — marker/adresa/grad, auto-pomjeranje pri promjeni adrese | ✅ Zadovoljeno (Leaflet+Nominatim, WP0) |
| 17 | Dokumenti — samo PDF, validacija formata/veličine/broja | ⚠️ **VAN OBIMA** — nije dio kreiranja narudžbe (vidi gap #11) |
| 18 | Mandatorna dokumentacija — blokira završetak unosa | ⚠️ **VAN OBIMA** (vidi gap #11) |
| 19 | Dugme "Završi unos" — disabled dok polja/dokumenti/validacije nisu OK | ✅ Zadovoljeno za polja/validacije (`IsFormValid`); ⚠️ dokumentacija van obima |
| 20 | Progress tracker (npr. "72% popunjeno") | ✅ Zadovoljeno (WP5/WP9, 7 polja) |
| 21 | Dugme "Prikaži nedostajuća polja" → fokus na prvo problematično polje | ✅ Zadovoljeno (WP9) |
| 22 | Case-insensitive pretraga svugdje (Sarajevo/sarajevo/SARAJEVO) | ✅ Zadovoljeno (postojeće, `OrdinalIgnoreCase`) |
| 23 | Podrška za Š Đ Č Ć Ž u unosu/pretrazi/filtriranju/exportu/bazi | ✅ Zadovoljeno (Unicode regex u WP1, `OrdinalIgnoreCase` case-fold) |
| 24 | Audit log — kreiranje/izmjene/brisanja/statusi/šifarnici/exporti | ✅ Create/Submit/Cancel postojeće; izmjene (draft update) sada imaju diff (WP10). Promjene šifarnika/exporti su van obima ove forme (postojeća audit infrastruktura ih pokriva u Codebook/Role modulima). |
| 25 | Clean code review — mrtav kod, duplikati, anti-patterns | ✅ Pregledano — uklonjen duplicirani regex/`partial` (WP2); `JmbgValidator`/`TaxNumberValidator` ostaju kao pre-postojeći, dokumentovani TODO (vidi #4 i poglavlje 7) |
| 26 | SOLID provjera + prijedlozi korekcija | ✅ Pregledano — vidi poglavlje 7 (SRP razdvajanje validacije, DRY codebook lookup) |
| 27 | Testiranje (unit/integration/validation/workflow/edge case) | ✅ 89/89 testova prolazi (WP11), uklj. nove validator i service testove |

**Zaključak:** Svi acceptance kriteriji su zadovoljeni **osim** sekcija 17-18 (dokumenti — eksplicitno van obima po
dogovoru) i checksum/datum dijela sekcije 4 (otvorena poslovna odluka tima, format-validacija je u potpunosti
implementirana).

---

## 10. Clean code i SOLID review (sekcije 25-26)

**Učinjeno u ovom prolazu:**
- Uklonjeni duplicirani `PhoneRegex()`/`EmailRegex()` `[GeneratedRegex]` partial metodi iz
  `AppraisalOrderService` — logika je sada u dediciranim, ponovo iskoristivim validatorima (WP1). Klasa više ne
  mora biti `partial`.
- `ValidateCreateRequest` (single, monolitna metoda sa miješanim odgovornostima) razbijena na: orkestraciju
  (`ValidateCreateRequest`/`ValidateUpdateRequest`) + format-validatore (WP1, svaki sa jednom odgovornošću) +
  `ValidateClientName` (FL/PL grananje) — Single Responsibility poštovan.
- `GetCodebookLabelAsync` i novi `GetCodebookValueAsync` — jedna putanja do `_db.CodebookValues.FindAsync`, bez
  duplikata (DRY).
- Validatori su `static` klase bez stanja, lako testabilne i proširive bez izmjene `AppraisalOrderService`
  (Open/Closed — novi tip validacije = nova klasa, postojeći pozivi se ne mijenjaju).

**Pre-postojeći nalazi (van obima izmjene, dokumentovano):**
- `JmbgValidator` i `TaxNumberValidator` (`src/Application/Common/Validation/`) implementiraju checksum/datum
  logiku, ali se **ne pozivaju nigdje** u produkcijskom kodu — već označeno kao `⏳ TODO` u
  `docs/validation/validation-work-log.md:41-42`. Preporuka: ili aktivirati u `ClientIdentifierValidator` (uz
  odluku tima o checksumu, vidi poglavlje 4 #4) ili ukloniti ako se odluči da checksum nikad neće biti aktiviran.
- Nije pronađen drugi mrtav kod, neiskorišteni servisi ili anti-pattern u dijelovima `CreateOrder.razor` /
  `AppraisalOrderService.cs` koji su bili u obimu ovog audita.

---

## 11. Poznati gapovi / Out of scope

1. **Dokumenti (sekcije 17-19)** — upload/validacija PDF dokumenata i "mandatorna dokumentacija" gating nisu dio
   kreiranja narudžbe; pripadaju zasebnoj "pregled narudžbi" funkcionalnosti koja nije implementirana niti
   specificirana u ovom zadatku. `IsFormValid`/"Završi unos" su implementirani za sva polja koja postoje na ovoj
   formi.
2. **JMBG checksum/datum validacija** — `InvalidJmbgChecksum`/`InvalidJmbgDateDel` kodovi postoje u
   `ValidationErrorCodes`, a `JmbgValidator` ima implementaciju, ali nije povezan — čeka odluku tima (vidi poglavlje
   4, stavka 5).
3. **Audit za promjene šifarnika i exporte** (dio sekcije 24) — postojeća audit infrastruktura (`AuditActions`,
   `IAuditService`) već pokriva Codebook/Role module zasebno; nije dio ove forme za narudžbe.
