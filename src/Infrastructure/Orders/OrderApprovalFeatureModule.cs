using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Praksa.Application.Common.Modules;
using Praksa.Application.Orders;

namespace Praksa.Infrastructure.Orders;

[System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
public sealed class OrderApprovalFeatureModule : IFeatureModule
{
    public void RegisterServices(IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IOrderApprovalService, OrderApprovalService>();
        services.AddScoped<IOrderQueryService, OrderQueryService>();
    }
}
