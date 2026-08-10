using MediatR;
using Praksa.Api.Modules;
using Praksa.Application.Orders.Queries;
using Praksa.Application.Security;

namespace Praksa.Api.Endpoints;

public sealed class OrderDetailEndpoints : IEndpointModule
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/orders")
            .WithTags("Orders");

        group.MapGet("/{orderId:int}/detail", GetById)
            .RequireAuthorization(AppPolicies.OrdersView)
            .WithName("GetOrderDetailById")
            .WithSummary("Vraća detalje narudžbe procjene, sa Capabilities za trenutnog korisnika (US 92/93/94).");
    }

    private static async Task<IResult> GetById(
        int orderId,
        IMediator mediator,
        CancellationToken ct)
    {
        var result = await mediator.Send(new GetOrderDetailQuery(orderId), ct);
        return Results.Ok(result);
    }
}
