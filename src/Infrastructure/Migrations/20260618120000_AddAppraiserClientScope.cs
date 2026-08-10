using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Praksa.Infrastructure.Persistence;

#nullable disable

namespace Praksa.Infrastructure.Migrations;

/// <summary>
/// Dodaje "client_scope" na appraisers — vrsta klijenata (FL/PL/oboje) koju vještak
/// smije procjenjivati. Određuje da li mu CA smije dodijeliti narudžbu (FL/PL matching).
/// 0=Sve, 1=FizičkaLica, 2=PravnaLica.
/// </summary>
[DbContext(typeof(ApplicationDbContext))]
[Migration("20260618120000_AddAppraiserClientScope")]
public partial class AddAppraiserClientScope : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(
            "ALTER TABLE appraisers ADD COLUMN IF NOT EXISTS client_scope integer NOT NULL DEFAULT 0;");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(
            "ALTER TABLE appraisers DROP COLUMN IF EXISTS client_scope;");
    }
}
