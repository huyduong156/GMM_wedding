.DEFAULT_GOAL := help

# Host-side Prisma commands use the local PostgreSQL exposed by Compose.
# Các lệnh Prisma chạy trên máy host sẽ dùng PostgreSQL local được Compose expose.
#
# Keep an explicitly exported DATABASE_URL untouched when developers customize it.
# Nếu developer đã tự export DATABASE_URL thì không ghi đè giá trị đó.
DATABASE_URL ?= postgresql://gmm_wedding:gmm_wedding_local@localhost:5432/gmm_wedding?schema=public
export DATABASE_URL


.PHONY: help dev docker-sync docker-rebuild system-sync update reset-templates \
	database-migrate database-seed database-refresh database-reset


# Show all available local development commands.
# Hiển thị tất cả các lệnh development có thể sử dụng.
help:
	@echo "GMM Wedding local commands"
	@echo ""
	@echo "  make system-sync      Sync Docker, dependencies, Prisma and database"
	@echo "  make docker-sync      Pull, build and start all Docker services"
	@echo "  make docker-rebuild   Force rebuild and recreate all Docker services"
	@echo "  make update           Alias of system-sync"
	@echo "  make dev              Start backend and frontend development servers"
	@echo ""
	@echo "  make database-migrate Apply pending database migrations"
	@echo "  make database-seed    Seed local database"
	@echo "  make database-refresh Migrate and reseed without resetting data"
	@echo "  make database-reset   Destructive database reset"
	@echo "  make reset-templates  Clear local template registry"


# Start backend and frontend development servers.
# Khởi động development server cho cả backend và frontend.
dev:
	npm --prefix backend run dev & \
	npm --prefix frontend run dev


# Pull, build and start all services defined in the Compose files.
# Tự động pull image mới, build image cần thiết và khởi động toàn bộ service
# được định nghĩa trong các file Compose.
#
# Do not hard-code service names here.
# Không hard-code tên service ở đây để sau này thêm service mới không cần sửa Makefile.
docker-sync:
	docker compose -f backend/compose.yaml pull --ignore-buildable
	docker compose -f backend/compose.yaml up -d --build --remove-orphans
	docker compose -f frontend/compose.yaml pull --ignore-buildable
	docker compose -f frontend/compose.yaml up -d --build --remove-orphans

# Force rebuild application images and recreate all Docker services.
# Ép build lại application images và recreate toàn bộ Docker services.
#
# Use this when frontend or backend changes are not reflected in the running containers.
# Dùng khi code frontend/backend đã thay đổi nhưng container đang chạy vẫn chưa phản ánh code mới.
docker-rebuild:
	docker compose -f backend/compose.yaml build --no-cache
	docker compose -f backend/compose.yaml up -d --force-recreate --remove-orphans
	docker compose -f frontend/compose.yaml build --no-cache
	docker compose -f frontend/compose.yaml up -d --force-recreate --remove-orphans

# Full local environment synchronization after pulling new code.
# Đồng bộ toàn bộ môi trường local sau khi pull code mới.
#
# This includes Docker services, dependencies, Prisma and database migrations.
# Bao gồm Docker services, dependencies, Prisma và database migrations.
system-sync: docker-sync
	npm --prefix frontend ci
	npm --prefix backend ci
	npm --prefix backend run db:generate
	npm --prefix backend run db:validate
	npm --prefix backend run db:migrate:deploy


# Backward-compatible alias for developers who prefer "make update".
# Alias để developer có thể tiếp tục dùng "make update".
update: system-sync


# Clear local template registry and template-bound publications.
# Xóa template registry local và các publication liên kết với template.
reset-templates:
	npm --prefix backend run db:reset-templates


# Apply pending Prisma migrations without deleting data.
# Áp dụng các Prisma migration đang pending mà không xóa dữ liệu.
database-migrate:
	npm --prefix backend run db:migrate:deploy


# Run idempotent local seed data.
# Seed dữ liệu local; có thể chạy lại mà không chủ động reset toàn bộ database.
database-seed:
	npm --prefix backend run db:seed

# Safely migrate the schema and reseed without resetting the database.
# Migrate schema và seed lại mà không reset toàn bộ database.
database-refresh:
	npm --prefix backend run db:refresh


# Destructive local/test reset: delete all data, migrate from zero, then seed.
# RESET database local/test: xóa dữ liệu, migrate lại từ đầu và seed lại.
database-reset:
	npm --prefix backend run db:reset
