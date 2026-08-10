using System.Diagnostics.CodeAnalysis;
using CK = Praksa.Application.Common.Constants.CodebookKeys;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Praksa.Application.Appraisers;
using Praksa.Application.Audit;
using Praksa.Application.Orders;
using Praksa.Application.Branches;
using Praksa.Application.Codebooks.Interfaces;
using Praksa.Application.Codebooks.Import;
using Praksa.Application.Orders.Interfaces;
using Praksa.Application.Reports;
using Praksa.Infrastructure.Orders;
using Praksa.Infrastructure.Common;
using Praksa.Application.Common.Interfaces;
using AppClock = Praksa.Application.Common.Interfaces.IClock;
using InfraClock = Praksa.Infrastructure.Common.SystemClock;
using InfraRateLimiter = Praksa.Infrastructure.Common.InMemoryDistributedRateLimiter;
using Praksa.Application.Notifications;
using Praksa.Application.Roles.Interfaces;
using Praksa.Application.Security.Interfaces;
using Praksa.Application.Users;
using Praksa.Infrastructure.Appraisers;
using Praksa.Infrastructure.Codebooks.Import;
using Praksa.Infrastructure.Codebooks.Import.Mappers;
using Praksa.Infrastructure.Audit;
using Praksa.Infrastructure.Branches;
using Praksa.Infrastructure.Auth;
using Praksa.Infrastructure.Codebooks;
using Praksa.Infrastructure.Notifications;
using Praksa.Infrastructure.Persistence;
using Praksa.Infrastructure.Roles;
using Praksa.Infrastructure.Security;
using Praksa.Infrastructure.Storage;
using Praksa.Infrastructure.Users;

namespace Praksa.Infrastructure;

