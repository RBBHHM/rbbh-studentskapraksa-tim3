using MediatR;
using Praksa.Application.Appraisers.Dtos;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders;

namespace Praksa.Application.AppraiserAssignment.Commands;

public sealed record RequestAdditionalPaymentCommand(int OrderId) : ICommand<SendToAppraiserResultDto>;

public sealed class RequestAdditionalPaymentCommandHandler
    : IRequestHandler<RequestAdditionalPaymentCommand, SendToAppraiserResultDto>
{
    private readonly IAppraiserAssignmentService _service;
    public RequestAdditionalPaymentCommandHandler(IAppraiserAssignmentService service) => _service = service;
    public Task<SendToAppraiserResultDto> Handle(RequestAdditionalPaymentCommand command, CancellationToken ct)
        => _service.RequestAdditionalPaymentAsync(command.OrderId, ct);
}
