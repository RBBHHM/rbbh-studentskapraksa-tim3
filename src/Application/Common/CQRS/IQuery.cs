using MediatR;

namespace Praksa.Application.Common.CQRS;

/// <summary>
/// Marker za operacije čitanja (read-only).
/// Pipeline: LoggingBehavior → handler. Audit se ne primjenjuje.
/// </summary>
public interface IQuery<TResult> : IRequest<TResult> { }
