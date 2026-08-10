using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Praksa.Infrastructure.Persistence;

#nullable disable

namespace Praksa.Infrastructure.Migrations;

/// <summary>
/// FL/PL spec (Slika 7.1): dodaje "workflow_type" na appraisal_orders — tip workflow-a
/// (1=FizičkaLica, 2=PravnaLica) odabran na ulaznom ekranu, određuje routing i lanac rola.
/// Nullable radi postojećih nacrta kreiranih prije uvođenja eksplicitnog odabira.
/// </summary>
[DbContext(typeof(ApplicationDbContext))]
[Migration("20260617120000_AddWorkflowType")]
public partial class AddWorkflowType : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // Self-healing: ranija (odbačena) migracija je na nekim bazama kreirala
        // workflow_type kao VARCHAR ("FL"/"PL"), dok model očekuje integer (enum:
        // FizičkaLica=1, PravnaLica=2). Ovaj blok pokriva sva stanja:
        //   - kolona ne postoji  → kreiraj kao integer
        //   - kolona je varchar  → konvertuj u integer uz mapiranje starih vrijednosti
        //   - kolona je već integer → ne diraj
        migrationBuilder.Sql(@"
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'appraisal_orders' AND column_name = 'workflow_type'
    ) THEN
        ALTER TABLE appraisal_orders ADD COLUMN workflow_type integer;
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'appraisal_orders' AND column_name = 'workflow_type'
          AND data_type = 'character varying'
    ) THEN
        ALTER TABLE appraisal_orders
            ALTER COLUMN workflow_type TYPE integer
            USING (CASE workflow_type
                WHEN 'FL' THEN 1 WHEN 'PL' THEN 2
                WHEN 'FizickaLica' THEN 1 WHEN 'PravnaLica' THEN 2
                WHEN '1' THEN 1 WHEN '2' THEN 2
                ELSE NULL END);
    END IF;
END $$;");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(
            "ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS workflow_type;");
    }
}
