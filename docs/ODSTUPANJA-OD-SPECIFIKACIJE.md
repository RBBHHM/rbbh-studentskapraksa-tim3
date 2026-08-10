# Odstupanja od specifikacije sistema (dev-lead zadatak)

> **Grana:** `feature/dev-lead-spec-uskladjivanje` (sa `develop`).
> **Svrha:** popis stvari koje **`DokumentacijaSistema`** zahtijeva, a na `develop` **nisu** (ili su samo
> djelimično) implementirane. Ovo je **odvojeno** od 12 user storija Sprinta 3 (faktura, izvještaji,
> finalizacija procjene) — ta odstupanja se ovdje **ne ponavljaju**.
> Na kraju dokumenta je **prompt za Claude Opus** koji precizno opisuje kako doraditi sistem na ovoj grani.

## Metodologija
Pročitana je cijela `DokumentacijaSistema` (sekcije 1–7) i uporedena s kodom na `develop`. Svaka stavka ima
**status pouzdanosti**: `POTVRĐENO` (pročitan kod koji to dokazuje) ili `ZA PROVJERU` (spec to traži; postoji
srodan kod, ali kompletnost nije potvrđena — fix-agent prvo verificira, pa dorađuje). Stavke koje su VEĆ
ispravno implementirane (FL auto-izbor vještaka, faktura tok, CO odobrenje, notifikacijska infrastruktura s email
threadingom, GO-toggle za vještaka, masovni import protokola) **nisu** ovdje — one su u redu.

---

## ✅ REZULTAT VERIFIKACIJE I DORADE (ažurirano nakon prolaska kroz cijeli sistem)

Nakon detaljne provjere koda, **većina početno sumnjivih odstupanja je VEĆ bila ispravno implementirana**.
Stvarna dorada je mala i precizna.

| ID | Stavka | Verifikovano stanje | Akcija |
|----|--------|---------------------|--------|
| **D1** | Iznos naknade na narudžbenici se nije čitao iz protokola (bio ručni `request.Iznos`) | **Stvarna rupa** | ✅ **Popravljeno** — `OrderDocumentGeneratorService` sada koristi `AppraisalFee` iz narudžbe (protokol) kad iznos nije proslijeđen ručno; izjava koristi isti izvor. |
| **D1 (urnek-layout)** | Generator gradi ad-hoc Word umjesto da koristi tačan bankovni `.docx` layout | Djelimično — službeni urneci POSTOJE i seeduju se (`DocumentTemplateSeeder` + `src/Infrastructure/Templates/*`), ali za sam workflow dokument se generiše strukturisani sadržaj. Pravi merge nije moguć bez tokena (službeni `.docx` nema placeholder-e, a izjava je legacy `.doc`). | Ostavljeno kao svjesna odluka (rizik > korist); funkcionalni cilj (eliminacija ručnog prepisivanja) zadovoljen jer se svi podaci čitaju iz protokola. |
| **D2** | Cjenovnik → auto-naknada po tipu | Cjenovnik je dostupan u kućici „Dokumentacija" (SharedDocument); `AppraisalFee` se evidentira; spec naknadu izvodi iz uplatnice/saglasnosti (urađeno). Auto-cijena po tipu = opciono poboljšanje, ne striktni AC. | Nije rađeno (opciono). |
| **D3** | Urneci u Dokumentaciji + ovlaštenja (vještak download / CO update) | **VEĆ urađeno** — `DocumentTemplateSeeder` seeduje narudžbenicu, izjavu i Urnek1-8 s `AllowedRoles` (Vjestak/CO/CA); `DocumentTemplateEndpoints` + `Dokumentacija.razor`. | Nije potrebno. |
| **D4** | ZK/KKP padajući meni napomena | **VEĆ urađeno** — `DocumentUploadSection.razor` sadrži sve napomene (mjesec/90 dana, čitak, otkup, doživotno izdržavanje, zabrana opterećenja). | Nije potrebno. |
| **D5** | Auto-adresa poslovnice iz šifarnika | **VEĆ urađeno** — `CreateOrder.razor` (`OnBranchChanged`) povlači `Branch.Address` iz šifarnika i puni `_branchAddress`. | Nije potrebno. |
| **D6** | Kombinacije tipa kolaterala (kolona H) | **VEĆ urađeno** — šifarnik `kombinovani_tipovi_kolaterala` u `seed/codebooks.json` ima tačno: `APP_STAN_I_GARAZA`, `APP_STAN_I_OSTAVA`, `APP_STAN_GARAZA_I_OSTAVA`. | Nije potrebno. |

