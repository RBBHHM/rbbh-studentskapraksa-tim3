using MediatR;
using Praksa.Application.Appraisers.Dtos;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders;

namespace Praksa.Application.AppraiserAssignment.Commands;

public sealed record SendToAppraiserCommand(int OrderId) : ICommand<SendToAppraiserResultDto>;

public sealed class SendToAppraiserCommandHandler
    : IRequestHandler<SendToAppraiserCommand, SendToAppraiserResultDto>
{
    private readonly IAppraiserAssignmentService _service;
    public SendToAppraiserCommandHandler(IAppraiserAssignmentService service) => _service = service;
    public Task<SendToAppraiserResultDto> Handle(SendToAppraiserCommand command, CancellationToken ct)
        => _service.SendToAppraiserAsync(command.OrderId, ct);
}
