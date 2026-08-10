using MediatR;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders;

namespace Praksa.Application.Invoice.Queries;

public sealed record GetInvoiceStatusQuery(int OrderId) : IQuery<InvoiceStatusDto>;

public sealed class GetInvoiceStatusQueryHandler
    : IRequestHandler<GetInvoiceStatusQuery, InvoiceStatusDto>
{
    private readonly IInvoiceWorkflowService _service;
    public GetInvoiceStatusQueryHandler(IInvoiceWorkflowService service) => _service = service;
    public Task<InvoiceStatusDto> Handle(GetInvoiceStatusQuery query, CancellationToken ct)
        => _service.GetStatusAsync(query.OrderId, ct);
}
