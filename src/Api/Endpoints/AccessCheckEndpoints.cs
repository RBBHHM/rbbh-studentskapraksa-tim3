using MediatR;
using Praksa.Api.Modules;
using Praksa.Application.AccessCheck.Commands;
using Praksa.Application.Orders.Dtos;
using Praksa.Application.Security;

namespace Praksa.Api.Endpoints;

/// <summary>
/// Endpointi za CO provjeru pristupa prije narudžbe (US-93) — "Uredan pristup" / "Dopuna".
/// Auto-discovery preko IEndpointModule.
/// </summary>
public sealed class AccessCheckEndpoints : IEndpointModule
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/orders/{orderId:int}/access-check")
            .WithTags("CO Access Check");

        group.MapPost("/approve", ApproveAccess)
            .RequireAuthorization(AppPolicies.OrdersAccessCheck)
            .WithName("ApproveAccessCheck")
            .WithSummary("CO potvrđuje uredan pristup nekretnini prije narudžbe.");

        group.MapPost("/reject", RejectAccess)
            .RequireAuthorization(AppPolicies.OrdersAccessCheck)
            .WithName("RejectAccessCheck")
            .WithSummary("CO traži dopunu prije odobrenja pristupa — narudžba se vraća CA na ponovni pregled.");
    }

    private static async Task<IResult> ApproveAccess(
        int orderId,
        AccessCheckDecisionRequest request,
        IMediator mediator,
        CancellationToken ct)
    {
        var result = await mediator.Send(new ApproveAccessCheckCommand(orderId, request.Comment), ct);
        return Results.Ok(result);
    }

    private static async Task<IResult> RejectAccess(
        int orderId,
        AccessCheckDecisionRequest request,
        IMediator mediator,
        CancellationToken ct)
    {
        var result = await mediator.Send(new RejectAccessCheckCommand(orderId, request.Comment ?? ""), ct);
        return Results.Ok(result);
    }
}
