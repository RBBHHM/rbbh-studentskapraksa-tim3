using Microsoft.EntityFrameworkCore;
using Praksa.Application.Codebooks.Interfaces;
using Praksa.Application.Codebooks.Models;
using Praksa.Application.Common.Constants;
using Praksa.Infrastructure.Persistence;

namespace Praksa.Infrastructure.Codebooks.UsageCheckers;

public sealed class CollateralTypeUsageChecker : ICodebookUsageChecker
{
    private readonly ApplicationDbContext _db;
    public CollateralTypeUsageChecker(ApplicationDbContext db) => _db = db;

    public string CodebookKey => CodebookKeys.CollateralTypes;

    public async Task<CodebookUsageLocation?> CheckAsync(int valueId, CancellationToken ct = default)
    {
        var count = await _db.AppraisalOrders
            .IgnoreQueryFilters()
            .CountAsync(o => o.CollateralTypeId == valueId || o.CombinedCollateralTypeId == valueId, ct);

        return count > 0
            ? new CodebookUsageLocation { Module = "Narudžbe", EntityName = "AppraisalOrder", Count = count }
            : null;
    }
}
