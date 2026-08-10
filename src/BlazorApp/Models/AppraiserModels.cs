namespace BlazorApp.Models;

// GET /api/appraisers, GET /api/appraisers/{id}
public sealed class AppraiserDto
{
    public int     Id                    { get; set; }
    public string  Name                  { get; set; } = "";
    public string? City                  { get; set; }
    public string  LegalForm             { get; set; } = "";
    public bool    IsOnLeave             { get; set; }
    public bool    IsBlacklisted         { get; set; }
    public bool    IsActive              { get; set; }
    public int     ActiveAssignmentCount { get; set; }
    public string? ContactEmail          { get; set; }
    public string? ContactPhone          { get; set; }
    public string? Notes                 { get; set; }
    public string? SupportedPropertyTypes { get; set; }
    public DateTime CreatedAt            { get; set; }
    public DateTime? UpdatedAt           { get; set; }
    public string? SupportedCities       { get; set; }
    public string  ClientScope           { get; set; } = "Sve";

    public string LegalFormLabel => LegalForm switch
    {
        "Firm"       => "Firma",
        "Individual" => "Individualni",
        _            => LegalForm
    };

    public string SupportedPropertyTypesLabel =>
        string.IsNullOrWhiteSpace(SupportedPropertyTypes) ? "Svi tipovi" : SupportedPropertyTypes;

    public string ClientScopeLabel => ClientScope switch
    {
        "Sve"         => "Svi klijenti",
        "FizickaLica" => "Samo fizička lica",
        "PravnaLica"  => "Samo pravna lica",
        _             => ClientScope
    };

    public string SupportedCitiesLabel =>
        string.IsNullOrWhiteSpace(SupportedCities) ? "Svi gradovi" : SupportedCities;
}

// POST /api/appraisers, PUT /api/appraisers/{id}
public sealed class CreateAppraiserRequest
{
    public string  Name                   { get; set; } = "";
    public string? City                    { get; set; }
    public string  LegalForm               { get; set; } = "Individual";
    public string? ContactEmail            { get; set; }
    public string? ContactPhone            { get; set; }
    public string? Notes                   { get; set; }
    public string? SupportedPropertyTypes  { get; set; }
    public string? SupportedCities         { get; set; }
    public string  ClientScope             { get; set; } = "Sve";
}

public sealed class UpdateAppraiserRequest
{
    public string  Name                   { get; set; } = "";
    public string? City                    { get; set; }
    public string  LegalForm               { get; set; } = "Individual";
    public string? ContactEmail            { get; set; }
    public string? ContactPhone            { get; set; }
    public string? Notes                   { get; set; }
    public string? SupportedPropertyTypes  { get; set; }
    public string? SupportedCities         { get; set; }
    public string? ClientScope             { get; set; }
}

// POST /api/appraisers/{id}/on-leave, /blacklist
public sealed class SetAppraiserFlagRequest
{
    public bool Value { get; set; }

    public SetAppraiserFlagRequest() { }

    public SetAppraiserFlagRequest(bool value)
    {
        Value = value;
    }
}

// POST /api/orders/{orderId}/select-appraiser/auto, /select-appraiser/manual
public sealed class AppraiserAssignmentResultDto
{
    public int     OrderId          { get; set; }
    public string  OrderNumber      { get; set; } = "";
    public string  Status           { get; set; } = "";
    public int     StatusCode       { get; set; }
    public int     AppraiserId      { get; set; }
    public string  AppraiserName    { get; set; } = "";
    public string? AppraiserCity    { get; set; }
    public bool    NotificationSent { get; set; }
    public string  Message          { get; set; } = "";
}

// POST /api/orders/{orderId}/select-appraiser/manual
public sealed class ManualSelectAppraiserRequest
{
    public int AppraiserId { get; set; }

    public ManualSelectAppraiserRequest() { }

    public ManualSelectAppraiserRequest(int appraiserId)
    {
        AppraiserId = appraiserId;
    }
}

// POST /api/orders/{orderId}/send-to-appraiser
public sealed class SendToAppraiserResultDto
{
    public int     OrderId          { get; set; }
    public string  OrderNumber      { get; set; } = "";
    public string  Status           { get; set; } = "";
    public int     StatusCode       { get; set; }
    public int     AppraiserId      { get; set; }
    public string  AppraiserName    { get; set; } = "";
    public string? AppraiserEmail   { get; set; }
    public bool    NotificationSent { get; set; }
    public string  Message          { get; set; } = "";
}

// GET /api/orders/{orderId}/appraiser-package
public sealed class AppraiserPackageDto
{
    public int     OrderId       { get; set; }
    public string  OrderNumber   { get; set; } = "";
    public int     AppraiserId   { get; set; }
    public string  AppraiserName { get; set; } = "";
    public string? AppraiserEmail { get; set; }
    public List<DocumentDto> Documents { get; set; } = [];
}

// ── PL zahtjev za ponudu ──────────────────────────────────────────────────

public sealed class QuoteRequestDto
{
    public int      Id             { get; set; }
    public int      OrderId        { get; set; }
    public int      AppraiserId    { get; set; }
    public string   AppraiserName  { get; set; } = "";
    public string?  AppraiserCity  { get; set; }
    public string?  AppraiserEmail { get; set; }
    public string   Status         { get; set; } = "";
    public DateTime SentAt         { get; set; }
    public DateTime Deadline       { get; set; }
    public decimal? OfferedPrice   { get; set; }
    public int?     OfferedDays    { get; set; }
    public DateTime? RespondedAt   { get; set; }
    public DateTime? ThankYouSentAt { get; set; }

    public string StatusLabel => Status switch
    {
        "Sent"         => "Poslano",
        "Responded"    => "Odgovoreno",
        "Selected"     => "Odabran",
        "ThankYouSent" => "Zahvalnica poslana",
        _              => Status
    };
}

public sealed class SendQuoteRequestsRequest
{
    public List<int> AppraiserIds { get; set; } = [];
    public DateTime  Deadline     { get; set; }
}

public sealed class SendQuoteRequestsResultDto
{
    public int    OrderId      { get; set; }
    public string OrderNumber  { get; set; } = "";
    public int    SentCount    { get; set; }
    public bool   NotificationSent { get; set; }
    public string Message      { get; set; } = "";
}

public sealed class SendThankYouResultDto
{
    public int    OrderId     { get; set; }
    public string OrderNumber { get; set; } = "";
    public int    SentCount   { get; set; }
    public string Message     { get; set; } = "";
}
