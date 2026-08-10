using MediatR;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Common.Models;
using Praksa.Application.Orders.Dtos;
using Praksa.Application.Orders.Requests;

namespace Praksa.Application.Orders.Queries;

public sealed record GetOrdersListQuery(OrderListRequest Request) : IQuery<PagedResult<AppraisalOrderListItemDto>>;

public sealed class GetOrdersListQueryHandler
    : IRequestHandler<GetOrdersListQuery, PagedResult<AppraisalOrderListItemDto>>
{
    private readonly IOrderQueryService _service;
    public GetOrdersListQueryHandler(IOrderQueryService service) => _service = service;
    public Task<PagedResult<AppraisalOrderListItemDto>> Handle(GetOrdersListQuery query, CancellationToken ct)
        => _service.GetListAsync(query.Request, ct);
}
