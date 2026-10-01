# Process lifecycle and restart safety

## Runtime behavior

The backend runner performs a database preflight before importing the Next.js standalone server. If `DATABASE_URL` is missing or the database cannot answer `SELECT 1` within `STARTUP_DATABASE_TIMEOUT_MS`, the new instance exits with a non-zero status and never starts listening on the HTTP port.

This is fail-fast protection, not a PID lock. The process manager remains responsible for ensuring that only one web instance is active and that the old instance exits before its replacement starts.

## Required hosting settings

- Run one web instance unless the database pool budget explicitly supports more.
- Use one process manager only; do not combine Passenger, PM2, cron startup, and a second `next start` command.
- On restart, send `SIGTERM`, wait for the termination grace period, then force-kill a stuck process before starting the replacement.
- Configure restart backoff and a finite failure threshold so a database outage does not create an infinite restart loop.
- Use `/api/health/live` for liveness. Use `/api/health/ready` as a database/dependency gate, not as an unconditional restart trigger.

## Local Docker behavior

The backend service uses an init process, a 20-second stop grace period, and `restart: on-failure:5`. This allows signal forwarding and graceful shutdown while limiting repeated startup failures during local diagnosis.

Verify a failed startup with:

```powershell
docker compose -f .\backend\compose.yaml logs backend
docker inspect gmm_wedding_BE --format '{{json .State}}'
```

Verify the process tree on a hosting server with:

```bash
ps -ef --forest
pgrep -af 'node|next|npm|pm2|passenger'
```
