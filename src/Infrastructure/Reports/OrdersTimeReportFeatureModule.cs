using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Praksa.Application.Common.Modules;
using Praksa.Application.Reports;

namespace Praksa.Infrastructure.Reports;

[System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
public sealed class OrdersTimeReportFeatureModule : IFeatureModule
{
    public void RegisterServices(IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IOrdersTimeReportService, OrdersTimeReportService>();
    }
}
