using BlazorApp.Models;
using System.Net.Http.Json;

namespace BlazorApp.Services;

public sealed class OrderService : BaseApiService
{
    public OrderService(IHttpClientFactory factory, ILogger<OrderService> logger, ActiveRoleState? activeRoleState = null)
        : base(factory, logger, activeRoleState: activeRoleState) { }

    // ── Narudžbe ──────────────────────────────────────────────────────────────

    public Task<Result<AppraisalOrderDto>> CreateDraftAsync(string? workflowType = null)
        => PostWithDataResultAsync<object, AppraisalOrderDto>(
            $"/api/orders/draft{(string.IsNullOrWhiteSpace(workflowType) ? "" : $"?tip={workflowType}")}", new { });

    public Task<Result<AppraisalOrderDto>> UpdateDraftAsync(int id, UpdateOrderRequest req, bool autosave = false)
        => PutWithDataResultAsync<UpdateOrderRequest, AppraisalOrderDto>(
            $"/api/orders/{id}{(autosave ? "?autosave=true" : "")}", req);

    public Task<Result<AppraisalOrderDto>> GetByIdAsync(int id)
        => GetWithResultAsync<AppraisalOrderDto>($"/api/orders/{id}");

    public Task<Result<AppraisalOrderDetailDto>> GetDetailByIdAsync(int id)
        => GetWithResultAsync<AppraisalOrderDetailDto>($"/api/orders/{id}/detail");

    public Task<Result<PagedResult<AppraisalOrderListItemDto>>> GetListAsync(
        int page = 1, int pageSize = 20, string? search = null, string? status = null,
        string? city = null, string? appraisalType = null,
        DateTime? createdFrom = null, DateTime? createdTo = null,
        string? sortBy = null, bool sortDescending = true)
    {
        var qs = $"/api/orders?page={page}&pageSize={pageSize}&sortDescending={sortDescending}";
        if (!string.IsNullOrWhiteSpace(search))        qs += $"&search={Uri.EscapeDataString(search)}";
        if (!string.IsNullOrWhiteSpace(status))        qs += $"&status={status}";
        if (!string.IsNullOrWhiteSpace(city))          qs += $"&city={Uri.EscapeDataString(city)}";
        if (!string.IsNullOrWhiteSpace(appraisalType)) qs += $"&appraisalType={appraisalType}";
        if (createdFrom.HasValue)                      qs += $"&createdFrom={createdFrom.Value:yyyy-MM-dd}";
        if (createdTo.HasValue)                        qs += $"&createdTo={createdTo.Value:yyyy-MM-ddTHH:mm:ss}";
        if (!string.IsNullOrWhiteSpace(sortBy))        qs += $"&sortBy={sortBy}";
        return GetWithResultAsync<PagedResult<AppraisalOrderListItemDto>>(qs);
    }

    public Task<Result<OrderSummaryDto>> GetSummaryAsync()
        => GetWithResultAsync<OrderSummaryDto>("/api/orders/summary");

    public Task<Result<AppraisalOrderDto>> SubmitAsync(int id)
        => PostWithDataResultAsync<object, AppraisalOrderDto>($"/api/orders/{id}/submit", new { });

    public Task<Result> CancelAsync(int id)
        => DeleteWithResultAsync($"/api/orders/{id}");

    /// <summary>Vještak prihvata dodijeljenu narudžbu i započinje izradu procjene.</summary>
    public Task<Result> AcceptByAppraiserAsync(int id)
        => PostWithResultAsync($"/api/orders/{id}/accept-by-appraiser", new { });

    /// <summary>Vještak odbija narudžbu s razlogom — sistem automatski dodjeljuje sljedećeg vještaka.</summary>
    public Task<Result> RejectByAppraiserAsync(int id, int reason, string? comment)
        => PostWithResultAsync($"/api/orders/{id}/reject-by-appraiser",
               new { Reason = reason, Comment = comment });

    /// <summary>Vještak traži doplatu za narudžbu.</summary>
public Task<Result> RequestAdditionalPaymentAsync(int id, decimal? amount = null, string? reason = null)
    => PostWithResultAsync($"/api/orders/{id}/additional-payment/request",
           new { reason, amount });

    /// <summary>CA potvrđuje da je doplata izvršena — vještak dobiva obavijest.</summary>
    public Task<Result> ConfirmAdditionalPaymentAsync(int id)
        => PostWithResultAsync($"/api/orders/{id}/confirm-additional-payment", new { });

    /// <summary>Vještak dostavlja gotovu procjenu na CO.</summary>
    public Task<Result> SubmitAppraisalAsync(int id, DateTime visitDate)
        => PostWithResultAsync($"/api/orders/{id}/submit-appraisal", new { visitDate });

    /// <summary>Generiše narudžbenicu i izjavu (Word) iz podataka Protokola.</summary>
    public Task<Result<OrderDocumentGenerationResultDto>> GenerateOrderDocumentsAsync(
        int id, decimal? iznos = null, string? zkOznaka = null)
        => PostWithDataResultAsync<object, OrderDocumentGenerationResultDto>(
            $"/api/orders/{id}/documents/generate", new { iznos, zkOznaka });

