using MediatR;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders;

namespace Praksa.Application.QuoteRequests.Commands;

public sealed record AcceptQuoteCommand(int OrderId, int QuoteRequestId) : ICommand<AcceptQuoteResult>;

public sealed class AcceptQuoteCommandHandler : IRequestHandler<AcceptQuoteCommand, AcceptQuoteResult>
{
    private readonly IQuoteRequestService _service;
    public AcceptQuoteCommandHandler(IQuoteRequestService service) => _service = service;
    public Task<AcceptQuoteResult> Handle(AcceptQuoteCommand command, CancellationToken ct)
        => _service.AcceptQuoteAsync(command.OrderId, command.QuoteRequestId, ct);
}
