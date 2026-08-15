# Local development quick reference

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

## Daily commands

```powershell
# Frontend
cd frontend
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run preview

# Backend
cd backend
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run test:integration
npm run check
npm run db:generate
npm run db:validate
npm run db:migrate
npm run db:migrate:deploy
npm run db:seed

# Docker
cd ..
docker compose up --build
docker compose down
docker compose logs -f frontend
docker compose -f backend/compose.yaml --profile tools up --build
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
