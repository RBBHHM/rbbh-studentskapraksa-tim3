namespace BlazorApp.Models;

// GET /api/orders/{id}/final-appraisal
public sealed class FinalAppraisalDocDto
{
    public int    DocumentId { get; set; }
    public string FileName   { get; set; } = "";
    public long   SizeBytes  { get; set; }
}

// POST /api/orders/{id}/confirm-original
public sealed class ConfirmOriginalResultDto
{
    public DateTime? OriginalReceivedAt     { get; set; }
    public string?   OriginalReceivedByName { get; set; }
    public string    NewStatus              { get; set; } = "";
}

// POST /api/orders/{id}/remind-appraiser
public sealed class ReminderResultDto
{
    public int       ReminderCount      { get; set; }
    public DateTime? LastReminderSentAt { get; set; }
}

// POST /api/orders/{id}/deliver-original
public sealed class DeliverOriginalResultDto
{
    public int      OrderId           { get; set; }
    public string   OrderNumber       { get; set; } = "";
    public DateTime DeliveredAt       { get; set; }
    public string   DeliveredByUserId { get; set; } = "";
    public string   Message           { get; set; } = "";
}

// POST /api/orders/{id}/sign-consent
public sealed class SignConsentResultDto
{
    public int       OrderId      { get; set; }
    public string    OrderNumber  { get; set; } = "";
    public DateTime  SignedAt     { get; set; }
    public string?   SignedByName { get; set; }
    public string    Message      { get; set; } = "";
}