#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from fpdf import FPDF
from datetime import datetime

YELLOW = (254, 230, 0)
RED    = (196, 30, 58)
DARK   = (43, 45, 51)
LIGHT  = (245, 244, 242)
MID    = (107, 101, 96)

CHAR_MAP = {
    "–": "-", "—": "-",
    "‘": "'", "’": "'",
    "“": '"', "”": '"',
    "…": "...", "≈": "~",
    "č": "c", "š": "s", "ž": "z",
    "ć": "c", "đ": "d",
    "Ć": "C", "Š": "S", "Ž": "Z",
    "Č": "C", "Đ": "D",
}

def clean(text):
    if not isinstance(text, str):
        return text
    for ch, rep in CHAR_MAP.items():
        text = text.replace(ch, rep)
    return text


class Report(FPDF):
    def _cell(self, w=0, h=0, text='', *a, **kw):
        return super().cell(w, h, clean(text), *a, **kw)
    def cell(self, w=0, h=0, text='', *a, **kw):
        return super().cell(w, h, clean(text), *a, **kw)
    def multi_cell(self, w, h=0, text='', *a, **kw):
        return super().multi_cell(w, h, clean(text), *a, **kw)

    def header(self):
        self.set_fill_color(*YELLOW)
        self.rect(0, 0, 210, 12, 'F')
        self.set_fill_color(*RED)
        self.rect(0, 12, 210, 2, 'F')

    def footer(self):
        self.set_y(-12)
        self.set_fill_color(*YELLOW)
        self.rect(0, self.get_y(), 210, 12, 'F')
        self.set_font('Helvetica', '', 8)
        self.set_text_color(*MID)
        self.cell(0, 12, 'Stranica %d  |  RBBH Studentska praksa 2026' % self.page_no(), align='C')

    def section(self, title):
        self.set_font('Helvetica', 'B', 11)
        self.set_fill_color(*YELLOW)
        self.set_text_color(*DARK)
        self.cell(0, 8, '  ' + title, new_x='LMARGIN', new_y='NEXT', fill=True)
        self.ln(2)

    def row(self, label, value, shade=False):
        bg = LIGHT if shade else (255, 255, 255)
        self.set_fill_color(*bg)
        self.set_font('Helvetica', 'B', 9)
        self.set_text_color(*DARK)
        self.cell(58, 7, label, fill=True)
        self.set_font('Helvetica', '', 9)
        self.set_text_color(*MID)
        self.multi_cell(0, 7, value, fill=True, new_x='LMARGIN', new_y='NEXT')

    def kpi(self, label, value, x):
        self.set_xy(x, self.get_y())
        self.set_fill_color(*RED)
        y = self.get_y()
        self.rect(x, y, 54, 22, 'F')
        self.set_text_color(255, 255, 255)
        self.set_font('Helvetica', 'B', 17)
        self.set_xy(x, y + 2)
        self.cell(54, 9, value, align='C')
        self.set_font('Helvetica', '', 8)
        self.set_xy(x, y + 12)
        self.cell(54, 7, label, align='C')
        self.set_text_color(*DARK)


pdf = Report(orientation='P', unit='mm', format='A4')
pdf.set_margins(16, 20, 16)
pdf.set_auto_page_break(auto=True, margin=16)
pdf.add_page()

# ── Naslov ──────────────────────────────────────────────────────────────────
pdf.ln(6)
pdf.set_font('Helvetica', 'B', 22)
pdf.set_text_color(*RED)
pdf.cell(0, 10, 'Izvjestaj studentske prakse', new_x='LMARGIN', new_y='NEXT', align='C')
pdf.set_font('Helvetica', '', 11)
pdf.set_text_color(*MID)
pdf.cell(0, 6, 'Raiffeisen Bank Bosnia and Herzegovina d.d.', new_x='LMARGIN', new_y='NEXT', align='C')
pdf.cell(0, 6, 'Generirano: %s' % datetime.now().strftime('%d.%m.%Y u %H:%M'), new_x='LMARGIN', new_y='NEXT', align='C')
pdf.ln(6)

