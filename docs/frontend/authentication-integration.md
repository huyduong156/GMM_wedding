# Frontend authentication integration

## Surfaces and endpoints

Frontend uses the backend opaque HTTP-only session and never stores credentials or session tokens in browser storage.

| Surface | Login route | Session check | Protected namespace |
|---|---|---|---|
| Owner workspace | `POST /api/auth/login` | `GET /api/me` | `/studio/*` |
| Platform admin | `POST /api/auth/admin/login` | `GET /api/admin/me` | `/gmm_admin/*` except `/gmm_admin/login` |

Owner login also supports Google OAuth through `GET /api/auth/google/start`. The
backend validates the Google authorization code with PKCE, requires
`email_verified=true`, then creates the same opaque session used by password
login. Configure `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`,
`GOOGLE_REDIRECT_URI` and `GOOGLE_SUCCESS_REDIRECT` in the backend. Google OAuth
is not enabled for the platform-admin login surface.

All requests use `credentials: include`. Before the first unsafe request, the client calls `GET /api/auth/csrf`; the backend returns a random token and sets a non-HttpOnly `gmm_csrf`/`__Host-gmm_csrf` cookie. Unsafe requests send JSON and `X-CSRF-Token` with the returned token. The backend compares the cookie and header, and also validates the browser `Origin`/Fetch Metadata. If an unsafe request is rejected with `REQUEST_ORIGIN_REJECTED`, the client invalidates its cached token, initializes CSRF again, and retries that mutation once. A persistent origin, Fetch Metadata, or content-type failure is returned after the retry. Backend `APP_ORIGIN` must exactly match the frontend origin.

## Public invitation URL

The owner-facing public URL is `/{weddingSlug}/invitation`.

- The page always tries the public published snapshot first, so a published invitation is viewable without login.
- If no public snapshot exists, only an authenticated owner whose wedding has the requested slug may read the owner-scoped draft at that URL.
- Anonymous visitors and authenticated users who do not own that wedding receive the normal 404 page; draft content is never exposed through a public API.
- Personalized guest URLs remain public-only and require the invitation to be published.

## Runtime behavior

- A protected route shows a short session-check state before rendering private content.
- Missing/expired owner sessions redirect to `/login`.
- Missing, expired or non-admin sessions redirect to `/gmm_admin/login` for admin routes.
- Owner login does not reject a user merely because that identity also has an admin role.
- Admin login maps `ADMIN_ACCESS_REQUIRED` to a permission-specific message without exposing private data.
- Logout revokes the backend session, clears frontend auth state and returns to the matching login surface.
- Owner password recovery uses `/forgot-password` and `/reset-password?token=...`, backed by `POST /api/auth/forgot-password` and `POST /api/auth/reset-password`.
- Owner onboarding uses `/register` and `/verify-email?token=...`, backed by `POST /api/auth/register` and `POST /api/auth/verify-email`. Registration acknowledgment remains generic.
- Khi user mới mở `/workspace-access/{token}`, FE lưu return path trong `sessionStorage`; `/register` tách token từ path này và gửi `workspaceAccessToken` cùng registration. Token không đi vào URL email. Verify response có thể trả `workspaceAccessOutcome`; FE dọn return path đã consume và hiển thị trạng thái `JOINED`, `ALREADY_USED`, `REVOKED`, `EXPIRED` hoặc `INVALID` trước khi user đăng nhập.
- The forgot-password confirmation remains generic and does not reveal whether an account exists. Public password recovery is not exposed on the platform-admin login surface.
- Resend-verification UI and `POST /api/auth/resend-verification` client integration are prepared behind `VITE_AUTH_RESEND_ENABLED=false`. Enable it only after the backend exposes the planned generic-acknowledgment contract; the UI includes a 60-second cooldown.

## Configuration

`VITE_API_BASE_URL` is compiled into the Vite bundle. Local Docker defaults to `http://localhost:3000/api` while the frontend is served at `http://localhost:8080`. Vite development uses the same backend port through its `/api` proxy; `VITE_DEV_API_TARGET` may override that target.

When running Vite directly at `http://localhost:5173`, start the backend with `APP_ORIGIN=http://localhost:5173`. Do not use wildcard credentialed CORS.
