using BlazorApp.Models;
using BlazorApp.Services;

namespace BlazorApp.Services;

// ── Models ────────────────────────────────────────────────────────────────────

public sealed record RoleDefinitionDto(
    int      Id,
    string   Name,
    string   DisplayName,
    string?  Description,
    bool     IsSystem,
    bool     IsActive,
    bool     IsDeleted,
    DateTime CreatedAt,
    string?  CreatedByUserId,
    DateTime UpdatedAt,
    string?  UpdatedByUserId,
    IReadOnlyList<PermissionDto> Permissions);

public sealed record RoleDefinitionListItemDto(
    int     Id,
    string  Name,
    string  DisplayName,
    string? Description,
    bool    IsSystem,
    bool    IsActive,
    int     PermissionCount,
    int     UserCount);

public sealed record PermissionDto(
    int     Id,
    string  Code,
    string  DisplayName,
    string? Description,
    string  Module,
    bool    IsActive);

public sealed record AuditLogItemDto(
    long     Id,
    DateTime TimestampUtc,
    string?  ActorUserId,
    string?  ActorUsername,
    string?  ActorEmail,
    string?  ActorFullName,
    string?  ActorRole,
    string?  ActiveRole,
    string   Action,
    string   OperationType,
    string   Module,
    string?  EntityType,
    string?  EntityKey,
    string?  EntityDisplayName,
    string?  OldValuesJson,
    string?  NewValuesJson,
    string?  ChangedFieldsJson,
    string   Status,
    string   Severity,
    string?  Reason,
    string?  CorrelationId,
    string?  RequestPath,
    string?  IpAddress,
    string?  UserAgent);

public sealed record CreateRoleRequest(string Name, string DisplayName, string? Description);
public sealed record UpdateRoleRequest(string DisplayName, string? Description);
public sealed record AddPermissionRequest(int PermissionDefinitionId);
public sealed record SuspendRequest(string? Reason);

// ── Service ───────────────────────────────────────────────────────────────────

public class AccessManagementService : BaseApiService
{
    public AccessManagementService(IHttpClientFactory factory, ILogger<AccessManagementService> logger, ActiveRoleState? activeRoleState = null)
        : base(factory, logger, activeRoleState: activeRoleState) { }

    // ── Role Definitions ──────────────────────────────────────────────────────

    public Task<Result<PagedResult<RoleDefinitionListItemDto>>> GetRolesAsync(
        string? search = null, bool? isActive = null, int page = 1, int pageSize = 20,
        CancellationToken ct = default)
    {
        var url = $"/api/admin/roles?page={page}&pageSize={pageSize}";
        if (!string.IsNullOrWhiteSpace(search)) url += $"&search={Uri.EscapeDataString(search)}";
        if (isActive.HasValue) url += $"&isActive={isActive.Value.ToString().ToLower()}";
        return GetWithResultAsync<PagedResult<RoleDefinitionListItemDto>>(url);
    }

    public Task<Result<RoleDefinitionDto>> GetRoleByIdAsync(int id, CancellationToken ct = default)
        => GetWithResultAsync<RoleDefinitionDto>($"/api/admin/roles/{id}");

    public Task<Result<RoleDefinitionDto>> CreateRoleAsync(CreateRoleRequest req, CancellationToken ct = default)
        => PostWithDataResultAsync<CreateRoleRequest, RoleDefinitionDto>("/api/admin/roles", req);

    public async Task<Result<RoleDefinitionDto>> UpdateRoleAsync(int id, UpdateRoleRequest req, CancellationToken ct = default)
    {
        var put = await PutWithResultAsync($"/api/admin/roles/{id}", req);
        if (!put.IsSuccess)
            return Result<RoleDefinitionDto>.Failure(put.ErrorMessage ?? "Greška.", put.StatusCode);
        return await GetRoleByIdAsync(id, ct);
    }

    public Task<Result<RoleDefinitionDto>> DeactivateRoleAsync(int id, CancellationToken ct = default)
        => PostWithDataResultAsync<object, RoleDefinitionDto>($"/api/admin/roles/{id}/deactivate", new { });

    public Task<Result<RoleDefinitionDto>> ActivateRoleAsync(int id, CancellationToken ct = default)
        => PostWithDataResultAsync<object, RoleDefinitionDto>($"/api/admin/roles/{id}/activate", new { });

