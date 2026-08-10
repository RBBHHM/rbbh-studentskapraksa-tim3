using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Praksa.Infrastructure.Persistence;

#nullable disable

namespace Praksa.Infrastructure.Migrations;

/// <summary>
/// Optimizacija baze: kompozitni indeksi za MyOrders/date-range query-je,
/// parcijalni indeks za aktivne narudžbe i PostgreSQL trigger za auto-update updated_at.
/// </summary>
[DbContext(typeof(ApplicationDbContext))]
[Migration("20260703000000_AddOptimizationIndexesAndTriggers")]
public partial class AddOptimizationIndexesAndTriggers : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // ── Kompozitni indeksi za MyOrders query (kreator + status/is_deleted) ──────
        migrationBuilder.CreateIndex(
            name:    "ix_orders_owner_deleted",
            table:   "appraisal_orders",
            columns: new[] { "created_by_user_id", "is_deleted" });

        migrationBuilder.CreateIndex(
            name:    "ix_orders_owner_status",
            table:   "appraisal_orders",
            columns: new[] { "created_by_user_id", "status" });

        // ── Indeks za datum-range filter ("Kreirano od/do") ──────────────────────────
        migrationBuilder.CreateIndex(
            name:   "ix_orders_created_at",
            table:  "appraisal_orders",
            column: "created_at");

        // ── Parcijalni indeks — samo aktivne narudžbe (WHERE is_deleted = false) ─────
        // Koristiti za SELECT WHERE status = ? AND is_deleted = false (česte pretrage).
        migrationBuilder.Sql(@"
            CREATE INDEX IF NOT EXISTS ix_orders_status_active
                ON appraisal_orders (status)
                WHERE is_deleted = false;");

        // ── PostgreSQL trigger funkcija: auto-update updated_at pri svakom UPDATE-u ──
        // Safety-net u slučaju da aplikacijska logika zaboravi pozvati SetUpdatedAt().
        migrationBuilder.Sql(@"
            CREATE OR REPLACE FUNCTION fn_set_updated_at()
            RETURNS TRIGGER LANGUAGE plpgsql AS $$
            BEGIN
                NEW.updated_at = (now() AT TIME ZONE 'UTC');
                RETURN NEW;
            END;
            $$;

            DROP TRIGGER IF EXISTS trg_appraisal_orders_set_updated_at ON appraisal_orders;
            CREATE TRIGGER trg_appraisal_orders_set_updated_at
                BEFORE UPDATE ON appraisal_orders
                FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(@"
            DROP TRIGGER IF EXISTS trg_appraisal_orders_set_updated_at ON appraisal_orders;
            DROP FUNCTION IF EXISTS fn_set_updated_at();
            DROP INDEX IF EXISTS ix_orders_status_active;");

        migrationBuilder.DropIndex(
            name:  "ix_orders_created_at",
            table: "appraisal_orders");

        migrationBuilder.DropIndex(
            name:  "ix_orders_owner_status",
            table: "appraisal_orders");

        migrationBuilder.DropIndex(
            name:  "ix_orders_owner_deleted",
            table: "appraisal_orders");
    }
}
