using System.Net.Http.Headers;
using System.Security.Claims;
using BlazorApp.Auth;
using BlazorApp.Components;
using BlazorApp.IoC;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using MudBlazor.Services;
using Serilog;
using Serilog.Formatting.Elasticsearch;

const string OIDC_SCHEME = "MicrosoftOidc";

var builder = WebApplication.CreateBuilder(args);

// Lokalni override za dev kredencijale (gitignored). Vidi appsettings.Development.Local.json.example.
builder.Configuration
    .AddJsonFile("appsettings.Development.Local.json", optional: true, reloadOnChange: false);

// ── Razor Components (Blazor Server) ─────────────────────────────────────────
builder.Services.AddRazorComponents()
                .AddInteractiveServerComponents();

// ── Structured logging ────────────────────────────────────────────────────────
builder.Host.UseSerilog((ctx, lc) =>
    lc.Enrich.FromLogContext()
      .ReadFrom.Configuration(builder.Configuration)
      .WriteTo.Console(new ElasticsearchJsonFormatter()));

// ── OIDC / Keycloak autentifikacija ──────────────────────────────────────────
// Authority = javni URL (browser ga koristi za redirect + iss validaciju u JWT-u)
// KeycloakInternalUrl = interni Docker URL (server-side discovery endpoint)
var authority        = builder.Configuration["OpenIDConnectSettings:Authority"]!;
var clientId         = builder.Configuration["OpenIDConnectSettings:ClientId"]!;
var keycloakInternal = builder.Configuration["KeycloakInternalUrl"] ?? authority;

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultScheme          = CookieAuthenticationDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = OIDC_SCHEME;
        options.DefaultSignOutScheme   = OIDC_SCHEME;
    })
    .AddCookie()
    .AddOpenIdConnect(OIDC_SCHEME, options =>
    {
        options.Authority        = authority;
        options.MetadataAddress  = $"{keycloakInternal}/.well-known/openid-configuration";
        options.ClientId         = clientId;
        options.ResponseType     = OpenIdConnectResponseType.Code;
        // response_mode=query → IdP vraća code kroz 302 GET redirect (top-level GET navigacija),
        // čime SameSite=Lax correlation/nonce cookie-ji stižu nazad. form_post bi bio cross-site
        // POST i ti cookie-ji ne bi bili poslani → "Correlation failed".
        options.ResponseMode     = OpenIdConnectResponseMode.Query;
        options.CallbackPath     = "/authentication/login-callback";
        options.SaveTokens       = true;
        // Claims (preferred_username, email, roles) već stižu u id_token-u (profile/email scope
        // + realm-roles-flat mapper sa id.token.claim=true), pa userinfo poziv nije potreban.
        options.GetClaimsFromUserInfoEndpoint = false;
        options.RequireHttpsMetadata          = !builder.Environment.IsDevelopment() &&
                                                  builder.Configuration.GetValue<bool>("OpenIDConnectSettings:RequireHttpsMetadata", defaultValue: true);
        options.MapInboundClaims              = false;

        // Lokalni razvoj ide preko HTTP-a; ne markiraj cookie-je kao Secure tada
        // (u produkciji iza HTTPS-a postaju Secure automatski preko SameAsRequest).
        options.CorrelationCookie.SameSite     = SameSiteMode.Lax;
        options.NonceCookie.SameSite           = SameSiteMode.Lax;
        options.CorrelationCookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
        options.NonceCookie.SecurePolicy       = CookieSecurePolicy.SameAsRequest;

        options.Scope.Add("openid");
        options.Scope.Add("profile");
        options.Scope.Add("email");
        options.Scope.Add("roles");
        // Bez offline_access: za bankarski kontekst dovoljan je refresh token vezan za SSO sesiju,
        // ne trajni offline token. (Izbjegava i "Offline tokens not allowed" ako rola nije dodijeljena.)

        options.TokenValidationParameters.NameClaimType = "preferred_username";
        options.TokenValidationParameters.RoleClaimType = "roles";
        options.TokenValidationParameters.ValidIssuers  = [authority, keycloakInternal];

        // Discovery document dolazi s internog URL-a (keycloak:8080), ali browser
        // mora biti preusmjeren na javni URL (localhost:8080). Zamijeni host u redirectu.
        var internalAuthority = new Uri(keycloakInternal).Authority;
        var publicAuthority   = new Uri(authority).Authority;
        options.Events.OnRedirectToIdentityProvider = ctx =>
        {
            ctx.ProtocolMessage.IssuerAddress = ctx.ProtocolMessage.IssuerAddress
                .Replace(internalAuthority, publicAuthority);

            // Prefiluj korisničko ime na Keycloak stranici ako je proslijeđen login_hint.
            if (ctx.Properties.Items.TryGetValue("login_hint", out var hint)
                && !string.IsNullOrWhiteSpace(hint))
            {
                ctx.ProtocolMessage.LoginHint = hint;
            }
            return Task.CompletedTask;
        };

        // Logout redirect — isti problem kao pri loginu: discovery document vraća
        // interni keycloak:8080 hostname koji browser ne može doseći.
        options.Events.OnRedirectToIdentityProviderForSignOut = ctx =>
        {
            ctx.ProtocolMessage.IssuerAddress = ctx.ProtocolMessage.IssuerAddress
                .Replace(internalAuthority, publicAuthority);
            return Task.CompletedTask;
        };

        // ── Audit: Login success ──────────────────────────────────────────────
        options.Events.OnTokenValidated = async ctx =>
        {
            try
            {
                var accessToken = ctx.TokenEndpointResponse?.AccessToken;
                if (string.IsNullOrWhiteSpace(accessToken)) return;

                var userId   = ctx.Principal?.FindFirstValue("sub") ?? string.Empty;
                var username = ctx.Principal?.FindFirstValue("preferred_username")
                               ?? ctx.Principal?.FindFirstValue(ClaimTypes.Name)
                               ?? "unknown";

                var backendBaseUri = builder.Configuration["BackendApiUri"];
                if (string.IsNullOrWhiteSpace(backendBaseUri)) return;

                var factory    = ctx.HttpContext.RequestServices.GetRequiredService<IHttpClientFactory>();
                using var httpClient = factory.CreateClient("BackendAudit");
                httpClient.BaseAddress = new Uri(backendBaseUri);
                httpClient.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", accessToken);

                await httpClient.PostAsJsonAsync("/api/audit/auth-events", new
                {
                    action   = "USER_LOGGED_IN",
                    userId,
                    username
                });
            }
            catch
            {
                // Audit greška ne smije blokirati korisnikovu prijavu
            }
        };

        // ── Audit: Login failed (OIDC remote failure) ─────────────────────────
        // Hvata: neuspješan callback iz Keycloak-a, odbijen authorization code, itd.
        options.Events.OnRemoteFailure = async ctx =>
        {
            try
            {
                var backendBaseUri = builder.Configuration["BackendApiUri"];
                if (!string.IsNullOrWhiteSpace(backendBaseUri))
                {
                    // Nema access tokena jer login nije uspio — šaljemo bez autorizacije.
                    // Backend /api/audit/auth-events mora prihvatiti AllowAnonymous za failed login.
                    var factory2     = ctx.HttpContext.RequestServices.GetRequiredService<IHttpClientFactory>();
                    using var httpClient = factory2.CreateClient("BackendAudit");
                    httpClient.BaseAddress = new Uri(backendBaseUri);
                    await httpClient.PostAsJsonAsync("/api/audit/auth-events/failed", new
                    {
                        action      = "USER_LOGIN_FAILED",
                        userId      = (string?)null,
                        username    = ctx.Request.Query["login_hint"].ToString() ?? "unknown",
                        reason      = ctx.Failure?.Message ?? "OIDC remote failure"
                    });
                }
            }
            catch { /* Audit greška ne smije blokirati error handling */ }

            // Preusmjeri na login stranicu s porukom greške
            ctx.Response.Redirect("/login?error=auth_failed");
            ctx.HandleResponse();
        };
    });

