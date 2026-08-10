using Praksa.Application.Common.Branches;

namespace Praksa.Application.Common.Validation;

/// <summary>
/// Validacija kombinacije grad/poslovnica — delegira na <see cref="BranchCatalog"/>
/// koji je jedini izvor istine za poslovnicu-grad mapiranje.
/// </summary>
public static class BranchCityMap
{
    public static bool IsValid(string? city, string? branch) =>
        BranchCatalog.IsValidCityBranch(city, branch);
}
