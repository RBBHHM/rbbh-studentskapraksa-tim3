using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Praksa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCaNameAndDocReviewStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Idempotent migration: baza već ima većinu kolona/tabela iz ranije primijenjenih
            // migracija. Koristimo raw SQL sa IF NOT EXISTS / IF EXISTS za sigurno pokretanje.

            // ── Rename PascalCase → snake_case (ako stari nazivi još postoje) ─────
            migrationBuilder.Sql("""
                DO $$ BEGIN
                    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appraisal_orders' AND column_name='SquareMetersResidential') THEN
                        ALTER TABLE appraisal_orders RENAME COLUMN "SquareMetersResidential" TO square_meters_residential;
                    END IF;
                    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appraisal_orders' AND column_name='SquareMetersCommercial') THEN
                        ALTER TABLE appraisal_orders RENAME COLUMN "SquareMetersCommercial" TO square_meters_commercial;
                    END IF;
                    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appraisal_orders' AND column_name='RequestSentAt') THEN
                        ALTER TABLE appraisal_orders RENAME COLUMN "RequestSentAt" TO request_sent_at;
                    END IF;
                    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appraisal_orders' AND column_name='RequestReceivedAt') THEN
                        ALTER TABLE appraisal_orders RENAME COLUMN "RequestReceivedAt" TO request_received_at;
                    END IF;
                END $$;
                """);

            // ── Kolone koje možda već postoje ────────────────────────────────────
            migrationBuilder.Sql("ALTER TABLE task_items ADD COLUMN IF NOT EXISTS row_version xid NOT NULL DEFAULT '0'::xid;");
            migrationBuilder.Sql("ALTER TABLE notifications ADD COLUMN IF NOT EXISTS deduplication_key varchar(512);");
            migrationBuilder.Sql("ALTER TABLE documents ADD COLUMN IF NOT EXISTS change_reason varchar(500);");
            migrationBuilder.Sql("ALTER TABLE appraisers ADD COLUMN IF NOT EXISTS supported_cities varchar(4000);");
            migrationBuilder.Sql("ALTER TABLE appraisers ADD COLUMN IF NOT EXISTS supported_property_types varchar(500);");

            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS accepted_by_ca_name varchar(300);");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS appraisal_delivered_to_co_at timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS appraisal_fee numeric(18,2);");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS appraiser_rating integer;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS appraiser_visit_date timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS branch_id integer;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS city_id integer;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS co_documentation_review_started_at timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS co_opinion_sent_to_am_at timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS collateral_status varchar(100);");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS corrected_appraisal_received_at timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS correction_count integer NOT NULL DEFAULT 0;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS correction_requested_at timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS documentation_review_status varchar(100);");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS documentation_supplement_at timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS esg_certificate varchar(200);");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_document_id integer;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_paid_at timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_paid_by_name varchar(300);");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_paid_by_user_id varchar(100);");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_received_date timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_sent_date timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_sent_for_payment_at timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_sent_for_payment_by_name varchar(300);");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_sent_for_payment_by_user_id varchar(100);");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_status integer NOT NULL DEFAULT 0;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_uploaded_at timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_uploaded_by_name varchar(300);");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_uploaded_by_user_id varchar(100);");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS order_sent_to_appraiser_at timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS payment_consent_status varchar(100);");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS row_version xid NOT NULL DEFAULT '0'::xid;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS signed_documents_received_at timestamptz;");

            // ── Precision fix za square_meters kolone ────────────────────────────
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ALTER COLUMN square_meters_residential TYPE numeric(12,2);");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ALTER COLUMN square_meters_commercial TYPE numeric(12,2);");

            // ── Tabele (CREATE IF NOT EXISTS) ────────────────────────────────────
            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS document_templates (
                    id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
                    code varchar(100) NOT NULL,
                    name varchar(300) NOT NULL,
                    description varchar(1000),
                    category varchar(50) NOT NULL,
                    file_name varchar(300) NOT NULL,
                    content_type varchar(100) NOT NULL,
                    file_size bigint NOT NULL,
                    storage_path varchar(500) NOT NULL,
                    sort_order integer NOT NULL,
                    is_active boolean NOT NULL DEFAULT true,
                    allowed_roles varchar(500),
                    created_at timestamptz NOT NULL,
                    updated_at timestamptz
                );
                """);

            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS quote_requests (
                    id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
                    appraisal_order_id integer NOT NULL,
                    appraiser_id integer NOT NULL,
                    status integer NOT NULL,
                    sent_at timestamptz NOT NULL,
                    deadline timestamptz NOT NULL,
                    sent_by_user_id varchar(100),
                    offered_price numeric(18,2),
                    offered_days integer,
                    responded_at timestamptz,
                    thank_you_sent_at timestamptz,
                    created_at timestamptz NOT NULL,
                    updated_at timestamptz
                );
                """);

            // ── Indeksi (CREATE IF NOT EXISTS) ───────────────────────────────────
            migrationBuilder.Sql("CREATE INDEX IF NOT EXISTS \"IX_notifications_deduplication_key\" ON notifications (deduplication_key);");
            migrationBuilder.Sql("""
                DROP INDEX IF EXISTS uix_codebook_values_key_code_active;
                CREATE UNIQUE INDEX uix_codebook_values_key_code_active ON codebook_values ("CodebookKey", "Code") WHERE "DeletedAt" IS NULL;
                """);
            migrationBuilder.Sql("CREATE INDEX IF NOT EXISTS \"IX_appraisal_orders_appraiser_id_status\" ON appraisal_orders (appraiser_id, status);");
            migrationBuilder.Sql("CREATE INDEX IF NOT EXISTS \"IX_appraisal_orders_branch_id\" ON appraisal_orders (branch_id);");
            migrationBuilder.Sql("CREATE INDEX IF NOT EXISTS \"IX_appraisal_orders_city\" ON appraisal_orders (city);");
            migrationBuilder.Sql("CREATE INDEX IF NOT EXISTS \"IX_appraisal_orders_city_id\" ON appraisal_orders (city_id);");
            migrationBuilder.Sql("CREATE INDEX IF NOT EXISTS \"IX_appraisal_orders_status_city\" ON appraisal_orders (status, city);");
            migrationBuilder.Sql("CREATE INDEX IF NOT EXISTS \"IX_document_templates_category\" ON document_templates (category);");
            migrationBuilder.Sql("CREATE UNIQUE INDEX IF NOT EXISTS \"IX_document_templates_code\" ON document_templates (code);");
            migrationBuilder.Sql("CREATE INDEX IF NOT EXISTS \"IX_quote_requests_appraisal_order_id\" ON quote_requests (appraisal_order_id);");
            migrationBuilder.Sql("CREATE UNIQUE INDEX IF NOT EXISTS \"IX_quote_requests_appraisal_order_id_appraiser_id\" ON quote_requests (appraisal_order_id, appraiser_id);");

            // ── FK-ovi (idempotent) ──────────────────────────────────────────────
            migrationBuilder.Sql("""
                DO $$ BEGIN
                    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_appraisal_orders_branches_branch_id') THEN
                        ALTER TABLE appraisal_orders ADD CONSTRAINT "FK_appraisal_orders_branches_branch_id"
                            FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE RESTRICT;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_appraisal_orders_cities_city_id') THEN
                        ALTER TABLE appraisal_orders ADD CONSTRAINT "FK_appraisal_orders_cities_city_id"
                            FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE RESTRICT;
                    END IF;
                END $$;
                """);

            // Protocol FK: promjena CASCADE → RESTRICT
            migrationBuilder.Sql("""
                DO $$ BEGIN
                    ALTER TABLE order_protocol_entries DROP CONSTRAINT IF EXISTS "FK_order_protocol_entries_appraisal_orders_order_id";
                    ALTER TABLE order_protocol_entries ADD CONSTRAINT "FK_order_protocol_entries_appraisal_orders_order_id"
                        FOREIGN KEY (order_id) REFERENCES appraisal_orders(id) ON DELETE RESTRICT;
                END $$;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appraisal_orders_branches_branch_id",
                table: "appraisal_orders");

            migrationBuilder.DropForeignKey(
                name: "FK_appraisal_orders_cities_city_id",
                table: "appraisal_orders");

            migrationBuilder.DropForeignKey(
                name: "FK_order_protocol_entries_appraisal_orders_order_id",
                table: "order_protocol_entries");

            migrationBuilder.DropTable(
                name: "document_templates");

            migrationBuilder.DropTable(
                name: "quote_requests");

            migrationBuilder.DropIndex(
                name: "IX_notifications_deduplication_key",
                table: "notifications");

            migrationBuilder.DropIndex(
                name: "uix_codebook_values_key_code_active",
                table: "codebook_values");

            migrationBuilder.DropIndex(
                name: "IX_appraisal_orders_appraiser_id_status",
                table: "appraisal_orders");

            migrationBuilder.DropIndex(
                name: "IX_appraisal_orders_branch_id",
                table: "appraisal_orders");

            migrationBuilder.DropIndex(
                name: "IX_appraisal_orders_city",
                table: "appraisal_orders");

            migrationBuilder.DropIndex(
                name: "IX_appraisal_orders_city_id",
                table: "appraisal_orders");

            migrationBuilder.DropIndex(
                name: "IX_appraisal_orders_status_city",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "row_version",
                table: "task_items");

            migrationBuilder.DropColumn(
                name: "deduplication_key",
                table: "notifications");

            migrationBuilder.DropColumn(
                name: "change_reason",
                table: "documents");

            migrationBuilder.DropColumn(
                name: "supported_cities",
                table: "appraisers");

            migrationBuilder.DropColumn(
                name: "supported_property_types",
                table: "appraisers");

            migrationBuilder.DropColumn(
                name: "accepted_by_ca_name",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "appraisal_delivered_to_co_at",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "appraisal_fee",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "appraiser_rating",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "appraiser_visit_date",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "branch_id",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "city_id",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "co_documentation_review_started_at",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "co_opinion_sent_to_am_at",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "collateral_status",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "corrected_appraisal_received_at",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "correction_count",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "correction_requested_at",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "documentation_review_status",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "documentation_supplement_at",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "esg_certificate",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "invoice_document_id",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "invoice_paid_at",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "invoice_paid_by_name",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "invoice_paid_by_user_id",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "invoice_received_date",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "invoice_sent_date",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "invoice_sent_for_payment_at",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "invoice_sent_for_payment_by_name",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "invoice_sent_for_payment_by_user_id",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "invoice_status",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "invoice_uploaded_at",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "invoice_uploaded_by_name",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "invoice_uploaded_by_user_id",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "order_sent_to_appraiser_at",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "payment_consent_status",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "row_version",
                table: "appraisal_orders");

            migrationBuilder.DropColumn(
                name: "signed_documents_received_at",
                table: "appraisal_orders");

            migrationBuilder.RenameColumn(
                name: "square_meters_residential",
                table: "appraisal_orders",
                newName: "SquareMetersResidential");

            migrationBuilder.RenameColumn(
                name: "square_meters_commercial",
                table: "appraisal_orders",
                newName: "SquareMetersCommercial");

            migrationBuilder.RenameColumn(
                name: "request_sent_at",
                table: "appraisal_orders",
                newName: "RequestSentAt");

            migrationBuilder.RenameColumn(
                name: "request_received_at",
                table: "appraisal_orders",
                newName: "RequestReceivedAt");

            migrationBuilder.AlterColumn<decimal>(
                name: "SquareMetersResidential",
                table: "appraisal_orders",
                type: "numeric",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(12,2)",
                oldPrecision: 12,
                oldScale: 2,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "SquareMetersCommercial",
                table: "appraisal_orders",
                type: "numeric",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(12,2)",
                oldPrecision: 12,
                oldScale: 2,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "uix_codebook_values_key_code_active",
                table: "codebook_values",
                columns: new[] { "CodebookKey", "Code" },
                unique: true,
                filter: "deleted_at IS NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_order_protocol_entries_appraisal_orders_order_id",
                table: "order_protocol_entries",
                column: "order_id",
                principalTable: "appraisal_orders",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
