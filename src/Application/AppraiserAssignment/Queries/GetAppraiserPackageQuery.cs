using MediatR;
using Praksa.Application.Appraisers.Dtos;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders;

namespace Praksa.Application.AppraiserAssignment.Queries;

public sealed record GetAppraiserPackageQuery(int OrderId) : IQuery<AppraiserPackageDto>;

public sealed class GetAppraiserPackageQueryHandler
    : IRequestHandler<GetAppraiserPackageQuery, AppraiserPackageDto>
{
    private readonly IAppraiserAssignmentService _service;
    public GetAppraiserPackageQueryHandler(IAppraiserAssignmentService service) => _service = service;
    public Task<AppraiserPackageDto> Handle(GetAppraiserPackageQuery query, CancellationToken ct)
        => _service.GetAppraiserPackageAsync(query.OrderId, ct);
}
