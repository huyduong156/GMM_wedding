# Backend logging

Backend logs are written to stdout/stderr so they are visible directly in the backend image and through `docker logs gmm_wedding_BE`.

Each API request receives or preserves `x-request-id`. The request log includes method, path and request ID. Errors include a readable timestamped message, error name/message and stack trace when available; the HTTP response continues to expose only the stable public error contract and request ID.

Set `LOG_LEVEL=debug` locally when diagnosing template sync. Never log request bodies, cookies, passwords, session tokens or guest PII.
