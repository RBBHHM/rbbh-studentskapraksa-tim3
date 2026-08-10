using MediatR;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders;
using Praksa.Application.Orders.Dtos;

namespace Praksa.Application.OriginalAppraisal.Commands;

public sealed record SendAppraiserReminderCommand(int OrderId) : ICommand<AppraiserReminderResultDto>;

public sealed class SendAppraiserReminderCommandHandler
    : IRequestHandler<SendAppraiserReminderCommand, AppraiserReminderResultDto>
{
    private readonly IOriginalAppraisalService _service;
    public SendAppraiserReminderCommandHandler(IOriginalAppraisalService service) => _service = service;
    public Task<AppraiserReminderResultDto> Handle(SendAppraiserReminderCommand command, CancellationToken ct)
        => _service.SendAppraiserReminderAsync(command.OrderId, ct);
}
