using MediatR;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders;
using Praksa.Application.Orders.Dtos;

namespace Praksa.Application.OrderApproval.Queries;

public sealed record GetFinalAppraisalQuery(int OrderId) : IQuery<FinalAppraisalDto>;

public sealed class GetFinalAppraisalQueryHandler : IRequestHandler<GetFinalAppraisalQuery, FinalAppraisalDto>
{
    private readonly IOrderApprovalService _service;
    public GetFinalAppraisalQueryHandler(IOrderApprovalService service) => _service = service;
    public Task<FinalAppraisalDto> Handle(GetFinalAppraisalQuery query, CancellationToken ct)
        => _service.GetFinalAppraisalAsync(query.OrderId, ct);
}