# ── Podaci o studentu ────────────────────────────────────────────────────────
pdf.section('PODACI O STUDENTU')
pdf.row('Ime i prezime:', 'Suljo Ruvic', shade=False)
pdf.row('Username / ID:', 'sruvic1', shade=True)
pdf.row('Repozitorij:',   'rbbhofficial/studentskapraksaTema3', shade=False)
pdf.row('Aktivna grana:', 'feature/prodaja-am-sm-ub-role-model', shade=True)
pdf.row('Period prakse:', '03.05.2026. - 17.06.2026. (> 6 tjedana)', shade=False)
pdf.row('Stack:',         '.NET 8, Blazor Server, Keycloak, PostgreSQL, Docker, nginx', shade=True)
pdf.ln(5)

# ── KPI ─────────────────────────────────────────────────────────────────────
pdf.section('KLJUCNI POKAZATELJI')
pdf.ln(3)
kpis = [
    ('AI sesija',     '13'),
    ('Git commitova', '80+'),
    ('Pull requestova','53+'),
    ('Ustediceno',    '640 min'),
    ('Trajanje sesija','348 min'),
]
gap   = 4
col_w = 54
total_w = len(kpis) * col_w + (len(kpis) - 1) * gap
start_x = (210 - 32 - total_w) / 2 + 16
y_kpi = pdf.get_y()
for i, (lbl, val) in enumerate(kpis):
    pdf.set_y(y_kpi)
    pdf.kpi(lbl, val, start_x + i * (col_w + gap))
pdf.ln(28)

# ── AI sesije ─────────────────────────────────────────────────────────────────
pdf.section('PREGLED AI SESIJA (Claude Code)')

sessions = [
    ('2026-06-10', 'code_generation', 30, 60,
     'US93 Frontend: Blazor UI kucice Prodaja i Kolateral oficir — komponente, servis, host stranica'),
    ('2026-06-11', 'documentation',   40, 120,
     'Sprint 12 finalna isporuka — 10 dokumentacijskih artefakata za NRS-Grupa3 (specifikacije, dijagrami, testni plan, vodic za deployment)'),
    ('2026-06-12', 'code_generation', 15, 25,
     'Rijesen merge konflikt u MainLayout.razor; conditional nav link za orders:view permission'),
    ('2026-06-14', 'infra_setup',     20, 30,
     'Fix nginx 502 "upstream sent too big header" — proxy_buffer_size za JWT auth cookie'),
    ('2026-06-15', 'debugging',       20, 35,
     'Fix hardkodiranih ID-ova za tipove kolaterala u AppraisalOrderSeeder — dinamicki codebook lookup'),
    ('2026-06-15', 'debugging',       15, 25,
     'Fix back dugmeta (history.back umjesto hardkodirane rute) i docker down -v za ispravne codebook ID-ove'),
    ('2026-06-15', 'debugging',        8, 15,
     'Uklonjen hardkodirani "Procjena narudzbe" sidebar link koji je vodio na /narudzbe/1/procjena'),
    ('2026-06-15', 'debugging',       20, 35,
     'Seeder nije kreirao AcceptCAOrder workflow taskove za SubmittedBySales narudzbe'),
    ('2026-06-15', 'debugging',       15, 20,
     'Fix EF correlated subquery u SeedMissingCaTasksAsync — global query filter blokirao kreiranje taskova'),
    ('2026-06-15', 'debugging',       25, 35,
     'Fix 400 BadHttpRequestException na PUT /api/orders/{id} — autosave bool query param bio non-nullable'),
    ('2026-06-15', 'code_generation', 90, 120,
     'Android Spirala 2 — Open-Meteo API integracija, Room baza, WeatherMapper, WeatherRepository, ViewModel, UI'),
    ('2026-06-15', 'debugging',       25, 60,
     'Fix PrognozaActivity crash (NoActionBar tema), Room Flow, Toast timing, fallbackToDestructiveMigration'),
    ('2026-06-16', 'code_generation', 25, 60,
     'Fix MyTasks "Zavrsi task" bug + BranchCatalog konsolidacija + nginx root location proxy buffer fix'),
]

