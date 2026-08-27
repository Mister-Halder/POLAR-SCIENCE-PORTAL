# India PolaRis — architecture and setup

## Shape of the system

```text
Browser ──► TanStack Start (SSR routes, server functions)
                 │  never holds S3 / DB credentials
                 ▼
          Express API (Node 22, TypeScript)
             ├── Postgres 16        (metadata, users, roles, audit)
             ├── Meilisearch        (faceted dataset search)
             └── S3-compatible store (dataset objects, media)
```

The public site is fully server-rendered and works with the curated in-repo
catalogue when no backend is attached, so every route stays demonstrable. The
moment `POLAR_API_URL`, `MEILISEARCH_HOST` or the `S3_*` variables are set, the
matching server function switches to the live service — see
`src/lib/api/search.functions.ts` and `src/lib/api/uploads.functions.ts`.

## Feature modules

| Path | Responsibility |
| --- | --- |
| `src/features/expeditions` | Expedition + station records, coordinates |
| `src/features/repository` | Dataset catalogue, facets, query engine |
| `src/features/learning` | Modules, lesson sections, quizzes |
| `src/features/media` | Media library items and licences |
| `src/features/auth` | Roles, permission matrix, demo session |
| `src/components/globe` | Interactive orthographic globe + map fallback |
| `src/routes` | SSR routes; `/admin/*` is a separate console shell |

## Auth and RBAC

- Argon2id password hashing; 15-minute JWT access token (RS256 in production).
- Opaque refresh token, hashed at rest, rotated per use with family-based reuse
  detection; delivered as `HttpOnly; Secure; SameSite=Strict` cookie.
- Roles: `public`, `researcher`, `curator`, `admin`, stored in `user_roles`
  (never on the profile row). Permission checks are enforced in the API; the UI
  only hides what the API would already refuse.
- Every privileged action writes to `audit_log`.

## Presigned upload / download flow

1. Client validates the form, computes SHA-256 locally.
2. `initDatasetUpload` server function → `POST /v1/uploads/presign` with the
   bearer token. API authorises the role, allocates an `object_key`, returns a
   single-method presigned PUT valid for `S3_PRESIGN_TTL_SECONDS` (default 300).
3. Browser PUTs the bytes directly to object storage.
4. API recomputes the checksum server-side and rejects mismatches.
5. Curator review → publish → DataCite DOI minted → Meilisearch document upsert.

Downloads mirror this: `POST /v1/datasets/:id/files/:file/download-url` checks
access level, licence acceptance and role, logs a `download_events` row, and
returns a short-lived presigned GET.

## Local setup

```bash
cp .env.example .env      # fill in secrets locally; never commit them
bun install
bun run dev               # portal on :8080
```

Backing services (compose file to add alongside the API service):

```yaml
services:
  postgres:
    image: postgres:16
    environment: { POSTGRES_USER: polar, POSTGRES_DB: polar }
    ports: ["5432:5432"]
  meilisearch:
    image: getmeili/meilisearch:v1.9
    ports: ["7700:7700"]
  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    ports: ["9000:9000", "9001:9001"]
```

Apply the schema with `psql "$DATABASE_URL" -f db/schema.sql`. Seed content for
expeditions, datasets, modules and media currently lives in the feature modules
and is the source of truth for the demo catalogue.

## Accessibility and design constraints

- Semantic landmarks, one `h1` per route, skip-to-content link, visible focus
  rings on a 2px accent outline.
- All colour comes from semantic tokens in `src/styles.css` (light and dark);
  no hardcoded colour utilities in components.
- The globe is keyboard-rotatable, pauses under `prefers-reduced-motion`, and
  offers an equivalent flat map + list fallback.
- Tables scroll horizontally on small screens; every form control is labelled.
