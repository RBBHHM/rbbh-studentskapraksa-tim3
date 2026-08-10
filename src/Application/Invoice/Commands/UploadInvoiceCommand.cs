using MediatR;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders;

namespace Praksa.Application.Invoice.Commands;

public sealed record UploadInvoiceCommand(int OrderId, int DocumentId) : ICommand<InvoiceWorkflowResultDto>;

public sealed class UploadInvoiceCommandHandler
    : IRequestHandler<UploadInvoiceCommand, InvoiceWorkflowResultDto>
{
    private readonly IInvoiceWorkflowService _service;
    public UploadInvoiceCommandHandler(IInvoiceWorkflowService service) => _service = service;
    public Task<InvoiceWorkflowResultDto> Handle(UploadInvoiceCommand command, CancellationToken ct)
        => _service.UploadInvoiceAsync(command.OrderId, command.DocumentId, ct);
}
