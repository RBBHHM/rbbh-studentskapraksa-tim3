using System.Diagnostics.CodeAnalysis;

namespace Praksa.Domain.Orders;

[ExcludeFromCodeCoverage]
public sealed record InvoiceSnapshot(
    InvoiceWorkflowStatus Status,
    int? DocumentId,
    string? UploadedByName, DateTime? UploadedAt,
    string? SentForPaymentByName, DateTime? SentForPaymentAt,
    string? PaidByName, DateTime? PaidAt);
