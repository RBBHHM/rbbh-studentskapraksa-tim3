using Praksa.Application.Common.Models;
using Praksa.Application.Orders.Dtos;
using Praksa.Domain.Orders;

namespace Praksa.Application.Orders.Interfaces;

public interface IProtocolService
{
    Task<ProtocolEntryDto> GetByOrderIdAsync(int orderId, CancellationToken ct = default);
    Task<PagedResult<ProtocolEntryDto>> GetProtocolListAsync(int page = 1, int pageSize = 20, CancellationToken ct = default);
    Task<OrderProtocolEntry> CreateProtocolForOrderAsync(int orderId, CancellationToken ct = default);
}
