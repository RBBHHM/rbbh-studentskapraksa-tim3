using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Praksa.Infrastructure.Persistence;

#nullable disable

namespace Praksa.Infrastructure.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20260620150000_AddEnterpriseAuditFields")]
public partial class AddEnterpriseAuditFields : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // K3: Optimistic concurrency — RowVersion za AppraisalOrder i TaskItem
        // Koristimo raw SQL jer EF Core generira DEFAULT 0 (integer) što PostgreSQL odbija za xid tip
        migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS row_version xid NOT NULL DEFAULT '0'::xid;");
        migrationBuilder.Sql("ALTER TABLE task_items ADD COLUMN IF NOT EXISTS row_version xid NOT NULL DEFAULT '0'::xid;");

        // V4: Notification deduplication key
        migrationBuilder.Sql("ALTER TABLE notifications ADD COLUMN IF NOT EXISTS deduplication_key character varying(512);");
        migrationBuilder.Sql("CREATE INDEX IF NOT EXISTS ix_notifications_deduplication_key ON notifications (deduplication_key);");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropIndex(name: "ix_notifications_deduplication_key", table: "notifications");
        migrationBuilder.DropColumn(name: "deduplication_key", table: "notifications");
        migrationBuilder.DropColumn(name: "row_version", table: "task_items");
        migrationBuilder.DropColumn(name: "row_version", table: "appraisal_orders");
    }
}
