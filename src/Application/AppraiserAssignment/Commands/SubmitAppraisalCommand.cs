using MediatR;
using Praksa.Application.Appraisers.Dtos;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders;

namespace Praksa.Application.AppraiserAssignment.Commands;

public sealed record SubmitAppraisalCommand(int OrderId, DateTime? VisitDate = null)
    : ICommand<SendToAppraiserResultDto>;

public sealed class SubmitAppraisalCommandHandler
    : IRequestHandler<SubmitAppraisalCommand, SendToAppraiserResultDto>
{
    private readonly IAppraiserAssignmentService _service;
    public SubmitAppraisalCommandHandler(IAppraiserAssignmentService service) => _service = service;
    public Task<SendToAppraiserResultDto> Handle(SubmitAppraisalCommand command, CancellationToken ct)
        => _service.SubmitAppraisalAsync(command.OrderId, command.VisitDate, ct);
}
