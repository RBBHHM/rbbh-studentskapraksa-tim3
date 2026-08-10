using MediatR;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders;
using Praksa.Application.Orders.Dtos;

namespace Praksa.Application.AccessCheck.Commands;

public sealed record ApproveAccessCheckCommand(int OrderId, string? Comment) : ICommand<CaDocumentReviewResultDto>;

public sealed class ApproveAccessCheckCommandHandler
    : IRequestHandler<ApproveAccessCheckCommand, CaDocumentReviewResultDto>
{
    private readonly IAccessCheckService _service;
    public ApproveAccessCheckCommandHandler(IAccessCheckService service) => _service = service;
    public Task<CaDocumentReviewResultDto> Handle(ApproveAccessCheckCommand command, CancellationToken ct)
        => _service.ApproveAccessAsync(command.OrderId, command.Comment, ct);
}
