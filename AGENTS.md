# Repository instructions for agents

Before planning or implementing project work, read `.agents/PROJECT_CONTEXT.md` and the relevant documents linked from `docs/README.md`.

Before implementing an admin/editor UI, read `design-system/MASTER.md`, `docs/09-admin-ui-ux.md`, and any matching file in `design-system/pages/`.

- Treat `docs/` as the product and engineering source of truth.
- Keep `frontend/` (React + Vite) and `backend/` (Next.js API) separate unless a documented decision changes this.
- Preserve Docker portability: independent multi-stage images, stateless/non-root runtime, root Compose for local integration, and one-off database migrations.
- Update the relevant document and, for long-lived context, `.agents/PROJECT_CONTEXT.md` in the same change.
- Record significant architecture decisions in `docs/adr/`.
- Never commit secrets, real guest PII, database dumps, or unlicensed assets.
