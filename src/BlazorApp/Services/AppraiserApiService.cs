using BlazorApp.Models;

namespace BlazorApp.Services;

/// <summary>Master-data CRUD za vještake (Faza C) + odabir vještaka za narudžbu.</summary>
public sealed class AppraiserApiService : BaseApiService
{
    public AppraiserApiService(IHttpClientFactory factory, ILogger<AppraiserApiService> logger, ActiveRoleState? activeRoleState = null)
        : base(factory, logger, activeRoleState: activeRoleState) { }

    public Task<Result<PagedResult<AppraiserDto>>> GetListAsync(
        string? search = null,
        string? city = null,
        bool? onLeave = null,
        bool? blacklisted = null,
        bool? active = null,
        int page = 1,
        int pageSize = 50)
    {
        var q = new List<string> { $"page={page}", $"pageSize={pageSize}" };
        if (!string.IsNullOrWhiteSpace(search)) q.Add($"search={Uri.EscapeDataString(search.Trim())}");
        if (!string.IsNullOrWhiteSpace(city))   q.Add($"city={Uri.EscapeDataString(city.Trim())}");
        if (onLeave.HasValue)                   q.Add($"onLeave={onLeave.Value.ToString().ToLowerInvariant()}");
        if (blacklisted.HasValue)               q.Add($"blacklisted={blacklisted.Value.ToString().ToLowerInvariant()}");
        if (active.HasValue)                    q.Add($"active={active.Value.ToString().ToLowerInvariant()}");

        return GetWithResultAsync<PagedResult<AppraiserDto>>($"/api/appraisers?{string.Join("&", q)}");
    }

    public Task<Result<AppraiserDto>> GetByIdAsync(int id)
        => GetWithResultAsync<AppraiserDto>($"/api/appraisers/{id}");

    public Task<Result<AppraiserDto>> CreateAsync(CreateAppraiserRequest request)
        => PostWithDataResultAsync<CreateAppraiserRequest, AppraiserDto>("/api/appraisers", request);

    public Task<Result<AppraiserDto>> UpdateAsync(int id, UpdateAppraiserRequest request)
        => PutWithDataResultAsync<UpdateAppraiserRequest, AppraiserDto>($"/api/appraisers/{id}", request);

    public Task<Result<AppraiserDto>> SetOnLeaveAsync(int id, bool value)
        => PostWithDataResultAsync<SetAppraiserFlagRequest, AppraiserDto>(
            $"/api/appraisers/{id}/on-leave", new SetAppraiserFlagRequest(value));

    public Task<Result<AppraiserDto>> SetBlacklistedAsync(int id, bool value)
        => PostWithDataResultAsync<SetAppraiserFlagRequest, AppraiserDto>(
            $"/api/appraisers/{id}/blacklist", new SetAppraiserFlagRequest(value));

    public Task<Result> DeactivateAsync(int id)
        => DeleteWithResultAsync($"/api/appraisers/{id}");

    // Faza C — FL automatski odabir vještaka za narudžbu
    public Task<Result<AppraiserAssignmentResultDto>> AutoSelectAsync(int orderId)
        => PostWithDataResultAsync<object, AppraiserAssignmentResultDto>(
            $"/api/orders/{orderId}/select-appraiser/auto", new { });

    // Faza D — PL ručni odabir / FL fallback: lista kandidata
    public Task<Result<List<AppraiserDto>>> GetCandidatesAsync(int orderId)
        => GetWithResultAsync<List<AppraiserDto>>($"/api/orders/{orderId}/appraiser-candidates");

    // Faza D — ručni odabir vještaka
    public Task<Result<AppraiserAssignmentResultDto>> ManualSelectAsync(int orderId, int appraiserId)
        => PostWithDataResultAsync<ManualSelectAppraiserRequest, AppraiserAssignmentResultDto>(
            $"/api/orders/{orderId}/select-appraiser/manual", new ManualSelectAppraiserRequest(appraiserId));

    // Faza D — slanje narudžbe odabranom vještaku
    public Task<Result<SendToAppraiserResultDto>> SendToAppraiserAsync(int orderId)
        => PostWithDataResultAsync<object, SendToAppraiserResultDto>(
            $"/api/orders/{orderId}/send-to-appraiser", new { });

    // Faza D — paket dokumenata za vještaka
    public Task<Result<AppraiserPackageDto>> GetAppraiserPackageAsync(int orderId)
        => GetWithResultAsync<AppraiserPackageDto>($"/api/orders/{orderId}/appraiser-package");

    // Vještak prihvata dodijeljenu narudžbu (→ izrada procjene u toku)
    public Task<Result<SendToAppraiserResultDto>> AcceptByAppraiserAsync(int orderId)
        => PostWithDataResultAsync<object, SendToAppraiserResultDto>(
            $"/api/orders/{orderId}/accept-by-appraiser", new { });

    // Vještak završava import potpisanih dokumenata
    public Task<Result<SendToAppraiserResultDto>> CompleteSignedDocumentImportAsync(int orderId)
        => PostWithDataResultAsync<object, SendToAppraiserResultDto>(
            $"/api/orders/{orderId}/complete-signed-docs", new { });

    // ── PL zahtjev za ponudu ─────────────────────────────────────────────

    public Task<Result<SendQuoteRequestsResultDto>> SendQuoteRequestsAsync(
        int orderId, SendQuoteRequestsRequest request)
        => PostWithDataResultAsync<SendQuoteRequestsRequest, SendQuoteRequestsResultDto>(
            $"/api/orders/{orderId}/quote-requests", request);

    public Task<Result<List<QuoteRequestDto>>> GetQuoteRequestsAsync(int orderId)
        => GetWithResultAsync<List<QuoteRequestDto>>($"/api/orders/{orderId}/quote-requests");

    public Task<Result<SendThankYouResultDto>> SendThankYouAsync(int orderId)
        => PostWithDataResultAsync<object, SendThankYouResultDto>(
            $"/api/orders/{orderId}/quote-requests/thank-you", new { });
}
