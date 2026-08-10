using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Praksa.Infrastructure.Persistence;

#nullable disable

namespace Praksa.Infrastructure.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20260620120000_AddInvoiceWorkflow")]
public partial class AddInvoiceWorkflow : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(
            "ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_status integer NOT NULL DEFAULT 0;");

        migrationBuilder.Sql(
            "ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_document_id integer;");

        migrationBuilder.Sql(
            "ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_uploaded_by_user_id character varying(100);");

        migrationBuilder.Sql(
            "ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_uploaded_by_name character varying(300);");

        migrationBuilder.Sql(
            "ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_uploaded_at timestamp with time zone;");

        migrationBuilder.Sql(
            "ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_sent_for_payment_by_user_id character varying(100);");

        migrationBuilder.Sql(
            "ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_sent_for_payment_by_name character varying(300);");

        migrationBuilder.Sql(
            "ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_sent_for_payment_at timestamp with time zone;");

        migrationBuilder.Sql(
            "ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_paid_by_user_id character varying(100);");

        migrationBuilder.Sql(
            "ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_paid_by_name character varying(300);");

        migrationBuilder.Sql(
            "ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_paid_at timestamp with time zone;");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS invoice_paid_at;");
        migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS invoice_paid_by_name;");
        migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS invoice_paid_by_user_id;");
        migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS invoice_sent_for_payment_at;");
        migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS invoice_sent_for_payment_by_name;");
        migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS invoice_sent_for_payment_by_user_id;");
        migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS invoice_uploaded_at;");
        migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS invoice_uploaded_by_name;");
        migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS invoice_uploaded_by_user_id;");
        migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS invoice_document_id;");
        migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS invoice_status;");
    }
}
