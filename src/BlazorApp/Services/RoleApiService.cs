namespace BlazorApp.Services;

public class RoleApiService : BaseApiService
{
    public RoleApiService(IHttpClientFactory factory, ILogger<RoleApiService> logger, ActiveRoleState? activeRoleState = null)
        : base(factory, logger, activeRoleState: activeRoleState) { }

    public Task<Result> AssignRoleAsync(string userId, string roleName)
        => PostWithResultAsync("/api/roles/assign", new { UserId = userId, RoleName = roleName });

    public Task<Result> RemoveRoleAsync(string userId, string roleName)
        => PostWithResultAsync("/api/roles/remove", new { UserId = userId, RoleName = roleName });

    public Task<Result> TransferAdminAsync(string fromUserId, string toUserId, string reason)
        => PostWithResultAsync("/api/roles/transfer-admin",
            new { SourceUserId = fromUserId, TargetUserId = toUserId, Reason = reason });
}
