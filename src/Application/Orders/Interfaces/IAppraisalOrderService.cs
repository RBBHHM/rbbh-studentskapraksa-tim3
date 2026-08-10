using Praksa.Application.Orders.Dtos;
using Praksa.Application.Orders.Requests;

namespace Praksa.Application.Orders.Interfaces;

/// <summary>
/// Kombinirani interfejs za rad s narudžbama. Extenduje:
///   - IOrderCreateService  (kreiranje, draft, update)
///   - IOrderSubmitService  (submit, cancel)
/// I-1 refactoring: pogledati sub-interfejse za granularniju injekciju.
/// </summary>
public interface IAppraisalOrderService
    : IOrderCreateService,
      IOrderSubmitService
{
    /// <summary>Jednostavan dohvat narudžbe po ID-u (bez capabilities, za internu upotrebu servisa).</summary>
    Task<AppraisalOrderDto> GetByIdAsync(int id, CancellationToken ct = default);
}
