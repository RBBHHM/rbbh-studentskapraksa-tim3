using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Praksa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSalesConsentToAppraisalOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appraisal_orders_branches_branch_id",
                table: "appraisal_orders");

            migrationBuilder.DropForeignKey(
                name: "FK_appraisal_orders_cities_city_id",
                table: "appraisal_orders");

            migrationBuilder.DropIndex(
                name: "IX_appraisal_orders_branch_id",
                table: "appraisal_orders");

            migrationBuilder.DropIndex(
                name: "IX_appraisal_orders_city_id",
                table: "appraisal_orders");

            migrationBuilder.AlterColumn<decimal>(
                name: "square_meters_residential",
                table: "appraisal_orders",
                type: "numeric",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(12,2)",
                oldPrecision: 12,
                oldScale: 2,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "square_meters_commercial",
                table: "appraisal_orders",
                type: "numeric",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(12,2)",
                oldPrecision: 12,
                oldScale: 2,
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "SalesConsentSigned",
                table: "appraisal_orders",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "SalesConsentSignedAt",
                table: "appraisal_orders",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SalesConsentSignedByName",
                table: "appraisal_orders",
                type: "text",
                nullable: true);

            // document_templates tabela je već kreirana migracijom 20260621120000_AddDocumentTemplates.
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // document_templates tabela se ne briše ovdje — kreirana je i upravlja se migracijom 20260621120000_AddDocumentTemplates.

            migrationBuilder.DropColumn(
                name: "SalesConsentSigned",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "SalesConsentSignedAt",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "SalesConsentSignedByName",
                table: "appraisal_orders");

            migrationBuilder.AlterColumn<decimal>(
                name: "square_meters_residential",
                table: "appraisal_orders",
                type: "numeric(12,2)",
                precision: 12,
                scale: 2,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "square_meters_commercial",
                table: "appraisal_orders",
                type: "numeric(12,2)",
                precision: 12,
                scale: 2,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_appraisal_orders_branch_id",
                table: "appraisal_orders",
                column: "branch_id");

            migrationBuilder.CreateIndex(
                name: "IX_appraisal_orders_city_id",
                table: "appraisal_orders",
                column: "city_id");

            migrationBuilder.AddForeignKey(
                name: "FK_appraisal_orders_branches_branch_id",
                table: "appraisal_orders",
                column: "branch_id",
                principalTable: "branches",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_appraisal_orders_cities_city_id",
                table: "appraisal_orders",
                column: "city_id",
                principalTable: "cities",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
