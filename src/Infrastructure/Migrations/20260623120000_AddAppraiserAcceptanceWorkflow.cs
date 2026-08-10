using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Praksa.Infrastructure.Persistence;

#nullable disable

namespace Praksa.Infrastructure.Migrations;

/// <summary>
/// Dodaje:
/// - order_declined_appraisers — evidencija vještaka koji su odbili ili prekoračili 24h rok za narudžbu
/// - sent_to_appraiser_at na appraisal_orders — za praćenje 24h roka prihvatanja
/// </summary>
[DbContext(typeof(ApplicationDbContext))]
[Migration("20260623120000_AddAppraiserAcceptanceWorkflow")]
public partial class AddAppraiserAcceptanceWorkflow : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // Polje za praćenje vremena slanja narudžbe vještaku (24h timeout).
        migrationBuilder.Sql(
            "ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS sent_to_appraiser_at timestamp with time zone;");

        // Evidencija odbijenih/timeout vještaka po narudžbi.
        migrationBuilder.Sql("""
            CREATE TABLE IF NOT EXISTS order_declined_appraisers (
                id                   serial PRIMARY KEY,
                appraisal_order_id   integer NOT NULL,
                appraiser_id         integer NOT NULL,
                declined_at          timestamp with time zone NOT NULL,
                reason               integer NOT NULL,
                free_text            varchar(1000),
                is_timeout           boolean NOT NULL DEFAULT false
            );
            """);

        migrationBuilder.Sql(
            "CREATE INDEX IF NOT EXISTS ix_order_declined_appraisers_order_id ON order_declined_appraisers(appraisal_order_id);");
        migrationBuilder.Sql(
            "CREATE INDEX IF NOT EXISTS ix_order_declined_appraisers_order_appraiser ON order_declined_appraisers(appraisal_order_id, appraiser_id);");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("DROP TABLE IF EXISTS order_declined_appraisers;");
        migrationBuilder.Sql(
            "ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS sent_to_appraiser_at;");
    }
}
