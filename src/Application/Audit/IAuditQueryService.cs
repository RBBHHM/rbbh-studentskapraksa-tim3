using Praksa.Application.Common.Models;
using Praksa.Application.Roles.Models;
using Praksa.Application.Roles.Requests;

namespace Praksa.Application.Audit;

public interface IAuditQueryService
{
    Task<PagedResult<AuditLogDto>> QueryAsync(AuditQueryRequest request, CancellationToken ct = default);
}
