using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Praksa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAuditLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "audit_logs",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TimestampUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ActorUserId = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    ActorUsername = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    ActorRole = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    Action = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    OperationType = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Module = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    SourceSystem = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    SourceConnectionName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    SourceDatabase = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    SourceSchema = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    SourceTable = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    EntityType = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    EntityKey = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    EntityDisplayName = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    OldValuesJson = table.Column<string>(type: "jsonb", nullable: true),
                    NewValuesJson = table.Column<string>(type: "jsonb", nullable: true),
                    ChangedFieldsJson = table.Column<string>(type: "jsonb", nullable: true),
                    Status = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Severity = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    Reason = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    IntegrationDirection = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: true),
                    ExternalRequestId = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    ExternalResponseStatus = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    CorrelationId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    RequestPath = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    HttpMethod = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    IpAddress = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    UserAgent = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_audit_logs", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_audit_logs_action",
                table: "audit_logs",
                column: "Action");

            migrationBuilder.CreateIndex(
                name: "ix_audit_logs_actor_user_id",
                table: "audit_logs",
                column: "ActorUserId");

            migrationBuilder.CreateIndex(
                name: "ix_audit_logs_correlation_id",
                table: "audit_logs",
                column: "CorrelationId");

            migrationBuilder.CreateIndex(
                name: "ix_audit_logs_entity_type_key",
                table: "audit_logs",
                columns: new[] { "EntityType", "EntityKey" });

            migrationBuilder.CreateIndex(
                name: "ix_audit_logs_module",
                table: "audit_logs",
                column: "Module");

            migrationBuilder.CreateIndex(
                name: "ix_audit_logs_severity",
                table: "audit_logs",
                column: "Severity");

            migrationBuilder.CreateIndex(
                name: "ix_audit_logs_source_system",
                table: "audit_logs",
                column: "SourceSystem");

            migrationBuilder.CreateIndex(
                name: "ix_audit_logs_status",
                table: "audit_logs",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "ix_audit_logs_timestamp_utc",
                table: "audit_logs",
                column: "TimestampUtc");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "audit_logs");
        }
    }
}
