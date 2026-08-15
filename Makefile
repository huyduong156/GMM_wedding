.PHONY: database:refresh

# Destructive local/test reset: applies all Prisma migrations and reseeds data.
database:refresh:
	cd backend && npm exec prisma migrate reset -- --force && npm run db:seed
