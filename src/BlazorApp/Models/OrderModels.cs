using BlazorApp.Constants;

namespace BlazorApp.Models;

// ── Request modeli ─────────────────────────────────────────────────────────

public sealed record UpdateOrderRequest(
    string? ClientName,
    string? ClientType,
    string? ClientIdentifier,
    int?    CollateralTypeId,
    int?    CombinedCollateralTypeId,
    string? City,
    string? PropertyAddress,
    string? PropertyCity,
    string? Branch,
    string? BranchAddress,
    string? ContactName,
    string? ContactPhone,
    string? ContactEmail,
    string? InternalNote,
    string?   DeliveryContactName      = null,
    string?   AmRecipientName         = null,
    DateTime? RequestReceivedAt       = null,
    DateTime? RequestSentAt           = null,
    decimal?  SquareMetersCommercial  = null,
    decimal?  SquareMetersResidential = null
);

// ── Response modeli ────────────────────────────────────────────────────────

public sealed class AppraisalOrderDto
{
    public int      Id                          { get; set; }
    public string   OrderNumber                 { get; set; } = "";
    public string   Title                       { get; set; } = "";
    public string   Status                      { get; set; } = "";
    public int      StatusCode                  { get; set; }
    public string?  WorkflowType                { get; set; }
    public string?  CurrentOwnerRole            { get; set; }
    public string?  NextResponsibleRole         { get; set; }
    public string   ClientName                  { get; set; } = "";
    public string?  ClientType                  { get; set; }
    public string?  ClientIdentifier            { get; set; }
    public int?     CollateralTypeId            { get; set; }
    public string?  CollateralTypeLabel         { get; set; }
    public int?     CombinedCollateralTypeId    { get; set; }
    public string?  CombinedCollateralTypeLabel { get; set; }
    public string?  City                        { get; set; }
    public string?  PropertyAddress             { get; set; }
    public string?  PropertyCity               { get; set; }
    public string?  Branch                      { get; set; }
    public string?  BranchAddress               { get; set; }
    public string?  ContactName                 { get; set; }
    public string?  ContactPhone                { get; set; }
    public string?  ContactEmail                { get; set; }
    public string?  DeliveryContactName         { get; set; }
    public string?  AmRecipientName             { get; set; }
    public string?  CreatedByUserId             { get; set; }
    public string?  CreatedByRole               { get; set; }
    public string?  CreatedByName               { get; set; }
    public DateTime  CreatedAt                  { get; set; }
    public DateTime? UpdatedAt                  { get; set; }
    public DateTime? SubmittedAt                { get; set; }
    public string?   InternalNote               { get; set; }
    public DateTime? RequestReceivedAt          { get; set; }
    public DateTime? RequestSentAt              { get; set; }
    public string?   ProtocolNumber             { get; set; }
    public decimal?  SquareMetersCommercial     { get; set; }
    public decimal?  SquareMetersResidential    { get; set; }
    // Faktura workflow (US-F1/F2/F3) — preslikano iz backend DTO-a
    public string?   InvoiceWorkflowStatus        { get; set; }
    public string?   InvoiceUploadedByName        { get; set; }
    public DateTime? InvoiceUploadedAt             { get; set; }
    public string?   InvoiceSentForPaymentByName   { get; set; }
    public DateTime? InvoiceSentForPaymentAt        { get; set; }
    public string?   InvoicePaidByName              { get; set; }
    public DateTime? InvoicePaidAt                   { get; set; }
    public int?      InvoiceDocumentId              { get; set; }

    // CA polja (US1)
    public string?   AcceptedByCAUserId          { get; set; }
    public string?   AcceptedByCAName            { get; set; }
    public DateTime? AcceptedAt                  { get; set; }
    public string?   DocumentationReviewStatus   { get; set; }

    // Vještak (Faza C)
    public int?      AppraiserId    { get; set; }
    public string?   AppraiserName  { get; set; }
    public string?   AppraiserCity  { get; set; }

    public OrderCapabilitiesDto Capabilities    { get; set; } = new();

    public bool IsDraft       => Status == "Draft";
    public bool IsSubmitted   => Status == "SubmittedBySales";

    public string StatusLabel => OrderStatusDisplay.Label(Status);

