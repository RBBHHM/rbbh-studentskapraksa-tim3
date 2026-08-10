using MediatR;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders.Interfaces;

namespace Praksa.Application.Orders.Commands;

public sealed record CancelOrderCommand(int OrderId) : ICommand;

public sealed class CancelOrderCommandHandler : IRequestHandler<CancelOrderCommand>
{
    private readonly IAppraisalOrderService _service;
    public CancelOrderCommandHandler(IAppraisalOrderService service) => _service = service;
    public Task Handle(CancelOrderCommand command, CancellationToken ct)
        => _service.CancelAsync(command.OrderId, ct);
}
