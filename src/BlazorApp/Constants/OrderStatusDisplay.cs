namespace BlazorApp.Constants;

/// <summary>
/// Centralna mapa: status narudžbe procjene (string vrijednost <c>AppraisalOrderStatus</c>
/// enuma) → prikazni naziv (label) i boja badge-a.
///
/// Prije ovog refaktorisanja, ista mapa je bila duplirana u 4 odvojena DTO-a
/// (<c>AppraisalOrderDto</c>, <c>AppraisalOrderListItemDto</c>,
/// <c>AppraisalOrderDetailDto</c>, <c>ProtocolEntryDto</c>) i ponovo (drugačije,
/// kao bg/fg/border trojka) u <c>OrderDetail.razor</c>. Sva mjesta sada delegiraju ovamo.
///
/// Kako dodati novi status: dodaj jedan red u <see cref="Label"/> i, ako treba
/// posebnu boju (van default-a), u <see cref="Color"/>.
/// </summary>
public static class OrderStatusDisplay
{
    // Konstante za eliminaciju magic stringova u razor komponentama
    public const string Draft                     = "Draft";
    public const string SubmittedBySales          = "SubmittedBySales";
    public const string Completed                 = "Completed";
    public const string Cancelled                 = "Cancelled";
    public const string OrderSentToAppraiser      = "OrderSentToAppraiser";
    public const string AppraisalInProgress       = "AppraisalInProgress";
    public const string AppraisalReceived         = "AppraisalReceived";
    public const string AppraisalReturnedForRework = "AppraisalReturnedForRework";
    public const string AdditionalPaymentCompleted = "AdditionalPaymentCompleted";
    public const string ReadyForProcedure         = "ReadyForProcedure";
    public const string ReturnedForCorrection     = "ReturnedForCorrection";

    // Task status konstante
    public const string TaskOpen      = "Open";
    public const string TaskAccepted  = "Accepted";
    public const string TaskCompleted_  = "Completed"; // suffix _ da ne konfiktuje sa order Completed

    public static string Label(string? status) => status switch
    {
        "Draft"                          => "Nacrt",
        "SubmittedBySales"               => "Poslano CA",
        "AcceptedByCA"                   => "Prihvaćeno CA",
        "DocumentationReviewInProgress"  => "Pregled dokumentacije",
        "ReturnedForCorrection"          => "Vraćena na dopunu",
        "CorrectionSubmitted"            => "Dopuna poslana",
        "DocumentationApproved"          => "Dokumentacija odobrena",
        "AccessCheckRequested"           => "Zahtjev za pristup",
        "AccessCheckApproved"            => "Pristup potvrđen",
        "AccessCheckRejected"            => "Vraćeno na pregled (pristup)",
        "ProtocolCreated"                => "Protokol kreiran",
        "AppraiserSelected"              => "Vještak odabran",
        "DocumentsGenerated"             => "Dokumenti generisani",
        "OrderSentToAppraiser"           => "Poslano vještaku",
        "AdditionalPaymentRequested"     => "Zahtjev za doplatu",
        "AdditionalPaymentCompleted"     => "Doplata izvršena",
        "AppraiserRejected"              => "Vještak odbio",
        "AppraisalInProgress"            => "Procjena u toku",
        "AppraisalReturnedForRework"     => "Vraćeno na doradu",
        "AppraisalReceived"              => "Procjena zaprimljena",
        "COApproved"                     => "Odobreno od CO",
        "ReadyForProcedure"              => "Spreman za proceduru",
        "OriginalReceived"               => "Original preuzet",
        "Completed"                      => "Završeno",
        "Cancelled"                      => "Otkazano",
        _                                => status ?? "—"
    };

    /// <summary>Boja teksta/granice badge-a (hex). Pozadina i border se izvode iz ove
    /// boje (vidi <c>AppStatusBadge</c>: <c>background:{color}22; border:1px solid {color}44</c>).</summary>
    public static string Color(string? status) => status switch
    {
        "Draft"            => "#9B9590",   // siva — nacrt
        "SubmittedBySales" => "#C9A100",   // žuta — čeka prihvat CA
        "Completed"        => "#225B45",   // zelena — završeno
        "Cancelled"        => "#C65C4A",   // crvena — otkazano
        _                  => "#E0841E"    // narandžasta — u obradi (svi ostali)
    };

    /// <summary>Pozadina badge-a — izvedena iz <see cref="Color"/> (alfa ~13%).</summary>
    public static string Background(string? status) => Color(status) + "22";

    /// <summary>Border badge-a — izvedena iz <see cref="Color"/> (alfa ~27%).</summary>
    public static string Border(string? status) => Color(status) + "44";

    /// <summary>
    /// Pojednostavljeni status (5 kategorija) za preglede gdje granularni status
    /// nije relevantan (npr. "Pregled narudžbi" KPI grupisanje). Namjerno odvojeno
    /// od <see cref="Label"/>/<see cref="Color"/> — nije duplikat, nego druga "vrsta" prikaza.
    /// </summary>
    public static string SimpleLabel(string? status) => status switch
    {
        "Draft"                 => "Nacrt",
        "SubmittedBySales"      => "Poslana",
        "AcceptedByCA"          => "Prihvaćena",
        "ReturnedForCorrection" => "Vraćena na dopunu",
        "Completed"             => "Završena",
        "Cancelled"             => "Otkazana",
        _                       => "U obradi"
    };

    public static string SimpleColor(string? status) => status switch
    {
        "Draft"                 => "#9B9590",   // siva — nacrt
        "SubmittedBySales"      => "#C9A100",   // žuta — poslana, čeka prihvat
        "AcceptedByCA"          => "#4D9B7C",   // zelenkasta — prihvaćena od CA
        "ReturnedForCorrection" => "#C9A100",   // žuta — čeka dopunu od prodaje
        "Completed"             => "#225B45",   // zelena — završena
        "Cancelled"             => "#C65C4A",   // crvena — otkazana
        _                       => "#E0841E"    // narandžasta — u obradi
    };
}
