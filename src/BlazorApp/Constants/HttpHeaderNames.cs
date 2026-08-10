namespace BlazorApp.Constants;

/// <summary>
/// Custom HTTP header nazivi koje BlazorApp šalje prema backend API-ju.
/// Mirror backend konstante iz <c>Praksa.Application.Common.HttpHeaders</c>
/// (BlazorApp ne referencira backend Application sloj, pa se naziv duplira ovdje —
/// isti pattern kao <see cref="AppRoles"/>).
/// </summary>
public static class HttpHeaderNames
{
    /// <summary>
    /// Aktivna rola odabrana kroz /select-role mehanizam (ActiveRoleState.ActiveRole).
    /// Čisto informativan header za audit log na backend-u — NE koristi se za autorizaciju.
    /// </summary>
    public const string ActiveRole = "X-Active-Role";
}
