using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Praksa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBusinessWorkflowFields_92_93_94 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ── Finalna procjena / odobrenje CO (US 93) ──────────────────────
            migrationBuilder.AddColumn<int>(
                name: "final_appraisal_document_id",
                table: "appraisal_orders",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "co_approved_at",
                table: "appraisal_orders",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "co_approved_by_user_id",
                table: "appraisal_orders",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ready_for_procedure_at",
                table: "appraisal_orders",
                type: "timestamp with time zone",
                nullable: true);

            // ── Original procjene u poslovnici (US 93) ───────────────────────
            migrationBuilder.AddColumn<DateTime>(
                name: "original_received_at",
                table: "appraisal_orders",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "original_received_by_user_id",
                table: "appraisal_orders",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "appraiser_reminder_count",
                table: "appraisal_orders",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "appraiser_reminder_last_sent_at",
                table: "appraisal_orders",
                type: "timestamp with time zone",
                nullable: true);

            // ── Mišljenja CO i Pravne službe (US 94) ─────────────────────────
            migrationBuilder.AddColumn<DateTime>(
                name: "opinions_completed_at",
                table: "appraisal_orders",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "order_opinions",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    appraisal_order_id = table.Column<int>(type: "integer", nullable: false),
                    opinion_type = table.Column<int>(type: "integer", nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false),
                    document_id = table.Column<int>(type: "integer", nullable: true),
                    imported_by_user_id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    imported_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    comment = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_order_opinions", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_order_opinions_appraisal_order_id",
                table: "order_opinions",
                column: "appraisal_order_id");

            migrationBuilder.CreateIndex(
                name: "IX_order_opinions_appraisal_order_id_opinion_type",
                table: "order_opinions",
                columns: new[] { "appraisal_order_id", "opinion_type" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "order_opinions");

            migrationBuilder.DropColumn(
                name: "final_appraisal_document_id",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "co_approved_at",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "co_approved_by_user_id",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "ready_for_procedure_at",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "original_received_at",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "original_received_by_user_id",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "appraiser_reminder_count",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "appraiser_reminder_last_sent_at",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "opinions_completed_at",
                table: "appraisal_orders");
        }
    }
}
