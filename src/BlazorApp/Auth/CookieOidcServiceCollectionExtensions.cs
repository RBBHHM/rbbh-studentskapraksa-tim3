using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;

namespace BlazorApp.Auth
{
    internal static partial class CookieOidcServiceCollectionExtensions
    {
        public static IServiceCollection ConfigureCookieOidcRefresh(
            this IServiceCollection services,
            string cookieScheme,
            string oidcScheme
        )
        {
            services.AddSingleton<CookieOidcRefresher>();
            services
                .AddOptions<CookieAuthenticationOptions>(cookieScheme)
                .Configure<CookieOidcRefresher>(
                    (cookieOptions, refresher) =>
                    {
                        cookieOptions.Events.OnValidatePrincipal = context =>
                            refresher.ValidateOrRefreshCookieAsync(context, oidcScheme);
                    }
                );
            services
                .AddOptions<OpenIdConnectOptions>(oidcScheme)
                .Configure(oidcOptions =>
                {
                    // offline_access se namjerno ne traži (vidi Program.cs OIDC scope konfiguraciju).
                    oidcOptions.SaveTokens = true;
                });
            return services;
        }
    }
}
