# Sprint 3 — T1 (Reporting foundation) + backend izvještaja

Grana: `feature/dev-lead-spec-uskladjivanje`. Implementirano direktno (dev lead), nakon prolaska kroz
`DokumentacijaSistema` i priloge te provjere cijelog sistema.

## Zašto je obim širi od „samo T1"
Provjerom sistema otkriveno je da **frontend izvještaja već postoji i radi** — stranica `/izvjestaji`
(`Components/Pages/ComingSoonIzvjestaji.razor`, uprkos imenu) ima pun UI za koncentraciju vještaka (5 opcija)
i pregled narudžbi sa 7 vremena, te poziva `GET /api/reports/concentration` i `GET /api/reports/timeline`.
**Ali backend (`ReportEndpoints`) je bio prazan stub** → cijela kućica „Izvještaji" nije radila. To je
„nije u skladu sa specifikacijom", pa je dorađeno zajedno s T1 temeljom da feature radi end-to-end.

## Šta je urađeno

### 1. Reporting foundation (T1)
- `IExcelReportBuilder` (`src/Application/Reports/`) + `ClosedXmlReportBuilder` (`src/Infrastructure/Reports/`) —
  zajednički xlsx generator (ClosedXML je već bio referenciran u projektu).
- `ReportsFeatureModule` — auto-discovery DI registracija (ne dira `DependencyInjection.cs`).
- Nove role: **`SpecijalniRacuni`**, **`Racunovodstvo`** (za PL fakturu, US-F2/F3) — dodane u `AppRoles`,
  `RolePermissionMatrix`, `RolePermissionSeeder` (SystemRoles + Keycloak sync).
- **Bonus fix:** rola `Likvidatura` je postojala u matrici i `AppRoles`, ali je **nedostajala u seeder
  `SystemRoles`** (nije se seedovala kao RoleDefinition/Keycloak) — dodana.

### 2. Backend izvještaja (US 9 + US 10) — da postojeći UI radi
- `IReportService` + `ReportService`:
  - **Koncentracija vještaka (US 9), 5 opcija** nad završenim procjenama, na zadati datum:
    1=Grad, 2=Procjenitelj, 3=Tip kolaterala (G+H), 4=Grad+Procjenitelj, 5=Grad+Procjenitelj (zadnji mjesec).
  - **Pregled svih narudžbi + 7 vremenskih kolona (US 10)** s krajnjim datumom:
    K→P, P→V, V→Y, Y→AB, AB→AC, Grand total (K→AB), Grand total Prodaja (P→AB).
    Mapiranje kolona potvrđeno iz priloga 1 (`TabelaExcelZaMasovniUpdatePodataka.xlsx`).
- `ReportEndpoints` (popunjen stub): `GET /api/reports/concentration?option=&asOfDate=` i
  `GET /api/reports/timeline?endDate=`, oboje vraćaju xlsx, zaštićeno `AppPolicies.ReportsGenerate`
  (CA/CO/Administrator već imaju permisiju).

### 3. Infrastrukturni fix
- `.gitignore`: pravilo `reports/` (mentor izvještaji) bilo je neusidreno i ignorisalo je **`src/**/Reports/`**
  (case-insensitive FS) — promijenjeno u `/reports/` (samo root). Bez ovoga, sav reporting kod (i kolega T2–T5)
  bi se tiho gubio iz commita.

## Napomena o specifikaciji vs. implementacija
- Izvještaji koriste postojeću permisiju **`reports.generate`** (već dodijeljena CA/CO/Admin i provjeravana u
  UI-u), umjesto 3 granularne (`reports.concentration/orders/reminder`) iz planskog dokumenta T1 — radi
  konzistentnosti s postojećim kodom i da se ne razbije postojeća stranica.
- **US 11 (reminder vještaku)** nije rađen ovdje (postojeći UI ga nema) — ostaje za T4.
- Provjereno: spec stavke D2–D6 iz `ODSTUPANJA-OD-SPECIFIKACIJE.md` su već bile implementirane; D1 (iznos
  narudžbenice iz protokola) je ranije popravljen na ovoj grani.

## Kako testirati
1. Pokreni API + BlazorApp (ili docker compose). Prijavi se kao CA/CO/Administrator.
2. Otvori **Izvještaji** u meniju (`/izvjestaji`).
3. **Koncentracija:** izaberi opciju (1–5), opciono datum → „Generiši Excel" → preuzima se
   `koncentracija-vjestaka-YYYYMMDD.xlsx`.
4. **Pregled narudžbi:** opciono krajnji datum → „Generiši Excel" → `pregled-narudzbi-YYYYMMDD.xlsx`
   sa svim poljima + 7 vremenskih kolona.
5. Provjeri da se xlsx otvara i da brojevi/grupiranja imaju smisla za seed podatke.

> Build/test nije pokrenut lokalno (mašina ima .NET 9 SDK, projekat cilja .NET 10 — `NETSDK1045`).
> Kompilaciju/testove validira CI na PR-u; molim ručni test prije merge-a.
