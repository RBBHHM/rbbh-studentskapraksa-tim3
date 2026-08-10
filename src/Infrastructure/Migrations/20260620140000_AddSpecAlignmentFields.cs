using System;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Praksa.Infrastructure.Persistence;

#nullable disable

namespace Praksa.Infrastructure.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20260620140000_AddSpecAlignmentFields")]
public partial class AddSpecAlignmentFields : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // Sve operacije su idempotentne (IF NOT EXISTS) jer ova migracija može naći
        // kolone već dodane naknadnim migracijama primijenjenim ranije (out-of-order).
        migrationBuilder.Sql("ALTER TABLE appraisers ADD COLUMN IF NOT EXISTS supported_cities character varying(1000);");
        migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS appraisal_fee numeric(18,2);");
        migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS collateral_status character varying(100);");
        migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS order_sent_to_appraiser_at timestamptz;");
        migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS signed_documents_received_at timestamptz;");
        migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS documentation_supplement_at timestamptz;");
        migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS appraisal_delivered_to_co_at timestamptz;");
        migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS correction_requested_at timestamptz;");
        migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS corrected_appraisal_received_at timestamptz;");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(name: "supported_cities", table: "appraisers");
        migrationBuilder.DropColumn(name: "appraisal_fee", table: "appraisal_orders");
        migrationBuilder.DropColumn(name: "collateral_status", table: "appraisal_orders");
        migrationBuilder.DropColumn(name: "order_sent_to_appraiser_at", table: "appraisal_orders");
        migrationBuilder.DropColumn(name: "signed_documents_received_at", table: "appraisal_orders");
        migrationBuilder.DropColumn(name: "documentation_supplement_at", table: "appraisal_orders");
        migrationBuilder.DropColumn(name: "appraisal_delivered_to_co_at", table: "appraisal_orders");
        migrationBuilder.DropColumn(name: "correction_requested_at", table: "appraisal_orders");
        migrationBuilder.DropColumn(name: "corrected_appraisal_received_at", table: "appraisal_orders");
    }
}
