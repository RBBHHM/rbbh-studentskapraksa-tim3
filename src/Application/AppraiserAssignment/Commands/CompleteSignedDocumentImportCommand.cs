using MediatR;
using Praksa.Application.Appraisers.Dtos;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders;

namespace Praksa.Application.AppraiserAssignment.Commands;

public sealed record CompleteSignedDocumentImportCommand(int OrderId) : ICommand<SendToAppraiserResultDto>;

public sealed class CompleteSignedDocumentImportCommandHandler
    : IRequestHandler<CompleteSignedDocumentImportCommand, SendToAppraiserResultDto>
{
    private readonly IAppraiserAssignmentService _service;
    public CompleteSignedDocumentImportCommandHandler(IAppraiserAssignmentService service) => _service = service;
    public Task<SendToAppraiserResultDto> Handle(CompleteSignedDocumentImportCommand command, CancellationToken ct)
        => _service.CompleteSignedDocumentImportAsync(command.OrderId, ct);
}
