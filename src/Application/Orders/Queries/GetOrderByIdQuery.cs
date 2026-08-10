using MediatR;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders.Dtos;
using Praksa.Application.Orders.Interfaces;

namespace Praksa.Application.Orders.Queries;

public sealed record GetOrderByIdQuery(int OrderId) : IQuery<AppraisalOrderDto>;

public sealed class GetOrderByIdQueryHandler : IRequestHandler<GetOrderByIdQuery, AppraisalOrderDto>
{
    private readonly IAppraisalOrderService _service;
    public GetOrderByIdQueryHandler(IAppraisalOrderService service) => _service = service;
    public Task<AppraisalOrderDto> Handle(GetOrderByIdQuery query, CancellationToken ct)
        => _service.GetByIdAsync(query.OrderId, ct);
}