builder.Services.ConfigureCookieOidcRefresh(
    CookieAuthenticationDefaults.AuthenticationScheme, OIDC_SCHEME);

// ── Infrastructure servisi ────────────────────────────────────────────────────
builder.Services.AddHttpContextAccessor();
builder.Services.AddMemoryCache();
builder.Services.AddMudServices();

// Named HttpClient za audit pozive iz OIDC event handlera.
// BaseAddress se postavlja per-request jer zavisi od konfiguracije.
builder.Services.AddHttpClient("BackendAudit");

DependencyContainer.RegisterClients(builder.Services, builder.Configuration);
DependencyContainer.RegisterServices(builder.Services, OIDC_SCHEME);

// ── Rate limiting — ROPC login endpoint (5 pokušaja/min po IP-u) ─────────────
builder.Services.AddRateLimiter(options =>
{
    options.AddPolicy("direct-login", httpContext =>
        System.Threading.RateLimiting.RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
            factory: _ => new System.Threading.RateLimiting.FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window      = TimeSpan.FromMinutes(1),
                QueueLimit  = 0
            }));
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

var dpBuilder = builder.Services.AddDataProtection().SetApplicationName("tim3-web");
if (!builder.Environment.IsDevelopment())
    dpBuilder.PersistKeysToFileSystem(new DirectoryInfo("/keys"));

