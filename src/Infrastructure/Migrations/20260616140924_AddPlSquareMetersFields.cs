using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Praksa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPlSquareMetersFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "SquareMetersCommercial",
                table: "appraisal_orders",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "SquareMetersResidential",
                table: "appraisal_orders",
                type: "numeric",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SquareMetersCommercial",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "SquareMetersResidential",
                table: "appraisal_orders");
        }
    }
}