    public bool   IsLegalEntity     => WorkflowType == ClientTypes.WorkflowPravnoLice || ClientType == ClientTypes.PravnoLice;
    public string WorkflowTypeLabel => WorkflowType switch
    {
        var w when w == ClientTypes.WorkflowPravnoLice  => "Pravna lica",
        var w when w == ClientTypes.WorkflowFizickoLice => "Fizička lica",
        _ => ClientTypes.DisplayLabel(ClientType)
    };
}

public sealed class OrderCapabilitiesDto
{
    public bool CanEdit   { get; set; }
    public bool CanSubmit { get; set; }
    public bool CanCancel { get; set; }
    public bool CanRequestAdditionalPayment  { get; set; }
    public bool CanCompleteAdditionalPayment { get; set; }
    public bool CanGenerateDocuments { get; set; }
    public bool CanSendQuoteRequests { get; set; }
    public bool CanSendThankYou      { get; set; }
    public bool CanUploadInvoice          { get; set; }
    public bool CanSendInvoiceForPayment  { get; set; }
    public bool CanConfirmInvoicePaid     { get; set; }
    public bool CanRejectOrder      { get; set; }
    public bool CanReturnForRework  { get; set; }
    public bool CanAdminRejectOrder { get; set; }
}

public sealed class AppraisalOrderListItemDto
{
    public int      Id                          { get; set; }
    public string   OrderNumber                 { get; set; } = "";
    public string   Title                       { get; set; } = "";
    public string   Status                      { get; set; } = "";
    public int      StatusCode                  { get; set; }
    public string?  WorkflowType                { get; set; }
    public string   ClientName                  { get; set; } = "";
    public string?  CollateralTypeLabel         { get; set; }
    public string?  CombinedCollateralTypeLabel { get; set; }
    public string?  City                        { get; set; }
    public string?  CreatedByRole               { get; set; }
    public DateTime CreatedAt                   { get; set; }
    public DateTime? SubmittedAt                { get; set; }
    public string?  Branch                      { get; set; }
    public DateTime? UpdatedAt                  { get; set; }

    public string WorkflowTypeLabel => WorkflowType switch
    {
        "PravnaLica"  => "Pravna lica",
        "FizickaLica" => "Fizička lica",
        _ => "—"
    };

    public string AppraisalTypeLabel => CombinedCollateralTypeLabel switch
        {
            not null => $"{CollateralTypeLabel ?? "—"} + {CombinedCollateralTypeLabel}",
            null     => CollateralTypeLabel ?? "—"
        };

    public string StatusLabel => OrderStatusDisplay.Label(Status);

    public string StatusColor => OrderStatusDisplay.Color(Status);

    // ── Pojednostavljeni status za "Pregled narudžbi" (5 kategorija) ──────────
    public string SimpleStatusLabel => OrderStatusDisplay.SimpleLabel(Status);

    public string SimpleStatusColor => OrderStatusDisplay.SimpleColor(Status);
}

// ── Sažetak narudžbi (KPI kartice) ──────────────────────────────────────────

public sealed class OrderSummaryDto
{
    public int Total            { get; set; }
    public int Draft            { get; set; }
    public int SubmittedBySales { get; set; }
    public int InProgress       { get; set; }
    public int Completed        { get; set; }
    public int Cancelled        { get; set; }
}

// ── Detalji narudžbe procjene (US 92/93/94) ─────────────────────────────────

public sealed class AppraisalOrderDetailDto
{
    public int      Id                          { get; set; }
    public string   OrderNumber                 { get; set; } = "";
    public string   Title                       { get; set; } = "";
    public string   Status                      { get; set; } = "";
    public int      StatusCode                  { get; set; }
    public string?  WorkflowType                { get; set; }
    public string?  CurrentOwnerRole            { get; set; }
    public string?  NextResponsibleRole         { get; set; }
    public string   ClientName                  { get; set; } = "";
    public string?  ClientType                  { get; set; }
    public string?  ClientIdentifier            { get; set; }
    public int?     CollateralTypeId            { get; set; }
    public string?  CollateralTypeLabel         { get; set; }
    public int?     CombinedCollateralTypeId    { get; set; }
    public string?  CombinedCollateralTypeLabel { get; set; }
    public string?  City                        { get; set; }
    public string?  PropertyAddress             { get; set; }
    public string?  PropertyCity               { get; set; }
    public string?  Branch                      { get; set; }
    public string?  BranchAddress               { get; set; }
    public string?  ContactName                 { get; set; }
    public string?  ContactPhone                { get; set; }
    public string?  ContactEmail                { get; set; }
    public string?  CreatedByUserId             { get; set; }
    public string?  CreatedByRole               { get; set; }
    public DateTime CreatedAt                   { get; set; }
    public DateTime? UpdatedAt                  { get; set; }
    public DateTime? SubmittedAt                { get; set; }
    public string?  InternalNote                { get; set; }

