using System.Net.Http.Headers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NSubstitute;
using Praksa.Application.Common.Constants;
using Praksa.Application.Common.Interfaces;
using Praksa.Application.Common.Models;
using Praksa.Application.Orders.Interfaces;
using Praksa.Application.Users;
using Praksa.Application.Users.Models;
using Praksa.Domain.Codebooks;
using Praksa.Infrastructure.Audit;
using Praksa.Infrastructure.Orders;
using Praksa.Infrastructure.Persistence;

namespace Praksa.Api.Tests.Helpers;

/// <summary>
/// WebApplicationFactory koji pokreće cijeli ASP.NET Core stack s in-memory bazom,
/// lažnim JWT handlerom i bez pozadinskih servisa koji zahtijevaju pravi PostgreSQL.
///
/// Svaki test-run dobija svoju izoliranu in-memory bazu (Guid u imenu).
/// </summary>
public sealed class ApiFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureServices(services =>
        {
            // ── Zamjena PostgreSQL baze s in-memory ───────────────────────────────
            // DependencyInjection.AddInfrastructure preskače Npgsql u "Testing" okruženju,
            // tako da ovdje samo registrujemo InMemory bez konflikta providera.
            // RemoveAllDescriptors je sigurnosna mreža za slučaj da dođe do duple registracije.
            RemoveAllDescriptors<DbContextOptions<ApplicationDbContext>>(services);
            var dbName = $"ApiTests_{Guid.NewGuid()}";
            services.AddDbContext<ApplicationDbContext>(o =>
                o.UseInMemoryDatabase(dbName)
                 .ConfigureWarnings(w =>
                     w.Ignore(InMemoryEventId.TransactionIgnoredWarning)));

            // ── Zamjena OrderNumberGenerator (raw SQL, ne radi s InMemory) ─────────
            // OrderNumberGenerator koristi PostgreSQL UPSERT koji nije podržan u InMemory.
            // Stub generira jedinstven broj bez DB-a.
            RemoveAllDescriptors<IOrderNumberGenerator>(services);
            services.AddScoped<IOrderNumberGenerator, InMemoryOrderNumberGenerator>();

            // ── Zamjena PostgresJobLock (raw SQL pg_try_advisory_lock) ─────────────
            // Pozadinski servisi i AuditLogQueueWorker koriste IDistributedJobLock;
            // za in-memory testove koristimo no-op implementaciju.
            RemoveAllDescriptors<IDistributedJobLock>(services);
            services.AddScoped<IDistributedJobLock, NoOpJobLock>();

            // ── Uklanjanje hosted servisa koji koriste PostgreSQL-specifičan SQL ────
            RemoveHostedService<AppraiserTimeoutService>(services);
            RemoveHostedService<AppraiserAcceptanceTimeoutService>(services);
            RemoveHostedService<AuditLogQueueWorker>(services);

            // ── Stub IUserRoleProvider — zamjena za Keycloak Admin API ───────────
            RemoveAllDescriptors<IUserRoleProvider>(services);
            var stubUserRoleProvider = Substitute.For<IUserRoleProvider>();
            stubUserRoleProvider
                .GetUsersWithRolesAsync(Arg.Any<UserRoleListRequest>(), Arg.Any<CancellationToken>())
                .Returns(new PagedResult<UserRoleSourceItem>
                {
                    Items = [], TotalCount = 0, Page = 1, PageSize = 20
                });
            stubUserRoleProvider
                .GetUserWithRolesAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
                .Returns((UserRoleSourceItem?)null);
            services.AddScoped(_ => stubUserRoleProvider);

            // ── Stub IUserRoleQueryService — wrapper oko IUserRoleProvider ──────
            RemoveAllDescriptors<IUserRoleQueryService>(services);
            var stubQuerySvc = Substitute.For<IUserRoleQueryService>();
            stubQuerySvc
                .GetUsersWithRolesAsync(Arg.Any<UserRoleListRequest>(), Arg.Any<CancellationToken>())
                .Returns(new PagedResult<UserRoleListItemDto>
                {
                    Items = [], TotalCount = 0, Page = 1, PageSize = 20
                });
            stubQuerySvc
                .GetUserRolesAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
                .Returns((UserRolesDetailDto?)null);
            services.AddScoped(_ => stubQuerySvc);

            // ── Stub IUserSuspensionService — poziva Keycloak Admin API ─────────
            RemoveAllDescriptors<IUserSuspensionService>(services);
            var stubSuspension = Substitute.For<IUserSuspensionService>();
            stubSuspension
                .SuspendAsync(Arg.Any<string>(), Arg.Any<string?>(), Arg.Any<CancellationToken>())
                .Returns(Task.CompletedTask);
            stubSuspension
                .ReactivateAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
                .Returns(Task.CompletedTask);
            services.AddScoped(_ => stubSuspension);

            // ── Zamjena JWT autentifikacije s test handlerom ──────────────────────
            // Uklanjamo sve auth scheme konfiguracije (JwtBearer, Keycloak, itd.)
            // i dodajemo jedino TestAuthHandler koji ne validira potpis.
            RemoveAllDescriptors<IAuthenticationSchemeProvider>(services);
            services.AddAuthentication(TestAuthHandler.SchemeName)
                .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(
                    TestAuthHandler.SchemeName, _ => { });
        });
    }

    // ── Helpers za kreiranje HTTP klijenata ───────────────────────────────────────

    /// <summary>HTTP klijent bez autentifikacije — za testiranje 401 scenarija.</summary>
    public HttpClient CreateAnonymousClient()
        => CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });

    /// <summary>HTTP klijent s punim skupom permissiona — za happy-path testove.</summary>
    public HttpClient CreateAuthenticatedClient(string token = "test-admin")
    {
        var client = CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);
        return client;
    }

    /// <summary>Seed helper — direktno upisuje u in-memory bazu izvan HTTP sloja.</summary>
    public async Task<T> SeedAsync<T>(Func<ApplicationDbContext, Task<T>> seed)
    {
        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        return await seed(db);
    }

    // ── Startup seeding ───────────────────────────────────────────────────────────

    protected override IHost CreateHost(IHostBuilder builder)
    {
        var host = base.CreateHost(builder);
        SeedMinimalData(host.Services);
        return host;
    }

    /// <summary>
    /// Seeduje minimalne referentne podatke koji su potrebni testovima:
    /// - Jedan CollateralType (tipovi_kolaterala) s ID = 1 (auto-increment)
    /// E2E testovi koriste collateralTypeId = 1 u payloadu.
    /// </summary>
    private static void SeedMinimalData(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        if (db.CodebookValues.Any()) return;

        db.CodebookValues.Add(CodebookValue.Create(
            codebookKey:     CodebookKeys.CollateralTypes,
            code:            "STAN",
            label:           "Stan (test)",
            description:     null,
            sortOrder:       1,
            createdByUserId: "test-seed"));
        db.SaveChanges();
    }

    // ── Private helpers ───────────────────────────────────────────────────────────

    private static void RemoveDescriptor<T>(IServiceCollection services)
    {
        var desc = services.SingleOrDefault(d => d.ServiceType == typeof(T));
        if (desc is not null) services.Remove(desc);
    }

    private static void RemoveAllDescriptors<T>(IServiceCollection services)
    {
        var descs = services.Where(d => d.ServiceType == typeof(T)).ToList();
        foreach (var d in descs) services.Remove(d);
    }

    private static void RemoveHostedService<T>(IServiceCollection services)
        where T : class
    {
        var desc = services.FirstOrDefault(d => d.ImplementationType == typeof(T));
        if (desc is not null) services.Remove(desc);
    }

    /// <summary>In-memory order number generator — koristi Guid umjesto PostgreSQL UPSERT.</summary>
    private sealed class InMemoryOrderNumberGenerator : IOrderNumberGenerator
    {
        // Instance field — ApiFactory kreira novu instancu po test sesiji.
        private int _counter;
        public Task<string> GenerateAsync(CancellationToken ct = default)
        {
            var n = System.Threading.Interlocked.Increment(ref _counter);
            return Task.FromResult($"PN-{DateTime.UtcNow.Year}-{n:D6}");
        }
    }

    /// <summary>No-op distributed lock — uvijek uspijeva, nikad ne blokira.</summary>
    private sealed class NoOpJobLock : IDistributedJobLock
    {
        public Task<bool> TryAcquireAsync(long lockKey, CancellationToken ct = default)
            => Task.FromResult(true);

        public Task ReleaseAsync(long lockKey, CancellationToken ct = default)
            => Task.CompletedTask;
    }
}
