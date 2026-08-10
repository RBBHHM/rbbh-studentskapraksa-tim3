using BlazorApp.Models;

namespace BlazorApp.Services;

/// <summary>Klijent za in-app notifikacijski inbox (GET/POST /api/notifications/*).</summary>
public class NotificationApiService : BaseApiService
{
    public NotificationApiService(IHttpClientFactory factory, ILogger<NotificationApiService> logger, ActiveRoleState? activeRoleState = null)
        : base(factory, logger, activeRoleState: activeRoleState) { }

    public Task<Result<NotificationInboxResultDto>> GetInboxAsync(
        int page = 1, int pageSize = 10, bool unreadOnly = false)
        => GetWithResultAsync<NotificationInboxResultDto>(
            $"/api/notifications/mine?page={page}&pageSize={pageSize}&unreadOnly={unreadOnly}");

    public Task<Result<UnreadNotificationCountDto>> GetUnreadCountAsync()
        => GetWithResultAsync<UnreadNotificationCountDto>("/api/notifications/unread-count");

    public Task<Result> MarkReadAsync(int notificationId)
        => PostWithResultAsync($"/api/notifications/{notificationId}/read", new object());
}
