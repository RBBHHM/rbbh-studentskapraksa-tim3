using Praksa.Application.Codebooks.Interfaces;

namespace Praksa.Infrastructure.Codebooks;

/// <summary>
/// Null implementacija cache invalidatora — koristi se dok cache nije implementiran.
/// Kad se doda stvarni cache (IMemoryCache, Redis...), zamijeniti ovu klasu.
/// </summary>
public sealed class NullCodebookCacheInvalidator : ICodebookCacheInvalidator
{
    public Task InvalidateAsync(string codebookKey, CancellationToken cancellationToken = default)
        => Task.CompletedTask;
}