// ── Build ─────────────────────────────────────────────────────────────────────
var app = builder.Build();

// ── Reverse proxy (Nginx) ─────────────────────────────────────────────────────
// Mora biti PRVO u pipeline-u: Blazor Server radi preko SignalR/WebSocket-a, a iza
// Nginx-a app vidi promet kao HTTP s internog porta. Bez X-Forwarded-Proto app generiše
// http redirect URI-jeve → OIDC login puca, a circuit (WebSocket) se ne uspostavi.
var forwardedOptions = new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
};
// Proxy je u Docker mreži na nepoznatom IP-u; default trusta samo loopback.
forwardedOptions.KnownNetworks.Clear();
forwardedOptions.KnownProxies.Clear();
app.UseForwardedHeaders(forwardedOptions);

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler(exApp => exApp.Run(async ctx =>
    {
        ctx.Response.StatusCode  = StatusCodes.Status500InternalServerError;
        ctx.Response.ContentType = "text/html; charset=utf-8";

        var exFeature = ctx.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>();
        var isOidcError = exFeature?.Error?.Message.Contains("IDX20803") == true
                       || exFeature?.Error?.InnerException?.Message.Contains("keycloak") == true;

        var html = isOidcError
            ? """
              <html><head><meta charset="utf-8"><title>Greška autentifikacije</title></head>
              <body style="font-family:'Segoe UI',sans-serif;background:#F8F6F2;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;">
                <div style="background:#fff;border:1px solid #F1EDE6;border-radius:12px;padding:40px 48px;max-width:480px;text-align:center;box-shadow:0 2px 16px rgba(0,0,0,0.08);">
                  <div style="font-size:40px;margin-bottom:16px;">🔐</div>
                  <h2 style="color:#2B2D33;margin:0 0 12px;">Servis za autentifikaciju nije dostupan</h2>
                  <p style="color:#6B6560;font-size:14px;line-height:1.6;margin:0 0 24px;">
                    Keycloak servis trenutno nije dostupan. Provjerite da li su svi Docker kontejneri pokrenuti, pa pokušajte ponovo.
                  </p>
                  <a href="/api/login" style="display:inline-block;background:#FEE600;color:#2B2D33;text-decoration:none;padding:10px 24px;border-radius:8px;font-weight:700;font-size:14px;">Pokušaj ponovo</a>
                </div>
              </body></html>
              """
            : """
              <html><head><meta charset="utf-8"><title>Greška servera</title></head>
              <body style="font-family:'Segoe UI',sans-serif;background:#F8F6F2;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;">
                <div style="background:#fff;border:1px solid #F1EDE6;border-radius:12px;padding:40px 48px;max-width:480px;text-align:center;box-shadow:0 2px 16px rgba(0,0,0,0.08);">
                  <div style="font-size:40px;margin-bottom:16px;">⚠️</div>
                  <h2 style="color:#2B2D33;margin:0 0 12px;">Greška servera</h2>
                  <p style="color:#6B6560;font-size:14px;line-height:1.6;margin:0 0 24px;">
                    Neočekivana greška. Pokušajte ponovo ili kontaktirajte administratora sistema.
                  </p>
                  <a href="/" style="display:inline-block;background:#FEE600;color:#2B2D33;text-decoration:none;padding:10px 24px;border-radius:8px;font-weight:700;font-size:14px;">Početna</a>
                </div>
              </body></html>
              """;

        await ctx.Response.WriteAsync(html, System.Text.Encoding.UTF8);
    }));
    app.UseHsts();
}

