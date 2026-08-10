using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Praksa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDocumentVersioningAndDeactivation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "deactivated_at",
                table: "documents",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "deactivated_by_user_id",
                table: "documents",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "deactivation_reason",
                table: "documents",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            // Default TRUE — postojeći dokumenti (uploadovani prije ove migracije) moraju
            // ostati aktivni, IsActive=false bi ih netačno prikazalo kao "deaktivirane".
            migrationBuilder.AddColumn<bool>(
                name: "is_active",
                table: "documents",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "previous_version_id",
                table: "documents",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_documents_is_active",
                table: "documents",
                column: "is_active");

            migrationBuilder.CreateIndex(
                name: "IX_documents_previous_version_id",
                table: "documents",
                column: "previous_version_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_documents_is_active",
                table: "documents");

            migrationBuilder.DropIndex(
                name: "IX_documents_previous_version_id",
                table: "documents");

            migrationBuilder.DropColumn(
                name: "deactivated_at",
                table: "documents");

            migrationBuilder.DropColumn(
                name: "deactivated_by_user_id",
                table: "documents");

            migrationBuilder.DropColumn(
                name: "deactivation_reason",
                table: "documents");

            migrationBuilder.DropColumn(
                name: "is_active",
                table: "documents");

            migrationBuilder.DropColumn(
                name: "previous_version_id",
                table: "documents");
        }
    }
}
