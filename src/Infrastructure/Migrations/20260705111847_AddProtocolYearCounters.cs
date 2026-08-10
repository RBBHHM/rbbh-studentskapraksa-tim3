using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Praksa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProtocolYearCounters : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Counter tabela za atomarnu dodjelu protokol rednih brojeva po godini.
            // Koristimo PostgreSQL-ov atomarni INSERT ... ON CONFLICT DO UPDATE ... RETURNING
            // koji garantuje jedinstvenost sekvence bez eksplicitnih lokova ili race conditiona.
            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS protocol_year_counters (
                    year          INTEGER PRIMARY KEY,
                    last_sequence INTEGER NOT NULL DEFAULT 0
                );
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP TABLE IF EXISTS protocol_year_counters;");
        }
    }
}
