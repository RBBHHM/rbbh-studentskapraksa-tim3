namespace BlazorApp.Models;

public sealed class UserRoleListItemDto
{
    public string UserId { get; init; } = string.Empty;
    public string Username { get; init; } = string.Empty;
    public string? DisplayName { get; init; }
    public string? Email { get; init; }
    public bool IsActive { get; init; }
    public IReadOnlyList<string> Roles { get; init; } = [];
    public IReadOnlyList<string> EffectivePermissions { get; init; } = [];
    public bool CanManageRoles { get; init; }
}