**Zaključak:** sistem je u odnosu na širu specifikaciju **vrlo usklađen**. Jedina stvarna korekcija u ovoj
dorada-iteraciji je **D1 (iznos iz protokola)**. Napomena: lokalni build nije moguć jer mašina ima .NET 9 SDK,
a projekat cilja .NET 10 (`NETSDK1045`) — provjeru build/test radi CI na PR-u i ručni test prije merge-a.

> Detaljna izvorna analiza D1–D6 (prije verifikacije) ostaje ispod kao trag rezonovanja.

---

## D1 — Generisanje narudžbenice i izjave NE koristi službene urneke banke · `POTVRĐENO` · **Visok**

**Spec (sekcija 4):** Nakon izbora vještaka CA pokreće generisanje gdje se podaci iz Protokola narudžbi
**automatski upisuju u službeni urnek „narudžbenica“** (prilog 9), a zatim se identični podaci **kopiraju iz
narudžbenice u „izjavu“** (prilog 10). Plavo označena polja u dokumentima su mjesta gdje se podaci umeću
(klijent, kontakt, adresa/grad nekretnine, adresa za dostavu, broj protokola, iznos — pojavljuje se 4× na
narudžbenici, ZK oznaka k.č./br. ZK/KKP u izjavi). Cilj je eliminisati ručni copy-paste.

**Stanje u kodu:** `src/Infrastructure/Documents/OrderDocumentGeneratorService.cs` gradi **ad-hoc** Word
dokumente iz koda (`OpenXml`, `AddTitle/AddField/...`) — **ne popunjava službene `.docx` urneke**. Mehanizam
predložaka **postoji ali se ne koristi za ovo**: `DocumentTemplate` entitet, `DocumentTemplateConfiguration`,
`DocumentTemplateSeeder`, migracija `20260621120000_AddDocumentTemplates`. Iznos je `request.Iznos` (ručno),
nije povučen iz protokola/cjenovnika (vidi D2).

**Šta uraditi:** generisati narudžbenicu i izjavu **iz službenih urneka** (prilog 9/10 + Urnek1-8 iz priloga 13)
kroz `DocumentTemplate` mehanizam: učitati `.docx` predložak, zamijeniti imenovane oznake (merge-field/placeholder)
podacima iz `OrderProtocolEntry`/`AppraisalOrder`, sačuvati kao dokument narudžbe. Podatke u izjavu povući iz
narudžbenice (jedinstven izvor istine). Zadržati postojeći fallback samo ako predložak nedostaje.

---

## D2 — Cjenovnik procjena nije kodificiran kao izvor naknade po tipu · `ZA PROVJERU` · **Srednji**

**Spec (sekcija 2):** Postoji cjenovnik (prilog 3, `CjenovnikZaIzraduProcjena.xlsx`): stan 200 KM, kuća 350 KM,
stambeno-poslovni 450 KM, garaža ulazi u cijenu stana (doplata po procjeni vještaka). Cjenovnik se uploaduje u
kućicu „Dokumentacija“, može se ažurirati od strane službe kolaterala, a iznos s uplatnice (FL)/saglasnosti (PL)
se preslikava u polje **„Naknada za procjenu (KM)“** (kolona U → `AppraisalFee`).

**Stanje u kodu:** `AppraisalFee` polje postoji i puni se (`ProtocolOrderMapper`, `AppraisalOrderService`), ali
**nema cjenovnik-modela** (`PriceList`/`Cjenovnik`) koji bi po tipu nekretnine određivao/validirao cijenu.
Naknada nije auto-izvedena iz tipa kolaterala niti unakrsno provjerena s uploadovanom uplatnicom.

**Šta uraditi:** verificirati postoji li auto-popunjavanje naknade iz cjenovnika po tipu; ako ne — uvesti
cjenovnik (šifarnik/konfiguracija: tip → cijena, ažurljiv od kolaterala) i predlagati/validirati `AppraisalFee`
po tipu kolaterala. Cjenovnik dostupan u Dokumentaciji.

---

