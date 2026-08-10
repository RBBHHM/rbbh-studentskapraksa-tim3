using System.Data;
using Microsoft.EntityFrameworkCore;
using Praksa.Application.Common.Interfaces;
using Praksa.Infrastructure.Persistence;

namespace Praksa.Infrastructure.Common;

/// <summary>
/// PostgreSQL session-level advisory lock.
/// Scoped — lock je vezan za DB konekciju tekućeg scope-a.
/// Uvijek pozivati ReleaseAsync() u finally bloku jer poolovane konekcije
/// zadržavaju advisory lockove između korištenja.
/// </summary>
[System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
public sealed class PostgresJobLock : IDistributedJobLock
{
    private readonly ApplicationDbContext _db;

    public PostgresJobLock(ApplicationDbContext db) => _db = db;

    public async Task<bool> TryAcquireAsync(long lockKey, CancellationToken ct = default)
    {
        var conn = _db.Database.GetDbConnection();
        if (conn.State != ConnectionState.Open)
            await _db.Database.OpenConnectionAsync(ct);

        using var cmd   = conn.CreateCommand();
        cmd.CommandText = "SELECT pg_try_advisory_lock(@key)";
        var p           = cmd.CreateParameter();
        p.ParameterName = "@key";
        p.Value         = lockKey;
        p.DbType        = DbType.Int64;
        cmd.Parameters.Add(p);

        return (bool)(await cmd.ExecuteScalarAsync(ct))!;
    }

    public async Task ReleaseAsync(long lockKey, CancellationToken ct = default)
    {
        var conn = _db.Database.GetDbConnection();
        if (conn.State != ConnectionState.Open) return;

        using var cmd   = conn.CreateCommand();
        cmd.CommandText = "SELECT pg_advisory_unlock(@key)";
        var p           = cmd.CreateParameter();
        p.ParameterName = "@key";
        p.Value         = lockKey;
        p.DbType        = DbType.Int64;
        cmd.Parameters.Add(p);

        await cmd.ExecuteNonQueryAsync(ct);
    }
}
