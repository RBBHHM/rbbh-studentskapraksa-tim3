namespace BlazorApp.Models;

/// <summary>Stavka inboxa in-app notifikacija — odgovara <c>NotificationDto</c> na backendu.</summary>
public sealed class NotificationDto
{
    public int      Id                { get; init; }
    public string   Subject           { get; init; } = string.Empty;
    public string   Message           { get; init; } = string.Empty;
    public bool     IsRead            { get; init; }
    public DateTime CreatedAt         { get; init; }
    public string?  RelatedEntityType { get; init; }
    public string?  RelatedEntityId   { get; init; }
}

/// <summary>Paginirana stranica inboxa — odgovara <c>NotificationInboxResult</c> na backendu.</summary>
public sealed class NotificationInboxResultDto
{
    public IReadOnlyList<NotificationDto> Items   { get; init; } = [];
    public int TotalCount  { get; init; }
    public int Page        { get; init; }
    public int PageSize    { get; init; }
    public int UnreadCount { get; init; }
}

/// <summary>Odgovor GET /api/notifications/unread-count.</summary>
public sealed class UnreadNotificationCountDto
{
    public int Count { get; init; }
}
