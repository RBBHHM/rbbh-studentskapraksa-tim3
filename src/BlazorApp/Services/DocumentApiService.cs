using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using BlazorApp.Models;

namespace BlazorApp.Services;

/// <summary>
/// HTTP klijent za dokumente narudžbe procjene (US-92).
/// Mapira na DocumentEndpoints i CodebookEndpoints na backendu.
/// </summary>
public sealed class DocumentApiService : BaseApiService
{
    private const string PdfContentType = "application/pdf";

    public DocumentApiService(IHttpClientFactory factory, ILogger<DocumentApiService> logger, ActiveRoleState? activeRoleState = null)
        : base(factory, logger, activeRoleState: activeRoleState) { }

    /// <summary>Aktivni tipovi dokumenata iz šifarnika <c>tipovi_dokumenata</c> (za sekcije).</summary>
    public Task<Result<List<CodebookValueItem>>> GetDocumentTypesAsync()
        => GetListWithResultAsync<CodebookValueItem>("/api/codebooks/tipovi_dokumenata/values/active");

    /// <summary>Lista dokumenata priloženih uz narudžbu, sortirana po vremenu uploada (najnoviji prvo).</summary>
    public Task<Result<List<DocumentDto>>> GetByOrderAsync(int orderId)
        => GetListWithResultAsync<DocumentDto>($"/api/orders/{orderId}/documents");

    /// <summary>Soft delete dokumenta. Backend dozvoljava samo uploaderu ili Kolateral administratoru.</summary>
    public Task<Result> DeleteAsync(int documentId)
        => DeleteWithResultAsync($"/api/documents/{documentId}");

    /// <summary>Zamjenjuje dokument novom verzijom. Stara verzija se deaktivira, ostaje u historiji.</summary>
    public async Task<Result<DocumentDto>> ReplaceAsync(int documentId, UploadFile file)
    {
        try
        {
            using var form = new MultipartFormDataContent();
            var part = new ByteArrayContent(file.Content);
            part.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(
                string.IsNullOrWhiteSpace(file.ContentType) ? "application/pdf" : file.ContentType);
            form.Add(part, "file", file.FileName);

            var response = await Http.PostAsync($"/api/documents/{documentId}/versions", form);
            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync();
                return Result<DocumentDto>.Failure(
                    BuildErrorMessage(body, response.StatusCode), (int)response.StatusCode);
            }

            var data = await response.Content.ReadFromJsonAsync<DocumentDto>(JsonOptions);
            return Result<DocumentDto>.Success(data!);
        }
        catch (Exception)
        {
            return Result<DocumentDto>.Failure("Nije moguće uspostaviti vezu. Provjerite internet vezu.");
        }
    }

    /// <summary>
    /// Upload jednog ili više PDF dokumenata jednog tipa.
    /// <para>
    /// <c>documentTypeId</c> ide kao query parametar (minimal API veže prosti tip iz query stringa),
    /// a fajlovi kao <c>multipart/form-data</c> dijelovi (<c>IFormFileCollection files</c>).
    /// </para>
    /// </summary>
    public async Task<Result<List<DocumentDto>>> UploadAsync(
        int orderId, int documentTypeId, IReadOnlyList<UploadFile> files)
    {
        if (files.Count == 0)
            return Result<List<DocumentDto>>.Failure("Potrebno je odabrati barem jedan PDF dokument.");

        try
        {
            using var form = new MultipartFormDataContent();
            foreach (var f in files)
            {
                var part = new ByteArrayContent(f.Content);
                part.Headers.ContentType = new MediaTypeHeaderValue(
                    string.IsNullOrWhiteSpace(f.ContentType) ? PdfContentType : f.ContentType);
                form.Add(part, "files", f.FileName);
            }

            var url = $"/api/orders/{orderId}/documents?documentTypeId={documentTypeId}";
            var response = await Http.PostAsync(url, form);

            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync();
                return Result<List<DocumentDto>>.Failure(
                    BuildErrorMessage(body, response.StatusCode), (int)response.StatusCode);
            }

            var data = await response.Content.ReadFromJsonAsync<List<DocumentDto>>(JsonOptions);
            return Result<List<DocumentDto>>.Success(data ?? []);
        }
        catch (Exception)
        {
            return Result<List<DocumentDto>>.Failure(
                "Nije moguće uspostaviti vezu. Provjerite internet vezu.");
        }
    }

    /// <summary>
    /// Vadi <c>detail</c> iz ProblemDetails odgovora; ako ga nema, vraća generičku poruku po HTTP kodu
    /// (prema validation-message-display-rules.md). Tehnički detalji 500 greške se ne prikazuju.
    /// </summary>
    private static string BuildErrorMessage(string body, HttpStatusCode status)
    {
        if (status != HttpStatusCode.InternalServerError && !string.IsNullOrWhiteSpace(body))
        {
            try
            {
                using var doc = JsonDocument.Parse(body);
                if (doc.RootElement.TryGetProperty("detail", out var detail) &&
                    detail.ValueKind == JsonValueKind.String &&
                    !string.IsNullOrWhiteSpace(detail.GetString()))
                {
                    return detail.GetString()!;
                }
            }
            catch (JsonException)
            {
                // Ne-JSON tijelo (npr. HTML 500) — padni na default poruku.
            }
        }

        return status switch
        {
            HttpStatusCode.BadRequest          => "Unos nije ispravan. Provjerite odabrane dokumente.",
            HttpStatusCode.Forbidden           => "Nemate pravo izvršiti ovu akciju.",
            HttpStatusCode.NotFound            => "Tražena stavka nije pronađena.",
            HttpStatusCode.Conflict            => "Akcija nije moguća zbog konflikta s postojećim podacima.",
            HttpStatusCode.InternalServerError => "Došlo je do greške na serveru. Pokušajte ponovo.",
            _                                  => "Došlo je do greške. Pokušajte ponovo."
        };
    }
}
