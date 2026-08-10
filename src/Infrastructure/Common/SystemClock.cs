using Praksa.Application.Common.Interfaces;

namespace Praksa.Infrastructure.Common;

public sealed class SystemClock : IClock
{
    public DateTime UtcNow => DateTime.UtcNow;
}
