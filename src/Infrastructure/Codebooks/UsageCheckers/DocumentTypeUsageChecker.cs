using Microsoft.EntityFrameworkCore;
using Praksa.Application.Codebooks.Interfaces;
using Praksa.Application.Codebooks.Models;
using Praksa.Application.Common.Constants;
using Praksa.Infrastructure.Persistence;

namespace Praksa.Infrastructure.Codebooks.UsageCheckers;

public sealed class DocumentTypeUsageChecker : ICodebookUsageChecker
{
    private readonly ApplicationDbContext _db;
    public DocumentTypeUsageChecker(ApplicationDbContext db) => _db = db;

    public string CodebookKey => CodebookKeys.DocumentTypes;

    public async Task<CodebookUsageLocation?> CheckAsync(int valueId, CancellationToken ct = default)
    {
        var count = await _db.Documents
            .IgnoreQueryFilters()
            .CountAsync(d => d.DocumentTypeId == valueId, ct);

        return count > 0
            ? new CodebookUsageLocation { Module = "Dokumenti", EntityName = "Document", Count = count }
            : null;
    }
}
