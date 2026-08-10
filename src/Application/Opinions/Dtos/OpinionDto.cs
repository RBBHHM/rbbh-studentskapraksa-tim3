using Praksa.Domain.Orders;

namespace Praksa.Application.Opinions.Dtos;

public sealed record OpinionDto(
    OpinionType   OpinionType,
    OpinionStatus Status,
    string?       ImportedByUserId,
    DateTime?     ImportedAt,
    string?       Comment,
    int?          DocumentId
);