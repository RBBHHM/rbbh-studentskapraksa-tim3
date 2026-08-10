using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Praksa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAuditOutbox : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS "AuditOutbox" (
                    "Id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    "Payload" text NOT NULL,
                    "CreatedAt" timestamptz NOT NULL,
                    "ProcessedAt" timestamptz NULL
                );
                """);

            migrationBuilder.Sql("""
                CREATE INDEX IF NOT EXISTS "IX_AuditOutbox_Unprocessed"
                ON "AuditOutbox" ("ProcessedAt", "CreatedAt")
                WHERE "ProcessedAt" IS NULL;
                """);

            // order_declined_appraisers je već kreirana u 20260623120000_AddAppraiserAcceptanceWorkflow
            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS order_declined_appraisers (
                    id serial PRIMARY KEY,
                    appraisal_order_id integer NOT NULL,
                    appraiser_id integer NOT NULL,
                    declined_at timestamptz NOT NULL,
                    reason integer NOT NULL,
                    free_text character varying(1000) NULL,
                    is_timeout boolean NOT NULL
                );
                """);

            migrationBuilder.Sql("CREATE INDEX IF NOT EXISTS ix_order_declined_appraisers_order_appraiser ON order_declined_appraisers (appraisal_order_id, appraiser_id);");
            migrationBuilder.Sql("CREATE INDEX IF NOT EXISTS ix_order_declined_appraisers_order_id ON order_declined_appraisers (appraisal_order_id);");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditOutbox");

            migrationBuilder.DropTable(
                name: "order_declined_appraisers");
        }
    }
}
