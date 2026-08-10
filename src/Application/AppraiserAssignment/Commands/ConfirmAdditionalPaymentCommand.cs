using MediatR;
using Praksa.Application.Appraisers.Dtos;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders;

namespace Praksa.Application.AppraiserAssignment.Commands;

public sealed record ConfirmAdditionalPaymentCommand(int OrderId) : ICommand<SendToAppraiserResultDto>;

public sealed class ConfirmAdditionalPaymentCommandHandler
    : IRequestHandler<ConfirmAdditionalPaymentCommand, SendToAppraiserResultDto>
{
    private readonly IAppraiserAssignmentService _service;
    public ConfirmAdditionalPaymentCommandHandler(IAppraiserAssignmentService service) => _service = service;
    public Task<SendToAppraiserResultDto> Handle(ConfirmAdditionalPaymentCommand command, CancellationToken ct)
        => _service.ConfirmAdditionalPaymentAsync(command.OrderId, ct);
}
