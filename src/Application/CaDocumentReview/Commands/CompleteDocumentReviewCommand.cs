using MediatR;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders;
using Praksa.Application.Orders.Dtos;

namespace Praksa.Application.CaDocumentReview.Commands;

public sealed record CompleteDocumentReviewCommand(int OrderId) : ICommand<CaDocumentReviewResultDto>;

public sealed class CompleteDocumentReviewCommandHandler
    : IRequestHandler<CompleteDocumentReviewCommand, CaDocumentReviewResultDto>
{
    private readonly ICaDocumentReviewService _service;
    public CompleteDocumentReviewCommandHandler(ICaDocumentReviewService service) => _service = service;
    public Task<CaDocumentReviewResultDto> Handle(CompleteDocumentReviewCommand command, CancellationToken ct)
        => _service.CompleteReviewAsync(command.OrderId, ct);
}
