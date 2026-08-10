# API standardi

## URL konvencije

- Koristite **kebab-case**: `/api/audit-logs`, ne `/api/auditLogs`
- Resursi u množini: `/api/items`, `/api/users`
- Verzioniranje prefiksom: `/api/v1/items` (opciono za sada)

## HTTP metode

| Metoda | Akcija | Status kod |
|--------|--------|-----------|
| GET | Čitanje resursa | 200 OK |
| POST | Kreiranje | 201 Created |
| PUT | Cijelo ažuriranje | 200 OK |
| PATCH | Parcijalno ažuriranje | 200 OK |
| DELETE | Brisanje | 204 No Content |

## Response format

```json
{
  "data": { ... },
  "errors": null
}
```

Za paginovane liste:
```json
{
  "data": {
    "items": [...],
    "totalCount": 100,
    "page": 1,
    "pageSize": 20
  }
}
```

## Error response

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.4",
  "title": "Not Found",
  "status": 404,
  "detail": "Entity 'Item' with key '42' was not found.",
  "traceId": "00-abc..."
}
```

## Correlation ID

Svaki request prima `X-Correlation-ID` header (ili se generiše automatski). Response uvijek vraća isti header.

## Health check

- `GET /health` — ukupan status
- `GET /health/ready` — readiness (baza dostupna?)
- `GET /health/live` — liveness (aplikacija živa?)
