using Praksa.Infrastructure.Codebooks;
using Xunit;

namespace Praksa.Application.Tests.Infrastructure.Codebooks;

public sealed class NullCodebookCacheInvalidatorTests
{
    [Fact]
    public async Task InvalidateAsync_CompletesWithoutError()
    {
        var sut = new NullCodebookCacheInvalidator();

        await sut.InvalidateAsync("any_key");
    }
}
