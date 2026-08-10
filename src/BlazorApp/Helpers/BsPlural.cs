namespace BlazorApp.Helpers;

/// <summary>
/// Bosnanska/hrvatska/srpska gramatika množine za prikaz "N imenica".
/// Pravilo: 1 → form1, 2-4 → form24, 5+ (i 11-19) → form5
/// </summary>
public static class BsPlural
{
    public static string Of(int n, string form1, string form24, string form5)
    {
        var abs = Math.Abs(n);
        if (abs % 100 is >= 11 and <= 19) return form5;
        return (abs % 10) switch
        {
            1         => form1,
            >= 2 and <= 4 => form24,
            _         => form5
        };
    }

    // ── Uobičajene imenice ───────────────────────────────────────────────────

    public static string Korisnik(int n)      => Of(n, "korisnik",     "korisnika",  "korisnika");
    public static string Zapis(int n)         => Of(n, "zapis",        "zapisa",     "zapisa");
    public static string Administrator(int n) => Of(n, "administrator","administratora","administratora");
    public static string Rola(int n)          => Of(n, "rola",         "role",       "rola");
    public static string Sifarnik(int n)      => Of(n, "šifarnik",     "šifarnika",  "šifarnika");
    public static string Vrijednost(int n)    => Of(n, "vrijednost",   "vrijednosti","vrijednosti");

    // ── Pridjevi za prikaz uz korisnika (muški rod) ──────────────────────────

    /// "1 aktivan", "2 aktivna", "7 aktivnih"
    public static string AktivanM(int n)  => Of(n, "aktivan",  "aktivna",  "aktivnih");
    /// "1 aktivna" (ž. rod — vrijednost, rola)
    public static string AktivanF(int n)  => Of(n, "aktivna",  "aktivne",  "aktivnih");
}
