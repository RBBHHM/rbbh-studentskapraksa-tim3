using MediatR;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders.Dtos;
using Praksa.Application.Orders.Interfaces;

namespace Praksa.Application.WorkflowTask.Commands;

public sealed record CompleteTaskCommand(int TaskId, string? Comment) : ICommand<WorkflowTaskDto>;

public sealed class CompleteTaskCommandHandler : IRequestHandler<CompleteTaskCommand, WorkflowTaskDto>
{
    private readonly IWorkflowTaskService _service;
    public CompleteTaskCommandHandler(IWorkflowTaskService service) => _service = service;
    public Task<WorkflowTaskDto> Handle(CompleteTaskCommand command, CancellationToken ct)
        => _service.CompleteTaskAsync(command.TaskId, command.Comment, ct);
}
