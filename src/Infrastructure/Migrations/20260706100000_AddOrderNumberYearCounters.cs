using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Praksa.Infrastructure.Persistence;

#nullable disable

namespace Praksa.Infrastructure.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260706100000_AddOrderNumberYearCounters")]
    public partial class AddOrderNumberYearCounters : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Counter tabela za atomarnu dodjelu ORD-YYYY-NNNNNN brojeva po godini.
            // Isti pattern kao protocol_year_counters (ADR-013) — eliminira race condition
            // u OrderNumberGenerator koji je koristio COUNT(*)+1 (ADR-048 fix).
            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS order_number_year_counters (
                    year          INTEGER PRIMARY KEY,
                    last_sequence INTEGER NOT NULL DEFAULT 0
                );
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP TABLE IF EXISTS order_number_year_counters;");
        }
    }
}
