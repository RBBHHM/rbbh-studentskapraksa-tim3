using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Praksa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixCodebookValueIndexFilterAndQueryFilters : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Napomena: FK_task_items_appraisal_orders_appraisal_order_id već postoji u bazi
            // (kreiran u 20260603120000_AddCoreBusinessEntities, sa istim Cascade ponašanjem) —
            // snapshot ga ranije nije sadržavao, ovdje samo dopunjujemo snapshot bez DDL-a.

            migrationBuilder.DropIndex(
                name: "uix_codebook_values_key_code_active",
                table: "codebook_values");

            migrationBuilder.CreateIndex(
                name: "uix_codebook_values_key_code_active",
                table: "codebook_values",
                columns: new[] { "CodebookKey", "Code" },
                unique: true,
                filter: "\"DeletedAt\" IS NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "uix_codebook_values_key_code_active",
                table: "codebook_values");

            migrationBuilder.CreateIndex(
                name: "uix_codebook_values_key_code_active",
                table: "codebook_values",
                columns: new[] { "CodebookKey", "Code" },
                unique: true,
                filter: "deleted_at IS NULL");
        }
    }
}