app.UseStaticFiles();
app.UseRateLimiter();
app.UseAntiforgery();
app.UseAuthentication();
app.UseAuthorization();

// Auth endpointi ekstrahovani u Auth/AuthEndpoints.cs (API-3 refactoring).
app.MapAuthEndpoints(OIDC_SCHEME);

// ── Proxy za preuzimanje dokumenata ───────────────────────────────────────────
// Browser autentifikaciju drži u OIDC cookieju, ne kao JWT Bearer, pa direktan
// odlazak na /api/documents/{id}/download (bez Authorization headera) vraća 401.
// Ovaj endpoint koristi "BackendApi" klijent (RequestMessageHandler dodaje Bearer
// iz cookieja) i streamuje fajl nazad korisniku.
app.MapGet("/files/documents/{id:int}", async (int id, bool? inline, IHttpClientFactory httpClientFactory) =>
{
    var apiClient = httpClientFactory.CreateClient("BackendApi");
    var response  = await apiClient.GetAsync($"/api/documents/{id}/download");

    if (!response.IsSuccessStatusCode)
        return Results.StatusCode((int)response.StatusCode);

    var contentType = response.Content.Headers.ContentType?.ToString() ?? "application/octet-stream";
    var fileName     = response.Content.Headers.ContentDisposition?.FileNameStar
                     ?? response.Content.Headers.ContentDisposition?.FileName
                     ?? $"dokument-{id}";

    var stream = await response.Content.ReadAsStreamAsync();
    // inline=true → Content-Disposition: inline (PDF prikazuje u browseru)
    // bez parametra ili inline=false → Content-Disposition: attachment (download)
    return inline == true
        ? Results.File(stream, contentType)
        : Results.File(stream, contentType, fileName);
}).RequireAuthorization();

// ── Proxy za export šifarnika ─────────────────────────────────────────────────
// Isti razlog kao proxy za dokumente: direktan browser GET na /api/codebooks/...
// ne šalje Authorization header → 401. Proxy koristi BackendApi klijent.
app.MapGet("/files/codebooks/export", async (string codebookType, string format, bool includeInactive, IHttpClientFactory httpClientFactory) =>
{
    var apiClient = httpClientFactory.CreateClient("BackendApi");
    var url = $"/api/codebooks/import-export/export?codebookType={Uri.EscapeDataString(codebookType)}&format={format}&includeInactive={includeInactive}";
    var response = await apiClient.GetAsync(url);

    if (!response.IsSuccessStatusCode)
        return Results.StatusCode((int)response.StatusCode);

    var contentType = response.Content.Headers.ContentType?.ToString() ?? "application/octet-stream";
    var fileName    = response.Content.Headers.ContentDisposition?.FileNameStar
                   ?? response.Content.Headers.ContentDisposition?.FileName
                   ?? $"export-{codebookType}.{format}";

    var stream = await response.Content.ReadAsStreamAsync();
    return Results.File(stream, contentType, fileName);
}).RequireAuthorization();

app.MapRazorComponents<App>()
   .AddInteractiveServerRenderMode();

app.Run();

// RopcTokenResponse proširen u Auth/AuthEndpoints.cs
