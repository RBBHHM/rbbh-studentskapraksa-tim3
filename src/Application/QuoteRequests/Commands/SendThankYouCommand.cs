using MediatR;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders;

namespace Praksa.Application.QuoteRequests.Commands;

public sealed record SendThankYouCommand(int OrderId) : ICommand<SendThankYouResult>;

public sealed class SendThankYouCommandHandler : IRequestHandler<SendThankYouCommand, SendThankYouResult>
{
    private readonly IQuoteRequestService _service;
    public SendThankYouCommandHandler(IQuoteRequestService service) => _service = service;
    public Task<SendThankYouResult> Handle(SendThankYouCommand command, CancellationToken ct)
        => _service.SendThankYouAsync(command.OrderId, ct);
}