    // US-93: CO odobrenje (T1/T4 dodaju kolone)
    public string?   CoApprovedByName { get; set; }
    public DateTime? CoApprovedAt     { get; set; }

    // US-93: preuzimanje originala (T1/T5 dodaju kolone)
    public string?   OriginalReceivedByName   { get; set; }
    public DateTime? OriginalReceivedAt       { get; set; }

    // US-93: reminder vještaku (T1/T5 dodaju kolone)
    public int       AppraiserReminderCount      { get; set; }
    public DateTime? AppraiserReminderLastSentAt { get; set; }

    // US-91/92: CA pregled dokumentacije — razlog/komentar dopune (zadnji CorrectDocumentation task)
    public string?   CorrectionReason  { get; set; }
    public string?   CorrectionComment { get; set; }

    // US-93: CO provjera pristupa — komentar uz "Dopuna" (zadnji AccessCheckCO task)
    public string?   AccessCheckComment { get; set; }

    // Faza C: odabrani vještak za narudžbu
    public int?     AppraiserId   { get; set; }
    public string?  AppraiserName { get; set; }
    public string?  AppraiserCity { get; set; }

    // Faktura (kućica CA)
    public DateTime? InvoiceSentDate     { get; set; }
    public DateTime? InvoiceReceivedDate { get; set; }

    // Procjena / vještak
    public DateTime? AppraiserVisitDate { get; set; }
    public int?      AppraiserRating    { get; set; }
    public string?   EsgCertificate     { get; set; }

    // Faktura workflow
    public string?   InvoiceWorkflowStatus        { get; set; }
    public string?   InvoiceUploadedByName        { get; set; }
    public DateTime? InvoiceUploadedAt            { get; set; }
    public string?   InvoiceSentForPaymentByName  { get; set; }
    public DateTime? InvoiceSentForPaymentAt      { get; set; }
    public string?   InvoicePaidByName            { get; set; }
    public DateTime? InvoicePaidAt                { get; set; }
    public int?      InvoiceDocumentId            { get; set; }

    // Protokol polja
    public decimal?  AppraisalFee                   { get; set; }
    public string?   CollateralStatus               { get; set; }
    public string?   ProtocolNumber                 { get; set; }
    public DateTime? OrderSentToAppraiserAt          { get; set; }
    public DateTime? SignedDocumentsReceivedAt        { get; set; }
    public DateTime? AppraisalDeliveredToCoAt         { get; set; }
    public DateTime? CorrectionRequestedAt           { get; set; }
    public DateTime? CorrectedAppraisalReceivedAt    { get; set; }
    public DateTime? ReadyForProcedureAt             { get; set; }

    // US1: CA polja
    public string?   AcceptedByCAName              { get; set; }
    public string?   DocumentationReviewStatus     { get; set; }
    public string?   CreatedByName                 { get; set; }

    // Saglasnost klijenta (PL)
    public bool      SalesConsentSigned       { get; set; }
    public DateTime? SalesConsentSignedAt     { get; set; }
    public string?   SalesConsentSignedByName { get; set; }

    public OrderDetailCapabilitiesDto Capabilities { get; set; } = new();

    public bool IsDraft              => Status == "Draft";
    public bool IsSubmitted          => Status == "SubmittedBySales";
    public bool IsReadyForProcedure  => Status == "ReadyForProcedure";
    public bool IsOriginalReceived   => Status is "OriginalReceived" or "Completed";
    public bool IsReturnedForCorrection => Status == "ReturnedForCorrection";
    public bool IsAccessCheckRequested  => Status == "AccessCheckRequested";
    public bool IsAccessCheckApproved   => Status == "AccessCheckApproved";
    public bool IsAccessCheckRejected   => Status == "AccessCheckRejected";

    public string StatusLabel => OrderStatusDisplay.Label(Status);

