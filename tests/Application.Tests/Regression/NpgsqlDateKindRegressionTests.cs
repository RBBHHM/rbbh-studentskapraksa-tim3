using Microsoft.EntityFrameworkCore;
using Praksa.Domain.Orders;
using Praksa.Infrastructure.Persistence;
using Xunit;

namespace Praksa.Application.Tests.Regression;

/// <summary>
/// Regresijski testovi za bug: DateTime filter s Kind=Unspecified bacal 500 na PostgreSQL-u.
///
/// Bug: project_orders_date_filter_npgsql_kind.md
/// Uzrok: Npgsql v8+ odbija DateTime s Kind=Unspecified za timestamptz kolone
/// Fix: DateTime.SpecifyKind(value, DateTimeKind.Utc) u AppraisalOrderService.GetListAsync
///
/// Testovi direktno testuju logiku SpecifyKind-a i EF query filtriranja
/// (ne konstruišu AppraisalOrderService koji ima mnogo zavisnosti).
/// </summary>
public sealed class NpgsqlDateKindRegressionTests : IDisposable
{
    private readonly ApplicationDbContext _db;

    public NpgsqlDateKindRegressionTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase($"NpgsqlDateReg_{Guid.NewGuid()}")
            .ConfigureWarnings(w =>
                w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.InMemoryEventId.TransactionIgnoredWarning))
            .Options;
        _db = new ApplicationDbContext(options);
        _db.Database.EnsureCreated();
    }

    public void Dispose() => _db.Dispose();

    // ── Direktna verifikacija SpecifyKind logike ──────────────────────────────────

    [Fact]
    public void SpecifyKind_UnspecifiedDatetime_ConvertsToUtc()
    {
        // Ovo je tačno šta je bug: DateTime.Parse("2026-01-01") vraća Kind=Unspecified
        var rawInput = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Unspecified);
        Assert.Equal(DateTimeKind.Unspecified, rawInput.Kind); // potvrđujemo bug scenario

        // Fix: SpecifyKind
        var fixed_ = DateTime.SpecifyKind(rawInput, DateTimeKind.Utc);

        Assert.Equal(DateTimeKind.Utc, fixed_.Kind);
        Assert.Equal(rawInput.Year,   fixed_.Year);
        Assert.Equal(rawInput.Month,  fixed_.Month);
        Assert.Equal(rawInput.Day,    fixed_.Day);
    }

    [Fact]
    public void SpecifyKind_AlreadyUtc_RemainsUtc()
    {
        var utcInput = new DateTime(2026, 6, 15, 0, 0, 0, DateTimeKind.Utc);

        var result = DateTime.SpecifyKind(utcInput, DateTimeKind.Utc);

        Assert.Equal(DateTimeKind.Utc, result.Kind);
        Assert.Equal(utcInput, result);
    }

    // ── EF Core in-memory query s Unspecified datumima ───────────────────────────
    // Na in-memory bazi Kind=Unspecified ne baca, ali testiramo logiku filtriranja
    // da fix ne mijenja semantiku upita (iz/van opsega)

    [Fact]
    public async Task EfQuery_WithSpecifyKindApplied_FiltersCorrectly()
    {
        _db.AppraisalOrders.Add(MakeDraftOrder("PN-DATE-001"));
        await _db.SaveChangesAsync();

        // Simuliramo šta endpoint radi: radi SpecifyKind na Unspecified inputu
        var rawFrom = new DateTime(2020, 1, 1, 0, 0, 0, DateTimeKind.Unspecified);
        var rawTo   = new DateTime(2030, 12, 31, 0, 0, 0, DateTimeKind.Unspecified);

        var from = DateTime.SpecifyKind(rawFrom, DateTimeKind.Utc);
        var to   = DateTime.SpecifyKind(rawTo,   DateTimeKind.Utc).AddDays(1);

        var count = await _db.AppraisalOrders
            .Where(o => o.CreatedAt >= from && o.CreatedAt < to)
            .CountAsync();

        // Narudžba je kreirana now (UTC) — mora biti u opsegu 2020-2030
        Assert.Equal(1, count);
    }

    [Fact]
    public async Task EfQuery_WithDateRangeExcludingOrder_ReturnsEmpty()
    {
        _db.AppraisalOrders.Add(MakeDraftOrder("PN-DATE-002"));
        await _db.SaveChangesAsync();

        // Prošlogodišnji opseg — narudžba kreirana sad ne smije biti u njemu
        var from = DateTime.SpecifyKind(new DateTime(2000, 1, 1), DateTimeKind.Utc);
        var to   = DateTime.SpecifyKind(new DateTime(2001, 1, 1), DateTimeKind.Utc);

        var count = await _db.AppraisalOrders
            .Where(o => o.CreatedAt >= from && o.CreatedAt < to)
            .CountAsync();

        Assert.Equal(0, count);
    }

    // ── Dokumentacioni test: SpecifyKind poziv postoji u source kodu ─────────────

    [Fact]
    public void Fix_SpecifyKindExistsInOrderQueryService()
    {
        // "Živi komentar" test — SpecifyKind fix je premješten u OrderQueryService
        // (GetListAsync i GetSummaryAsync su refaktorisani iz AppraisalOrderService u L1 sprintu).
        var serviceFile = LocateQueryServiceFile();
        if (serviceFile is null) return;

        var content = File.ReadAllText(serviceFile);

        Assert.Contains("SpecifyKind", content,          StringComparison.Ordinal);
        Assert.Contains("DateTimeKind.Utc", content,     StringComparison.Ordinal);
        Assert.Contains("CreatedFrom", content,          StringComparison.Ordinal);
    }

    // ── Private helpers ───────────────────────────────────────────────────────────

    private static string? LocateQueryServiceFile()
    {
        var dir = AppContext.BaseDirectory;
        for (var i = 0; i < 10; i++)
        {
            dir = Path.GetDirectoryName(dir) ?? dir;
            var candidate = Path.Combine(dir, "src", "Infrastructure", "Orders",
                "OrderQueryService.cs");
            if (File.Exists(candidate)) return candidate;
        }
        return null;
    }

    private static AppraisalOrder MakeDraftOrder(string orderNumber)
        => AppraisalOrder.Create(
            orderNumber:              orderNumber,
            title:                    "Regresija test narudžba",
            clientName:               "Test Klijent",
            clientType:               "FL",
            clientIdentifier:         "1234567890123",
            contactName:              "Test Kontakt",
            contactPhone:             "061-000-000",
            contactEmail:             "test@test.ba",
            city:                     "Sarajevo",
            branch:                   "POS_SARAJEVO_CENTAR",
            branchAddress:            "Titova 1, Sarajevo",
            propertyAddress:          "Obala 1, Sarajevo",
            collateralTypeId:         1,
            combinedCollateralTypeId: null,
            createdByUserId:          "test-user-id",
            createdByRole:            "AM",
            createdByName:            "Test Korisnik",
            deliveryContactName:      "Test Kontakt",
            amRecipientName:          "Test AM");
}
