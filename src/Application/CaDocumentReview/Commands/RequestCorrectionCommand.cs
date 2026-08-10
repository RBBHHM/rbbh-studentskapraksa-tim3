using FluentValidation;
using MediatR;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders;
using Praksa.Application.Orders.Dtos;

namespace Praksa.Application.CaDocumentReview.Commands;

public sealed record RequestCorrectionCommand(
    int OrderId,
    int ReasonCodeId,
    string? Comment) : ICommand<CaDocumentReviewResultDto>;

public sealed class RequestCorrectionCommandHandler
    : IRequestHandler<RequestCorrectionCommand, CaDocumentReviewResultDto>
{
    private readonly ICaDocumentReviewService _service;
    public RequestCorrectionCommandHandler(ICaDocumentReviewService service) => _service = service;
    public Task<CaDocumentReviewResultDto> Handle(RequestCorrectionCommand command, CancellationToken ct)
        => _service.RequestCorrectionAsync(command.OrderId, command.ReasonCodeId, command.Comment, ct);
}

public sealed class RequestCorrectionCommandValidator : AbstractValidator<RequestCorrectionCommand>
{
    public RequestCorrectionCommandValidator()
    {
        RuleFor(x => x.OrderId).GreaterThan(0).WithMessage("ID narudžbe je nevažeći.");
        RuleFor(x => x.ReasonCodeId).GreaterThan(0).WithMessage("Razlog dopune je obavezan.");
    }
}
