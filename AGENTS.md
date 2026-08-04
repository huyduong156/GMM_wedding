# Repository instructions for agents

Before planning or implementing project work, read `.agents/PROJECT_CONTEXT.md` and the relevant documents linked from `docs/README.md`.

Before implementing frontend or UI work, read `docs/frontend/README.md`. Before implementing an admin/editor UI, also read `design-system/MASTER.md`, `docs/frontend/admin-editor-ui-ux.md`, and any matching file in `design-system/pages/`.

Before implementing backend work, read `docs/backend/README.md`, `docs/shared/architecture/system-architecture.md`, and the matching backend contract document.

Keep frontend-only and backend-only branches isolated. A frontend-only task must not modify `backend/` or `docs/backend/`. A backend-only task must not modify `frontend/`, `docs/frontend/`, or `design-system/`. Either branch may touch `docs/shared/` only when it genuinely changes a cross-system contract, end-to-end flow, or long-lived architecture decision; keep shared-doc edits minimal and explicit to reduce merge conflicts.

Before any Google/web search or external source lookup, use `.agents/skills/web-research-agent/SKILL.md`. Delegate research to a dedicated sub-agent and keep raw search results out of the main task context. Use local repository documents directly without delegation.

- Treat `docs/` as the product and engineering source of truth.
- Keep `frontend/` (React + Vite) and `backend/` (Next.js API) separate unless a documented decision changes this.
- Preserve Docker portability: independent multi-stage images, stateless/non-root runtime, root Compose for local integration, and one-off database migrations.
- Update the relevant document and, for long-lived context, `.agents/PROJECT_CONTEXT.md` in the same change.
- Record significant architecture decisions in `docs/shared/architecture/adr/`.
- Never commit secrets, real guest PII, database dumps, or unlicensed assets.
