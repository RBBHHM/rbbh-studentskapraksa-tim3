using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Praksa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAuditLogFullNameAndActiveRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ActiveRole",
                table: "audit_logs",
                type: "character varying(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ActorFullName",
                table: "audit_logs",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_audit_logs_active_role",
                table: "audit_logs",
                column: "ActiveRole");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_audit_logs_active_role",
                table: "audit_logs");

            migrationBuilder.DropColumn(
                name: "ActiveRole",
                table: "audit_logs");

            migrationBuilder.DropColumn(
                name: "ActorFullName",
                table: "audit_logs");
        }
    }
}
