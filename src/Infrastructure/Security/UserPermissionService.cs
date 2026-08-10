using Praksa.Application.Common.Interfaces;
using Praksa.Application.Security;
using Praksa.Application.Security.Interfaces;

namespace Praksa.Infrastructure.Security;

/// <summary>
/// Implementacija <see cref="IUserPermissionService"/>.
/// Izračunava permission-e trenutnog korisnika putem <see cref="RolePermissionMatrix"/>.
/// Podržava korisnike sa više rola — permission-e se sabiraju.
/// </summary>
public class UserPermissionService : IUserPermissionService
{
    private readonly ICurrentUserService _currentUser;

    public UserPermissionService(ICurrentUserService currentUser)
    {
        _currentUser = currentUser;
    }

    public bool CurrentUserHasPermission(string permission) =>
        RolePermissionMatrix
            .GetPermissionsForRoles(_currentUser.Roles)
            .Contains(permission);
}
