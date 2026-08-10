using FluentValidation;
using MediatR;
using Praksa.Application.Appraisers.Dtos;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders;
using Praksa.Domain.Orders;

namespace Praksa.Application.AppraiserAssignment.Commands;

public sealed record RejectByAppraiserCommand(
    int OrderId,
    AppraiserDeclineReason Reason,
    string? FreeText = null) : ICommand<SendToAppraiserResultDto>;

public sealed class RejectByAppraiserCommandHandler
    : IRequestHandler<RejectByAppraiserCommand, SendToAppraiserResultDto>
{
    private readonly IAppraiserAssignmentService _service;
    public RejectByAppraiserCommandHandler(IAppraiserAssignmentService service) => _service = service;
    public Task<SendToAppraiserResultDto> Handle(RejectByAppraiserCommand command, CancellationToken ct)
        => _service.RejectByAppraiserAsync(command.OrderId, command.Reason, command.FreeText, ct);
}

public sealed class RejectByAppraiserCommandValidator : AbstractValidator<RejectByAppraiserCommand>
{
    public RejectByAppraiserCommandValidator()
    {
        RuleFor(x => x.OrderId).GreaterThan(0).WithMessage("ID narudžbe je nevažeći.");
        RuleFor(x => x.Reason).IsInEnum().WithMessage("Razlog odbijanja je nevažeći.");
    }
}
