using MediatR;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders.Dtos;
namespace Praksa.Application.Orders.Queries;

public sealed record GetOrderSummaryQuery : IQuery<OrderSummaryDto>;

public sealed class GetOrderSummaryQueryHandler : IRequestHandler<GetOrderSummaryQuery, OrderSummaryDto>
{
    private readonly IOrderQueryService _service;
    public GetOrderSummaryQueryHandler(IOrderQueryService service) => _service = service;
    public Task<OrderSummaryDto> Handle(GetOrderSummaryQuery query, CancellationToken ct)
        => _service.GetSummaryAsync(ct);
}
