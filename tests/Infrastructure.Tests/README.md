# Infrastructure.Tests

Unit testovi za Infrastructure sloj — konkretne implementacije servisa (skladište fajlova,
notifikacije) testirane bez prave Postgres baze (EF Core InMemory provider) i bez diska
van privremenog test direktorija.

```csharp
public class LocalFileStorageProvider_Tests : IDisposable
{
    private readonly string _root = Directory.CreateTempSubdirectory().FullName;

    [Fact]
    public async Task SaveAsync_StoresFileUnderSubPath()
    {
        var provider = CreateProvider(_root);
        var result = await provider.SaveAsync(new MemoryStream([1, 2, 3]), "test.pdf", "documents/1");

        Assert.StartsWith("documents/1/", result.StoragePath);
    }

    public void Dispose() => Directory.Delete(_root, recursive: true);
}
```
