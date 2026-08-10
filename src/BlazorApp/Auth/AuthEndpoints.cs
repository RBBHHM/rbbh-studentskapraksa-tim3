// Ekstrahovano iz Program.cs (API-3 refactoring, Jul 2026).
// Centralizira sve auth endpointe: OIDC challenge, ROPC direktna prijava i odjava.
using System.Security.Claims;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace BlazorApp.Auth;

/// <summary>
/// Registracija i implementacija auth API endpointa:
///   POST /api/auth/direct-login  — ROPC prijava (email+password → cookie)
///   GET  /api/login              — OIDC challenge fallback
///   GET  /api/logout             — Odjava (OIDC + cookie)
/// </summary>
public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app, string oidcScheme)
    {
        app.MapGet("/api/login", (string? loginHint) =>
        {
            var props = new AuthenticationProperties { RedirectUri = "/" };
            if (!string.IsNullOrWhiteSpace(loginHint))
                props.Items["login_hint"] = loginHint;
            return Results.Challenge(props, [oidcScheme]);
        }).AllowAnonymous();

        app.MapPost("/api/auth/direct-login",
            async (HttpContext httpContext, IHttpClientFactory factory, IConfiguration config) =>
                await HandleDirectLogin(httpContext, factory, config))
            .AllowAnonymous()
            .DisableAntiforgery()
            .RequireRateLimiting("direct-login");

        app.MapGet("/api/logout",
            async (HttpContext ctx, IHttpClientFactory httpClientFactory) =>
                await HandleLogout(ctx, httpClientFactory, oidcScheme))
            .AllowAnonymous();
    }

    // ── ROPC direktna prijava ─────────────────────────────────────────────────────

    private static async Task HandleDirectLogin(
        HttpContext httpContext, IHttpClientFactory factory, IConfiguration config)
    {
        var form     = httpContext.Request.Form;
        // Strip control characters before use to prevent log injection
        var email    = new string(form["email"].ToString().Trim().Where(c => c >= ' ' && c != '\x7f').ToArray());
        var password = form["password"].ToString();

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            httpContext.Response.Redirect("/login?error=auth_failed");
            return;
        }

        // ── 1. ROPC — dohvati token direktno od Keycloak-a ───────────────────────
        // Koristiti KeycloakInternalUrl (Docker hostname) za server-side pozive.
        var authority = config["KeycloakInternalUrl"] ?? config["OpenIDConnectSettings:Authority"]!;
        var clientId  = config["OpenIDConnectSettings:ClientId"]!;
        var tokenUrl  = $"{authority}/protocol/openid-connect/token";

        string accessToken, idToken;
        int expiresIn;
        string? refreshToken;

        try
        {
            using var http = factory.CreateClient();
            http.Timeout = TimeSpan.FromSeconds(15);

            var ropcForm = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["grant_type"] = "password",
                ["client_id"]  = clientId,
                ["username"]   = email,
                ["password"]   = password,
                ["scope"]      = "openid profile email roles"
            });

            var tokenResp = await http.PostAsync(tokenUrl, ropcForm);
            if (!tokenResp.IsSuccessStatusCode)
            {
                httpContext.Response.Redirect("/login?error=auth_failed");
                return;
            }

            var tokenData = await tokenResp.Content.ReadFromJsonAsync<RopcTokenResponse>(
                new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (tokenData is null || string.IsNullOrWhiteSpace(tokenData.AccessToken))
            {
                httpContext.Response.Redirect("/login?error=auth_failed");
                return;
            }

            accessToken  = tokenData.AccessToken;
            idToken      = tokenData.IdToken ?? tokenData.AccessToken;
            refreshToken = tokenData.RefreshToken;
            expiresIn    = tokenData.ExpiresIn > 0 ? tokenData.ExpiresIn : 300;
        }
        catch
        {
            httpContext.Response.Redirect("/login?error=auth_failed");
            return;
        }

        // ── 2. Parsiraj JWT i kreiraj ClaimsPrincipal ─────────────────────────────
        var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
        System.IdentityModel.Tokens.Jwt.JwtSecurityToken jwt;
        try
        {
            jwt = handler.ReadJwtToken(accessToken);
        }
        catch
        {
            httpContext.Response.Redirect("/login?error=auth_failed");
            return;
        }

        var claims = jwt.Claims.ToList();
        if (!claims.Any(c => c.Type == ClaimTypes.Name))
        {
            var username = claims.FirstOrDefault(c => c.Type == "preferred_username")?.Value;
            if (username is not null)
                claims.Add(new Claim(ClaimTypes.Name, username));
        }

        var identity  = new ClaimsIdentity(
            claims, CookieAuthenticationDefaults.AuthenticationScheme, "preferred_username", "roles");
        var principal = new ClaimsPrincipal(identity);

        // ── 3. Postavi auth cookie sa tokenima ────────────────────────────────────
        var expiresAt = DateTimeOffset.UtcNow.AddSeconds(expiresIn).ToString("o");
        var authProps = new AuthenticationProperties
        {
            IsPersistent = true,
            ExpiresUtc   = DateTimeOffset.UtcNow.AddSeconds(expiresIn + 60)
        };
        authProps.StoreTokens(
        [
            new() { Name = "access_token",  Value = accessToken },
            new() { Name = "token_type",    Value = "Bearer" },
            new() { Name = "expires_at",    Value = expiresAt },
            .. (refreshToken is not null
                ? new[] { new AuthenticationToken { Name = "refresh_token", Value = refreshToken } }
                : Array.Empty<AuthenticationToken>())
        ]);

        await httpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, authProps);
        httpContext.Response.Redirect("/");
    }

    // ── Odjava ────────────────────────────────────────────────────────────────────

    private static async Task HandleLogout(
        HttpContext ctx, IHttpClientFactory httpClientFactory, string oidcScheme)
    {
        try
        {
            var userId   = ctx.User.FindFirstValue("sub") ?? string.Empty;
            var username = ctx.User.FindFirstValue("preferred_username")
                        ?? ctx.User.FindFirstValue(ClaimTypes.Name)
                        ?? "unknown";

            var apiClient = httpClientFactory.CreateClient("BackendApi");
            await apiClient.PostAsJsonAsync("/api/audit/auth-events", new
            {
                action = "USER_LOGGED_OUT", userId, username
            });
        }
        catch { /* Audit greška ne smije blokirati odjavu */ }

        await ctx.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

        var idToken = await ctx.GetTokenAsync("id_token");
        if (!string.IsNullOrWhiteSpace(idToken))
        {
            await ctx.SignOutAsync(oidcScheme,
                new AuthenticationProperties { RedirectUri = "/login" });
        }
        else
        {
            ctx.Response.Redirect("/login");
        }
    }
}

/// <summary>Keycloak token response za ROPC grant.</summary>
internal sealed record RopcTokenResponse(
    [property: JsonPropertyName("access_token")]  string  AccessToken,
    [property: JsonPropertyName("refresh_token")] string? RefreshToken,
    [property: JsonPropertyName("id_token")]      string? IdToken,
    [property: JsonPropertyName("expires_in")]    int     ExpiresIn,
    [property: JsonPropertyName("token_type")]    string? TokenType);