pdf.set_fill_color(*RED)
pdf.set_text_color(255, 255, 255)
pdf.set_font('Helvetica', 'B', 8)
pdf.cell(22, 7, 'Datum',        fill=True)
pdf.cell(35, 7, 'Kategorija',   fill=True)
pdf.cell(18, 7, 'Trajanje',     fill=True, align='C')
pdf.cell(18, 7, 'Usteceno',     fill=True, align='C')
pdf.cell(0,  7, 'Opis zadatka', fill=True, new_x='LMARGIN', new_y='NEXT')

for i, (d, k, dur, sv, opis) in enumerate(sessions):
    bg = LIGHT if i % 2 == 0 else (255, 255, 255)
    pdf.set_fill_color(*bg)
    pdf.set_text_color(*DARK)
    pdf.set_font('Helvetica', '', 8)
    pdf.cell(22, 6, d, fill=True)
    pdf.cell(35, 6, k, fill=True)
    pdf.cell(18, 6, '%d min' % dur, fill=True, align='C')
    pdf.cell(18, 6, '%d min' % sv,  fill=True, align='C')
    pdf.multi_cell(0, 6, opis, fill=True, new_x='LMARGIN', new_y='NEXT')

pdf.ln(2)
pdf.set_font('Helvetica', 'B', 9)
pdf.set_text_color(*RED)
pdf.cell(0, 7,
    'UKUPNO: 13 sesija  |  348 min trajanje  |  640 min usteceno (~10h 40min)',
    new_x='LMARGIN', new_y='NEXT')
pdf.ln(4)

# ── Git historija ─────────────────────────────────────────────────────────────
pdf.add_page()
pdf.ln(6)
pdf.section('GIT HISTORIJA — PREGLED PO FAZAMA')

