using MediatR;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders;
using Praksa.Application.Orders.Dtos;

namespace Praksa.Application.OriginalAppraisal.Commands;

public sealed record ConfirmOriginalReceivedCommand(int OrderId) : ICommand<OriginalReceivedResultDto>;

public sealed class ConfirmOriginalReceivedCommandHandler
    : IRequestHandler<ConfirmOriginalReceivedCommand, OriginalReceivedResultDto>
{
    private readonly IOriginalAppraisalService _service;
    public ConfirmOriginalReceivedCommandHandler(IOriginalAppraisalService service) => _service = service;
    public Task<OriginalReceivedResultDto> Handle(ConfirmOriginalReceivedCommand command, CancellationToken ct)
        => _service.ConfirmOriginalReceivedAsync(command.OrderId, ct);
}
