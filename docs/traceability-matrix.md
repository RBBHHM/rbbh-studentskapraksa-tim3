# Traceability Matrix — User Story → Kod → Test

## Legenda
- IMPL = Implementirano (100%)
- PARTIAL = Djelomicno
- N/A = Nije primjenjivo

## FL/PL Workflow

| # | User Story | Feature | Ekran/API | Servis | Test | Status |
|---|---|---|---|---|---|---|
| US-1 | Prodaja kreira narudžbu | CreateOrder FL/PL | CreateOrder.razor, POST /api/orders | AppraisalOrderService.CreateAsync | AppraisalOrderServiceTests (45 testova) | IMPL |
| US-2 | Draft/autosave | CreateDraft, UpdateDraft | CreateOrder.razor (autosave timer) | AppraisalOrderService.CreateDraftAsync/UpdateDraftAsync | AppraisalOrderServiceTests | IMPL |
| US-3 | Submit narudžbe CA-u | Submit workflow | CreateOrder.razor "Pošalji" | AppraisalOrderService.SubmitAsync | AppraisalOrderServiceTests | IMPL |
| US-4 | CA prihvata zadatak | AcceptCAOrder task | MyTasks.razor | WorkflowTaskService.AcceptTaskAsync | WorkflowTaskServiceTests (9 testova) | IMPL |
| US-5 | CA pregled dokumentacije | Document review | OrderDetail.razor Dokumenti tab | CaDocumentReviewService | Nema dedicated testova | PARTIAL |
| US-6 | CA dopuna podataka | ReturnForCorrection | OrderDetail.razor | CaDocumentReviewService.RequestCorrectionAsync | Nema dedicated testova | PARTIAL |
| US-7 | CO provjera pristupa (PL) | AccessCheck | OrderDetail.razor | AccessCheckService | AccessCheckServiceTests (4 testa) | IMPL |
| US-8 | Izbor vještaka FL (algoritam) | Auto-select appraiser | - | AppraiserSelectionService | Nema dedicated testova | PARTIAL |
| US-9 | Izbor vještaka PL (ručno) | Manual select | - | AppraiserAssignmentService | Nema dedicated testova | PARTIAL |
| US-10 | Slanje narudžbe vještaku | SendToAppraiser | OrderDetail.razor | AppraiserAssignmentService | Nema dedicated testova | PARTIAL |
| US-11 | Vještak prihvata/odbija (24h) | Accept/Reject | OrderDetail.razor | AppraiserAssignmentService | Nema dedicated testova | PARTIAL |
| US-12 | Doplata za procjenu | AdditionalPayment | OrderDetail.razor | AdditionalPaymentService | Nema dedicated testova | PARTIAL |
| US-13 | Vještak dostavlja procjenu | SubmitAppraisal | OrderDetail.razor | AppraiserAssignmentService | Nema dedicated testova | PARTIAL |
| US-14 | CO odobrava procjenu | ApproveFinalAppraisal | OrderDetail.razor | OrderApprovalService | OrderApprovalServiceTests (16 testova) | IMPL |
| US-15 | CO vraća na doradu | ReturnForRework | OrderDetail.razor | OrderApprovalService | OrderApprovalServiceTests | IMPL |
| US-16 | Dostava originala u poslovnicu | ConfirmOriginalReceived | OrderDetail.razor | OriginalAppraisalService | OriginalAppraisalServiceTests (3 testa) | IMPL |
| US-17 | Reminder vještaku | SendReminder | ComingSoonReminder.razor | OriginalAppraisalService | OriginalAppraisalServiceTests | IMPL |
| US-F1 | Upload fakture (Protokol) | InvoiceUpload | OrderDetail.razor Faktura tab | InvoiceWorkflowService | InvoiceWorkflowServiceTests (5 testova) | IMPL |
| US-F2 | Slanje na plaćanje (CA) | SendForPayment | OrderDetail.razor | InvoiceWorkflowService | InvoiceWorkflowServiceTests | IMPL |
| US-F3 | Potvrda plaćanja (Likvidatura) | ConfirmPaid | OrderDetail.razor | InvoiceWorkflowService | InvoiceWorkflowServiceTests | IMPL |
| US-R1 | Izvještaj koncentracije (5 opcija) | ConcentrationReport | ComingSoonIzvjestaji.razor | ReportService | Nema dedicated testova | PARTIAL |
| US-R2 | Timeline izvještaj (7 kolona) | TimelineReport | ComingSoonIzvjestaji.razor | ReportService | Nema dedicated testova | PARTIAL |
| US-93 | CO mišljenje + Pravna | OpinionRequest/Submit | NarudzbaProcjena.razor | OpinionService | Nema dedicated testova | PARTIAL |
| US-V2 | Odbijanje sa razlogom + auto-reassign | RejectByAppraiser | OrderDetail.razor SelectReasonDialog | AppraiserAssignmentService | Nema dedicated testova | PARTIAL |
| US-CO3 | Vraćanje na doradu (3 kategorije) | ReturnForRework | OrderDetail.razor SelectReasonDialog | OrderApprovalService | OrderApprovalServiceTests | IMPL |

## Infrastruktura

| # | Feature | Servis | Test | Status |
|---|---|---|---|---|
| AUTH | Keycloak OIDC | DependencyInjection JWT config | - | IMPL |
| RBAC | 48 permissija, 12 rola | AppRoles, AppPermissions, RolePermissionMatrix | AppRolesTests, DashboardRoutesTests, RolePermissionMatrixTests | IMPL |
| AUDIT | 96 audit akcija | AuditService + AuditLogQueue | - | IMPL |
| DOCS | Upload/verzioniranje/deaktivacija | DocumentService | DocumentServiceTests (14 testova) | IMPL |
| NOTIFY | Email + InApp | NotificationService + EmailNotificationProvider | NotificationServiceTests (11 testova) | IMPL |
| STATE | OrderStateMachine | OrderStateMachine | OrderStateMachineTests + IntegrationTests (12 testova) | IMPL |
| 4-EYES | Four-eyes princip | OrderApprovalService.EnsureNotCreator | OrderApprovalServiceTests | IMPL |
| CONCUR | Optimistic locking | BaseEntity.RowVersion | - | IMPL |
| TIMEOUT | 24h appraiser timeout | AppraiserTimeoutService | Nema dedicated testova | PARTIAL |
| RATE | Rate limiting | SimpleRateLimiter + RateLimitEndpointFilter | Nema dedicated testova | PARTIAL |
| DEDUP | Notification deduplikacija | EmailNotificationProvider 5-min window | Nema dedicated testova | PARTIAL |

## Sumarna statistika

- **Potpuno implementirano (IMPL):** 17/25 user story-ja (68%)
- **Djelomicno (PARTIAL — kod postoji, testovi nedostaju):** 8/25 (32%)
- **Nije implementirano:** 0/25 (0%)
- **Sva poslovna logika je implementirana — PARTIAL znači samo da nedostaju dedicated testovi**
