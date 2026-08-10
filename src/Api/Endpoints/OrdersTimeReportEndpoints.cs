using Praksa.Api.Modules;
using Praksa.Application.Reports;
using Praksa.Application.Security;

namespace Praksa.Api.Endpoints;

public sealed class OrdersTimeReportEndpoints : IEndpointModule
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/reports/orders", GetReport)
            .RequireAuthorization(AppPolicies.ReportsGenerate)
            .WithTags("Reports")
            .WithName("GetOrdersTimeReport")
            .WithSummary("US10 — Pregled svih narudžbi + 7 vremenskih kolona. format=json|xlsx, endDate=yyyy-MM-dd.");
    }

    private static async Task<IResult> GetReport(
        IOrdersTimeReportService service,
        DateTime? endDate = null,
        string format = "json",
        CancellationToken ct = default)
    {
        if (string.Equals(format, "xlsx", StringComparison.OrdinalIgnoreCase))
        {
            var (stream, contentType, fileName) = await service.GetReportXlsxAsync(endDate, ct);
            return Results.File(stream, contentType, fileName);
        }

        var rows = await service.GetReportAsync(endDate, ct);
        return Results.Ok(rows);
    }
}
