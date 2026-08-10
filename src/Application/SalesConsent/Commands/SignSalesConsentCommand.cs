using MediatR;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Orders;
using Praksa.Application.Orders.Dtos;

namespace Praksa.Application.SalesConsent.Commands;

public sealed record SignSalesConsentCommand(int OrderId) : ICommand<SignConsentResultDto>;

public sealed class SignSalesConsentCommandHandler
    : IRequestHandler<SignSalesConsentCommand, SignConsentResultDto>
{
    private readonly IOriginalAppraisalService _service;
    public SignSalesConsentCommandHandler(IOriginalAppraisalService service) => _service = service;
    public Task<SignConsentResultDto> Handle(SignSalesConsentCommand command, CancellationToken ct)
        => _service.SignSalesConsentAsync(command.OrderId, ct);
}