    public Task<Result> DeleteRoleAsync(int id, CancellationToken ct = default)
        => DeleteWithResultAsync($"/api/admin/roles/{id}");

    public Task<Result<RoleDefinitionDto>> AddPermissionToRoleAsync(int roleId, int permId, CancellationToken ct = default)
        => PostWithDataResultAsync<AddPermissionRequest, RoleDefinitionDto>(
            $"/api/admin/roles/{roleId}/permissions", new AddPermissionRequest(permId));

    public async Task<Result<RoleDefinitionDto>> RemovePermissionFromRoleAsync(int roleId, int permId, CancellationToken ct = default)
    {
        var deleteResult = await DeleteWithResultAsync($"/api/admin/roles/{roleId}/permissions/{permId}");
        if (!deleteResult.IsSuccess)
            return Result<RoleDefinitionDto>.Failure(deleteResult.ErrorMessage ?? "Greška pri uklanjanju permissiona.", deleteResult.StatusCode);
        return await GetRoleByIdAsync(roleId, ct);
    }

    // ── Permission Catalog ────────────────────────────────────────────────────

    public Task<Result<IReadOnlyList<PermissionDto>>> GetPermissionsAsync(CancellationToken ct = default)
        => GetWithResultAsync<IReadOnlyList<PermissionDto>>("/api/admin/permissions");

    // ── User Suspension ───────────────────────────────────────────────────────

    public Task<Result> SuspendUserAsync(string userId, string? reason, CancellationToken ct = default)
        => PostWithResultAsync($"/api/users/{userId}/suspend", new SuspendRequest(reason));

    public Task<Result> ReactivateUserAsync(string userId, CancellationToken ct = default)
        => PostWithResultAsync($"/api/users/{userId}/reactivate", new { });

    // ── Šifarnici (count za Dashboard) ────────────────────────────────────────

    public async Task<int> GetCodebooksCountAsync(CancellationToken ct = default)
    {
        var result = await GetWithResultAsync<PagedCountOnly>("/api/admin/codebooks?page=1&pageSize=1");
        return result.IsSuccess ? result.Data?.TotalCount ?? 0 : 0;
    }

    private sealed record PagedCountOnly(int TotalCount);

    // ── Audit ─────────────────────────────────────────────────────────────────

    public Task<Result<PagedResult<AuditLogItemDto>>> GetAuditAsync(
        string? module = null, string? action = null, string? status = null,
        string? severity = null, string? search = null,
        string? entityType = null, string? entityKey = null,
        string? actorUsername = null, string? actorRole = null,
        DateTime? from = null, DateTime? to = null,
        int page = 1, int pageSize = 50,
        CancellationToken ct = default)
    {
        var url = $"/api/audit?page={page}&pageSize={pageSize}";
        if (!string.IsNullOrWhiteSpace(module))        url += $"&module={Uri.EscapeDataString(module)}";
        if (!string.IsNullOrWhiteSpace(action))        url += $"&action={Uri.EscapeDataString(action)}";
        if (!string.IsNullOrWhiteSpace(status))        url += $"&status={Uri.EscapeDataString(status)}";
        if (!string.IsNullOrWhiteSpace(severity))      url += $"&severity={Uri.EscapeDataString(severity)}";
        if (!string.IsNullOrWhiteSpace(search))        url += $"&search={Uri.EscapeDataString(search)}";
        if (!string.IsNullOrWhiteSpace(entityType))    url += $"&entityType={Uri.EscapeDataString(entityType)}";
        if (!string.IsNullOrWhiteSpace(entityKey))     url += $"&entityKey={Uri.EscapeDataString(entityKey)}";
        if (!string.IsNullOrWhiteSpace(actorUsername)) url += $"&actorUsername={Uri.EscapeDataString(actorUsername)}";
        if (!string.IsNullOrWhiteSpace(actorRole))     url += $"&actorRole={Uri.EscapeDataString(actorRole)}";
        if (from.HasValue) url += $"&from={Uri.EscapeDataString(from.Value.ToString("O"))}";
        if (to.HasValue)   url += $"&to={Uri.EscapeDataString(to.Value.ToString("O"))}";
        return GetWithResultAsync<PagedResult<AuditLogItemDto>>(url);
    }
}
