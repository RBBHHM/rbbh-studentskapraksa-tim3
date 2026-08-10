using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Praksa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRequestDateFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "RequestReceivedAt",
                table: "appraisal_orders",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RequestSentAt",
                table: "appraisal_orders",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequestReceivedAt",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "RequestSentAt",
                table: "appraisal_orders");
        }
    }
}
