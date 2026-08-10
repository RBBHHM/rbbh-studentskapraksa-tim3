using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Praksa.Api.Middleware;

public sealed class KeycloakHealthCheck : IHealthCheck
{
    private readonly string? _authority;
    private readonly IHttpClientFactory _httpClientFactory;

    public KeycloakHealthCheck(IConfiguration configuration, IHttpClientFactory httpClientFactory)
    {
        _authority         = configuration["Keycloak:Authority"];
        _httpClientFactory = httpClientFactory;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(_authority))
            return HealthCheckResult.Degraded("Keycloak Authority nije konfigurisan.");

        try
        {
            var client = _httpClientFactory.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(5);

            var url = $"{_authority.TrimEnd('/')}/.well-known/openid-configuration";
            using var response = await client.GetAsync(url, ct);

            return response.IsSuccessStatusCode
                ? HealthCheckResult.Healthy("Keycloak je dostupan.")
                : HealthCheckResult.Degraded($"Keycloak vratio HTTP {(int)response.StatusCode}.");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Keycloak nije dostupan.", ex);
        }
    }
}
