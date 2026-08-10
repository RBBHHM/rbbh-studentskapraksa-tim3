namespace Praksa.Infrastructure.Auth;

/// <summary>
/// Konfiguracija za Keycloak Admin REST API.
/// Primarni pristup: client_credentials (service account) — zahtijeva manage-realm rolu na service accountu.
/// Fallback za development: password grant na master realmu (AdminUsername + AdminPassword).
/// Secretove i lozinke postaviti putem environment varijabli — NIKADA ne hardkodovati!
/// </summary>
[System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
public class KeycloakAdminOptions
{
    public const string SectionName = "KeycloakAdmin";

    public string BaseUrl { get; init; } = string.Empty;
    public string Realm { get; init; } = string.Empty;
    public string ClientId { get; init; } = string.Empty;
    public string ClientSecret { get; init; } = string.Empty;

    /// <summary>
    /// Ako je postavljeno, koristi password grant na master realmu umjesto client_credentials.
    /// Korisno za lokalni razvoj kada service account još nema manage-realm rolu.
    /// U produkciji ostaviti prazno — koristiti service account s manage-realm rolom.
    /// </summary>
    public string AdminUsername { get; init; } = string.Empty;
    public string AdminPassword { get; init; } = string.Empty;

    public bool UseAdminCredentials =>
        !string.IsNullOrEmpty(AdminUsername) && !string.IsNullOrEmpty(AdminPassword);
}
