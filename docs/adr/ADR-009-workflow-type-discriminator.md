# ADR-009: WorkflowType kao domenski diskriminator FL/PL

**Status:** Accepted (problem riješen; preostali tehnički dug dokumentovan)  
**Kategorija:** B — Domen i poslovni model  
**Owner:** Arhitekta / Domain Expert  
**Datum donošenja:** Decembar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Kada se eliminira `ClientType` string kolona iz baze (budući migration task)  
**Zahvaćeni moduli:** Domain, Application, Infrastructure, Api  
**User Stories:** US-1 (FL workflow), US-PL (PL workflow)

---

## Kontekst

Sistem podržava dva odvojena poslovna puta: **FL** (fizička lica) i **PL** (pravna lica). Ova dva puta dijele ~85% iste logike ali se razlikuju u: izboru vještaka (AutoSelect za FL, QuoteRequest bidding za PL), validaciji identifikatora klijenta (JMBG za FL, matični broj za PL) i dostupnosti određenih workflow koraka.

Tokom inicijalnog razvoja, razlikovanje između FL i PL workflowa implementirano je kroz string polje `ClientType` ("FL" ili "PL") na `AppraisalOrder`. S rastom sistema, identifikovano je da 7 mjesta u kodu koristi direktno string poređenje umjesto domenski tipiziranog pristupa.

---

## Decision Drivers

- **Domenski izraz** — FL/PL razlika je fundamentalni poslovni koncept koji treba biti izražen kroz domenski tip, ne string literale
- **Backward kompatibilnost** — narudžbe s `ClientType` stringom već postoje u bazi; migracija mora biti postupna
- **Izbjegavanje TPH naslijeđivanja** — 85% zajedničke logike između FL i PL ne opravdava odvojene klase s zajedničkim parent-om

---

## Odluka

Dodan je `WorkflowType` enum (`FizickaLica | PravnaLica`) na `AppraisalOrder` kao kanonski diskriminator, s tri computed property za bezbedan pristup:

```csharp
public WorkflowType? WorkflowType { get; private set; }  // nullable za stare zapise
public WorkflowType EffectiveWorkflowType =>
    WorkflowType ?? WorkflowTypes.FromClientType(ClientType);
public bool IsFL() => EffectiveWorkflowType == WorkflowTypes.FromClientType("FL");
public bool IsPL() => EffectiveWorkflowType == WorkflowTypes.FromClientType("PL");
```

**Pravilo**: Sav novi kod i svi refaktorisani dijelovi koriste `IsFL()` i `IsPL()`. Direktan pristup `ClientType` stringu dozvoljen je samo za backward-compat slučajeve (prikaz u UI-u, legacy upiti).

### Zašto jedan entitet, ne nasljeđivanje

| Aspekt | Jedan entitet + enum | TPH nasljeđivanje |
|--------|---------------------|-------------------|
| 85% zajednička logika | ✓ Prirodno | ✓ Kroz parent klasu |
| Discriminator u bazi | String "FL"/"PL" | EF discriminator kolona |
| Kompleksnost upita | Jednostavno | Jednostavno (TPH je jedna tablica) |
| Promjena tipa narudžbe | ✓ UPDATE WorkflowType | ✗ DELETE + INSERT drugog tipa |

Odabran je jedan entitet jer je promjena WorkflowType-a narudžbe (hipotetički scenario) bez brisanja zapisa prirodnija. TPT (Table Per Type) odbačen zbog JOIN overhead-a bez jasne koristi.

---

## Alternativna rješenja

| Opcija | Backward compat | Domenski tip | Migracija | Zašto nije izabrana |
|--------|----------------|-------------|-----------|---------------------|
| **Jedan entitet + WorkflowType enum** ✓ | ✓ (nullable fallback) | ✓ | Postupna | — |
| TPH nasljeđivanje | ✗ (zahtijeva migraciju svih zapisa) | ✓ | Skupo | Zahtijeva brisanje i rekriranje svih AppraisalOrder zapisa s novim discriminator tipom |
| Zadržati string ClientType | ✓ | ✗ | Nema | Ostaje žarište grešaka; 7 direktnih string poređenja će nastaviti rasti |

---

## Consequences

### Pozitivne
- Nove metode koje razlikuju FL/PL koriste `IsFL()` umjesto `order.ClientType == "FL"` — bez string literala u logici
- `WorkflowType` enum omogućava compile-time provjeru exhaustiveness u switch izrazima
- Refaktoring identificirao je 7 mjesta gdje je logika bila implementirana samo za jedan path — bugovi koji su potencijalno latentni

### Negativne
- Dva paralelna mehanizama diskriminacije (`WorkflowType` enum i `ClientType` string) koegzistiraju dok se ne eliminira `ClientType` kolona — to je izvor konfuzije za novog developera
- `EffectiveWorkflowType` computed property je neočekivan za dev koji nije upoznat s historijatom

### Svjesno prihvaćeni kompromisi
- Prihvatamo koegzistenciju dvije reprezentacije tipa tokom prijelaznog perioda jer hard cutover (migracija svih zapisa odjednom) nosi rizik za produkcijsku bazu s aktivnim narudžbama.

---

## Tehnički dug

- **Eliminacija `ClientType` kolone**: U budućoj migraciji, `ClientType` polje treba biti uklonjeno iz tabele i iz svih UI prikaza koji ga direktno koriste. Preduslovi: (a) `WorkflowType` enum popunjen za sve postojeće zapise, (b) svi UI prikazi ažurirani na domenski prikaz.

---

## Migration Impact

- **Breaking Changes:** Nema za trenutnu implementaciju — `WorkflowType` je nullable i koegzistira s `ClientType`
- **Rollback Plan:** `WorkflowType` kolona može biti ignorisana bez ikakvih posljedica; `ClientType` ostaje funkcionalan
- **Compatibility:** Stari zapisi (bez `WorkflowType`) nastavljaju raditi kroz `EffectiveWorkflowType` fallback

---

## Kada revidirati

- Eliminacija `ClientType` kolone bude planirana — tada ovaj ADR treba ažurirati sa statusom "Completed"
- Pojavi se treći tip workflow-a (npr. "Poslovni subjekti" koji nije ni FL ni PL) — tada enum treba biti proširen i `EffectiveWorkflowType` logika ažurirana
