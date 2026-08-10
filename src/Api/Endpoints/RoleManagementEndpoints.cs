using Microsoft.AspNetCore.Mvc;
using Praksa.Api.Middleware;
using Praksa.Application.Security;
using Praksa.Application.Security.DTOs;
using Praksa.Application.Security.Interfaces;

namespace Praksa.Api.Endpoints;

/// <summary>
/// Endpointi za upravljanje rolama korisnika.
///
/// Permission pravila:
/// - roles.assign          → POST /api/roles/assign
/// - roles.remove          → POST /api/roles/remove
/// - roles.transfer-admin  → POST /api/roles/transfer-admin
///
/// Sva poslovna pravila (min jedan admin, jedinstvenost role) su u RoleManagementService.
/// </summary>
public static class RoleManagementEndpoints
{
    public static IEndpointRouteBuilder MapRoleManagementEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/roles")
                       .WithTags("Roles");

        group.MapPost("/assign", AssignRole)
             .RequireAuthorization(AppPolicies.RolesAssign)
             .AddEndpointFilter<RateLimitEndpointFilter>()
             .WithName("AssignRole")
             .WithSummary("Dodjeljuje rolu korisniku. Dozvoljeno samo Administratoru.");

        group.MapPost("/remove", RemoveRole)
             .RequireAuthorization(AppPolicies.RolesRemove)
             .AddEndpointFilter<RateLimitEndpointFilter>()
             .WithName("RemoveRole")
             .WithSummary("Uklanja rolu korisniku. Blokira se ako bi to uklonilo posljednjeg Administratora.");

        group.MapPost("/transfer-admin", TransferAdminRole)
             .RequireAuthorization(AppPolicies.RolesTransferAdmin)
             .AddEndpointFilter<RateLimitEndpointFilter>()
             .WithName("TransferAdminRole")
             .WithSummary("Prenosi Administrator rolu na drugog korisnika. Siguran redoslijed: najprije dodaj, pa ukloni.");

        return app;
    }

    private static async Task<IResult> AssignRole(
        [FromBody] AssignRoleRequest request,
        IRoleManagementService service,
        CancellationToken ct)
    {
        await service.AssignRoleAsync(request, ct);
        return Results.NoContent();
    }

    private static async Task<IResult> RemoveRole(
        [FromBody] RemoveRoleRequest request,
        IRoleManagementService service,
        CancellationToken ct)
    {
        await service.RemoveRoleAsync(request, ct);
        return Results.NoContent();
    }

    private static async Task<IResult> TransferAdminRole(
        [FromBody] TransferAdminRoleRequest request,
        IRoleManagementService service,
        CancellationToken ct)
    {
        await service.TransferAdminRoleAsync(request, ct);
        return Results.NoContent();
    }
}
