using MediatR;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders.Dtos;
using Praksa.Application.Orders.Interfaces;

namespace Praksa.Application.Orders.Commands;

public sealed record CreateDraftOrderCommand(string? WorkflowType = null) : ICommand<AppraisalOrderDto>;

public sealed class CreateDraftOrderCommandHandler : IRequestHandler<CreateDraftOrderCommand, AppraisalOrderDto>
{
    private readonly IAppraisalOrderService _service;
    public CreateDraftOrderCommandHandler(IAppraisalOrderService service) => _service = service;
    public Task<AppraisalOrderDto> Handle(CreateDraftOrderCommand command, CancellationToken ct)
        => _service.CreateDraftAsync(command.WorkflowType, ct);
}
