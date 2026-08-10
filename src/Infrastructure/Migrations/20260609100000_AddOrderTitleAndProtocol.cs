using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using Praksa.Infrastructure.Persistence;

#nullable disable

namespace Praksa.Infrastructure.Migrations;

/// <summary>
/// US-1 i US-2: Dodaje title kolonu na appraisal_orders i kreira order_protocol_entries tabelu.
/// </summary>
[DbContext(typeof(ApplicationDbContext))]
[Migration("20260609100000_AddOrderTitleAndProtocol")]
public partial class AddOrderTitleAndProtocol : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // ── Dodati title kolonu na appraisal_orders ───────────────────────
        migrationBuilder.AddColumn<string>(
            name:      "title",
            table:     "appraisal_orders",
            maxLength: 500,
            nullable:  false,
            defaultValue: "");

        // ── Kreirati order_protocol_entries ──────────────────────────────
        migrationBuilder.CreateTable(
            name: "order_protocol_entries",
            columns: table => new
            {
                id                    = table.Column<int>(nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy",
                        NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                order_id              = table.Column<int>(nullable: false),
                protocol_number       = table.Column<string>(maxLength: 20, nullable: false),
                protocol_year         = table.Column<int>(nullable: false),
                protocol_sequence     = table.Column<int>(nullable: false),
                generated_at          = table.Column<DateTime>(nullable: false),
                generated_by_user_id  = table.Column<string>(maxLength: 100, nullable: false),
                status                = table.Column<int>(nullable: false, defaultValue: 0),
                created_at            = table.Column<DateTime>(nullable: false),
                updated_at            = table.Column<DateTime>(nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_order_protocol_entries", x => x.id);
                table.ForeignKey(
                    name:                 "FK_order_protocol_entries_appraisal_orders_order_id",
                    column:               x => x.order_id,
                    principalTable:       "appraisal_orders",
                    principalColumn:      "id",
                    onDelete:             ReferentialAction.Restrict);
            });

        migrationBuilder.CreateIndex(
            name:    "IX_order_protocol_entries_order_id",
            table:   "order_protocol_entries",
            column:  "order_id",
            unique:  true);

        migrationBuilder.CreateIndex(
            name:    "IX_order_protocol_entries_protocol_number",
            table:   "order_protocol_entries",
            column:  "protocol_number",
            unique:  true);

        migrationBuilder.CreateIndex(
            name:    "IX_order_protocol_entries_year_sequence",
            table:   "order_protocol_entries",
            columns: ["protocol_year", "protocol_sequence"],
            unique:  true);

        migrationBuilder.CreateIndex(
            name:   "IX_order_protocol_entries_protocol_year",
            table:  "order_protocol_entries",
            column: "protocol_year");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "order_protocol_entries");

        migrationBuilder.DropColumn(
            name:  "title",
            table: "appraisal_orders");
    }
}
