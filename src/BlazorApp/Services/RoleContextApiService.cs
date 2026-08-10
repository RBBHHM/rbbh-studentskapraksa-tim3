namespace BlazorApp.Services;

public sealed record ActiveRoleResponse(string RoleCode, string DashboardRoute);

public class RoleContextApiService : BaseApiService
{
    public RoleContextApiService(IHttpClientFactory factory, ILogger<RoleContextApiService> logger, ActiveRoleState? activeRoleState = null)
        : base(factory, logger, activeRoleState: activeRoleState) { }

    /// <summary>
    /// Poziva backend da validira i prihvati izbor aktivne role.
    /// Backend provjerava da korisnik posjeduje tu rolu.
    /// Vraća dashboardRoute ako je uspješno.
    /// </summary>
    public Task<Result<ActiveRoleResponse>> SetActiveRoleAsync(
        string roleCode, CancellationToken ct = default)
        => PostWithDataResultAsync<object, ActiveRoleResponse>(
            "/api/me/active-role",
            new { RoleCode = roleCode });
}
