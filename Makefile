.DEFAULT_GOAL := help

# Host-side Prisma commands use the local PostgreSQL exposed by Compose.
# Keep an explicitly exported DATABASE_URL untouched when developers customize it.
DATABASE_URL ?= postgresql://gmm_wedding:gmm_wedding_local@localhost:5432/gmm_wedding?schema=public
export DATABASE_URL

.PHONY: help sync update reset-templates images build-images database-migrate database-seed database-refresh database-reset database\:refresh

help:
	@echo "GMM Wedding local commands"
	@echo "  make sync             Install dependencies, generate/validate Prisma, apply migrations"
	@echo "  make update           Alias of sync for pulling new code"
	@echo "  make reset-templates  Clear local template registry and template-bound publications"
	@echo "  make images           Rebuild frontend and backend Docker images"

# Reconcile both app dependency trees and the local database schema.
sync:
	docker compose -f backend/compose.yaml up -d postgres redis mailpit
	npm --prefix frontend ci
	npm --prefix backend ci
	npm --prefix backend run db:generate
	npm --prefix backend run db:validate
	npm --prefix backend run db:migrate:deploy

# Keep the developer-facing update command safe and deterministic.
update: sync

# Rebuild both application images from the current working tree.
images:
	docker compose build frontend
	docker compose -f backend/compose.yaml build backend

build-images: images

# Destructive local/test-only reset; does not reset the whole database.
reset-templates:
	npm --prefix backend run db:reset-templates

# Apply pending Prisma migrations without deleting data.
database-migrate:
	cd backend && npm run db:migrate:deploy

# Run idempotent local seed data.
database-seed:
	cd backend && npm run db:seed

# Safe refresh: migrate schema and reseed without resetting existing data.
database-refresh:
	cd backend && npm run db:refresh

# Destructive local/test reset: delete all data, migrate from zero, then seed.
database-reset:
	cd backend && npm run db:reset

# Backward-compatible alias.
database\:refresh: database-reset
