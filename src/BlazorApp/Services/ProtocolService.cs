using BlazorApp.Models;

namespace BlazorApp.Services;

public sealed class ProtocolService : BaseApiService
{
    public ProtocolService(IHttpClientFactory factory, ILogger<ProtocolService> logger, ActiveRoleState? activeRoleState = null)
        : base(factory, logger, activeRoleState: activeRoleState) { }

    public Task<Result<PagedResult<ProtocolEntryDto>>> GetListAsync(int page = 1, int pageSize = 20)
        => GetWithResultAsync<PagedResult<ProtocolEntryDto>>($"/api/protocol/orders?page={page}&pageSize={pageSize}");

    public Task<Result<ProtocolEntryDto>> GetByOrderIdAsync(int orderId)
        => GetWithResultAsync<ProtocolEntryDto>($"/api/protocol/orders/{orderId}");
}
