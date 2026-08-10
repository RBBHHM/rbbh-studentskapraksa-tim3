using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Praksa.Infrastructure.Migrations;

/// <inheritdoc />
public partial class AddNotifications : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "notifications",
            columns: table => new
            {
                id                  = table.Column<int>(nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                recipient_user_id   = table.Column<string>(maxLength: 128, nullable: true),
                recipient_role      = table.Column<string>(maxLength: 128, nullable: true),
                channel             = table.Column<int>(nullable: false),
                subject             = table.Column<string>(maxLength: 256, nullable: false),
                message             = table.Column<string>(nullable: false),
                status              = table.Column<int>(nullable: false, defaultValue: 0),
                sent_at             = table.Column<DateTime>(nullable: true),
                retry_count         = table.Column<int>(nullable: false, defaultValue: 0),
                error_message       = table.Column<string>(nullable: true),
                related_entity_type = table.Column<string>(maxLength: 128, nullable: true),
                related_entity_id   = table.Column<string>(maxLength: 128, nullable: true),
                is_read             = table.Column<bool>(nullable: false, defaultValue: false),
                read_at             = table.Column<DateTime>(nullable: true),
                created_at          = table.Column<DateTime>(nullable: false),
                updated_at          = table.Column<DateTime>(nullable: true)
            },
            constraints: table => table.PrimaryKey("PK_notifications", x => x.id));

        migrationBuilder.CreateIndex(
            name: "IX_notifications_recipient_user_id",
            table: "notifications",
            column: "recipient_user_id");

        migrationBuilder.CreateIndex(
            name: "IX_notifications_status",
            table: "notifications",
            column: "status");

        migrationBuilder.CreateIndex(
            name: "IX_notifications_recipient_user_id_is_read",
            table: "notifications",
            columns: new[] { "recipient_user_id", "is_read" });
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable("notifications");
    }
}