## D3 — Urneci za izradu procjene (po tipu kolaterala) u kućici Dokumentacija · `ZA PROVJERU` · **Srednji**

**Spec (sekcija 4, prilog 13):** Svi urneci za izradu procjene (Urnek1-8, po tipu kolaterala) importovani su u
aplikaciju u kućicu „Dokumentacija za pregled“; **vještak** ima ovlaštenje samo da skine urneke, **CO** može
naknadno ažurirati urneke.

**Stanje u kodu:** postoje `SharedDocument`, `DocumentTemplate`, `Dokumentacija.razor`, `DocumentTemplateSeeder`.
Nije potvrđeno da su svih 8 urneka stvarno uvezeni i da su ovlaštenja (vještak download / CO update) tačno
postavljena za tu kategoriju.

**Šta uraditi:** verificirati uvoz svih urneka i ovlaštenja; dopuniti seed/ovlaštenja ako fali.

---

## D4 — Padajući meni napomena na ZK/KKP u kućici Prodaja · `ZA PROVJERU` · **Nizak-srednji**

**Spec (sekcija 2):** U polju ZK (kućica Prodaja) vidljiv padajući meni s napomenama: „Ne stariji od mjesec
dana“, „Čitak dokument“, „Otkup druge banke (procjena samo ako je otkup)“, upozorenja o **doživotnom
izdržavanju u B/C listu** i **zabrani opterećenja/otuđenja** (tada se procjena ne naručuje / briše se C list).
Polje KKP: napomena „Ne stariji od 90 dana“. Plus manuelni unos.

**Stanje u kodu:** validacija starosti dokumenata je implementirana (commit „Implementacija validacije starosti
dokumenata“); `DocumentUploadSection.razor` postoji. Nije potvrđeno da su **sve** tekstualne napomene prisutne
kao vidljiv padajući meni Prodaji.

**Šta uraditi:** verificirati i dopuniti napomene (padajući meni + manuelni unos) tačno po spec tekstu za ZK i KKP.

---

## D5 — Auto-povlačenje adrese poslovnice iz šifarnika org. jedinica · `ZA PROVJERU` · **Nizak**

**Spec (sekcija 2, prilog 2 `SifreOrgJed`):** Polje „Adresa poslovnice za dostavu original procjene“ u kućici
Prodaja **automatski se povlači** iz šifarnika poslovnica (šifra novo — kolona A), zavisno iz koje filijale je
inicirana narudžba.

**Stanje u kodu:** postoje `Branch`/`City`, `BranchSeeder`, `BranchQueryService`, FK `BranchId`. Nije potvrđeno
da se `BranchAddress` auto-popunjava iz šifarnika pri inicijaciji (umjesto ručnog unosa).

**Šta uraditi:** verificirati auto-povlačenje adrese poslovnice; vezati na šifru org. jedinice ako fali.

---

## D6 — „Tip kolaterala kombinovano“ (kolona H) — kombinacije u padajućem meniju · `ZA PROVJERU` · **Nizak**

**Spec (sekcija 3):** U kućici CA i u Protokolu narudžbi (kolona H) padajući meni mora sadržavati kombinacije:
**APP-stan garaža i ostava**, **APP-stan i garaža**, **APP-stan i ostava** (pored postojećih tipova).

**Stanje u kodu:** `CombinedCollateralTypeId` postoji; commit „Dopuna tipova kolaterala“ sugeriše da je djelimično
urađeno. Nije potvrđeno da su sve tri kombinacije u šifarniku.

**Šta uraditi:** verificirati i dopuniti šifarnik kombinacija ako fali.

---

## Sažetak prioriteta

| ID | Odstupanje | Status | Prioritet |
|----|------------|--------|-----------|
| D1 | Narudžbenica/izjava ne koriste službene urneke | POTVRĐENO | **Visok** |
| D2 | Cjenovnik → auto-naknada po tipu | ZA PROVJERU | Srednji |
| D3 | Urneci procjene u Dokumentaciji + ovlaštenja | ZA PROVJERU | Srednji |
| D4 | ZK/KKP padajući meni napomena | ZA PROVJERU | Nizak-srednji |
| D5 | Auto-adresa poslovnice iz šifarnika | ZA PROVJERU | Nizak |
| D6 | Kombinacije tipa kolaterala (kolona H) | ZA PROVJERU | Nizak |

