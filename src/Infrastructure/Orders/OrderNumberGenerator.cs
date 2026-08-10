using Microsoft.EntityFrameworkCore;
using Praksa.Application.Orders.Interfaces;
using Praksa.Infrastructure.Persistence;

namespace Praksa.Infrastructure.Orders;

/// <summary>
/// Generira jedinstven broj narudžbe formata PN-{year}-{seq:D6}.
/// Format PN (Protokol Narudžbe) usklađen sa specifikacijom i Excel tabletom.
///
/// Koristi PostgreSQL atomarni INSERT ... ON CONFLICT DO UPDATE ... RETURNING
/// identičan pattern kao ProtocolService (ADR-013) — eliminiše race condition
/// koji je postojao u COUNT(*)+1 pristupu (ADR-048 fix).
/// </summary>
public sealed class OrderNumberGenerator : IOrderNumberGenerator
{
    private readonly ApplicationDbContext _db;

    public OrderNumberGenerator(ApplicationDbContext db) => _db = db;

    public async Task<string> GenerateAsync(CancellationToken ct = default)
    {
        var year = DateTime.UtcNow.Year;

        var sequences = await _db.Database
            .SqlQuery<int>($"""
                INSERT INTO order_number_year_counters (year, last_sequence)
                VALUES ({year}, 1)
                ON CONFLICT (year)
                DO UPDATE SET last_sequence = order_number_year_counters.last_sequence + 1
                RETURNING last_sequence
                """)
            .ToListAsync(ct);

        return $"PN-{year}-{sequences[0]:D6}";
    }
}
