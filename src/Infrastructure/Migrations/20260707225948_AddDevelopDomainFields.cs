using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Praksa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDevelopDomainFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Sve operacije su idempotentne (IF NOT EXISTS / IF EXISTS)
            // jer ova migracija nastala merge-om develop→main može naići na
            // već primijenjene promjene iz ranijih migracija na main grani.

            migrationBuilder.Sql("""
                DO $$ BEGIN
                    IF EXISTS (
                        SELECT 1 FROM pg_constraint
                        WHERE conname = 'FK_order_protocol_entries_appraisal_orders_order_id'
                    ) THEN
                        ALTER TABLE order_protocol_entries
                            DROP CONSTRAINT "FK_order_protocol_entries_appraisal_orders_order_id";
                    END IF;
                END $$;
                """);

            migrationBuilder.Sql("""
                DROP INDEX IF EXISTS uix_codebook_values_key_code_active;
                """);

            migrationBuilder.Sql("""
                DO $$ BEGIN
                    IF EXISTS (SELECT 1 FROM information_schema.columns
                               WHERE table_name='appraisal_orders' AND column_name='RequestSentAt') THEN
                        ALTER TABLE appraisal_orders RENAME COLUMN "RequestSentAt" TO request_sent_at;
                    END IF;
                END $$;
                """);

            migrationBuilder.Sql("""
                DO $$ BEGIN
                    IF EXISTS (SELECT 1 FROM information_schema.columns
                               WHERE table_name='appraisal_orders' AND column_name='RequestReceivedAt') THEN
                        ALTER TABLE appraisal_orders RENAME COLUMN "RequestReceivedAt" TO request_received_at;
                    END IF;
                END $$;
                """);

            migrationBuilder.Sql("ALTER TABLE appraisers ADD COLUMN IF NOT EXISTS supported_cities character varying(2000);");
            migrationBuilder.Sql("ALTER TABLE appraisers ADD COLUMN IF NOT EXISTS supported_property_types character varying(2000);");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS accepted_by_ca_name character varying(300);");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS appraisal_delivered_to_co_at timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS appraisal_fee numeric;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS appraiser_rating integer;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS appraiser_visit_date timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS branch_id integer;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS city_id integer;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS co_documentation_review_started_at timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS co_opinion_sent_to_am_at timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS collateral_status character varying(100);");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS corrected_appraisal_received_at timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS correction_count integer NOT NULL DEFAULT 0;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS correction_requested_at timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS documentation_review_status character varying(30);");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS documentation_supplement_at timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS esg_certificate character varying(50);");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_document_id integer;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_paid_at timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_paid_by_name character varying(300);");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_paid_by_user_id character varying(100);");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_received_date timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_sent_date timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_sent_for_payment_at timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_sent_for_payment_by_name character varying(300);");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_sent_for_payment_by_user_id character varying(100);");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_status integer NOT NULL DEFAULT 0;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_uploaded_at timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_uploaded_by_name character varying(300);");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS invoice_uploaded_by_user_id character varying(100);");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS order_sent_to_appraiser_at timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS payment_consent_status character varying(100);");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS signed_documents_received_at timestamptz;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS square_meters_commercial numeric(12,2);");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders ADD COLUMN IF NOT EXISTS square_meters_residential numeric(12,2);");

            migrationBuilder.Sql("""
                CREATE UNIQUE INDEX IF NOT EXISTS uix_codebook_values_key_code_active
                ON codebook_values ("CodebookKey", "Code")
                WHERE "DeletedAt" IS NULL;
                """);

            migrationBuilder.Sql("""
                DO $$ BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM pg_constraint
                        WHERE conname = 'FK_order_protocol_entries_appraisal_orders_order_id'
                    ) THEN
                        ALTER TABLE order_protocol_entries
                            ADD CONSTRAINT "FK_order_protocol_entries_appraisal_orders_order_id"
                            FOREIGN KEY (order_id) REFERENCES appraisal_orders(id)
                            ON DELETE RESTRICT;
                    END IF;
                END $$;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DO $$ BEGIN
                    IF EXISTS (
                        SELECT 1 FROM pg_constraint
                        WHERE conname = 'FK_order_protocol_entries_appraisal_orders_order_id'
                    ) THEN
                        ALTER TABLE order_protocol_entries
                            DROP CONSTRAINT "FK_order_protocol_entries_appraisal_orders_order_id";
                    END IF;
                END $$;
                """);

            migrationBuilder.Sql("DROP INDEX IF EXISTS uix_codebook_values_key_code_active;");

            migrationBuilder.Sql("ALTER TABLE appraisers DROP COLUMN IF EXISTS supported_cities;");
            migrationBuilder.Sql("ALTER TABLE appraisers DROP COLUMN IF EXISTS supported_property_types;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS accepted_by_ca_name;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS appraisal_delivered_to_co_at;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS appraisal_fee;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS appraiser_rating;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS appraiser_visit_date;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS branch_id;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS city_id;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS co_documentation_review_started_at;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS co_opinion_sent_to_am_at;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS collateral_status;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS corrected_appraisal_received_at;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS correction_count;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS correction_requested_at;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS documentation_review_status;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS documentation_supplement_at;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS esg_certificate;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS invoice_document_id;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS invoice_paid_at;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS invoice_paid_by_name;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS invoice_paid_by_user_id;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS invoice_received_date;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS invoice_sent_date;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS invoice_sent_for_payment_at;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS invoice_sent_for_payment_by_name;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS invoice_sent_for_payment_by_user_id;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS invoice_status;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS invoice_uploaded_at;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS invoice_uploaded_by_name;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS invoice_uploaded_by_user_id;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS order_sent_to_appraiser_at;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS payment_consent_status;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS signed_documents_received_at;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS square_meters_commercial;");
            migrationBuilder.Sql("ALTER TABLE appraisal_orders DROP COLUMN IF EXISTS square_meters_residential;");

            migrationBuilder.Sql("""
                DO $$ BEGIN
                    IF EXISTS (SELECT 1 FROM information_schema.columns
                               WHERE table_name='appraisal_orders' AND column_name='request_sent_at') THEN
                        ALTER TABLE appraisal_orders RENAME COLUMN request_sent_at TO "RequestSentAt";
                    END IF;
                END $$;
                """);

            migrationBuilder.Sql("""
                DO $$ BEGIN
                    IF EXISTS (SELECT 1 FROM information_schema.columns
                               WHERE table_name='appraisal_orders' AND column_name='request_received_at') THEN
                        ALTER TABLE appraisal_orders RENAME COLUMN request_received_at TO "RequestReceivedAt";
                    END IF;
                END $$;
                """);

            migrationBuilder.Sql("""
                CREATE UNIQUE INDEX IF NOT EXISTS uix_codebook_values_key_code_active
                ON codebook_values ("CodebookKey", "Code")
                WHERE deleted_at IS NULL;
                """);

            migrationBuilder.Sql("""
                DO $$ BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM pg_constraint
                        WHERE conname = 'FK_order_protocol_entries_appraisal_orders_order_id'
                    ) THEN
                        ALTER TABLE order_protocol_entries
                            ADD CONSTRAINT "FK_order_protocol_entries_appraisal_orders_order_id"
                            FOREIGN KEY (order_id) REFERENCES appraisal_orders(id)
                            ON DELETE CASCADE;
                    END IF;
                END $$;
                """);
        }
    }
}
