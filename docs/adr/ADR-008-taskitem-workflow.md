# ADR-008: TaskItem — operativni model workflowa i SLA tracking

**Status:** Accepted  
**Kategorija:** B — Domen i poslovni model  
**Owner:** Arhitekta / Domain Expert  
**Datum donošenja:** Novembar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako se uvede zahtjev za paralelnim zadacima unutar jedne narudžbe ili za taskovima koji nemaju jasno definiranog aktera  
**Zahvaćeni moduli:** Domain, Infrastructure, BlazorApp (My Tasks UI)  
**User Stories:** US-1 (CA pregled zadataka), sve — svaki korak workflowa generira TaskItem

---

## Kontekst

State machine (ADR-007) definira koji su prijelazi statusa dozvoljeni. Ali to ne odgovara na operativna pitanja: **ko** treba nešto uraditi? **Do kada?** Kako spriječiti da dva korisnika istovremeno prihvate isti zadatak?

Bez eksplicitnog modela za ove koncepte, pitanja poput "koji su moji aktivni zadaci?" zahtijevaju kompleksne JOIN upite koji kombinuju status narudžbe, ulogu korisnika i poslovne pravila — svaki put iznova implementirani na drugačiji način.

---

## Decision Drivers

- **"Moji zadaci" dashboard** — CA, CO i Vještak trebaju pregled zadataka koji čekaju njihovu akciju, bez potrebe za razumijevanjem workflow statusa
- **SLA tracking** — svaki korak workflowa ima regulatorni ili poslovni rok; kašnjenje mora biti vidljivo
- **Ekskluzivnost prihvatanja** — dva CA ne smiju paralelno prihvatiti isti zadatak; race condition je poslovni rizik
- **Decoupling od status provjere** — "Moji zadaci" UI ne smije ovisiti o kompleksnoj status logici

---

## Odluka

`TaskItem` je domenski entitet koji živi pored `AppraisalOrder` i modelira operativni aspekt workflowa:

```
TaskItem
  ├── AppraisalOrderId    (FK)
  ├── TaskType            (enum: AcceptTask, CompleteDocumentReview, ApproveFinalAppraisal...)
  ├── Title               (human-readable opis)
  ├── Description         (što treba biti napravljeno)
  ├── AssignedRole        (koja uloga je odgovorna: CA, CO, Vještak...)
  ├── DueDate             (SLA rok; nullable za taskove bez roka)
  ├── Status              (Pending → InProgress → Completed | Cancelled)
  ├── IsLocked            (ekskluzivna brava prihvatanja)
  └── AssignedUserId      (koji korisnik drži bravu)
```

**Invarijanta**: Svaka service metoda koja mijenja status narudžbe mora kreirati odgovarajući TaskItem. Ova invarijanta nije automatski provjerena — ona je konvencija zaštićena code reviewom i unit testovima koji asertuju da servis kreira TaskItem.

### Razlika između State Machine i TaskItem

| Aspekt | State Machine | TaskItem |
|--------|--------------|---------|
| Što definira | Koji su prijelazi dozvoljeni | Što treba biti napravljeno sljedeće |
| Vremenska komponenta | Nema | DueDate za SLA |
| Dodjela aktera | Nema | AssignedRole + AssignedUserId |
| Ekskluzivnost | Nema | IsLocked + AssignedUserId brava |
| Historija koraka | Djelimično (kroz status) | Eksplicitna — svaki korak je zapis |

### Brava prihvatanja

```csharp
// CA prihvata zadatak:
TaskItem.Accept(userId, now);
// Ako je IsLocked == true: baca ConflictException("TASK_ALREADY_ACCEPTED")
// Inače: IsLocked = true, AssignedUserId = userId, Status = InProgress
```

Race condition između dva CA koji paralelno šalju Accept zahtjev riješen je optimističkim concurrencyjem (RowVersion na TaskItem — vidi ADR-011).

---

## Alternativna rješenja

| Opcija | "Moji zadaci" upit | SLA tracking | Ekskluzivnost | Historija koraka | Zašto nije izabrana |
|--------|-------------------|-------------|-------------|-----------------|---------------------|
| **TaskItem domenski entitet** ✓ | Trivijalan upit (TaskType + AssignedRole + Status) | ✓ DueDate | ✓ IsLocked | ✓ svaki korak je zapis | — |
| Čisto status-based (bez TaskItem) | Kompleksni JOIN + status analiza po ulozi | Indirektno (CreatedAt + SLA konstanta) | ✗ race condition moguć | ✗ samo trenutni status | Ne može odgovoriti na "koji su moji zadaci" bez kompleksnih upita koji se mijenjaju sa svakim novim tipom zadatka |
| Workflow engine (Hangfire Jobs) | ✓ | ✓ | ✓ | ✓ | Uvodi infrastrukturnu zavisnost; zadaci bi živjeli van domenskog modela; gubi se mogućnost domenskog testiranja |

---

## Consequences

### Pozitivne
- `GET /api/tasks/my` je trivijalan upit: `WHERE assigned_role = @role AND status = Pending AND NOT is_locked`
- SLA kašnjenje je vidljivo direktno: `WHERE due_date < NOW() AND status != Completed`
- Historija zadataka po narudžbi je dostupna kao lista TaskItem zapisa — audit trail operativnih koraka
- Konkurentno prihvatanje zadatka elegantno riješeno bez SELECT FOR UPDATE

### Negativne
- Svaka service metoda mora eksplicitno kreirati TaskItem — propuštanje kreacije nije automatski detektovano
- Rast broja TaskItem zapisa je predvidiv: jedna narudžba može generirati 10–15 TaskItem zapisa; pri velikom volumenu narudžbi (> 10 000 narudžbi godišnje) tablice narastu do milion+ zapisa
- TaskItem tip (TaskType enum) mora biti ažuriran za svaki novi workflow korak — ne postoji automatska derivacija

### Svjesno prihvaćeni kompromisi
- Prihvatamo ručnu konvenciju kreiranja TaskItem-a u svakom servisu jer alternativa — derivacija zadataka iz statusa — nije skalabilna s rastom kompleksnosti workflowa. Konvencija je zaštićena code reviewom i bi mogla biti zaštićena arhitektonskim testom u budućnosti.

---

## Tehnički dug

- Nema automatizovane provjere da li svaka service metoda kreira TaskItem — oslanja se na konvenciju i review
- Arhiviranje starih (Completed/Cancelled) TaskItem zapisa nije implementirano — tablica raste bez gornje granice
- TaskItem DueDate kalkulacija koristi hardkodirane konstante umjesto konfigurabilnih SLA parametara (vidi ADR-027)

---

## Migration Impact

- **Breaking Changes:** Dodavanje novog TaskType enum vrijednosti je backward-compatible
- **Rollback Plan:** TaskItem zapisi mogu biti obrisani bez uticaja na narudžbu (ne sadrže poslovne podatke, samo operativni kontekst)
- **Compatibility:** TaskItem je striktno interan — nije eksponiran kroz API kao samostalan resurs, samo kroz `/api/tasks/my` endpoint

---

## Kada revidirati

- Volumen TaskItem zapisa postane mjerljiv performance problem u upitima (> 1M zapisa)
- Pojavi se zahtjev za paralelnim zadacima unutar jedne narudžbe (npr. CO i CA rade istovremeno)
- Pojavi se zahtjev za delegiranjem zadatka drugom korisniku unutar iste role
