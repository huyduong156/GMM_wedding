# Frontend authentication integration

## Surfaces and endpoints

Frontend uses the backend opaque HTTP-only session and never stores credentials or session tokens in browser storage.

| Surface | Login route | Session check | Protected namespace |
|---|---|---|---|
| Owner workspace | `POST /api/auth/login` | `GET /api/me` | `/studio/*` |
| Platform admin | `POST /api/auth/admin/login` | `GET /api/admin/me` | `/gmm_admin/*` except `/gmm_admin/login` |

All requests use `credentials: include`. Unsafe requests send JSON and `X-CSRF-Protection: 1`; the browser supplies the `Origin` header. Backend `APP_ORIGIN` must exactly match the frontend origin.

## Runtime behavior

- A protected route shows a short session-check state before rendering private content.
- Missing/expired owner sessions redirect to `/login`.
- Missing, expired or non-admin sessions redirect to `/gmm_admin/login` for admin routes.
- Owner login does not reject a user merely because that identity also has an admin role.
- Admin login maps `ADMIN_ACCESS_REQUIRED` to a permission-specific message without exposing private data.
- Logout revokes the backend session, clears frontend auth state and returns to the matching login surface.
- Password reset and registration UI remain unavailable until their complete backend contracts are implemented.

## Configuration

`VITE_API_BASE_URL` is compiled into the Vite bundle. Local Docker defaults to `http://localhost:3000/api` while the frontend is served at `http://localhost:8080`.

When running Vite directly at `http://localhost:5173`, start the backend with `APP_ORIGIN=http://localhost:5173`. Do not use wildcard credentialed CORS.
