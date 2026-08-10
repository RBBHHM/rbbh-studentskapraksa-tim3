using MediatR;
using Praksa.Application.Appraisers.Dtos;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders;

namespace Praksa.Application.AppraiserAssignment.Commands;

public sealed record AcceptByAppraiserCommand(int OrderId) : ICommand<SendToAppraiserResultDto>;

public sealed class AcceptByAppraiserCommandHandler
    : IRequestHandler<AcceptByAppraiserCommand, SendToAppraiserResultDto>
{
    private readonly IAppraiserAssignmentService _service;
    public AcceptByAppraiserCommandHandler(IAppraiserAssignmentService service) => _service = service;
    public Task<SendToAppraiserResultDto> Handle(AcceptByAppraiserCommand command, CancellationToken ct)
        => _service.AcceptByAppraiserAsync(command.OrderId, ct);
}
