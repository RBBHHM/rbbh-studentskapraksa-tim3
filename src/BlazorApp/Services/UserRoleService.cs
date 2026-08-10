using BlazorApp.Models;

namespace BlazorApp.Services;

public class UserRoleService : BaseApiService
{
    public UserRoleService(IHttpClientFactory factory, ILogger<UserRoleService> logger, ActiveRoleState? activeRoleState = null)
        : base(factory, logger, activeRoleState: activeRoleState) { }

    public Task<Result<PagedResult<UserRoleListItemDto>>> GetUsersAsync(
        string? search = null,
        string? role = null,
        bool? isActive = null,
        int page = 1,
        int pageSize = 20)
    {
        var url = BuildUrl("/api/users", search, role, isActive, page, pageSize);
        return GetWithResultAsync<PagedResult<UserRoleListItemDto>>(url);
    }

    private static string BuildUrl(string path, string? search, string? role, bool? isActive, int page, int pageSize)
    {
        var q = new List<string> { $"page={page}", $"pageSize={pageSize}" };
        if (!string.IsNullOrWhiteSpace(search)) q.Add($"search={Uri.EscapeDataString(search.Trim())}");
        if (!string.IsNullOrWhiteSpace(role))   q.Add($"role={Uri.EscapeDataString(role.Trim())}");
        if (isActive.HasValue)                  q.Add($"isActive={isActive.Value.ToString().ToLowerInvariant()}");
        return $"{path}?{string.Join("&", q)}";
    }
}
