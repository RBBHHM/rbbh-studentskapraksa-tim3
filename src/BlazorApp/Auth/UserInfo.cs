using System.Security.Claims;

namespace BlazorApp.Auth;

/// <summary>
/// User information class for persisting authentication state
/// </summary>
public class UserInfo
{
    public string? UserId { get; set; }
    public string? Email { get; set; }
    public string? Name { get; set; }
    public string[]? Roles { get; set; }

    public static UserInfo FromClaimsPrincipal(ClaimsPrincipal principal)
    {
        return new UserInfo
        {
            UserId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? principal.FindFirst("sub")?.Value,
            Email = principal.FindFirst(ClaimTypes.Email)?.Value
                ?? principal.FindFirst("email")?.Value,
            Name = principal.FindFirst(ClaimTypes.Name)?.Value
                ?? principal.FindFirst("name")?.Value
                ?? principal.FindFirst("preferred_username")?.Value,
            Roles = principal.FindAll(ClaimTypes.Role)
                .Select(c => c.Value)
                .ToArray()
        };
    }

    public ClaimsPrincipal ToClaimsPrincipal()
    {
        var claims = new List<Claim>();

        if (!string.IsNullOrEmpty(UserId))
            claims.Add(new Claim(ClaimTypes.NameIdentifier, UserId));

        if (!string.IsNullOrEmpty(Email))
            claims.Add(new Claim(ClaimTypes.Email, Email));

        if (!string.IsNullOrEmpty(Name))
            claims.Add(new Claim(ClaimTypes.Name, Name));

        if (Roles != null)
        {
            foreach (var role in Roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
        }

        var identity = new ClaimsIdentity(claims, "BlazorApp");
        return new ClaimsPrincipal(identity);
    }
}
