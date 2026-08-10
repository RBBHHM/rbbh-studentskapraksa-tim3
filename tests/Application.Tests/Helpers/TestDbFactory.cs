using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Praksa.Infrastructure.Persistence;

namespace Praksa.Application.Tests.Helpers;

public static class TestDbFactory
{
    public static ApplicationDbContext Create(bool suppressTransactionWarning = true)
    {
        var builder = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString());

        if (suppressTransactionWarning)
            builder.ConfigureWarnings(w => w.Ignore(InMemoryEventId.TransactionIgnoredWarning));

        return new ApplicationDbContext(builder.Options);
    }
}
