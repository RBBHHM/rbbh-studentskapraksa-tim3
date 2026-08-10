using Praksa.Application.Codebooks.Models;
using Praksa.Application.Codebooks.Requests;
using Praksa.Application.Common.Models;

namespace Praksa.Application.Codebooks.Interfaces;

/// <summary>
/// Upravljanje šifarnicima (Codebook) kao cjelinom.
/// Odvojeno od ICodebookValueService koji upravljava vrijednostima unutar šifarnika.
/// </summary>
public interface ICodebookService
{
    Task<PagedResult<CodebookListItemDto>> GetAllAsync(CodebookQueryRequest request, CancellationToken ct = default);
    Task<CodebookDto?> GetByCodeAsync(string code, CancellationToken ct = default);
    Task<CodebookDto> CreateAsync(CreateCodebookRequest request, CancellationToken ct = default);
    Task<CodebookDto> UpdateAsync(string code, UpdateCodebookRequest request, CancellationToken ct = default);
    Task<CodebookDto> DeactivateAsync(string code, CancellationToken ct = default);
    Task<CodebookDto> ActivateAsync(string code, CancellationToken ct = default);
    Task DeleteAsync(string code, CancellationToken ct = default);
}
