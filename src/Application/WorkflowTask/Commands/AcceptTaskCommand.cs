using MediatR;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders.Dtos;
using Praksa.Application.Orders.Interfaces;

namespace Praksa.Application.WorkflowTask.Commands;

public sealed record AcceptTaskCommand(int TaskId) : ICommand<WorkflowTaskDto>;

public sealed class AcceptTaskCommandHandler : IRequestHandler<AcceptTaskCommand, WorkflowTaskDto>
{
    private readonly IWorkflowTaskService _service;
    public AcceptTaskCommandHandler(IWorkflowTaskService service) => _service = service;
    public Task<WorkflowTaskDto> Handle(AcceptTaskCommand command, CancellationToken ct)
        => _service.AcceptTaskAsync(command.TaskId, ct);
}
