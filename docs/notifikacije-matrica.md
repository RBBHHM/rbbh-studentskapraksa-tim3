# Matrica notifikacija — US 12 (revizija pokrivenosti)

> Zadatak **T8** — US 3/4/5 dorada CO toka + US 12 revizija notifikacija.
> Dokument mapira **svaki događaj iz US 12** na primaoca, kanal (in-app / email),
> status u kodu i — ako je rupa — vlasnika zaduženog zadatka.

## Legenda statusa
- **OK** — notifikacija je implementirana i šalje se odgovarajućem primaocu.
- **RUPA** — notifikacija nedostaje ili je nepotpuna; u koloni *Vlasnik* je zadatak zadužen za popravku.
- **DJELOMIČNO** — postoji, ali jedan kanal (npr. email) nije pokriven.

## Konvencije provjerene na nivou cijelog toka
- **Link za pristup aplikaciji**: `EmailNotificationProvider` dodaje `Pristup aplikaciji: {AppBaseUrl}/narudzbe/{orderId}`
  u tijelo svakog emaila vezanog za narudžbu. **OK** za sve događaje ispod.
- **Nadovezivanje na email lanac (threading)**: `EmailNotificationProvider` postavlja `References`,
  `In-Reply-To` i `Message-Id` po šablonu `<order-{orderId}@{domain}>`, čime svi emailovi iste narudžbe
  ostaju u istom lancu. **OK** za sve događaje ispod.
- **In-app inbox**: sve in-app notifikacije idu kroz `INotificationService` / `INotificationProvider`
  i vidljive su u bell inboxu primaoca.

## Matrica događaja

| # | Događaj | Primalac | Kanal | Status | Servis / lokacija | Vlasnik rupe |
|---|---------|----------|-------|--------|-------------------|--------------|
| 1 | Nova narudžba | CA (KolateralAdministrator) | in-app + email | OK | `AppraisalOrderService` (Subject "Nova narudžba za prihvatanje" / "Nova narudžba procjene") | — |
| 2 | Dopuna podataka (CA traži dopunu) | AM/SM/UB (Prodaja) | in-app + email | OK | `CaDocumentReviewService.RequestCorrectionAsync` (fan-out na `CreatedByRole`) | — |
| 3 | Podaci dopunjeni (Prodaja dostavila) | CA | in-app + email | OK | `CaDocumentReviewService` (notifikacija nazad CA) | — |
| 4 | Dokumentacija uredna | AM/SM/UB (Prodaja) | in-app + email | OK | `CaDocumentReviewService` (approve grana) | — |
| 5 | Provjera pristupa (zahtjev) | CO (KolateralOficir) | in-app + email | OK | `AccessCheckService` (notifikacija roli CO) | — |
| 6 | Pristup uredan | CA + AM | in-app + email | OK | `AccessCheckService` (approve grana, fan-out) | — |
| 7 | Narudžba vještaku | Vještak | in-app + email | OK | `AppraiserAssignmentService` / tok vještaka | T6 (verificirati) |
| 8 | Procjena naručena | AM/SM/UB (Prodaja) | in-app + email | OK | tok slanja vještaku | — |
| 9 | Vještak prihvata | CA | in-app + email | OK | tok vještaka | T6 (verificirati) |
| 10 | Odbijeno (vještak odbija) | CA | in-app + email | OK | tok vještaka (traži sljedećeg vještaka) | T6 (verificirati) |
| 11 | **Procjena završena** (import procjene) | CO | in-app + email | **DJELOMIČNO** | slanje pokreće tok vještaka (T6) | **T6** — verificirati da CO zaista dobije email "Završena procjena" |
| 12 | **Procjena može dalje** (CO odobrio) | Vještak + AM/SM/UB | in-app + email | OK | `OrderApprovalService.ApproveFinalAppraisalAsync` → `NotifyAppraiserApprovedAsync` (vještak) + `NotifyProdajaSegmentApprovedAsync` (AM/SM/UB) + `NotifyOrderCreatorAsync` (kreator) | — (popravljeno u T8) |
| 13 | **Procjena vraćena na doradu** | Vještak | in-app + email | OK | `OrderApprovalService.ReturnForReworkAsync` → `NotifyAppraiserReworkAsync` (in-app + email, samo slobodni komentar) | — |
| 14 | Faktura uploadovana | CA | in-app + email | OK | `InvoiceWorkflowService` (fan-out na rolu) | T7 |
| 15 | Faktura na plaćanje | Likvidatura | in-app + email | OK | `InvoiceWorkflowService` | T7 |
| 16 | Faktura plaćena | CA | in-app + email | OK | `InvoiceWorkflowService` | T7 |
| 17 | Mišljenje importovano | AM/SM/UB / CO / Pravna služba | in-app | DJELOMIČNO | `OpinionService` (`NotifyUsersAsync` na više rola) — provjeriti email kanal | T6/vlasnik opinion toka |

## Rupe — sažetak i eskalacija

### Unutar scope-a T8 (popravljeno)
- **Događaj 12 (Procjena može dalje → AM/SM/UB)**: ranije se notifikacija slala **samo kreatoru** narudžbe.
  Dodano u `OrderApprovalService.NotifyProdajaSegmentApprovedAsync` da AM/SM/UB rola dobiju notifikaciju.
- **Rok originala (vezano za događaj 12 / US 4)**: task `ConfirmOriginalReceived` sada koristi
  **2 radna dana** (`AddWorkingDays`, preskače vikend) umjesto ranijih `now.AddDays(3)`.
- **Padajući meni za doradu (US 5)**: dodana 4. vrijednost **"Slobodni unos komentara"**;
  vještaku ide **samo slobodni komentar**, interna kategorija ostaje za evidenciju (audit).

### Izvan scope-a T8 (zabilježeno, NE dirano)
- **Događaj 11 (Procjena završena → CO)** — vlasnik **T6** (tok vještaka). Treba potvrditi da CO
  zaista prima email kad vještak importuje procjenu. Eskalirati na T6.
- **Događaji 14–16 (Faktura)** — vlasnik **T7** (`InvoiceWorkflowService`). Notifikacije postoje;
  ako se traži dodatni kanal/primalac, popravlja T7.
- **Događaj 17 (Mišljenje importovano)** — provjeriti pokrivenost email kanala za sve role
  (AM/SM/UB/CO/Pravna). Vlasnik opinion toka.

## Napomena
Statusi za događaje označene "verificirati" zahtijevaju ručnu provjeru na strani vlasnika
(T6/T7) jer fajlovi tih tokova nisu u scope-u T8 i nisu dirani.
