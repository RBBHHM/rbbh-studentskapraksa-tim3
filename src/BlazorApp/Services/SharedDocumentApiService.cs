using System.Net.Http.Headers;
using System.Net.Http.Json;
using BlazorApp.Models;

namespace BlazorApp.Services;

public sealed class SharedDocumentApiService : BaseApiService
{
    private const string PdfContentType = "application/pdf";

    public SharedDocumentApiService(
        IHttpClientFactory factory,
        ILogger<SharedDocumentApiService> logger,
        ActiveRoleState? activeRoleState = null)
        : base(factory, logger, activeRoleState: activeRoleState) { }

    public Task<Result<List<SharedDocumentDto>>> GetAllAsync()
        => GetListWithResultAsync<SharedDocumentDto>("/api/shared-documents");

    public Task<Result<List<string>>> GetCategoriesAsync()
        => GetListWithResultAsync<string>("/api/shared-documents/categories");

    public async Task<Result<SharedDocumentDto>> UploadAsync(
        string title, string category, byte[] content, string fileName, string contentType)
    {
        try
        {
            using var form = new MultipartFormDataContent();

            var filePart = new ByteArrayContent(content);
            filePart.Headers.ContentType = new MediaTypeHeaderValue(
                string.IsNullOrWhiteSpace(contentType) ? PdfContentType : contentType);
            form.Add(filePart, "file", fileName);

            // title i category idu kao form fields
            form.Add(new StringContent(title),    "title");
            form.Add(new StringContent(category), "category");

            var response = await Http.PostAsync("/api/shared-documents", form);
            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync();
                return Result<SharedDocumentDto>.Failure(
                    ParseError(body), (int)response.StatusCode);
            }

            var data = await response.Content.ReadFromJsonAsync<SharedDocumentDto>(JsonOptions);
            return Result<SharedDocumentDto>.Success(data!);
        }
        catch (Exception ex)
        {
            return Result<SharedDocumentDto>.Failure(ex.Message);
        }
    }

    public Task<Result> DeleteAsync(int id)
        => DeleteWithResultAsync($"/api/shared-documents/{id}");

    public async Task<Result<(byte[] Content, string FileName)>> DownloadAsync(int id)
    {
        try
        {
            var response = await Http.GetAsync($"/api/shared-documents/{id}/download");
            if (!response.IsSuccessStatusCode)
                return Result<(byte[], string)>.Failure("Greška pri preuzimanju dokumenta.", (int)response.StatusCode);

            var content  = await response.Content.ReadAsByteArrayAsync();
            var fileName = response.Content.Headers.ContentDisposition?.FileNameStar
                           ?? response.Content.Headers.ContentDisposition?.FileName
                           ?? $"dokument-{id}.pdf";
            return Result<(byte[], string)>.Success((content, fileName));
        }
        catch (Exception ex)
        {
            return Result<(byte[], string)>.Failure(ex.Message);
        }
    }

    private static string ParseError(string body)
    {
        try
        {
            var doc = System.Text.Json.JsonDocument.Parse(body);
            if (doc.RootElement.TryGetProperty("detail", out var d))
                return d.GetString() ?? body;
        }
        catch { }
        return body;
    }
}
