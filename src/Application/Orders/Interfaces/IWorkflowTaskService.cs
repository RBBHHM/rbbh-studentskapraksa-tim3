using Praksa.Application.Common.Models;
using Praksa.Application.Orders.Dtos;

namespace Praksa.Application.Orders.Interfaces;

public interface IWorkflowTaskService
{
    /// <summary>Taskovi dodijeljeni trenutno prijavljenom korisniku ili njegovoj roli.</summary>
    Task<PagedResult<WorkflowTaskDto>> GetMyTasksAsync(int page = 1, int pageSize = 20, CancellationToken ct = default);

    Task<WorkflowTaskDto> AcceptTaskAsync(int taskId, CancellationToken ct = default);
    Task<WorkflowTaskDto> CompleteTaskAsync(int taskId, string? comment, CancellationToken ct = default);
}
