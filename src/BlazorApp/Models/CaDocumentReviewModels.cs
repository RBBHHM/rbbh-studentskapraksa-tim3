namespace BlazorApp.Models;

// POST /api/orders/{id}/request-correction
public sealed class RequestCorrectionRequest
{
    public int     ReasonCodeId { get; set; }
    public string? Comment      { get; set; }

    public RequestCorrectionRequest() { }

    public RequestCorrectionRequest(int reasonCodeId, string? comment)
    {
        ReasonCodeId = reasonCodeId;
        Comment = comment;
    }
}

// POST /api/orders/{id}/submit-correction
public sealed class SubmitCorrectionRequest
{
    public string? Comment { get; set; }

    public SubmitCorrectionRequest() { }

    public SubmitCorrectionRequest(string? comment)
    {
        Comment = comment;
    }
}

// Odgovor za request-correction / complete-review / submit-correction
public sealed class CaDocumentReviewResultDto
{
    public int    OrderId          { get; set; }
    public string OrderNumber      { get; set; } = "";
    public string Status           { get; set; } = "";
    public int    StatusCode       { get; set; }
    public bool   NotificationSent { get; set; }
    public string Message          { get; set; } = "";
}

// Rezultat RequestCorrectionDialog-a (odabrani razlog + opcioni komentar)
public sealed record RequestCorrectionDialogResult(int ReasonCodeId, string? Comment);

// POST /api/orders/{id}/access-check/approve i /reject
public sealed class AccessCheckDecisionRequest
{
    public string? Comment { get; set; }

    public AccessCheckDecisionRequest() { }

    public AccessCheckDecisionRequest(string? comment)
    {
        Comment = comment;
    }
}
