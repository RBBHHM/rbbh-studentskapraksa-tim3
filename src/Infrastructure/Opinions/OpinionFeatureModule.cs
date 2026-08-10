using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Praksa.Application.Common.Modules;
using Praksa.Application.Opinions;

namespace Praksa.Infrastructure.Opinions;

[System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
public sealed class OpinionFeatureModule : IFeatureModule
{
    public void RegisterServices(IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IOpinionService, OpinionService>();
    }
}