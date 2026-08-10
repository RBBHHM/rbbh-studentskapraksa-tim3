namespace BlazorApp.Models;

public record CityDto(int Id, string Name);

public record BranchDto(int Id, string Code, string Name, string Address, int CityId, string CityName);
