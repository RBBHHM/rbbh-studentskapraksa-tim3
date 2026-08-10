using MediatR;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders;

namespace Praksa.Application.Invoice.Commands;

public sealed record ConfirmInvoicePaidCommand(int OrderId) : ICommand<InvoiceWorkflowResultDto>;

public sealed class ConfirmInvoicePaidCommandHandler
    : IRequestHandler<ConfirmInvoicePaidCommand, InvoiceWorkflowResultDto>
{
    private readonly IInvoiceWorkflowService _service;
    public ConfirmInvoicePaidCommandHandler(IInvoiceWorkflowService service) => _service = service;
    public Task<InvoiceWorkflowResultDto> Handle(ConfirmInvoicePaidCommand command, CancellationToken ct)
        => _service.ConfirmPaidAsync(command.OrderId, ct);
}