    // ── Reminder vještaku (original dostava) ──────────────────────────────

    public Task<Result> SendReminderAsync(int id)
        => PostWithResultAsync($"/api/orders/{id}/remind-appraiser", new { });

    // ── S3-15: Reminder vještaku za STATUS izrade procjene ────────────────
    // Endpoint: GET /api/reports/appraiser-reminders
    // Filter: status "u obradi" + OrderSentToAppraiserAt > N radnih dana

    public Task<Result<AppraiserReminderReportModel>> GetOverdueAppraisalsAsync(
        int? appraiserId = null, int minBusinessDays = 5, int page = 1, int pageSize = 50)
    {
        var url = $"/api/reports/appraiser-reminders?minBusinessDaysOverdue={minBusinessDays}&page={page}&pageSize={pageSize}";
        if (appraiserId.HasValue) url += $"&appraiserId={appraiserId.Value}";
        return GetWithResultAsync<AppraiserReminderReportModel>(url);
    }

    public Task<Result<ReminderSentModel>> SendAppraisalStatusReminderAsync(int orderId)
        => PostWithDataResultAsync<object, ReminderSentModel>(
            $"/api/reports/appraiser-reminders/{orderId}/send", new { });

    // ── Administrativno odbijanje narudžbe (CA/CO) ─────────────────────────
    public Task<Result> AdminRejectOrderAsync(int id, string reason, string? comment = null)
        => PostWithResultAsync($"/api/orders/{id}/reject-order", new { reason, comment });

    // ── Dorada procjene (CO vraća) ──────────────────────────────────────

    public Task<Result> ReturnForReworkAsync(int id, string category, string comment)
        => PostWithResultAsync($"/api/orders/{id}/return-for-rework", new { category, comment });

    // ── Faktura workflow (US-F1/F2/F3) ─────────────────────────────────────

    public Task<Result<InvoiceWorkflowResultDto>> UploadInvoiceAsync(int orderId, int documentId)
        => PostWithDataResultAsync<object, InvoiceWorkflowResultDto>(
            $"/api/orders/{orderId}/invoice/upload", new { documentId });

    public Task<Result<InvoiceWorkflowResultDto>> SendInvoiceForPaymentAsync(int orderId)
        => PostWithDataResultAsync<object, InvoiceWorkflowResultDto>(
            $"/api/orders/{orderId}/invoice/send-for-payment", new { });

    public Task<Result<InvoiceWorkflowResultDto>> ConfirmInvoicePaidAsync(int orderId)
        => PostWithDataResultAsync<object, InvoiceWorkflowResultDto>(
            $"/api/orders/{orderId}/invoice/confirm-paid", new { });

    public Task<Result<InvoiceStatusDto>> GetInvoiceStatusAsync(int orderId)
        => GetWithResultAsync<InvoiceStatusDto>($"/api/orders/{orderId}/invoice/status");

    // ── Šifarnici ─────────────────────────────────────────────────────────────

    public Task<Result<List<CodebookValueItem>>> GetCollateralTypesAsync()
        => GetListWithResultAsync<CodebookValueItem>("/api/codebooks/collateral-types");

    public Task<Result<List<CodebookValueItem>>> GetCombinedCollateralTypesAsync()
        => GetListWithResultAsync<CodebookValueItem>("/api/codebooks/combined-collateral-types");

    public Task<Result<List<CodebookValueItem>>> GetCitiesAsync()
        => GetListWithResultAsync<CodebookValueItem>("/api/codebooks/gradovi/values/active");

    public Task<Result<List<CodebookValueItem>>> GetPropertyTypesAsync()
        => GetListWithResultAsync<CodebookValueItem>("/api/codebooks/tipovi_nekretnina/values/active");

    public Task<Result<List<CodebookValueItem>>> GetBranchesAsync()
        => GetListWithResultAsync<CodebookValueItem>("/api/codebooks/poslovnice/values/active");

    public Task<Result<List<CodebookValueItem>>> GetClientTypesAsync()
        => GetListWithResultAsync<CodebookValueItem>("/api/codebooks/tipovi_klijenata/values/active");

    // ── Taskovi ────────────────────────────────────────────────────────────────

    public Task<Result<PagedResult<WorkflowTaskDto>>> GetMyTasksAsync(int page = 1, int pageSize = 20)
        => GetWithResultAsync<PagedResult<WorkflowTaskDto>>($"/api/tasks/my?page={page}&pageSize={pageSize}");

    public Task<Result<WorkflowTaskDto>> AcceptTaskAsync(int taskId)
        => PostWithDataResultAsync<object, WorkflowTaskDto>($"/api/tasks/{taskId}/accept", new { });

    public Task<Result<WorkflowTaskDto>> CompleteTaskAsync(int taskId, string? comment = null)
        => PostWithDataResultAsync<object, WorkflowTaskDto>($"/api/tasks/{taskId}/complete", new { comment });

}