phases = [
    ('Sprint 1 — Temelji platforme (03.05 – 30.05.2026.)', [
        ('2026-05-03', 'Initial commit — Clean Architecture struktura (.NET 8, Blazor Server, Keycloak, PostgreSQL)'),
        ('2026-05-28', 'feat: phase-1 backend foundation — DDD entiteti, EF migracije, Docker Compose'),
        ('2026-05-28', 'feat: DPNPN-30 pregled korisnika i rola (Clean Architecture)'),
        ('2026-05-29', 'feat: GET /api/me endpoint sa profilom prijavljenog korisnika'),
        ('2026-05-29', 'DPNPN-31: PUT endpoint za promjenu role korisnika'),
        ('2026-05-29', 'DPNPN-47/48/49: Backend validacije — JMBG, Porezni broj, Afikati'),
        ('2026-05-29', 'DPNPN-64/65/66/70: Codebook modul — tipovi, vrijednosti, CRUD'),
        ('2026-05-30', 'refactor: SOLID/DRY/KISS cleanup + GET /api/me/permissions endpoint'),
    ]),
    ('Sprint 1 — Login i role (01.06 – 05.06.2026.)', [
        ('2026-06-01', 'FE-ROLE-01-02: UI za upravljanje korisnickim rolama'),
        ('2026-06-01', 'feat: Login forma — Raiffeisen branding, fail-fast validacija'),
        ('2026-06-01', 'feat: Povezi frontend s backend API-jem (OIDC / JWT cookie)'),
        ('2026-06-02', 'DEVOPS-01: Keycloak realm export i auto-import pri pokretanju'),
        ('2026-06-02', 'feat: PostgreSQL + Keycloak konfiguracija u .NET API-ju'),
    ]),
    ('Sprint 1 — Dorade i stabilizacija (08.06 – 09.06.2026.)', [
        ('2026-06-08', 'feat: Sprint 1 dorade — login, seed, migracije, CSV export, dashboard'),
        ('2026-06-08', 'fix: Keycloak Admin API — admin-cli fallback (manage-realm)'),
        ('2026-06-09', 'feat(US-1/US-2): Iniciranje narudzbe procjene + kombinovani kolateral (backend)'),
        ('2026-06-09', 'feat(US-1/US-2): Frontend UI za iniciranje narudzbe (CreateOrder)'),
        ('2026-06-09', 'feat(UX): Enterprise redizajn forme — Leaflet mapa, grad/poslovnica filtar'),
        ('2026-06-09', 'security: Audit neovlastenih pristupa narudzbama'),
        ('2026-06-09', 'feat: Live search s debounce 400ms (korisnici, audit log, codebook)'),
    ]),
    ('Sprint 2 — Workflow narudzbi (10.06 – 15.06.2026.)', [
        ('2026-06-10', 'feat(US93): Blazor UI kucice Prodaja i Kolateral oficir'),
        ('2026-06-11', 'feat: Platforma/foundation za narudzbe procjene (US 92/93/94) — WorkflowTaskService, MyTasks'),
        ('2026-06-12', 'feat: CO odobrenje finalne procjene'),
        ('2026-06-13', 'feat(T7 US94): Backend misljenja CO i Pravne sluzbe'),
        ('2026-06-13', 'DPNPN-105: Document upload servis i endpointi'),
        ('2026-06-14', 'feat: DocumentUploadSection komponenta za prilaganje dokumentacije (US-92)'),
        ('2026-06-14', 'Implementacija dashboarda Kolateral administratora'),
        ('2026-06-14', 'fix: integriraj DocumentUploadSection u Procjena narudzbe (US-92)'),
        ('2026-06-15', 'feat: GET /api/orders/{id}, real-data wiring, testne narudzbe za US92/93/94'),
        ('2026-06-15', 'DPNPN-108: Backend za preuzimanje originala procjene + reminder vjestaku'),
        ('2026-06-15', 'test: Domain/Security/Dtos unit testovi (Faza 0+1 coverage)'),
        ('2026-06-15', 'feat: CA workflow — pregled dokumentacije, CO provjera, slanje narudzbe vjestaku (Faza A-D)'),
        ('2026-06-15', 'fix: autosave query param ima default vrijednost u UpdateDraft endpointu'),
        ('2026-06-15', 'fix: seed AcceptCAOrder taskova za SubmittedBySales narudzbe'),
        ('2026-06-15', 'fix: EF query u SeedMissingCaTasksAsync'),
        ('2026-06-15', 'fix: back dugme koristi history.back() umjesto hardkodirane rute'),
        ('2026-06-15', 'fix: ukloni hardkodirani sidebar link "Procjena narudzbe"'),
        ('2026-06-15', 'fix: dinamicko rjesavanje ID-ova tipova kolaterala u seed-u'),
        ('2026-06-15', 'fix: dodaj proxy buffer settings u nginx location / blok'),
    ]),
    ('Sprint 2 — AM/SM/UB role model + refaktoring (16.06.2026.)', [
        ('2026-06-16', 'feat: AM/SM/UB role model — AccountManager, SalesManager, UnitBoss uloge u Keycloak realmu'),
        ('2026-06-16', 'UI component refaktor — Home.razor, SelectRole.razor uskladeni sa novim rolama'),
        ('2026-06-16', 'Document download audit — server-side fetch, potpun audit trail preuzimanja'),
        ('2026-06-16', 'fix: BranchCatalog — konsolidacija 3 hardkodirana izvora u jedan katalog'),
        ('2026-06-16', 'fix: nginx root location proxy buffer (upstream sent too big header)'),
        ('2026-06-16', 'fix: preuzimanje finalne procjene kroz server-side fetch (Us93SalesActions)'),
    ]),
]

for ptitle, commits in phases:
    pdf.set_fill_color(*YELLOW)
    pdf.set_text_color(*DARK)
    pdf.set_font('Helvetica', 'B', 8)
    pdf.cell(0, 7, '  ' + ptitle, fill=True, new_x='LMARGIN', new_y='NEXT')
    for i, (d, opis) in enumerate(commits):
        bg = LIGHT if i % 2 == 0 else (255, 255, 255)
        pdf.set_fill_color(*bg)
        pdf.set_font('Helvetica', 'B', 8)
        pdf.set_text_color(*RED)
        pdf.cell(24, 6, d, fill=True)
        pdf.set_font('Helvetica', '', 8)
        pdf.set_text_color(*DARK)
        pdf.multi_cell(0, 6, opis, fill=True, new_x='LMARGIN', new_y='NEXT')
    pdf.ln(2)

# ── Tehnicke komponente ───────────────────────────────────────────────────────
pdf.add_page()
pdf.ln(6)
pdf.section('IMPLEMENTIRANE TEHNICKE KOMPONENTE')

