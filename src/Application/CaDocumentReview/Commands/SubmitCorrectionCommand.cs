using MediatR;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders;
using Praksa.Application.Orders.Dtos;

namespace Praksa.Application.CaDocumentReview.Commands;

public sealed record SubmitCorrectionCommand(int OrderId, string? Comment) : ICommand<CaDocumentReviewResultDto>;

public sealed class SubmitCorrectionCommandHandler
    : IRequestHandler<SubmitCorrectionCommand, CaDocumentReviewResultDto>
{
    private readonly ICaDocumentReviewService _service;
    public SubmitCorrectionCommandHandler(ICaDocumentReviewService service) => _service = service;
    public Task<CaDocumentReviewResultDto> Handle(SubmitCorrectionCommand command, CancellationToken ct)
        => _service.SubmitCorrectionAsync(command.OrderId, command.Comment, ct);
}
