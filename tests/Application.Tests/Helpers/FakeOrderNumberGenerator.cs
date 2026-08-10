using Praksa.Application.Orders.Interfaces;

namespace Praksa.Application.Tests.Helpers;

/// <summary>
/// Test stub za IOrderNumberGenerator — ne koristi PostgreSQL raw SQL,
/// generiše jedinstven broj bez relacijske baze.
/// </summary>
public sealed class FakeOrderNumberGenerator : IOrderNumberGenerator
{
    // Instance field — svaka test klasa dobiva vlastiti counter počevši od 0.
    // static bi uzrokovao da counter nikad ne resetuje između test runova u istom procesu.
    private int _counter;

    public Task<string> GenerateAsync(CancellationToken ct = default)
    {
        var n = System.Threading.Interlocked.Increment(ref _counter);
        return Task.FromResult($"PN-{DateTime.UtcNow.Year}-{n:D6}");
    }
}
