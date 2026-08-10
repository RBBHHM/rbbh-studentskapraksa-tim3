namespace BlazorApp.Constants;

/// <summary>
/// Konstante za role vraćene u <c>MeDto.Roles</c> (GET /api/me).
/// Mirror backend konstanti iz <c>Praksa.Application.Security.AppRoles</c>.
/// </summary>
public static class AppRoles
{
    public const string Administrator = "Administrator";
    public const string Unosnik       = "Unosnik";
    public const string Verifikator   = "Verifikator";

    // ── Segment Prodaja — AM, SM, UB (narudžbe procjene — US 92/93/94) ────────
    // Tri odvojene Keycloak/aplikativne role. Korisnik se NIKAD ne prijavljuje
    // kao generička rola "Prodaja" — uvijek kao AM, SM ili UB.
    public const string AM = "AM";
    public const string SM = "SM";
    public const string UB = "UB";

    /// <summary>Naziv segmenta/kućice — samo za labeling (UI), nije Keycloak rola.</summary>
    public const string ProdajaSegment = "Prodaja";

    public const string KolateralAdministrator = "KolateralAdministrator";
    public const string KolateralOficir        = "KolateralOficir";
    public const string Vjestak                = "Vjestak";
    public const string PravnaSluzba           = "PravnaSluzba";
    public const string Protokol               = "Protokol";
    public const string Likvidatura            = "Likvidatura";
    public const string SpecijalniRacuni       = "SpecijalniRacuni";
    public const string Racunovodstvo          = "Racunovodstvo";

    /// <summary>Role koje mogu inicirati narudžbe procjene — AM, SM, UB.</summary>
    public static readonly string[] SalesRoles = [AM, SM, UB];

    public static bool IsSalesRole(string? role) =>
        role is not null && SalesRoles.Contains(role, StringComparer.OrdinalIgnoreCase);

    // ── Prikaz role u UI-u (umjesto sirovog koda "Vjestak", "AM"...) ──────────
    private static readonly Dictionary<string, string> _displayNames = new(StringComparer.OrdinalIgnoreCase)
    {
        [Administrator]          = "Administrator",
        [Verifikator]            = "Verifikator",
        [Unosnik]                = "Unosnik podataka",
        [AM]                     = "Account Manager (AM)",
        [SM]                     = "Sales Manager (SM)",
        [UB]                     = "Universal Banker (UB)",
        [KolateralAdministrator] = "Kolateral administrator",
        [KolateralOficir]        = "Kolateral oficir",
        [Vjestak]                = "Vještak",
        [PravnaSluzba]           = "Pravna služba",
        [Protokol]               = "Protokol",
        [Likvidatura]            = "Likvidatura",
        [SpecijalniRacuni]       = "Specijalni računi",
        [Racunovodstvo]          = "Računovodstvo",
    };

    // Prioritet kad korisnik ima više rola (mirror RolePriorityResolver) — viši = važniji.
    private static readonly Dictionary<string, int> _priority = new(StringComparer.OrdinalIgnoreCase)
    {
        [Administrator] = 100, [Verifikator] = 50, [KolateralOficir] = 45,
        [KolateralAdministrator] = 40, [PravnaSluzba] = 35, [AM] = 20, [SM] = 20,
        [UB] = 20, [Unosnik] = 10, [Vjestak] = 8, [Protokol] = 5,
        [Likvidatura] = 4, [Racunovodstvo] = 3, [SpecijalniRacuni] = 2,
    };

    /// <summary>Lijepi naziv role za prikaz. Vraća sirovi kod ako rola nije poznata.</summary>
    public static string DisplayName(string? role) =>
        role is not null && _displayNames.TryGetValue(role, out var n) ? n : (role ?? "Korisnik");

    /// <summary>Najvažnija rola iz skupa (za prikaz primarne role u UI-u).</summary>
    public static string? PrimaryRole(IEnumerable<string>? roles) =>
        roles?.OrderByDescending(r => _priority.TryGetValue(r, out var p) ? p : 0).FirstOrDefault();

    /// <summary>Lijepi naziv primarne (najvažnije) role korisnika.</summary>
    public static string PrimaryDisplayName(IEnumerable<string>? roles) => DisplayName(PrimaryRole(roles));
}
