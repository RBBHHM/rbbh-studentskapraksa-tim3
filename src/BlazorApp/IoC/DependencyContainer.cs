using BlazorApp.Auth;
using BlazorApp.Middlewares;
using BlazorApp.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.Extensions.Options;

namespace BlazorApp.IoC;

public static class DependencyContainer
{
    public static void RegisterServices(IServiceCollection services, string oidcScheme)
    {
        services.AddTransient<RequestMessageHandler>(sp => new RequestMessageHandler(
            sp.GetRequiredService<IHttpContextAccessor>(),
            sp.GetRequiredService<ILogger<RequestMessageHandler>>(),
            sp.GetService<CookieOidcRefresher>(),
            sp.GetRequiredService<IOptionsMonitor<CookieAuthenticationOptions>>(),
            oidcScheme
        ));

        services.AddScoped<AuthenticationStateProvider, PersistingAuthenticationStateProvider>();

        // Role context — scoped per Blazor circuit (per tab/sesija)
        services.AddScoped<ActiveRoleState>();

        services.AddScoped<UserRoleService>();
        services.AddScoped<MeService>();
        services.AddScoped<AccessManagementService>();
        services.AddScoped<RoleApiService>();
        services.AddScoped<OpinionApiService>();
        services.AddScoped<RoleContextApiService>();
        services.AddScoped<OrderService>();
        services.AddScoped<ProtocolService>();
        services.AddScoped<Us93ApiService>();
        services.AddScoped<DocumentApiService>();
        services.AddScoped<NotificationApiService>();
        services.AddScoped<AppraiserApiService>();
        services.AddScoped<BranchApiService>();
        services.AddScoped<SharedDocumentApiService>();
        services.AddScoped<ImportExportService>();
    }

    public static void RegisterClients(IServiceCollection services, IConfiguration configuration)
    {
        var backendUri = configuration["BackendApiUri"];
        if (string.IsNullOrWhiteSpace(backendUri))
            throw new InvalidOperationException(
                "BackendApiUri nije konfiguriran u appsettings.json. " +
                "Dodajte: \"BackendApiUri\": \"https://localhost:7101\"");

        services
            .AddHttpClient("BackendApi", c =>
            {
                c.BaseAddress = new Uri(backendUri);
                c.Timeout = TimeSpan.FromMinutes(10);
                c.DefaultRequestHeaders.Add("Accept", "application/json");
            })
            .AddHttpMessageHandler<RequestMessageHandler>();
    }
}
