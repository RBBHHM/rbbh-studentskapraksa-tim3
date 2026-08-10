namespace BlazorApp.Constants;

/// <summary>
/// Konstante za permission stringove vraćene u <c>MeDto.Permissions</c> (GET /api/me).
/// Mirror backend konstanti iz <c>Praksa.Application.Security.AppPermissions</c>.
///
/// SINGLE SOURCE OF TRUTH: Backend klasa (<c>AppPermissions</c> u Application sloju).
/// Ovaj fajl mora biti identičan vrijednostima. Svaka nova permission dodaje se i tamo i ovdje.
/// Dugoročno rješenje: OpenAPI-generated klijent ili shared NuGet paket.
///
/// PRAVILO: Nikad ne pisati hardkodirane permission stringove po Razor komponentama.
/// Uvijek koristiti ove konstante uz <c>MeDto.Permissions.Contains(...)</c>.
/// </summary>
public static class AppPermissions
{
    // ── Administracija korisnika ──────────────────────────────────────────────
    public const string UsersView           = "users.view";

    // ── Upravljanje rolama ────────────────────────────────────────────────────
    public const string RolesView           = "roles.view";
    public const string RolesAssign         = "roles.assign";
    public const string RolesRemove         = "roles.remove";
    public const string RolesTransferAdmin  = "roles.transfer-admin";
    public const string RolesManage         = "roles.manage";

    // ── Rad sa zapisima ───────────────────────────────────────────────────────
    public const string RecordsCreate                  = "records.create";
    public const string RecordsViewOwn                 = "records.view-own";
    public const string RecordsUpdateOwnDraft          = "records.update-own-draft";
    public const string RecordsSubmitForVerification   = "records.submit-for-verification";
    public const string RecordsViewPendingVerification = "records.view-pending-verification";
    public const string RecordsApprove                 = "records.approve";
    public const string RecordsReject                  = "records.reject";
    public const string RecordsViewHistory             = "records.view-history";

    // ── Šifarnici ─────────────────────────────────────────────────────────────
    public const string CodebooksView       = "codebooks.view";
    public const string CodebooksManage     = "codebooks.manage";

    // ── Suspenzija korisnika ──────────────────────────────────────────────────
    public const string UsersSuspend        = "users.suspend";

    // ── Audit / Sigurnost ─────────────────────────────────────────────────────
    public const string AuditViewSecurity   = "audit.view-security";

    // ── Administrativni pristup ───────────────────────────────────────────────
    public const string AdminAccess         = "admin.access";

    // ── Dokumenti narudžbe (US 92) ────────────────────────────────────────────
    public const string DocumentsUpload     = "documents.upload";
    public const string DocumentsView       = "documents.view";
    public const string DocumentsDownload   = "documents.download";
    public const string DocumentsDelete     = "documents.delete";

    // ── Narudžba / workflow procjene (US 93) ──────────────────────────────────
    public const string OrdersView              = "orders.view";
    public const string OrdersApproveFinal      = "orders.approve-final";
    public const string OrdersDownloadAppraisal = "orders.download-appraisal";
    public const string OrdersConfirmOriginal   = "orders.confirm-original";
    public const string OrdersRemindAppraiser   = "orders.remind-appraiser";

    // ── Mišljenja CO i Pravne službe (US 94) ──────────────────────────────────
    public const string OpinionsRequest     = "opinions.request";
    public const string OpinionsSubmitCo    = "opinions.submit-co";
    public const string OpinionsSubmitLegal = "opinions.submit-legal";
    public const string OpinionsView        = "opinions.view";

    // ── Notifikacije ───────────────────────────────────────────────────────────
    public const string NotificationsView   = "notifications.view";

    // ── Narudžbe procjene — inicijacija i radni tok (US-1, US-2) ──────────────
    public const string OrdersCreate        = "orders.create";
    public const string OrdersViewOwn       = "orders.view-own";
    public const string OrdersViewAll       = "orders.view-all";
    public const string OrdersUpdateDraft   = "orders.update-draft";
    public const string OrdersSubmit        = "orders.submit";
    public const string OrdersCancel        = "orders.cancel";
    public const string OrdersAccept        = "orders.accept";
    public const string ProtocolView        = "protocol.view";

    // ── CA pregled dokumentacije — "Dopuna podataka" / "Završi pregled" (US-91/92) ──
    public const string OrdersRequestCorrection = "orders.request-correction";
    public const string OrdersCompleteReview    = "orders.complete-review";
    public const string OrdersSubmitCorrection  = "orders.submit-correction";

    // ── CO provjera pristupa prije narudžbe (US-93) ───────────────────────────
    public const string OrdersAccessCheck       = "orders.access-check";

    // ── Odabir vještaka + master-data vještaka (US-93 Faza C) ─────────────────
    public const string OrdersSelectAppraiser   = "orders.select-appraiser";
    public const string AppraisersManage        = "appraisers.manage";
    public const string AppraisersView          = "appraisers.view";

    // ── Slanje narudžbe vještaku (US-93 Faza D) ───────────────────────────────
    public const string OrdersSendToAppraiser   = "orders.send-to-appraiser";

    // ── Dijeljeni dokumenti (cjenovnik, lista dokumentacije po tipu) ──────────
    public const string SharedDocumentsView   = "shared-documents.view";
    public const string SharedDocumentsManage = "shared-documents.manage";

    // ── Import/Export šifarnika i vještaka ────────────────────────────────────
    public const string CodebooksImport    = "codebooks.import";
    public const string CodebooksExport    = "codebooks.export";
    public const string AppraisersImport   = "appraisers.import";
    public const string AppraisersExport   = "appraisers.export";

    // ── Faktura vještaka (US-F1/F2/F3) ───────────────────────────────────────
    public const string InvoiceView             = "invoice.view";
    public const string InvoiceUpload           = "invoice.upload";
    public const string InvoiceSendForPayment   = "invoice.send-for-payment";
    public const string InvoiceConfirmPayment   = "invoice.confirm-payment";

    // ── Doplata vještaka ──────────────────────────────────────────────────────
    public const string OrdersAdditionalPayment = "orders.additional-payment";

    // ── Izvještaji (US-R1/R2) ─────────────────────────────────────────────────
    public const string ReportsGenerate = "reports.generate";
}
