using BlazorApp.Models;

namespace BlazorApp.Services;

public sealed class BranchApiService : BaseApiService
{
    public BranchApiService(IHttpClientFactory factory, ILogger<BranchApiService> logger)
        : base(factory, logger) { }

    public Task<Result<List<CityDto>>> GetCitiesAsync()
        => GetListWithResultAsync<CityDto>("/api/branches/cities");

    public Task<Result<List<BranchDto>>> GetBranchesAsync(int? cityId = null)
    {
        var url = cityId.HasValue
            ? $"/api/branches?cityId={cityId.Value}"
            : "/api/branches";
        return GetListWithResultAsync<BranchDto>(url);
    }

    public Task<Result<BranchDto>> GetBranchByIdAsync(int id)
        => GetWithResultAsync<BranchDto>($"/api/branches/{id}");
}
