using MediatR;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders.Dtos;
using Praksa.Application.Orders.Interfaces;

namespace Praksa.Application.Orders.Commands;

public sealed record SubmitOrderCommand(int OrderId) : ICommand<AppraisalOrderDto>;

public sealed class SubmitOrderCommandHandler : IRequestHandler<SubmitOrderCommand, AppraisalOrderDto>
{
    private readonly IAppraisalOrderService _service;
    public SubmitOrderCommandHandler(IAppraisalOrderService service) => _service = service;
    public Task<AppraisalOrderDto> Handle(SubmitOrderCommand command, CancellationToken ct)
        => _service.SubmitAsync(command.OrderId, ct);
}