components = [
    ('Backend (.NET 8 / Clean Architecture)', [
        'Keycloak OIDC integracija — JWT cookie, token refresh, ROPC flow',
        'PostgreSQL + Entity Framework Core 8 — migracije, seederi, audit trail',
        'IEndpointModule pattern — auto-discovery API endpointa bez manualnog registriranja',
        'WorkflowTaskService — Open -> Accept -> Complete tok zadataka',
        'AppraisalOrderService — CRUD narudzbi s lifecycle metodama (Accept, StartDocReview...)',
        'DocumentService — upload, download, audit za pritozene fajlove',
        'OpinionService — misljenja CO i Pravne sluzbe za US94',
        'BranchCatalog — jedinstven izvor podataka za sve poslovnice (kod, naziv, grad, adresa)',
        'AuditService — sve poslovne akcije upisane u audit log s metadata',
        'JMBG / Porezni broj validatori — custom DataAnnotations atributi',
        'SeedMissingCaTasksAsync — idempotentni seeder za workflow taskove pri pokretanju',
        'GET /api/branches — dinamicki endpoint za podatke poslovnica',
        'DPNPN-108: GET /api/orders/{id}/document + POST reminder vjestaku',
    ]),
    ('Frontend (Blazor Server)', [
        'LoginPage — Raiffeisen branding, fail-fast validacija, username bez @ zahtjeva',
        'SelectRole — odabir poslovne uloge pri prijavi (AM, SM, UB, CA, CO)',
        'Home.razor — personalizovana pocetna za svaku ulogu',
        'CreateOrder.razor — forma s Leaflet mapom, grad/poslovnica filter, BranchApiService',
        'MyTasks.razor — lista zadataka s Accept/Complete tokom, paging, duplicate guard',
        'OrderDetails.razor (CA) — pregled narudzbe, prihvatanje, upload dokumenata',
        'NarudzbaProcjena.razor (CO) — kucice za akciju, upload CO/Pravna misljenja',
        'DocumentUploadSection — prilaganje fajlova uz all-or-nothing validaciju',
        'Us93SalesActions — prodajne akcije, server-side preuzimanje finalne procjene',
        'Dashboard Kolateral administratora — KPI kartice, lista narudzbi',
        'Users & Roles admin UI — pregled korisnika, dodjela rola iz Keycloaka',
        'Codebook management UI — tipovi i vrijednosti sifarnika',
        'Audit log UI — filteri datuma, live search s debounce-om, paging',
        'Notification bell — permissioni-based obavjestenja (orders:view permission)',
        'AppStatusBadge, AppEmptyState, AppErrorBanner — reusable UI komponente',
    ]),
    ('Infrastruktura (Docker / nginx / Keycloak)', [
        'Docker Compose (docker-compose.yml + override.yml) — api, web, db, keycloak, nginx',
        'nginx reverse proxy — routing api/web, WebSocket upgrade za Blazor SignalR',
        'nginx proxy buffer settings — rijesen "upstream sent too big header" za JWT cookie',
        'Keycloak realm auto-import pri pokretanju kontejnera',
        'AM/SM/UB/CA/CO role mapping u Keycloak realmu',
        'PostgreSQL perzistentni volume — podaci prezive docker restart',
    ]),
    ('Testiranje i dokumentacija', [
        'Unit testovi: Domain entiteti, Security, Dtos (Faza 0+1 coverage inicijative)',
        'Vodic za testiranje poslovnih procesa DPNPN-90..94',
        'Kompletna lista test korisnika i kredencijala u README',
        'Sprint dokumentacija: specifikacije, dijagrami, testni plan, vodic za deployment',
    ]),
]

for ctitle, items in components:
    pdf.set_fill_color(*YELLOW)
    pdf.set_text_color(*DARK)
    pdf.set_font('Helvetica', 'B', 9)
    pdf.cell(0, 7, '  ' + ctitle, fill=True, new_x='LMARGIN', new_y='NEXT')
    for item in items:
        pdf.set_fill_color(255, 255, 255)
        pdf.set_font('Helvetica', '', 8.5)
        pdf.set_text_color(*DARK)
        pdf.cell(6, 6, '')
        pdf.set_text_color(*RED)
        pdf.cell(4, 6, chr(0x2022) if False else '-')
        pdf.set_text_color(*DARK)
        pdf.multi_cell(0, 6, item, new_x='LMARGIN', new_y='NEXT')
    pdf.ln(2)

