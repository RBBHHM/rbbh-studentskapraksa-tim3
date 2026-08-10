using BlazorApp.Models;

namespace BlazorApp.Services;

public class MeService : BaseApiService
{
    public MeService(IHttpClientFactory factory, ILogger<MeService> logger, ActiveRoleState? activeRoleState = null)
        : base(factory, logger, activeRoleState: activeRoleState) { }

    public Task<Result<MeDto>> GetMeAsync(CancellationToken ct = default)
        => GetWithResultAsync<MeDto>("/api/me");
}
