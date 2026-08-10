using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Praksa.Infrastructure.Persistence;

#nullable disable

namespace Praksa.Infrastructure.Migrations;

/// <summary>
/// Dodaje:
/// 1. invoice_sent_date, invoice_received_date na appraisal_orders (US1 — faktura datumi)
/// 2. supported_property_types na appraisers (US11 — tipovi nekretnina koje vještak pokriva)
/// </summary>
[DbContext(typeof(ApplicationDbContext))]
[Migration("20260618140000_AddInvoiceDatesAndPropertyTypes")]
public partial class AddInvoiceDatesAndPropertyTypes : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(
            "ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_sent_date timestamp with time zone;");

        migrationBuilder.Sql(
            "ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_received_date timestamp with time zone;");

        migrationBuilder.Sql(
            "ALTER TABLE appraisers ADD COLUMN IF NOT EXISTS supported_property_types character varying(500);");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(
            "ALTER TABLE appraisers DROP COLUMN IF EXISTS supported_property_types;");

        migrationBuilder.Sql(
            "ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS invoice_received_date;");

        migrationBuilder.Sql(
            "ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS invoice_sent_date;");
    }
}
