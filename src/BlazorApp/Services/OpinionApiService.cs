using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;
using BlazorApp.Models;
using Microsoft.AspNetCore.Components.Forms;

namespace BlazorApp.Services;

/// <summary>
/// HTTP klijent za mišljenja CO i Pravne službe (US-94).
/// Mapira na OpinionEndpoints (T7) na backendu.
/// </summary>
public sealed class OpinionApiService : BaseApiService
{
    private const long MaxFileSizeBytes = 10L * 1024 * 1024;

    public OpinionApiService(IHttpClientFactory factory, ILogger<OpinionApiService> logger, ActiveRoleState? activeRoleState = null)
        : base(factory, logger, activeRoleState: activeRoleState) { }

    /// <summary>Status mišljenja (CO + Pravna) za narudžbu. Prazna lista = mišljenje još nije zatraženo.</summary>
    public Task<Result<List<OpinionDto>>> GetOpinionsAsync(int orderId)
        => GetListWithResultAsync<OpinionDto>($"/api/orders/{orderId}/opinions");

    /// <summary>Prodaja šalje zahtjev za mišljenje CO i Pravne službe.</summary>
    public Task<Result> RequestOpinionsAsync(int orderId)
        => PostWithResultAsync($"/api/orders/{orderId}/opinions/request", new { });

    /// <summary>CO ili Pravna importuju svoj PDF mišljenja + komentar.</summary>
    public async Task<Result> SubmitOpinionAsync(int orderId, OpinionType type, IBrowserFile file, string? comment)
    {
        try
        {
            using var form = new MultipartFormDataContent();

            var fileContent = new StreamContent(file.OpenReadStream(MaxFileSizeBytes));
            fileContent.Headers.ContentType = new MediaTypeHeaderValue(
                string.IsNullOrWhiteSpace(file.ContentType) ? "application/pdf" : file.ContentType);
            form.Add(fileContent, "file", file.Name);

            form.Add(new StringContent(comment ?? string.Empty), "comment");

            var response = await Http.PostAsync($"/api/orders/{orderId}/opinions/{type}", form);

            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync();
                return Result.Failure(BuildErrorMessage(body, response.StatusCode), (int)response.StatusCode);
            }

            return Result.Success();
        }
        catch (Exception ex)
        {
            return Result.Failure(ex.Message);
        }
    }

    /// <summary>Vadi <c>detail</c> iz ProblemDetails odgovora; ako ga nema, generička poruka po HTTP kodu.</summary>
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
                // Ne-JSON tijelo — padni na default poruku.
            }
        }

        return status switch
        {
            HttpStatusCode.BadRequest          => "Unos nije ispravan. Provjerite odabrani dokument.",
            HttpStatusCode.Forbidden           => "Nemate pravo izvršiti ovu akciju.",
            HttpStatusCode.NotFound            => "Mišljenje za ovu narudžbu nije pronađeno.",
            HttpStatusCode.Conflict            => "Akcija nije moguća zbog konflikta s postojećim podacima.",
            HttpStatusCode.InternalServerError => "Došlo je do greške na serveru. Pokušajte ponovo.",
            _                                  => "Došlo je do greške. Pokušajte ponovo."
        };
    }
}
