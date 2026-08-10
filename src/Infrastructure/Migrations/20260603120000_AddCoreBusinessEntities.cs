using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Praksa.Infrastructure.Migrations;

/// <inheritdoc />
public partial class AddCoreBusinessEntities : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // ── appraisal_orders ──────────────────────────────────────────────
        migrationBuilder.CreateTable(
            name: "appraisal_orders",
            columns: table => new
            {
                id                        = table.Column<int>(nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                order_number              = table.Column<string>(maxLength: 50, nullable: false),
                status                    = table.Column<int>(nullable: false, defaultValue: 0),
                client_name               = table.Column<string>(maxLength: 300, nullable: false),
                client_type               = table.Column<string>(maxLength: 50, nullable: true),
                client_identifier         = table.Column<string>(maxLength: 50, nullable: true),
                contact_name              = table.Column<string>(maxLength: 300, nullable: true),
                contact_phone             = table.Column<string>(maxLength: 50, nullable: true),
                contact_email             = table.Column<string>(maxLength: 200, nullable: true),
                branch                    = table.Column<string>(maxLength: 200, nullable: true),
                branch_address            = table.Column<string>(maxLength: 400, nullable: true),
                city                      = table.Column<string>(maxLength: 100, nullable: true),
                collateral_type_id        = table.Column<int>(nullable: true),
                combined_collateral_type_id = table.Column<int>(nullable: true),
                property_address          = table.Column<string>(maxLength: 500, nullable: true),
                created_by_user_id        = table.Column<string>(maxLength: 100, nullable: true),
                created_by_role           = table.Column<string>(maxLength: 100, nullable: true),
                accepted_by_ca_user_id    = table.Column<string>(maxLength: 100, nullable: true),
                accepted_at               = table.Column<DateTime>(nullable: true),
                submitted_at              = table.Column<DateTime>(nullable: true),
                appraiser_id              = table.Column<int>(nullable: true),
                internal_note             = table.Column<string>(maxLength: 2000, nullable: true),
                is_deleted                = table.Column<bool>(nullable: false, defaultValue: false),
                deleted_at                = table.Column<DateTime>(nullable: true),
                deleted_by_user_id        = table.Column<string>(maxLength: 100, nullable: true),
                created_at                = table.Column<DateTime>(nullable: false),
                updated_at                = table.Column<DateTime>(nullable: true)
            },
            constraints: table => table.PrimaryKey("PK_appraisal_orders", x => x.id));

        migrationBuilder.CreateIndex(
            name: "IX_appraisal_orders_order_number", table: "appraisal_orders",
            column: "order_number", unique: true);
        migrationBuilder.CreateIndex(
            name: "IX_appraisal_orders_status", table: "appraisal_orders", column: "status");
        migrationBuilder.CreateIndex(
            name: "IX_appraisal_orders_created_by_user_id", table: "appraisal_orders", column: "created_by_user_id");
        migrationBuilder.CreateIndex(
            name: "IX_appraisal_orders_is_deleted", table: "appraisal_orders", column: "is_deleted");

        // ── task_items ────────────────────────────────────────────────────
        migrationBuilder.CreateTable(
            name: "task_items",
            columns: table => new
            {
                id                   = table.Column<int>(nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                appraisal_order_id   = table.Column<int>(nullable: false),
                task_type            = table.Column<int>(nullable: false),
                title                = table.Column<string>(maxLength: 300, nullable: false),
                description          = table.Column<string>(maxLength: 2000, nullable: true),
                assigned_role        = table.Column<string>(maxLength: 100, nullable: true),
                assigned_user_id     = table.Column<string>(maxLength: 100, nullable: true),
                status               = table.Column<int>(nullable: false, defaultValue: 0),
                accepted_at          = table.Column<DateTime>(nullable: true),
                accepted_by_user_id  = table.Column<string>(maxLength: 100, nullable: true),
                completed_at         = table.Column<DateTime>(nullable: true),
                completed_by_user_id = table.Column<string>(maxLength: 100, nullable: true),
                due_date             = table.Column<DateTime>(nullable: true),
                comment              = table.Column<string>(maxLength: 2000, nullable: true),
                is_locked            = table.Column<bool>(nullable: false, defaultValue: false),
                created_at           = table.Column<DateTime>(nullable: false),
                updated_at           = table.Column<DateTime>(nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_task_items", x => x.id);
                table.ForeignKey(
                    name: "FK_task_items_appraisal_orders_appraisal_order_id",
                    column: x => x.appraisal_order_id,
                    principalTable: "appraisal_orders",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(
            name: "IX_task_items_appraisal_order_id", table: "task_items", column: "appraisal_order_id");
        migrationBuilder.CreateIndex(
            name: "IX_task_items_status", table: "task_items", column: "status");
        migrationBuilder.CreateIndex(
            name: "IX_task_items_assigned_role", table: "task_items", column: "assigned_role");
        migrationBuilder.CreateIndex(
            name: "IX_task_items_assigned_user_id", table: "task_items", column: "assigned_user_id");

        // ── documents ─────────────────────────────────────────────────────
        migrationBuilder.CreateTable(
            name: "documents",
            columns: table => new
            {
                id                 = table.Column<int>(nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                appraisal_order_id = table.Column<int>(nullable: false),
                document_type_id   = table.Column<int>(nullable: true),
                file_name          = table.Column<string>(maxLength: 500, nullable: false),
                original_file_name = table.Column<string>(maxLength: 500, nullable: false),
                content_type       = table.Column<string>(maxLength: 200, nullable: true),
                file_size          = table.Column<long>(nullable: false),
                storage_path       = table.Column<string>(maxLength: 1000, nullable: false),
                uploaded_by_user_id = table.Column<string>(maxLength: 100, nullable: true),
                uploaded_at        = table.Column<DateTime>(nullable: false),
                version            = table.Column<int>(nullable: false, defaultValue: 1),
                is_deleted         = table.Column<bool>(nullable: false, defaultValue: false),
                deleted_at         = table.Column<DateTime>(nullable: true),
                deleted_by_user_id = table.Column<string>(maxLength: 100, nullable: true),
                created_at         = table.Column<DateTime>(nullable: false),
                updated_at         = table.Column<DateTime>(nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_documents", x => x.id);
                table.ForeignKey(
                    name: "FK_documents_appraisal_orders_appraisal_order_id",
                    column: x => x.appraisal_order_id,
                    principalTable: "appraisal_orders",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(
            name: "IX_documents_appraisal_order_id", table: "documents", column: "appraisal_order_id");
        migrationBuilder.CreateIndex(
            name: "IX_documents_is_deleted", table: "documents", column: "is_deleted");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable("documents");
        migrationBuilder.DropTable("task_items");
        migrationBuilder.DropTable("appraisal_orders");
    }
}