---

# PROMPT ZA CLAUDE OPUS (dorada na grani `feature/dev-lead-spec-uskladjivanje`)

> Kopiraj sve ispod kao zadatak agentu.

```
Radiš na .NET 10 / Clean Architecture / Blazor Server / PostgreSQL projektu (namespace Praksa.*),
na grani `feature/dev-lead-spec-uskladjivanje` (granata sa `develop`). Cilj: uskladiti sistem sa
`DokumentacijaSistema` po listi odstupanja D1–D6 iz `docs/ODSTUPANJA-OD-SPECIFIKACIJE.md`.
Ne diraj funkcionalnosti 12 user storija Sprinta 3 (faktura, izvještaji, finalizacija procjene).

Pravila:
- Prati postojeće konvencije: interfejs u Application, implementacija u Infrastructure, registracija kroz
  IFeatureModule; endpointi kroz IEndpointModule; API vraća DTO; autorizacija preko AppPolicies.*; sve na
  bosanskom; async/await; audit za bitne akcije; bez migracija osim ako je nužno (i tada jedna, čista).
- Za SVAKU stavku sa statusom „ZA PROVJERU“: PRVO pročitaj relevantni kod i potvrdi je li zaista rupa.
  Ako je već implementirano, zabilježi to i preskoči — ne pravi duplikate. Ako jeste rupa, implementiraj.
- Radi malim, logički zaokruženim commitovima (jedan po odstupanju). Build i `dotnet test` moraju ostati zeleni.

Redoslijed rada:

1) D1 (POTVRĐENO, prioritet): Prebaci `OrderDocumentGeneratorService` da narudžbenicu i izjavu generiše
   POPUNJAVANJEM službenih `.docx` urneka kroz postojeći `DocumentTemplate` mehanizam, umjesto ad-hoc
   građenja Worda. Učitaj predložak, zamijeni imenovane oznake/merge-fieldove podacima iz `OrderProtocolEntry`
   i `AppraisalOrder` (klijent, kontakt+telefon, adresa i grad nekretnine, adresa za dostavu, broj protokola,
   iznos naknade — na narudžbenici se pojavljuje na 4 mjesta, ZK oznaka/k.č./br. ZK/KKP u izjavi). Izjavu puni
   podacima iz narudžbenice (jedinstven izvor). Predloške registruj/seeduj iz priloženih urneka
   (NarudžbenicaZaProcjenuVrijednostiImovineBr, Izjava, Urnek1-8 po tipu kolaterala). Zadrži fallback samo ako
   predložak nedostaje. Pokrij testom (generisani dokument sadrži ključne podatke).

2) D2: Provjeri auto-popunjavanje „Naknada za procjenu (KM)“ (`AppraisalFee`). Ako se ne izvodi iz cjenovnika,
   uvedi cjenovnik (tip kolaterala → cijena; stan 200, kuća 350, stambeno-poslovni 450 KM; ažurljiv od službe
   kolaterala) i predloži/validiraj `AppraisalFee` po tipu. Cjenovnik učini dostupnim u kućici „Dokumentacija“.

3) D3: Provjeri da su urneci za izradu procjene (po tipu kolaterala) uvezeni u „Dokumentaciju“ i da su
   ovlaštenja tačna (vještak: samo download; CO: ažuriranje). Dopuni seed/ovlaštenja ako fali.

4) D4: Provjeri ZK/KKP padajući meni napomena u kućici Prodaja (`DocumentUploadSection.razor`). Dopuni sve
   napomene iz spec teksta (mjesec/90 dana, čitak, otkup druge banke, doživotno izdržavanje B/C list, zabrana
   opterećenja/otuđenja) + manuelni unos.

5) D5: Provjeri auto-povlačenje adrese poslovnice iz šifarnika org. jedinica (`Branch`/`City`) u kućicu Prodaja;
   veži na šifru org. jedinice ako se ne povlači automatski.

6) D6: Provjeri da šifarnik kombinacija tipa kolaterala (kolona H) sadrži: „APP-stan garaža i ostava“,
   „APP-stan i garaža“, „APP-stan i ostava“. Dopuni ako fali.

Na kraju: kratak izvještaj šta je od D1–D6 bilo stvarna rupa i šta je urađeno, te otvori PR prema `develop`.
```
