using MediatR;
using Praksa.Application.Common.CQRS;
using Praksa.Application.Opinions;
using Praksa.Application.Opinions.Dtos;

namespace Praksa.Application.Opinions.Queries;

public sealed record GetOpinionsQuery(int OrderId) : IQuery<List<OpinionDto>>;

public sealed class GetOpinionsQueryHandler : IRequestHandler<GetOpinionsQuery, List<OpinionDto>>
{
    private readonly IOpinionService _service;
    public GetOpinionsQueryHandler(IOpinionService service) => _service = service;
    public Task<List<OpinionDto>> Handle(GetOpinionsQuery query, CancellationToken ct)
        => _service.GetOpinionsAsync(query.OrderId, ct);
}
