using MediatR;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Opinions;

namespace Praksa.Application.Opinions.Commands;

public sealed record RequestOpinionsCommand(int OrderId) : ICommand;

public sealed class RequestOpinionsCommandHandler : IRequestHandler<RequestOpinionsCommand>
{
    private readonly IOpinionService _service;
    public RequestOpinionsCommandHandler(IOpinionService service) => _service = service;
    public Task Handle(RequestOpinionsCommand command, CancellationToken ct)
        => _service.RequestOpinionsAsync(command.OrderId, ct);
}
