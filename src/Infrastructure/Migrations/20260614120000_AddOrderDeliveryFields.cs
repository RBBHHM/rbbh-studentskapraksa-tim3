using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Praksa.Infrastructure.Persistence;

#nullable disable

namespace Praksa.Infrastructure.Migrations;

/// <summary>
/// US-1/US-2 FL/PL spec: dodaje "Inicirao (Ime AM/SM/UB)", "Osoba u poslovnici za dostavu
/// originala procjene" i "Ime AM na kojeg se šalje procjena mailom" na appraisal_orders.
/// </summary>
[DbContext(typeof(ApplicationDbContext))]
[Migration("20260614120000_AddOrderDeliveryFields")]
public partial class AddOrderDeliveryFields : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>(
            name:      "created_by_name",
            table:     "appraisal_orders",
            maxLength: 300,
            nullable:  true);

        migrationBuilder.AddColumn<string>(
            name:      "delivery_contact_name",
            table:     "appraisal_orders",
            maxLength: 300,
            nullable:  true);

        migrationBuilder.AddColumn<string>(
            name:      "am_recipient_name",
            table:     "appraisal_orders",
            maxLength: 300,
            nullable:  true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(name: "am_recipient_name",     table: "appraisal_orders");
        migrationBuilder.DropColumn(name: "delivery_contact_name", table: "appraisal_orders");
        migrationBuilder.DropColumn(name: "created_by_name",       table: "appraisal_orders");
    }
}
