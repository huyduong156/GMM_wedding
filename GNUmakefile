.PHONY: database-migrate database-seed database-refresh database-reset database\:refresh

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