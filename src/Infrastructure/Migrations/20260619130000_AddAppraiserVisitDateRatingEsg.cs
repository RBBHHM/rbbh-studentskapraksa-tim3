using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Praksa.Infrastructure.Persistence;

#nullable disable

namespace Praksa.Infrastructure.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20260619130000_AddAppraiserVisitDateRatingEsg")]
public partial class AddAppraiserVisitDateRatingEsg : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(
            "ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS appraiser_visit_date timestamp with time zone;");

        migrationBuilder.Sql(
            "ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS appraiser_rating integer;");

        migrationBuilder.Sql(
            "ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS esg_certificate character varying(200);");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS esg_certificate;");
        migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS appraiser_rating;");
        migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS appraiser_visit_date;");
    }
}
