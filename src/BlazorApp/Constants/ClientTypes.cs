namespace BlazorApp.Constants;

/// <summary>
/// Konstante za tipove klijenata — sprječava magic strings u svim Blazor komponentama i modelima.
/// Premješteno iz inline string komparacija u OrderModels.cs.
/// </summary>
public static class ClientTypes
{
    public const string FizickoLice = "FL";
    public const string PravnoLice  = "PL";

    public const string WorkflowFizickoLice = "FizickaLica";
    public const string WorkflowPravnoLice  = "PravnaLica";

    public static string DisplayLabel(string? clientType) => clientType switch
    {
        FizickoLice => "Fizičko lice",
        PravnoLice  => "Pravna lica",
        _           => "—"
    };

    public static bool IsFizickoLice(string? clientType) =>
        string.Equals(clientType, FizickoLice, StringComparison.OrdinalIgnoreCase);

    public static bool IsPravnoLice(string? clientType) =>
        string.Equals(clientType, PravnoLice, StringComparison.OrdinalIgnoreCase);
}
