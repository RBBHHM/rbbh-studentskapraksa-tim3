using BlazorApp.Models;

namespace BlazorApp.Services;

public sealed class Us93ApiService : BaseApiService
{
    public Us93ApiService(IHttpClientFactory factory, ILogger<Us93ApiService> logger, ActiveRoleState? activeRoleState = null)
        : base(factory, logger, activeRoleState: activeRoleState) { }

    public Task<Result> ApproveFinalAsync(int orderId, int appraiserRating = 4)
        => PostWithResultAsync($"/api/orders/{orderId}/approve-final", new { appraiserRating });

    public Task<Result<FinalAppraisalDocDto>> GetFinalAppraisalAsync(int orderId)
        => GetWithResultAsync<FinalAppraisalDocDto>($"/api/orders/{orderId}/final-appraisal");

    public Task<Result<ConfirmOriginalResultDto>> ConfirmOriginalAsync(int orderId)
        => PostWithDataResultAsync<object, ConfirmOriginalResultDto>(
            $"/api/orders/{orderId}/confirm-original", new { });

    public Task<Result<ReminderResultDto>> RemindAppraiserAsync(int orderId)
        => PostWithDataResultAsync<object, ReminderResultDto>(
            $"/api/orders/{orderId}/remind-appraiser", new { });

    public Task<Result<List<CodebookValueItem>>> GetCorrectionReasonsAsync()
        => GetListWithResultAsync<CodebookValueItem>("/api/codebooks/razlozi_dopune_dokumentacije/values/active");

    public Task<Result<CaDocumentReviewResultDto>> RequestCorrectionAsync(int orderId, int reasonCodeId, string? comment)
        => PostWithDataResultAsync<RequestCorrectionRequest, CaDocumentReviewResultDto>(
            $"/api/orders/{orderId}/request-correction", new RequestCorrectionRequest(reasonCodeId, comment));

    public Task<Result<CaDocumentReviewResultDto>> CompleteReviewAsync(int orderId)
        => PostWithDataResultAsync<object, CaDocumentReviewResultDto>(
            $"/api/orders/{orderId}/complete-review", new { });

    public Task<Result<CaDocumentReviewResultDto>> SubmitCorrectionAsync(int orderId, string? comment)
        => PostWithDataResultAsync<SubmitCorrectionRequest, CaDocumentReviewResultDto>(
            $"/api/orders/{orderId}/submit-correction", new SubmitCorrectionRequest(comment));

    public Task<Result<CaDocumentReviewResultDto>> ApproveAccessCheckAsync(int orderId, string? comment)
        => PostWithDataResultAsync<AccessCheckDecisionRequest, CaDocumentReviewResultDto>(
            $"/api/orders/{orderId}/access-check/approve", new AccessCheckDecisionRequest(comment));

    public Task<Result<CaDocumentReviewResultDto>> RejectAccessCheckAsync(int orderId, string comment)
        => PostWithDataResultAsync<AccessCheckDecisionRequest, CaDocumentReviewResultDto>(
            $"/api/orders/{orderId}/access-check/reject", new AccessCheckDecisionRequest(comment));

    public Task<Result<DeliverOriginalResultDto>> DeliverOriginalToOfficeAsync(int orderId)
        => PostWithDataResultAsync<object, DeliverOriginalResultDto>(
            $"/api/orders/{orderId}/deliver-original", new { });

    public Task<Result<SignConsentResultDto>> SignConsentAsync(int orderId)
        => PostWithDataResultAsync<object, SignConsentResultDto>(
            $"/api/orders/{orderId}/sign-consent", new { });
}