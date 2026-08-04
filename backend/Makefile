.DEFAULT_GOAL := help

.PHONY: help doctor install sync outdated update dev lint typecheck test check build docker-build docker-up docker-down docker-logs db-admin-up db-admin-down db-migrate db-migrate-deploy db-seed

help:
	@echo "GMM Wedding backend commands"
	@echo "  make doctor             Check required local tools"
	@echo "  make install            Reproduce dependencies from package-lock.json"
	@echo "  make sync               Alias of install for switching branch/machine"
	@echo "  make outdated           Report available dependency updates"
	@echo "  make update             Update dependencies within declared semver ranges"
	@echo "  make dev                Start backend development server"
	@echo "  make check              Run lint, typecheck, and tests"
	@echo "  make build              Build production backend"
	@echo "  make docker-build       Build the independent backend image"
	@echo "  make docker-up          Start backend dependencies/services via root Compose"
	@echo "  make docker-down        Stop root Compose services"
	@echo "  make docker-logs        Follow backend container logs"
	@echo "  make db-admin-up        Start PostgreSQL and the local Adminer UI"
	@echo "  make db-admin-down      Stop and remove the local Adminer UI"
	@echo "  make db-migrate         Apply development migrations"
	@echo "  make db-migrate-deploy  Apply reviewed production migrations"
	@echo "  make db-seed            Insert idempotent local demo data"

doctor:
	node --version
	npm --version
	docker --version
	docker compose version

install:
	npm ci

sync: install

outdated:
	npm outdated

update:
	npm update
	npm outdated

dev:
	npm run dev

lint:
	npm run lint

typecheck:
	npm run typecheck

test:
	npm run test

check: lint typecheck test

build:
	npm run build

docker-build:
	docker build -t gmm-wedding-backend:local .

docker-up:
	docker compose up -d --build backend postgres

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f backend

db-admin-up:
	docker compose --profile tools up -d postgres db-admin

db-admin-down:
	docker compose --profile tools stop db-admin
	docker compose --profile tools rm -f db-admin

db-migrate:
	npm run db:migrate

db-migrate-deploy:
	docker compose --profile tools run --rm backend-migrate

db-seed:
	npm run db:seed
