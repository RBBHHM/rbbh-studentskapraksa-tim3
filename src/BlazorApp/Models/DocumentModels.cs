namespace BlazorApp.Models;

public sealed class SharedDocumentDto
{
    public int      Id               { get; set; }
    public string   Title            { get; set; } = "";
    public string   Category         { get; set; } = "";
    public string   FileName         { get; set; } = "";
    public string   OriginalFileName { get; set; } = "";
    public string?  ContentType      { get; set; }
    public long     FileSize         { get; set; }
    public DateTime UploadedAt       { get; set; }
    public string?  UploadedByUserId { get; set; }
    public string   DownloadUrl      { get; set; } = "";
    public bool     IsActive         { get; set; } = true;
}


/// <summary>
/// Dokument priložen uz narudžbu procjene. Ogledalo backend
/// <c>Praksa.Application.Documents.Dtos.DocumentDto</c> (GET /api/orders/{id}/documents).
/// </summary>
public sealed class DocumentDto
{
    public int      Id               { get; set; }
    public int      OrderId          { get; set; }
    public int?     DocumentTypeId   { get; set; }
    public string   FileName         { get; set; } = "";
    public string?  OriginalFileName { get; set; }
    public string?  ContentType      { get; set; }
    public long     FileSize         { get; set; }
    public DateTime UploadedAt       { get; set; }
    public string?  UploadedByUserId { get; set; }
    public string   DownloadUrl      { get; set; } = "";
    public int      Version          { get; set; } = 1;
    public int?     PreviousVersionId { get; set; }
    public bool     IsActive         { get; set; } = true;

    /// <summary>Naziv za prikaz — originalni naziv fajla ako postoji, inače interni.</summary>
    public string DisplayName => string.IsNullOrWhiteSpace(OriginalFileName) ? FileName : OriginalFileName;
}

/// <summary>
/// Fajl pripremljen za upload — sadržaj već pročitan u memoriju da bi se mogao
/// poslati kroz <c>MultipartFormDataContent</c>. Klijent validira PDF/veličinu prije
/// kreiranja ovog objekta.
/// </summary>
public sealed record UploadFile(string FileName, string ContentType, byte[] Content);

public sealed class OrderDocumentGenerationResultDto
{
    public int    OrderId     { get; set; }
    public string OrderNumber { get; set; } = "";
    public List<DocumentDto> GeneratedDocuments { get; set; } = [];
    public string Message     { get; set; } = "";
}

// ── Faktura workflow (US-F1/F2/F3) ──────────────────────────────────────

public sealed class InvoiceWorkflowResultDto
{
    public int    OrderId        { get; set; }
    public string OrderNumber    { get; set; } = "";
    public string InvoiceStatus  { get; set; } = "";
    public bool   NotificationSent { get; set; }
    public string Message        { get; set; } = "";
}

public sealed class InvoiceStatusDto
{
    public int       OrderId                  { get; set; }
    public string    OrderNumber              { get; set; } = "";
    public string    Status                   { get; set; } = "";
    public string?   UploadedByName           { get; set; }
    public DateTime? UploadedAt               { get; set; }
    public string?   SentForPaymentByName     { get; set; }
    public DateTime? SentForPaymentAt         { get; set; }
    public string?   PaidByName               { get; set; }
    public DateTime? PaidAt                   { get; set; }
    public int?      InvoiceDocumentId        { get; set; }
}
