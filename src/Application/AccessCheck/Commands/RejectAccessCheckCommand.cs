using FluentValidation;
using MediatR;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders;
using Praksa.Application.Orders.Dtos;

namespace Praksa.Application.AccessCheck.Commands;

public sealed record RejectAccessCheckCommand(int OrderId, string Comment) : ICommand<CaDocumentReviewResultDto>;

public sealed class RejectAccessCheckCommandHandler
    : IRequestHandler<RejectAccessCheckCommand, CaDocumentReviewResultDto>
{
    private readonly IAccessCheckService _service;
    public RejectAccessCheckCommandHandler(IAccessCheckService service) => _service = service;
    public Task<CaDocumentReviewResultDto> Handle(RejectAccessCheckCommand command, CancellationToken ct)
        => _service.RejectAccessAsync(command.OrderId, command.Comment, ct);
}

public sealed class RejectAccessCheckCommandValidator : AbstractValidator<RejectAccessCheckCommand>
{
    public RejectAccessCheckCommandValidator()
    {
        RuleFor(x => x.OrderId).GreaterThan(0).WithMessage("ID narudžbe je nevažeći.");
        RuleFor(x => x.Comment).NotEmpty().WithMessage("Komentar pri odbijanju pristupa je obavezan.")
            .MaximumLength(2000).WithMessage("Komentar ne smije prelaziti 2000 znakova.");
    }
}
