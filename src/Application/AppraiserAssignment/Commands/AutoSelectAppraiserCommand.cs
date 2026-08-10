using MediatR;
using Praksa.Application.Appraisers.Dtos;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders;

namespace Praksa.Application.AppraiserAssignment.Commands;

public sealed record AutoSelectAppraiserCommand(int OrderId) : ICommand<AppraiserAssignmentResultDto>;

public sealed class AutoSelectAppraiserCommandHandler
    : IRequestHandler<AutoSelectAppraiserCommand, AppraiserAssignmentResultDto>
{
    private readonly IAppraiserAssignmentService _service;
    public AutoSelectAppraiserCommandHandler(IAppraiserAssignmentService service) => _service = service;
    public Task<AppraiserAssignmentResultDto> Handle(AutoSelectAppraiserCommand command, CancellationToken ct)
        => _service.AutoSelectAppraiserAsync(command.OrderId, ct);
}