    public bool   IsLegalEntity     => WorkflowType == ClientTypes.WorkflowPravnoLice || ClientType == ClientTypes.PravnoLice;
    public string WorkflowTypeLabel => WorkflowType switch
    {
        var w when w == ClientTypes.WorkflowPravnoLice  => "Pravna lica",
        var w when w == ClientTypes.WorkflowFizickoLice => "Fizička lica",
        _ => ClientTypes.DisplayLabel(ClientType)
    };
}

public sealed class OrderDetailCapabilitiesDto
{
    public bool CanEdit  { get; set; }
    public bool CanSubmit { get; set; }
    public bool CanCancel { get; set; }

    // US-93 capabilities — postavljaju T4/T5 backend endpointi
    public bool CanApproveFinal    { get; set; }
    public bool CanDownloadFinal   { get; set; }
    public bool CanConfirmOriginal { get; set; }
    public bool CanRemindAppraiser { get; set; }

    // US-91/92 capabilities — CA pregled dokumentacije
    public bool CanRequestCorrection { get; set; }
    public bool CanCompleteReview    { get; set; }
    public bool CanSubmitCorrection  { get; set; }

    // US-93 capability — CO provjera pristupa prije narudžbe
    public bool CanAccessCheck { get; set; }

    // Faza C — odabir vještaka za narudžbu
    public bool CanSelectAppraiser { get; set; }

    // Faza D — slanje narudžbe vještaku
    public bool CanSendToAppraiser { get; set; }

    // Doplata
    public bool CanRequestAdditionalPayment  { get; set; }
    public bool CanCompleteAdditionalPayment { get; set; }

    // Generisanje dokumenata (narudžbenica + izjava)
    public bool CanGenerateDocuments { get; set; }

    // PL zahtjev za ponudu
    public bool CanSendQuoteRequests { get; set; }
    public bool CanSendThankYou      { get; set; }

    // Faktura workflow (US-F1/F2/F3)
    public bool CanUploadInvoice          { get; set; }
    public bool CanSendInvoiceForPayment  { get; set; }
    public bool CanConfirmInvoicePaid     { get; set; }

    // Odbijanje + dorada
    public bool CanRejectOrder      { get; set; }
    public bool CanReturnForRework  { get; set; }
    public bool CanAdminRejectOrder { get; set; }

    // Saglasnost klijenta (PL)
    public bool CanSignConsent { get; set; }
}

// ── Protokol narudžbi ─────────────────────────────────────────────────────

public sealed class ProtocolEntryDto
{
    public int      Id                          { get; set; }
    public int      OrderId                     { get; set; }
    public string   OrderNumber                 { get; set; } = "";
    public string   OrderTitle                  { get; set; } = "";
    public string   ProtocolNumber              { get; set; } = "";
    public int      ProtocolYear                { get; set; }
    public int      ProtocolSequence            { get; set; }
    public string   Status                      { get; set; } = "";
    public DateTime GeneratedAt                 { get; set; }
    public string   GeneratedByUserId           { get; set; } = "";
    public string   ClientName                  { get; set; } = "";
    public string?  City                        { get; set; }
    public string?  Branch                      { get; set; }
    public string   OrderStatus                 { get; set; } = "";
    public int      OrderStatusCode             { get; set; }
    public string?  CollateralTypeLabel         { get; set; }
    public string?  CombinedCollateralTypeLabel { get; set; }

    public string?  ClientType                  { get; set; }
    public string?  ClientIdentifier            { get; set; }
    public string?  ContactName                 { get; set; }
    public string?  ContactPhone                { get; set; }
    public string?  PropertyAddress             { get; set; }
    public string?  BranchAddress               { get; set; }
    public string?  CreatedByName               { get; set; }
    public string?  CreatedByRole               { get; set; }
    public string?  DeliveryContactName         { get; set; }
    public string?  AmRecipientName             { get; set; }

    // Faktura (kućica CA)
    public DateTime? InvoiceSentDate     { get; set; }
    public DateTime? InvoiceReceivedDate { get; set; }

