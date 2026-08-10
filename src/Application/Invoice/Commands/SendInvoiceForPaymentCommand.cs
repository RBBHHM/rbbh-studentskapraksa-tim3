using MediatR;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders;

namespace Praksa.Application.Invoice.Commands;

public sealed record SendInvoiceForPaymentCommand(int OrderId) : ICommand<InvoiceWorkflowResultDto>;

public sealed class SendInvoiceForPaymentCommandHandler
    : IRequestHandler<SendInvoiceForPaymentCommand, InvoiceWorkflowResultDto>
{
    private readonly IInvoiceWorkflowService _service;
    public SendInvoiceForPaymentCommandHandler(IInvoiceWorkflowService service) => _service = service;
    public Task<InvoiceWorkflowResultDto> Handle(SendInvoiceForPaymentCommand command, CancellationToken ct)
        => _service.SendForPaymentAsync(command.OrderId, ct);
}
