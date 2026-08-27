# Local development quick reference

## Sync after pulling code

Run this from the repository root after `git pull` or switching branches:

```powershell
# Pull/start local dependencies (including MinIO), install packages, regenerate/validate Prisma, and apply migrations.
make sync
```

The command is safe to run repeatedly and does not delete existing data. Without GNU Make, use:

```powershell
# Same synchronization workflow without Make.
npm run sync
```

## Rebuild Docker images

Use this after pulling code that runs inside Docker or changing a Dockerfile:

```powershell
# Pull all local service images and rebuild frontend/backend images from the current working tree.
make images
```

`make build-images` is an equivalent explicit alias. It pulls the upstream images declared by the backend Compose file
(MinIO, MinIO client, PostgreSQL, Redis, Mailpit, and the optional Adminer image) and rebuilds the two application
images. It does not start or recreate containers. Recreate services afterward so they use the new images:

```powershell
# Recreate the frontend container.
docker compose up -d --force-recreate frontend

# Recreate the backend container.
docker compose -f backend/compose.yaml up -d --force-recreate backend
```

## Reset template data for local testing

Use this when template test data is inconsistent or a template lifecycle test needs a clean registry:

```powershell
# Destructive for template-bound local data; does not reset the whole database.
make reset-templates
```

This removes `Template` and `TemplateVersion`, detaches website/invitation selections, resets their published state and slugs, and removes template-bound snapshots/recaps. Wedding, guest, content, wish, and media data are preserved. The command is blocked for `APP_ENV=staging` and `APP_ENV=production`; use it only with a local/test database.

Equivalent npm command:

```powershell
# Same template-only reset without Make.
npm run db:reset-templates
```

Run the template sync/release flow after the reset to repopulate the registry.

## URLs and ports

| Service | URL / host:port | Notes |
|---|---|---|
| Frontend Vite | http://localhost:5173 | `cd frontend; npm run dev` |
| Frontend Docker/Nginx | http://localhost:8080 | Root Compose; override with `FRONTEND_PORT` |
| Backend API | http://localhost:3000/api | `cd backend; npm run dev` |
| Health | http://localhost:3000/api/health/live | Liveness |
| Readiness | http://localhost:3000/api/health/ready | Database readiness |
| Swagger UI | http://localhost:3000/api-docs | Requires `API_DOCS_ENABLED=true` |
| PostgreSQL | localhost:5432 | Host port; container hostname `postgres` |
| Adminer | http://localhost:8081 | Backend Compose `tools` profile |
| Mailpit UI | http://localhost:8025 | SMTP host port `localhost:1025` |
| Redis | localhost:6379 | Container hostname `redis` |
| MinIO S3 API | http://localhost:9000 | Bucket `gmm-wedding`; Console: http://localhost:9001 |

## Seed accounts

`make database-seed` creates or updates the following local/test accounts. These credentials are for local development only and must not be reused in staging or production.

| Email | Password | Role |
|---|---|---|
| `owner.local@gmm.test` | `LocalOwnerPassword123!` | Local owner and platform admin |
| `admin@gmail.com` | `mytester123@` | Platform admin test account |
| `user@gmail.com` | `mytester123@` | Wedding owner test account |
| `user2@gmail.com` | `mytester123@` | Wedding viewer test account |

The test fixture password can be overridden with `SEED_TEST_PASSWORD`; the local owner password can be overridden with `SEED_OWNER_PASSWORD`.

## Daily commands

```powershell
# Frontend: enter the frontend project.
cd frontend

# Install frontend dependencies. After pulling code, prefer `make sync` at the repo root.
npm install

# Start the Vite development server.
npm run dev

# Run frontend linting.
npm run lint

# Check frontend TypeScript.
npm run typecheck

# Run frontend tests.
npm run test

# Build the frontend production bundle.
npm run build

# Preview the built frontend bundle.
npm run preview

# Backend: enter the backend project.
cd ..\backend

# Install backend dependencies. After pulling code, prefer `make sync` at the repo root.
npm install

# Start the Next.js API in development mode.
npm run dev

# Run backend linting.
npm run lint

# Check backend TypeScript.
npm run typecheck

# Run backend unit tests.
npm run test

# Run backend integration tests.
npm run test:integration

# Run the standard backend quality gate.
npm run check

# Generate the Prisma client after schema or dependency changes.
npm run db:generate

# Validate the Prisma schema without changing the database.
npm run db:validate

# Create/apply a development migration after intentionally changing schema.prisma.
npm run db:migrate

# Apply committed migrations without creating a new migration.
npm run db:migrate:deploy

# Insert/update local idempotent demo data.
npm run db:seed

# Docker: return to the repository root.
cd ..

# Build and start the root frontend Compose service.
docker compose up --build

# Stop root Compose services.
docker compose down

# Follow frontend container logs.
docker compose logs -f frontend

# Build/start backend services and local tooling.
docker compose -f backend/compose.yaml --profile tools up --build

# Follow backend container logs.
docker compose -f backend/compose.yaml logs -f backend
```

## Migrate fresh

Reset database local/test, apply all migrations again and run the seed:

```powershell
cd backend
npx prisma migrate reset --force
npm run db:seed
```

This permanently deletes all data in the selected database. Do not run it against staging or production. The backend Compose migration job is run with:

```powershell
docker compose -f backend/compose.yaml --profile tools run --rm backend-migrate
```



## Promote a local user to platform admin

After the database is running and migrations have been applied, grant an active
`ADMIN` assignment to the user by email. Replace `owner.local@gmm.test` with
the account email when needed:

```powershell change user to admin
• INSERT INTO "UserRole" ("id", "userId", "role", "reason")
  SELECT
    gen_random_uuid(),
    u."id",
    'ADMIN'::"SystemRole",
    'Granted for local development'
  FROM "User" u
  WHERE lower(u."email") = lower('owner.local@gmm.test')
    AND NOT EXISTS (
      SELECT 1
      FROM "UserRole" ur
      WHERE ur."userId" = u."id"
        AND ur."role" = 'ADMIN'::"SystemRole"
        AND ur."revokedAt" IS NULL
    );
```

The command is safe to run repeatedly. The account must be `ACTIVE` and have a
verified email before it can log in at `/gmm_admin/login`.
