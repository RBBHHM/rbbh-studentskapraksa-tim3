using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Praksa.Infrastructure.Persistence;

#nullable disable

namespace Praksa.Infrastructure.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20260620130000_AddPaymentConsentAndGaps")]
public partial class AddPaymentConsentAndGaps : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(
            "ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS payment_consent_status character varying(100);");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS payment_consent_status;");
    }
}
