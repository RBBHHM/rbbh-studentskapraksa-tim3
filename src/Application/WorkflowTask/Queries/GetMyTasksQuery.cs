using MediatR;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Common.Models;
using Praksa.Application.Orders.Dtos;
using Praksa.Application.Orders.Interfaces;

namespace Praksa.Application.WorkflowTask.Queries;

public sealed record GetMyTasksQuery(int Page = 1, int PageSize = 20) : IQuery<PagedResult<WorkflowTaskDto>>;

public sealed class GetMyTasksQueryHandler
    : IRequestHandler<GetMyTasksQuery, PagedResult<WorkflowTaskDto>>
{
    private readonly IWorkflowTaskService _service;
    public GetMyTasksQueryHandler(IWorkflowTaskService service) => _service = service;
    public Task<PagedResult<WorkflowTaskDto>> Handle(GetMyTasksQuery query, CancellationToken ct)
        => _service.GetMyTasksAsync(query.Page, query.PageSize, ct);
}
