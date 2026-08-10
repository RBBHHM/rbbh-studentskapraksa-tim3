using Microsoft.Extensions.Diagnostics.HealthChecks;
using Praksa.Infrastructure.Persistence;

namespace Praksa.Api.Middleware;

/// <summary>
/// Health check koji provjerava konekciju na PostgreSQL putem EF Core.
/// Ne zahtijeva dodatni NuGet paket — koristi postojeći DbContext.
/// </summary>
public sealed class DatabaseHealthCheck : IHealthCheck
{
    private readonly ApplicationDbContext _db;

    public DatabaseHealthCheck(ApplicationDbContext db) => _db = db;

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var canConnect = await _db.Database.CanConnectAsync(cancellationToken);
            return canConnect
                ? HealthCheckResult.Healthy("PostgreSQL konekcija uspješna.")
                : HealthCheckResult.Unhealthy("PostgreSQL nije dostupan.");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("PostgreSQL greška: " + ex.Message);
        }
    }
}
