using MediatR;
using Praksa.Application.Appraisers.Dtos;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders;

namespace Praksa.Application.AppraiserAssignment.Queries;

public sealed record GetCandidatesForOrderQuery(int OrderId) : IQuery<IReadOnlyList<AppraiserDto>>;

public sealed class GetCandidatesForOrderQueryHandler
    : IRequestHandler<GetCandidatesForOrderQuery, IReadOnlyList<AppraiserDto>>
{
    private readonly IAppraiserAssignmentService _service;
    public GetCandidatesForOrderQueryHandler(IAppraiserAssignmentService service) => _service = service;
    public Task<IReadOnlyList<AppraiserDto>> Handle(GetCandidatesForOrderQuery query, CancellationToken ct)
        => _service.GetCandidatesForOrderAsync(query.OrderId, ct);
}
