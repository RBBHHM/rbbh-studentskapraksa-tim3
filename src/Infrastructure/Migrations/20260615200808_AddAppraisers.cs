using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Praksa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAppraisers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_order_protocol_entries_appraisal_orders_order_id",
                table: "order_protocol_entries");

            migrationBuilder.CreateTable(
                name: "appraisers",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    city = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    legal_form = table.Column<int>(type: "integer", nullable: false),
                    is_on_leave = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    is_blacklisted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    contact_email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    contact_phone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    notes = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_appraisers", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_appraisal_orders_appraiser_id",
                table: "appraisal_orders",
                column: "appraiser_id");

            migrationBuilder.CreateIndex(
                name: "IX_appraisers_city",
                table: "appraisers",
                column: "city");

            migrationBuilder.CreateIndex(
                name: "IX_appraisers_is_active",
                table: "appraisers",
                column: "is_active");

            migrationBuilder.CreateIndex(
                name: "IX_appraisers_is_blacklisted",
                table: "appraisers",
                column: "is_blacklisted");

            migrationBuilder.CreateIndex(
                name: "IX_appraisers_is_on_leave",
                table: "appraisers",
                column: "is_on_leave");

            migrationBuilder.AddForeignKey(
                name: "FK_appraisal_orders_appraisers_appraiser_id",
                table: "appraisal_orders",
                column: "appraiser_id",
                principalTable: "appraisers",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_order_protocol_entries_appraisal_orders_order_id",
                table: "order_protocol_entries",
                column: "order_id",
                principalTable: "appraisal_orders",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appraisal_orders_appraisers_appraiser_id",
                table: "appraisal_orders");

            migrationBuilder.DropForeignKey(
                name: "FK_order_protocol_entries_appraisal_orders_order_id",
                table: "order_protocol_entries");

            migrationBuilder.DropTable(
                name: "appraisers");

            migrationBuilder.DropIndex(
                name: "IX_appraisal_orders_appraiser_id",
                table: "appraisal_orders");

            migrationBuilder.AddForeignKey(
                name: "FK_order_protocol_entries_appraisal_orders_order_id",
                table: "order_protocol_entries",
                column: "order_id",
                principalTable: "appraisal_orders",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
