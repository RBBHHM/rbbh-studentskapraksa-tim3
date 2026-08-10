using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Praksa.Application.Common.Modules;
using Praksa.Application.Documents;

namespace Praksa.Infrastructure.Documents;

[System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
public sealed class DocumentFeatureModule : IFeatureModule
{
    public void RegisterServices(IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IDocumentService, DocumentService>();
        services.AddScoped<ISharedDocumentService, SharedDocumentService>();
        services.AddScoped<IOrderDocumentGenerator, OrderDocumentGeneratorService>();
    }
}