# ── Statistika i zakljucak ───────────────────────────────────────────────────
pdf.add_page()
pdf.ln(6)
pdf.section('STATISTIKA AI POMOCI PO KATEGORIJAMA')

cat_data = [
    ('code_generation', 3, 205, 'Generisanje koda (frontend + backend)'),
    ('debugging',       7, 225, 'Debugging i ispravke gresaka'),
    ('documentation',   1, 120, 'Dokumentacija (artefakti finalne isporuke)'),
    ('infra_setup',     1,  30, 'Infrastruktura (Docker, nginx, Keycloak)'),
    ('other',           1,  60, 'Ostalo (Android Spirala 2)'),
]

pdf.set_fill_color(*RED)
pdf.set_text_color(255, 255, 255)
pdf.set_font('Helvetica', 'B', 9)
pdf.cell(50, 7, 'Kategorija',     fill=True)
pdf.cell(18, 7, 'Sesija',         fill=True, align='C')
pdf.cell(25, 7, 'Ust. (min)',     fill=True, align='C')
pdf.cell(0,  7, 'Opis',           fill=True, new_x='LMARGIN', new_y='NEXT')

for i, (cat, n, saved, label) in enumerate(cat_data):
    bg = LIGHT if i % 2 == 0 else (255, 255, 255)
    pdf.set_fill_color(*bg)
    pdf.set_text_color(*DARK)
    pdf.set_font('Helvetica', '', 9)
    pdf.cell(50, 7, cat,        fill=True)
    pdf.cell(18, 7, str(n),     fill=True, align='C')
    pdf.cell(25, 7, str(saved), fill=True, align='C')
    pdf.cell(0,  7, label,      fill=True, new_x='LMARGIN', new_y='NEXT')

pdf.ln(3)
pdf.set_font('Helvetica', 'B', 9)
pdf.set_fill_color(*YELLOW)
pdf.set_text_color(*DARK)
pdf.cell(50, 7, 'UKUPNO', fill=True)
pdf.cell(18, 7, '13',     fill=True, align='C')
pdf.cell(25, 7, '640',    fill=True, align='C')
pdf.cell(0,  7, '~10h 40min ustecenog vremena', fill=True, new_x='LMARGIN', new_y='NEXT')

pdf.ln(8)
pdf.section('ZAKLJUCAK')
pdf.set_font('Helvetica', '', 10)
pdf.set_text_color(*DARK)
pdf.multi_cell(0, 7,
    'Tokom studentske prakse u periodu 03.05.2026. - 17.06.2026. uspjesno je '
    'implementiran kompletan sistem za iniciranje, pracenje i odobravanje narudzbi '
    'procjene nekretnina za Raiffeisen Bank BiH.\n\n'
    'Projekat je razvijan u timu koristeci Git Flow, sa vise od 80 commit-a i 53 '
    'pull request-a na GitHub repozitoriju rbbhofficial/studentskapraksaTema3. '
    'Koristena je moderna .NET 8 / Blazor Server arhitektura u kombinaciji s Keycloak '
    'za autentifikaciju/autorizaciju i PostgreSQL bazom podataka, deployana u Docker '
    'Compose okruzenju s nginx reverse proxy-jem.\n\n'
    'AI asistent Claude Code koristen je u 13 sesija ukupnog trajanja 5h 48min, '
    'cime je procijenjeno ustediceno 10h 40min manualnog rada. '
    'Kategorije: debugging (7 sesija), code generation (3), dokumentacija (1), '
    'infra setup (1), ostalo (1).',
    new_x='LMARGIN', new_y='NEXT')

pdf.ln(10)
pdf.set_fill_color(*RED)
pdf.set_text_color(255, 255, 255)
pdf.set_font('Helvetica', 'B', 11)
pdf.cell(0, 12, '  sruvic1  |  RBBH Studentska praksa  |  %s' % datetime.now().strftime('%d.%m.%Y'),
          fill=True, new_x='LMARGIN', new_y='NEXT')

out = '/Users/suljoruvic/Desktop/studentskapraksaTema3/Izvjestaj_Praksa_sruvic1.pdf'
pdf.output(out)
print('PDF kreiran:', out)
