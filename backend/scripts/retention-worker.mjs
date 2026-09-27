import { runPurge } from './purge-soft-deleted.mjs'

const timezone = process.env.RETENTION_TIMEZONE ?? 'Asia/Ho_Chi_Minh'
let lastRunKey = null

function currentScheduleParts() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    hour12: false,
  }).formatToParts(new Date())
  return Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]))
}

async function tick() {
  const parts = currentScheduleParts()
  const runKey = `${parts.weekday}-${new Date().toISOString().slice(0, 10)}`
  if (parts.weekday === 'Sat' && parts.hour === '00' && parts.minute === '00' && lastRunKey !== runKey) {
    lastRunKey = runKey
    await runPurge()
  }
}

console.log(JSON.stringify({ job: 'retention-worker', schedule: 'Saturday 00:00', timezone }))
await tick()
setInterval(() => tick().catch((error) => console.error(error)), 30_000)
