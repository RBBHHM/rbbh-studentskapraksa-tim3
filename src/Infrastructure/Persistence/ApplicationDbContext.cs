using Microsoft.EntityFrameworkCore;
using Praksa.Domain.Appraisers;
using Praksa.Domain.Audit;
using Praksa.Domain.Branches;
using Praksa.Domain.Codebooks;
using Praksa.Domain.Documents;
using Praksa.Domain.Notifications;
using Praksa.Domain.Orders;
using Praksa.Domain.Roles;
using Praksa.Infrastructure.Audit;

namespace Praksa.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<City>                 Cities                => Set<City>();
    public DbSet<Branch>               Branches              => Set<Branch>();
    public DbSet<AuditLog>             AuditLogs             => Set<AuditLog>();
    public DbSet<Codebook>             Codebooks             => Set<Codebook>();
    public DbSet<CodebookValue>        CodebookValues        => Set<CodebookValue>();
    public DbSet<RoleDefinition>       RoleDefinitions       => Set<RoleDefinition>();
    public DbSet<PermissionDefinition> PermissionDefinitions => Set<PermissionDefinition>();
    public DbSet<RolePermission>       RolePermissions       => Set<RolePermission>();
    public DbSet<AppraisalOrder>       AppraisalOrders       => Set<AppraisalOrder>();
    public DbSet<TaskItem>             TaskItems             => Set<TaskItem>();
    public DbSet<Document>             Documents             => Set<Document>();
    public DbSet<SharedDocument>       SharedDocuments       => Set<SharedDocument>();
    public DbSet<Notification>         Notifications         => Set<Notification>();
    public DbSet<OrderProtocolEntry>   OrderProtocolEntries  => Set<OrderProtocolEntry>();
    public DbSet<Opinion>              Opinions              => Set<Opinion>();
    public DbSet<Appraiser>                Appraisers              => Set<Appraiser>();
    public DbSet<OrderDeclinedAppraiser>   OrderDeclinedAppraisers => Set<OrderDeclinedAppraiser>();
    public DbSet<QuoteRequest>             QuoteRequests           => Set<QuoteRequest>();
    public DbSet<DocumentTemplate>         DocumentTemplates       => Set<DocumentTemplate>();
    public DbSet<AuditOutboxEntry>         AuditOutbox             => Set<AuditOutboxEntry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
