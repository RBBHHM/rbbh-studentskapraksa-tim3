using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Praksa.Infrastructure.Persistence;

#nullable disable

namespace Praksa.Infrastructure.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20260621110000_AddCityBranchForeignKeys")]
public partial class AddCityBranchForeignKeys : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS city_id integer;");
        migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS branch_id integer;");

        // Koristimo iste nazive kao u 20260622192543 da IF NOT EXISTS pronađe postojeće
        migrationBuilder.Sql("""CREATE INDEX IF NOT EXISTS "IX_appraisal_orders_city_id" ON appraisal_orders (city_id);""");
        migrationBuilder.Sql("""CREATE INDEX IF NOT EXISTS "IX_appraisal_orders_branch_id" ON appraisal_orders (branch_id);""");

        migrationBuilder.Sql("""
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_appraisal_orders_cities_city_id') THEN
                    ALTER TABLE appraisal_orders ADD CONSTRAINT "FK_appraisal_orders_cities_city_id"
                        FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE RESTRICT;
                END IF;
            END $$;
            """);

        migrationBuilder.Sql("""
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_appraisal_orders_branches_branch_id') THEN
                    ALTER TABLE appraisal_orders ADD CONSTRAINT "FK_appraisal_orders_branches_branch_id"
                        FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE RESTRICT;
                END IF;
            END $$;
            """);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(name: "FK_appraisal_orders_branches_branch_id", table: "appraisal_orders");
        migrationBuilder.DropForeignKey(name: "FK_appraisal_orders_cities_city_id", table: "appraisal_orders");
        migrationBuilder.DropIndex(name: "IX_appraisal_orders_branch_id", table: "appraisal_orders");
        migrationBuilder.DropIndex(name: "IX_appraisal_orders_city_id", table: "appraisal_orders");
        migrationBuilder.DropColumn(name: "branch_id", table: "appraisal_orders");
        migrationBuilder.DropColumn(name: "city_id", table: "appraisal_orders");
    }
}