[ExcludeFromCodeCoverage]
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // ── Baza podataka ─────────────────────────────────────────────────────
        // U Testing okruženju (WebApplicationFactory) preskačemo Npgsql —
        // factory registruje vlastiti in-memory DbContext bez konflikta providera.
        var env = services
            .FirstOrDefault(d => d.ServiceType == typeof(IWebHostEnvironment))
            ?.ImplementationInstance as IWebHostEnvironment;

        if (env?.IsEnvironment("Testing") != true)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(
                    configuration.GetConnectionString("Default"),
                    npgsqlOptions => npgsqlOptions.MigrationsAssembly(
                        typeof(ApplicationDbContext).Assembly.FullName))
                .ConfigureWarnings(w => w.Ignore(
                    Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning)));
        }

        services.AddHttpContextAccessor();
        services.AddMemoryCache();
        services.AddSingleton<IClock, Praksa.Infrastructure.Common.SystemClock>();
        services.AddSingleton<IDistributedRateLimiter, InfraRateLimiter>();

        // ── Autentifikacija / Claims ───────────────────────────────────────────
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IClaimsTransformation, PermissionClaimsTransformation>();
        services.AddScoped<IUserPermissionService, UserPermissionService>();

        // ── Skladište fajlova (dokumentacija narudžbi, US 92) ──────────────────
        services.Configure<FileStorageOptions>(configuration.GetSection(FileStorageOptions.SectionName));
        services.AddSingleton<IFileStorageProvider, LocalFileStorageProvider>();

        // ── Notifikacije ──────────────────────────────────────────────────────
        services.AddScoped<IRoleManagementNotificationService, NullRoleManagementNotificationService>();

        // ── Role management (Keycloak assign/remove/transfer) ─────────────────
        services.AddScoped<IRoleManagementService, RoleManagementService>();

        // ── Role Definitions (PostgreSQL + Keycloak sync) ─────────────────────
        services.AddScoped<IRoleDefinitionService, RoleDefinitionService>();
        services.AddScoped<IPermissionCatalogService, PermissionCatalogService>();
        services.AddScoped<IKeycloakRoleSyncService, KeycloakRoleSyncService>();

        // ── User Suspension ───────────────────────────────────────────────────
        services.AddScoped<IUserSuspensionService, UserSuspensionService>();

        // ── Narudžbe procjene (US-1, US-2) — fizički split (I-1) ────────────────
        // Sub-servisi dostupni direktno za buduću granularnu injekciju
        services.AddScoped<IOrderCreateService,  OrderCreateService>();
        services.AddScoped<IOrderSubmitService,  OrderSubmitService>();
        // Facade implementira IAppraisalOrderService i delegira na sub-servise
        services.AddScoped<IAppraisalOrderService, AppraisalOrderService>();
        services.AddScoped<IProtocolService, ProtocolService>();
        services.AddScoped<IWorkflowTaskService, WorkflowTaskService>();
        services.AddScoped<ICaDocumentReviewService, CaDocumentReviewService>();
        services.AddScoped<IAccessCheckService, AccessCheckService>();
        services.AddScoped<IOrderTitleGenerator, OrderTitleGenerator>();
        services.AddScoped<IOrderNumberGenerator, OrderNumberGenerator>();
        // IOrderApprovalService je registrovan kroz OrderApprovalFeatureModule (AddFeatureModules).

        // ── Vještaci — master-data, odabir i workflow (Faza C/D) — fizički split (I-2) ─
        services.AddScoped<IAppraiserService, AppraiserService>();
        services.AddScoped<IAppraiserSelectionService, AppraiserSelectionService>();
        services.AddScoped<IFlAppraiserSelectionService, FlAppraiserSelectionService>();
        services.AddScoped<IPlAppraiserSelectionService, PlAppraiserSelectionService>();
        services.AddScoped<IAppraiserOrderLifecycleService, AppraiserAssignmentService>();
        services.AddScoped<IAppraiserAssignmentService, AppraiserAssignmentService>();
        services.AddScoped<IQuoteRequestService, QuoteRequestService>();
        services.AddScoped<IInvoiceWorkflowService, InvoiceWorkflowService>();
        services.AddScoped<IReportService, Reports.ReportService>();
        services.AddScoped<IDistributedJobLock, PostgresJobLock>();
        services.AddHostedService<AppraiserTimeoutService>();
        // Provjera 24h roka prihvatanja — blokira vještaka i dodjeljuje sljedećeg.
        services.AddHostedService<AppraiserAcceptanceTimeoutService>();

        // ── Import/Export šifarnika ──────────────────────────────────────────
        services.AddScoped<ICodebookImportExportService, CodebookImportExportService>();
        services.AddScoped<ICodebookMapper, AppraiserMapper>();
        services.AddScoped<ICodebookMapper>(_ => new CodebookValueMapper(CK.CollateralTypes, CK.CollateralTypes));
        services.AddScoped<ICodebookMapper>(_ => new CodebookValueMapper(CK.PropertyTypes, CK.PropertyTypes));
        services.AddScoped<ICodebookMapper>(_ => new CodebookValueMapper(CK.Cities, CK.Cities));
        services.AddScoped<ICodebookMapper>(_ => new CodebookValueMapper(CK.Branches, CK.Branches));
        services.AddScoped<ICodebookMapper>(_ => new CodebookValueMapper(CK.CombinedCollateralTypes, CK.CombinedCollateralTypes));
        services.AddScoped<ICodebookMapper>(_ => new CodebookValueMapper(CK.DocumentationSupplementReasons, CK.DocumentationSupplementReasons));
        services.AddScoped<ICodebookMapper, ProtocolOrderMapper>();

        // ── Izvještaji ─────────────────────────────────────────────────────────
        services.AddScoped<IReportService, Reports.ReportService>();

        // ── Poslovnice i gradovi ──────────────────────────────────────────────
        services.AddScoped<IBranchQueryService, BranchQueryService>();

        // ── Šifarnici ─────────────────────────────────────────────────────────
        services.AddScoped<ICodebookService, CodebookService>();
        services.AddScoped<ICodebookValueService, CodebookValueService>();
        services.AddScoped<ICodebookUsageService, CodebookUsageService>();
        services.AddScoped<ICodebookUsageChecker, Codebooks.UsageCheckers.CollateralTypeUsageChecker>();
        services.AddScoped<ICodebookUsageChecker, Codebooks.UsageCheckers.DocumentTypeUsageChecker>();
        services.AddScoped<ICodebookCacheInvalidator, NullCodebookCacheInvalidator>();

        // ── Audit ─────────────────────────────────────────────────────────────
        services.AddScoped<IAuditValueSanitizer, AuditValueSanitizer>();
        services.AddScoped<DatabaseAuditSink>();
        services.AddScoped<FileAuditSink>();
        services.AddScoped<IAuditSink, FallbackAuditSink>();
        services.AddSingleton<AuditLogQueue>();
        services.AddSingleton<IAuditLogQueue>(sp => sp.GetRequiredService<AuditLogQueue>());
        services.AddHostedService<AuditLogQueueWorker>();
        services.AddScoped<IAuditService, AuditService>();
        services.AddScoped<IAuditQueryService, AuditQueryService>();

        // ── Korisnici i role (Keycloak read) ──────────────────────────────────
        services.AddScoped<IUserRoleProvider, KeycloakUserRoleProvider>();
        services.AddScoped<IUserRoleQueryService, UserRoleQueryService>();

        // ── Keycloak Admin HTTP client ────────────────────────────────────────
        services.Configure<KeycloakOptions>(configuration.GetSection(KeycloakOptions.SectionName));
        services.Configure<KeycloakAdminOptions>(configuration.GetSection(KeycloakAdminOptions.SectionName));
        services.AddHttpClient("KeycloakAdmin", client =>
        {
            var baseUrl = configuration[$"{KeycloakAdminOptions.SectionName}:BaseUrl"];
            if (!string.IsNullOrEmpty(baseUrl))
                client.BaseAddress = new Uri(baseUrl);
            client.DefaultRequestHeaders.Add("Accept", "application/json");
        });

        // ── JWT Bearer autentifikacija ────────────────────────────────────────
        var keycloak = configuration.GetSection(KeycloakOptions.SectionName).Get<KeycloakOptions>()
            ?? new KeycloakOptions();

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.Authority             = keycloak.Authority;
                options.Audience              = keycloak.Audience;
                options.RequireHttpsMetadata  = keycloak.RequireHttpsMetadata;
                options.AutomaticRefreshInterval = TimeSpan.FromMinutes(10);
                options.RefreshInterval       = TimeSpan.FromSeconds(10);

                var validIssuers = new[] { keycloak.Authority }
                    .Concat(keycloak.ValidIssuers)
                    .Where(i => !string.IsNullOrWhiteSpace(i))
                    .Distinct()
                    .ToArray();
                if (validIssuers.Length > 0)
                {
                    options.TokenValidationParameters.ValidIssuers = validIssuers;
                }

                options.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = context =>
                    {
                        if (context.Exception is SecurityTokenExpiredException)
                            context.Response.Headers["Token-Expired"] = "true";
                        return Task.CompletedTask;
                    }
                };
            });

        return services;
    }
}