    // Faktura workflow (US-F1/F2/F3)
    public string?   InvoiceWorkflowStatus       { get; set; }
    public string?   InvoiceUploadedByName       { get; set; }
    public DateTime? InvoiceUploadedAt            { get; set; }
    public string?   InvoiceSentForPaymentByName  { get; set; }
    public DateTime? InvoiceSentForPaymentAt       { get; set; }
    public string?   InvoicePaidByName             { get; set; }
    public DateTime? InvoicePaidAt                  { get; set; }
    public int?      InvoiceDocumentId             { get; set; }

    // Preslikano iz kućica Vještak / CO
    public string?   AppraiserName      { get; set; }
    public int?      AppraiserRating    { get; set; }
    public string?   EsgCertificate     { get; set; }
    public DateTime? AppraiserVisitDate { get; set; }

    // US1: CA polja
    public string?  AcceptedByCAName          { get; set; }
    public string?  DocumentationReviewStatus { get; set; }

    public bool IsCancelled => Status == "Cancelled";

    public string? ClientTypeLabel => ClientType switch
    {
        var t when t == ClientTypes.FizickoLice => "Fizičko lice",
        var t when t == ClientTypes.PravnoLice  => "Pravno lice",
        _                                       => ClientType
    };

    public string OrderStatusLabel => OrderStatusDisplay.Label(OrderStatus);

    public string OrderStatusColor => OrderStatusDisplay.Color(OrderStatus);
}

// ── Šifarnik DTO ───────────────────────────────────────────────────────────

public sealed class CodebookValueItem
{
    public int     Id          { get; set; }
    public string  Code        { get; set; } = "";
    public string  Label       { get; set; } = "";
    public int     SortOrder   { get; set; }
    public string? Description { get; set; }
}

// ── Taskovi ────────────────────────────────────────────────────────────────

public sealed class WorkflowTaskDto
{
    public int      Id               { get; set; }
    public int      OrderId          { get; set; }
    public string   OrderNumber      { get; set; } = "";
    public string?  OrderTitle       { get; set; }
    public string   TaskType         { get; set; } = "";
    public int      TaskTypeCode     { get; set; }
    public string   Title            { get; set; } = "";
    public string?  Description      { get; set; }
    public string?  AssignedRole     { get; set; }
    public string?  AssignedUserId   { get; set; }
    public string   Status           { get; set; } = "";
    public int      StatusCode       { get; set; }
    public bool     IsLocked         { get; set; }
    public DateTime? DueDate         { get; set; }
    public DateTime? AcceptedAt      { get; set; }
    public string?  AcceptedByUserId { get; set; }
    public DateTime? CompletedAt     { get; set; }
    public string?  CompletedByUserId { get; set; }
    public string?  Comment          { get; set; }
    public DateTime CreatedAt        { get; set; }

    public string StatusLabel => Status switch
    {
        "Open"      => "Otvoreno",
        "Accepted"  => "Prihvaćeno",
        "InProgress"=> "U toku",
        "Completed" => "Završeno",
        "Returned"  => "Vraćeno",
        "Cancelled" => "Otkazano",
        _           => Status
    };

    public bool IsOverdue => DueDate.HasValue && DueDate.Value < DateTime.UtcNow && Status is "Open" or "Accepted";
}

// ── S3-15: Reminder vještaku — modeli ─────────────────────────────────────────

public sealed class AppraiserReminderReportModel
{
    public int                         TotalOverdue           { get; set; }
    public List<ReminderOrderModel>    Orders                 { get; set; } = [];
    public DateTime                    GeneratedAt            { get; set; }
    public int                         MinBusinessDaysOverdue { get; set; }
}

public sealed class ReminderOrderModel
{
    public int       OrderId                  { get; set; }
    public string    OrderNumber              { get; set; } = "";
    public string    ClientName               { get; set; } = "";
    public string    City                     { get; set; } = "";
    public string    OrderStatus              { get; set; } = "";
    public string    StatusLabel              { get; set; } = "";
    public int?      AppraiserId              { get; set; }
    public string?   AppraiserName            { get; set; }
    public string?   AppraiserEmail           { get; set; }
    public DateTime? OrderSentToAppraiserAt   { get; set; }
    public DateTime? AppraisalDeliveredToCoAt { get; set; }
    public int       BusinessDaysOverdue      { get; set; }
}

public sealed class ReminderSentModel
{
    public int    OrderId          { get; set; }
    public string OrderNumber      { get; set; } = "";
    public bool   NotificationSent { get; set; }
    public string Message          { get; set; } = "";
}

