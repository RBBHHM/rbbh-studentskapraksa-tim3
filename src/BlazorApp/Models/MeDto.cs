namespace BlazorApp.Models;

public sealed class MeDto
{
    public string? UserId           { get; init; }
    public string? Username         { get; init; }
    public string? DisplayName      { get; init; }
    public string? Email            { get; init; }
    public IReadOnlyList<string> Roles            { get; init; } = [];
    public IReadOnlyList<string> Permissions      { get; init; } = [];
    public string? DefaultRoute     { get; init; }
    public IReadOnlyList<string> AvailableModules { get; init; } = [];
    public string  UserStatus       { get; init; } = "Active";
}
