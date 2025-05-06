# REST API Plan

## 1. Resources

| Resource | Database Table | Description |
|----------|----------------|-------------|
| User | `users` | Discord-authenticated user who can manage servers |
| Server | `servers` | Discord guild configuration for the bot |
| Server Admin | `server_admins` | Mapping of users to servers where they have admin rights |
| Knowledge Document | `knowledge_documents` | Document that feeds the knowledge base of a server |
| Conversation | `conversations` | Conversation transcript between user and bot |
| Forwarded Ticket | `forwarded_tickets` | Ticket created when a conversation is escalated to human support |
| Shard | `shards` | Runtime shard status info (internal) |
| Server Shard | `server_shards` | Mapping of servers to shards (internal) |
| Billing Plan | `billing_plans` | Commercial plans offered |
| Subscription | `subscriptions` | Subscription of a server to a billing plan |
| Invoice | `invoices` | Billing invoices |
| Analytics | `analytics` | Daily aggregated statistics for a server |

> Note: “internal” resources are consumed only by the bot management service and are not exposed to the public dashboard API unless explicitly needed.

## 2. Endpoints

### 2.1 Authentication

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/discord` | Exchange Discord OAuth code for JWT issued by Supabase Auth |
| GET | `/auth/me` | Return the authenticated `User` profile |
| POST | `/auth/refresh` | Refresh access‑token using refresh‑token |

Authentication flows leverage Supabase Auth; all subsequent calls require the `Authorization: Bearer <jwt>` header.

---

### 2.2 Servers

| Method | Path | Description | Query Params | Success | Error |
|--------|------|-------------|--------------|---------|-------|
| GET | `/servers` | List servers current user administers | `page`, `pageSize`, `q` (name search) | 200 → `ServerList` | 401, 500 |
| POST | `/servers` | Register a new server and optional initial config | — | 201 → `Server` | 400 (validation), 409 (exists) |
| GET | `/servers/{id}` | Get single server | — | 200 → `ServerDetail` | 404, 403 |
| PATCH | `/servers/{id}` | Update mutable fields in `servers.config` | — | 200 → `Server` | 400, 403, 404 |
| DELETE | `/servers/{id}` | De‑activate server (sets `active=false`) | — | 204 | 403, 404 |

`ServerList` response example
```json
{
  "data": [
    {
      "id": "123456789",
      "name": "Acme Guild",
      "iconUrl": "https://...",
      "active": true,
      "config": {
        "enabled": false,
        "language": "en",
        "systemPrompt": "You are a helpful..."
      }
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 37
}
```

---

### 2.3 Server Configuration Convenience Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/servers/{id}/activate` | Enable the bot (`config.enabled=true`) |
| POST | `/servers/{id}/deactivate` | Disable the bot (`config.enabled=false`) |
| POST | `/servers/{id}/refresh-config` | Force bot to reload config immediately (backend publishes a NOTIFY) |

---

### 2.4 Server Admins

| Method | Path | Description |
|--------|------|-------------|
| GET | `/servers/{id}/admins` | List current admins |
| POST | `/servers/{id}/admins` | Add admin (`discordId`) |
| DELETE | `/servers/{id}/admins/{userId}` | Remove admin |

---

### 2.5 Knowledge Documents

| Method | Path | Description | Notes |
|--------|------|-------------|-------|
| GET | `/servers/{id}/documents` | Paginated list of documents | Supports `q`, `page`, `pageSize`, `fileType` |
| POST | `/servers/{id}/documents` | Upload new document | `multipart/form-data` (file) or JSON body `{title, content, fileType}` |
| GET | `/servers/{id}/documents/{docId}` | Get document metadata & content |
| PATCH | `/servers/{id}/documents/{docId}` | Update title/content |
| DELETE | `/servers/{id}/documents/{docId}` | Delete document |
| POST | `/servers/{id}/documents/{docId}/reindex` | Re‑run indexing (admin) |

`KnowledgeDocument` response
```json
{
  "id": "uuid",
  "title": "Getting Started",
  "fileType": "md",
  "createdAt": "2024-05-31T12:00:00Z",
  "updatedAt": "2024-05-31T12:01:00Z"
}
```

---

### 2.6 Conversations (Bot & Dashboard)

| Method | Path | Description | Filters |
|--------|------|-------------|---------|
| GET | `/servers/{id}/conversations` | List conversations | `status`, `from`, `to`, `page`, `pageSize`, `userId` |
| POST | `/servers/{id}/conversations` | Bot creates/updates conversation transcript | Consumed by bot service |
| GET | `/servers/{id}/conversations/{convId}` | Conversation detail |
| PATCH | `/servers/{id}/conversations/{convId}` | Update `status` or append transcript chunk |

---

### 2.7 Forwarded Tickets

| Method | Path | Description |
|--------|------|-------------|
| GET | `/servers/{id}/tickets` | List forwarded tickets |
| POST | `/servers/{id}/conversations/{convId}/forward` | Create a forwarded ticket (bot or dashboard) |
| PATCH | `/servers/{id}/tickets/{ticketId}` | Update ticket (`assignedTo`, `status`, `resolutionNotes`) |
| GET | `/servers/{id}/tickets/{ticketId}` | Ticket detail |

---

### 2.8 Analytics

| Method | Path | Description |
|--------|------|-------------|
| GET | `/servers/{id}/analytics` | List daily metrics | `from`, `to` |
| GET | `/servers/{id}/analytics/{date}` | Metrics for specific day |

---

### 2.9 Billing (Post‑MVP optional)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/billing/plans` | Public list of plans |
| GET | `/servers/{id}/subscription` | Current subscription |
| POST | `/servers/{id}/subscription` | Subscribe to plan |
| PATCH | `/servers/{id}/subscription` | Update/cancel subscription |
| GET | `/servers/{id}/invoices` | List invoices |
| GET | `/servers/{id}/invoices/{invoiceId}` | Invoice detail |

## 3. Authentication & Authorization

1. OAuth2 with Discord handled by Supabase. After successful OAuth the client receives a JWT.
2. All endpoints **require** `Authorization: Bearer <jwt>` except `/auth/*` and public `/billing/plans`.
3. Row Level Security (RLS) in Postgres ensures that:  
   - User can **SELECT/UPDATE** only servers they administer (`server_admins`).  
   - Same rule propagates to `knowledge_documents`, `conversations`, `forwarded_tickets`, `analytics` via SUPABASE policies.
4. Additional middleware checks:
   - `X-RateLimit-*` headers and 429 responses (per‑user per‑endpoint quotas).
   - For bot‑to‑API requests, a separate Service Key or bot JWT with `service_role` claims is used (bypasses RLS where required).

## 4. Validation & Business Logic

| Resource | Field Validation (API layer) | Business Rules |
|----------|-----------------------------|----------------|
| Server | `language` in ISO‑639‑1, `channels` each valid Discord channel‑ID, `maxMessagesPerUser` ≤ 100, `maxTextLength` ≤ 4000 | When `enabled` toggles, enqueue config refresh notify |
| KnowledgeDocument | `fileType` ∈ {txt, md, pdf} | File size ≤ 10 MB; after create/update trigger re‑index; duplicates (same hash) rejected |
| Conversation | `status` immutable once `completed` | Transcript max 10 000 items; when `forwarded` create ticket automatically |
| ForwardedTicket | `status` transition: pending→assigned→resolved; cannot revert | On `resolved` set `resolvedAt`; update analytics |
| Subscription | `status` managed by billing service only | Cannot create if existing active subscription |

### Common Error Codes

| Code | Meaning |
|------|---------|
| 400 | Validation failed |
| 401 | Not authenticated |
| 403 | Authenticated but not authorized (no admin rights) |
| 404 | Resource not found or not visible per RLS |
| 409 | Conflict (duplicate, invalid state transition) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

## 5. Pagination, Filtering & Sorting Guidelines

- All list endpoints accept `page` (1‑based) and `pageSize` (default 20, max 100).
- Pagination metadata returned in wrapper: `{ data, page, pageSize, total }`.
- Filtering via clearly named query params; values can be combined (e.g., `status=active&status=forwarded`).
- Sorting: `sort` (e.g., `sort=-createdAt`), whitelist allowed fields per resource.

## 6. Rate Limiting & Performance

- Dashboard endpoints: 60 requests/min per user.  
- Bot service endpoints (conversations): 10 requests/sec per server.
- Heavy list endpoints (`/conversations`, `/analytics`) must leverage proper Postgres indexes already defined:  
  - `conversations_status_idx`, `conversations_created_at_idx`  
  - `analytics_date_idx`, `analytics_server_id_idx`.
- Responses are compressed with gzip.
- Optional ETag/If‑None‑Match for GET endpoints.

## 7. Security Measures

- All endpoints served over HTTPS.
- Input sanitation and type‑checked via `zod` schemas (TypeScript runtime validation).
- Webhooks (if added) must verify `X-Signature` using HMAC.
- JWTs validated and revoked via Supabase introspection.

## 8. Error Response Example
```json
{
  "error": {
    "code": 400,
    "message": "Validation error",
    "details": [
      {
        "field": "language",
        "message": "Unsupported language code"
      }
    ]
  }
}
```

---

## 9. OpenAPI & Tooling

- A full OpenAPI 3.1 spec will be generated from source code annotations (`tsoa` or `zod-to-openapi`).
- Swagger UI served at `/docs` in non‑production environments.
- Contract tests ensure spec and implementation parity.

## 10. Assumptions & Notes

1. The bot itself is treated as a first‑party trusted client using a service‑role key.
2. Real‑time push (WebSocket) is out of scope for MVP; polling endpoints suffice.
3. Internal resources (`shards`, `server_shards`) are managed by the bot process and not documented for external clients.
4. File storage for PDFs uses Supabase Storage; `storage_path` is included in responses but upload handled via signed URL.
