namespace BlazorApp.Models;

/// <summary>Tip mišljenja — mora odgovarati <c>Praksa.Domain.Orders.OpinionType</c> (CO=0, Pravna=1).</summary>
public enum OpinionType
{
    CO     = 0,
    Pravna = 1
}

/// <summary>Status mišljenja — mora odgovarati <c>Praksa.Domain.Orders.OpinionStatus</c> (Requested=0, Imported=1).</summary>
public enum OpinionStatus
{
    Requested = 0,
    Imported  = 1
}

/// <summary>
/// Mišljenje za narudžbu (CO ili Pravna). Ogledalo backend
/// <c>Praksa.Application.Opinions.Dtos.OpinionDto</c> (GET /api/orders/{orderId}/opinions).
/// </summary>
public sealed class OpinionDto
{
    public OpinionType   OpinionType      { get; set; }
    public OpinionStatus Status           { get; set; }
    public string?       ImportedByUserId { get; set; }
    public DateTime?     ImportedAt       { get; set; }
    public string?       Comment          { get; set; }
    public int?          DocumentId       { get; set; }

    /// <summary>Link za preuzimanje uvezenog mišljenja (reuse dokument-endpointa iz T2).</summary>
    public string? DownloadUrl => DocumentId.HasValue ? $"/files/documents/{DocumentId}" : null;
}
