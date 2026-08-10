using BlazorApp.Models;
using System.Net.Http.Headers;

namespace BlazorApp.Services;

public sealed class ImportExportService : BaseApiService
{
    public ImportExportService(IHttpClientFactory factory, ILogger<ImportExportService> logger, ActiveRoleState? activeRoleState = null)
        : base(factory, logger, activeRoleState: activeRoleState) { }

    public Task<Result<List<string>>> GetSupportedTypesAsync()
        => GetWithResultAsync<List<string>>("/api/codebooks/import-export/types");

    public async Task<Result<ImportPreviewResultDto>> PreviewImportAsync(
        string codebookType, int mode, string fileName, byte[] fileContent)
    {
        using var content = new MultipartFormDataContent();
        var fileBytes = new ByteArrayContent(fileContent);
        fileBytes.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
        content.Add(fileBytes, "file", fileName);

        var qs = $"/api/codebooks/import-export/preview?codebookType={Uri.EscapeDataString(codebookType)}&mode={mode}";
        return await PostMultipartWithResultAsync<ImportPreviewResultDto>(qs, content);
    }

    public Task<Result<ImportResultDto>> ConfirmImportAsync(string previewToken)
        => PostWithDataResultAsync<ImportConfirmRequestDto, ImportResultDto>(
            "/api/codebooks/import-export/confirm",
            new ImportConfirmRequestDto { PreviewToken = previewToken });

    public string GetExportUrl(string codebookType, string format, bool includeInactive) =>
        $"/files/codebooks/export?codebookType={Uri.EscapeDataString(codebookType)}&format={format}&includeInactive={includeInactive}";
}
