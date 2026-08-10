using Praksa.Domain.Common;

namespace Praksa.Domain.Branches;

public sealed class City : BaseEntity
{
    public string Name { get; private set; } = null!;

    private City() { }

    public static City Create(string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        return new City { Name = name.Trim() };
    }

    public void UpdateName(string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        Name = name.Trim();
    }
}
