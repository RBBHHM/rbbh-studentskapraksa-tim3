using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Praksa.Infrastructure.Migrations;

/// <inheritdoc />
public partial class AddRoleManagement : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // ── permission_definitions ────────────────────────────────────────────
        migrationBuilder.CreateTable(
            name: "permission_definitions",
            columns: table => new
            {
                id          = table.Column<int>(nullable: false)
                                   .Annotation("Npgsql:ValueGenerationStrategy",
                                       NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                code         = table.Column<string>(maxLength: 100, nullable: false),
                display_name = table.Column<string>(maxLength: 250, nullable: false),
                description  = table.Column<string>(maxLength: 1000, nullable: true),
                module       = table.Column<string>(maxLength: 100, nullable: false),
                is_active    = table.Column<bool>(nullable: false, defaultValue: true),
                created_at   = table.Column<DateTime>(nullable: false),
                updated_at   = table.Column<DateTime>(nullable: true)
            },
            constraints: table => table.PrimaryKey("PK_permission_definitions", x => x.id));

        migrationBuilder.CreateIndex(
            name: "IX_permission_definitions_code",
            table: "permission_definitions",
            column: "code",
            unique: true);

        migrationBuilder.CreateIndex(
            name: "IX_permission_definitions_module",
            table: "permission_definitions",
            column: "module");

        // ── role_definitions ──────────────────────────────────────────────────
        migrationBuilder.CreateTable(
            name: "role_definitions",
            columns: table => new
            {
                id                 = table.Column<int>(nullable: false)
                                          .Annotation("Npgsql:ValueGenerationStrategy",
                                              NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                name               = table.Column<string>(maxLength: 150, nullable: false),
                display_name       = table.Column<string>(maxLength: 250, nullable: false),
                description        = table.Column<string>(maxLength: 1000, nullable: true),
                is_system          = table.Column<bool>(nullable: false),
                is_active          = table.Column<bool>(nullable: false, defaultValue: true),
                created_at         = table.Column<DateTime>(nullable: false),
                updated_at         = table.Column<DateTime>(nullable: true),
                created_by_user_id = table.Column<string>(maxLength: 100, nullable: true),
                updated_by_user_id = table.Column<string>(maxLength: 100, nullable: true),
                deleted_at         = table.Column<DateTime>(nullable: true),
                deleted_by_user_id = table.Column<string>(maxLength: 100, nullable: true)
            },
            constraints: table => table.PrimaryKey("PK_role_definitions", x => x.id));

        migrationBuilder.CreateIndex(
            name: "IX_role_definitions_name",
            table: "role_definitions",
            column: "name",
            unique: true,
            filter: "deleted_at IS NULL");

        migrationBuilder.CreateIndex(
            name: "IX_role_definitions_is_active",
            table: "role_definitions",
            column: "is_active");

        migrationBuilder.CreateIndex(
            name: "IX_role_definitions_is_system",
            table: "role_definitions",
            column: "is_system");

        // ── role_permissions (join) ───────────────────────────────────────────
        migrationBuilder.CreateTable(
            name: "role_permissions",
            columns: table => new
            {
                role_definition_id       = table.Column<int>(nullable: false),
                permission_definition_id = table.Column<int>(nullable: false),
                created_at               = table.Column<DateTime>(nullable: false),
                created_by_user_id       = table.Column<string>(maxLength: 100, nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_role_permissions",
                    x => new { x.role_definition_id, x.permission_definition_id });
                table.ForeignKey(
                    name: "FK_role_permissions_role_definitions_role_definition_id",
                    column: x => x.role_definition_id,
                    principalTable: "role_definitions",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_role_permissions_permission_definitions_permission_definition_id",
                    column: x => x.permission_definition_id,
                    principalTable: "permission_definitions",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(
            name: "IX_role_permissions_role_definition_id",
            table: "role_permissions",
            column: "role_definition_id");

        migrationBuilder.CreateIndex(
            name: "IX_role_permissions_permission_definition_id",
            table: "role_permissions",
            column: "permission_definition_id");

        // ── Seed: Permission Catalog + System Roles + Role-Permission veze ──────
        // Koristimo raw SQL jer InsertData zahtijeva BuildTargetModel mapping.
        migrationBuilder.Sql(@"
            INSERT INTO permission_definitions (code, display_name, description, module, is_active, created_at) VALUES
            ('users.view',                        'Pregled korisnika',              'Pregled liste korisnika i njihovih rola',                    'Korisnici',     true, '2026-06-03'),
            ('users.suspend',                     'Suspenzija korisnika',           'Suspendovanje i reaktiviranje korisnickih naloga',           'Korisnici',     true, '2026-06-03'),
            ('roles.view',                        'Pregled rola',                   'Pregled liste rola u sistemu',                              'Role',          true, '2026-06-03'),
            ('roles.assign',                      'Dodjela role',                   'Dodjela role korisniku',                                    'Role',          true, '2026-06-03'),
            ('roles.remove',                      'Uklanjanje role',                'Uklanjanje role korisniku',                                 'Role',          true, '2026-06-03'),
            ('roles.transfer-admin',              'Prenos admin role',              'Prenos administratorske role na drugog korisnika',          'Role',          true, '2026-06-03'),
            ('roles.manage',                      'Upravljanje definicijama rola',  'Kreiranje, uredjivanje, deaktivacija custom rola',          'Role',          true, '2026-06-03'),
            ('records.create',                    'Kreiranje zapisa',               'Kreiranje novih naloga procjene',                           'Zapisi',        true, '2026-06-03'),
            ('records.view-own',                  'Pregled vlastitih zapisa',       'Pregled vlastitih kreiranih naloga',                        'Zapisi',        true, '2026-06-03'),
            ('records.update-own-draft',          'Uredjivanje vlastitih nacrta',   'Uredjivanje vlastitih naloga u statusu nacrt',              'Zapisi',        true, '2026-06-03'),
            ('records.submit-for-verification',   'Slanje na verifikaciju',         'Slanje naloga na verifikaciju',                             'Zapisi',        true, '2026-06-03'),
            ('records.view-pending-verification', 'Pregled na verifikaciji',        'Pregled naloga koji cekaju verifikaciju',                   'Verifikacija',  true, '2026-06-03'),
            ('records.approve',                   'Odobravanje naloga',             'Odobravanje naloga procjene',                               'Verifikacija',  true, '2026-06-03'),
            ('records.reject',                    'Odbijanje naloga',               'Odbijanje naloga procjene',                                 'Verifikacija',  true, '2026-06-03'),
            ('records.view-history',              'Pregled historije',              'Pregled historije naloga',                                  'Verifikacija',  true, '2026-06-03'),
            ('codebooks.view',                    'Pregled sifarnika',              'Pregled vrijednosti sifarnika (dropdowni)',                  'Sifarnici',     true, '2026-06-03'),
            ('codebooks.manage',                  'Upravljanje sifarnicima',        'Kreiranje, uredjivanje, deaktivacija vrijednosti sifarnika','Sifarnici',     true, '2026-06-03'),
            ('audit.view-security',               'Pregled audit loga',             'Pregled sigurnosnog audit loga',                            'Sigurnost',     true, '2026-06-03'),
            ('admin.access',                      'Administrativni pristup',        'Pristup administrativnim modulima sistema',                 'Administracija', true, '2026-06-03');

            INSERT INTO role_definitions (name, display_name, description, is_system, is_active, created_at) VALUES
            ('Administrator', 'Administrator', 'Potpun pristup svim modulima sistema',          true, true, '2026-06-03'),
            ('Unosnik',       'Unosnik',       'Kreiranje i unos naloga procjene nekretnina',   true, true, '2026-06-03'),
            ('Verifikator',   'Verifikator',   'Verifikacija i odobravanje naloga procjene',    true, true, '2026-06-03');

            INSERT INTO role_permissions (role_definition_id, permission_definition_id, created_at)
            SELECT r.id, p.id, '2026-06-03'
            FROM role_definitions r, permission_definitions p
            WHERE r.name = 'Administrator';

            INSERT INTO role_permissions (role_definition_id, permission_definition_id, created_at)
            SELECT r.id, p.id, '2026-06-03'
            FROM role_definitions r, permission_definitions p
            WHERE r.name = 'Unosnik'
              AND p.code IN ('records.create','records.view-own','records.update-own-draft',
                             'records.submit-for-verification','codebooks.view');

            INSERT INTO role_permissions (role_definition_id, permission_definition_id, created_at)
            SELECT r.id, p.id, '2026-06-03'
            FROM role_definitions r, permission_definitions p
            WHERE r.name = 'Verifikator'
              AND p.code IN ('records.view-pending-verification','records.approve','records.reject',
                             'records.view-history','codebooks.view');
        ");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable("role_permissions");
        migrationBuilder.DropTable("role_definitions");
        migrationBuilder.DropTable("permission_definitions");
    }
}
