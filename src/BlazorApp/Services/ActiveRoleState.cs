namespace BlazorApp.Services;

/// <summary>
/// Čuva aktivni role context korisnika tokom Blazor Server sesije (per circuit).
///
/// NAPOMENA: Ovo je UI-side state koji NE zamjenjuje backend validaciju.
/// Backend uvijek ponovo validira rolu na svakom API pozivu.
/// Ovaj servis postoji samo kako bi UI mogao prilagoditi meni i dashboard
/// bez round-trip-a na server pri svakom render-u.
///
/// Scoped životni vijek → jedan instance per SignalR circuit (per tab/sesija).
/// </summary>
public sealed class ActiveRoleState
{
    private string? _activeRole;
    private IReadOnlyList<string> _allRoles = [];

    /// <summary>Trenutno aktivna uloga korisnika. Null ako još nije odabrana.</summary>
    public string? ActiveRole => _activeRole;

    /// <summary>Sve role koje korisnik posjeduje (iz MeDto).</summary>
    public IReadOnlyList<string> AllRoles => _allRoles;

    /// <summary>True ako korisnik ima više od jedne validne role.</summary>
    public bool HasMultipleRoles => _allRoles.Count > 1;

    /// <summary>
    /// Event koji se okida kad se aktivna rola promijeni.
    /// MainLayout se pretplaćuje kako bi ažurirao header bez full page refresh.
    /// </summary>
    public event Action? OnRoleChanged;

    /// <summary>
    /// Inicijalizira state sa listom svih rola.
    /// Poziva se u Home.razor ili SelectRole.razor odmah po učitavanju MeDto.
    /// </summary>
    public void Initialize(IReadOnlyList<string> allRoles, string? activeRole = null)
    {
        _allRoles   = allRoles;
        _activeRole = activeRole;
    }

    /// <summary>Postavlja novu aktivnu rolu i notificira pretplatnike.</summary>
    public void SetActiveRole(string roleCode)
    {
        _activeRole = roleCode;
        OnRoleChanged?.Invoke();
    }

    /// <summary>Briše aktivan role context (npr. pri logout-u).</summary>
    public void Clear()
    {
        _activeRole = null;
        _allRoles   = [];
        OnRoleChanged?.Invoke();
    }
}
