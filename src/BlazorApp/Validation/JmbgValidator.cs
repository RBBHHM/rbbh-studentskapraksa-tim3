namespace BlazorApp.Validation;

/// <summary>
/// Klijentska validacija JMBG-a za Blazor forme. Ista pravila kao backend JmbgValidator.
/// Format: DDMMYYYRRBBBK — 13 cifara.
/// Godišnji dio YYY: ≥900 → 1000+YYY, &lt;900 → 2000+YYY. Validni opseg 1900–tekuća godina.
/// </summary>
internal static class JmbgValidator
{
    internal static bool IsValid(string? jmbg)
        => !string.IsNullOrWhiteSpace(jmbg) && GetError(jmbg) is null;

    internal static string? GetError(string? jmbg)
    {
        if (string.IsNullOrWhiteSpace(jmbg))
            return "JMBG je obavezan.";

        var v = jmbg.Trim();

        if (!v.All(char.IsDigit))
            return "JMBG smije sadržavati samo cifre.";

        if (v.Length != 13)
            return "JMBG mora sadržavati tačno 13 cifara.";

        var d = new int[13];
        for (var i = 0; i < 13; i++) d[i] = v[i] - '0';

        int day   = d[0] * 10 + d[1];
        int month = d[2] * 10 + d[3];
        int yyy   = d[4] * 100 + d[5] * 10 + d[6];
        int year  = yyy >= 900 ? 1000 + yyy : 2000 + yyy;

        if (!IsValidBirthDate(day, month, year))
            return "Datum rođenja u JMBG-u nije validan.";

        int sum = 7 * (d[0] + d[6]) + 6 * (d[1] + d[7]) +
                  5 * (d[2] + d[8]) + 4 * (d[3] + d[9]) +
                  3 * (d[4] + d[10]) + 2 * (d[5] + d[11]);
        int m = 11 - (sum % 11);

        if (m == 10 || (m == 11 ? 0 : m) != d[12])
            return "Kontrolna cifra JMBG-a nije ispravna.";

        return null;
    }

    private static bool IsValidBirthDate(int day, int month, int year)
    {
        if (year < 1900 || year > DateTime.UtcNow.Year) return false;
        try { _ = new DateTime(year, month, day); return true; }
        catch { return false; }
    }
}
