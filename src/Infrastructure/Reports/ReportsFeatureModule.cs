using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Praksa.Application.Common.Modules;
using Praksa.Application.Reports;

namespace Praksa.Infrastructure.Reports;

/// <summary>
/// Registruje servise izvještaja (auto-discovery preko IFeatureModule — ne dira DependencyInjection.cs).
/// </summary>
[System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
public sealed class ReportsFeatureModule : IFeatureModule
{
    public void RegisterServices(IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IExcelReportBuilder, ClosedXmlReportBuilder>();
        services.AddScoped<IReportService, ReportService>();
    }
}
