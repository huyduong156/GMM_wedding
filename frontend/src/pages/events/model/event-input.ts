import type { EventInput } from '../../../shared/api/weddings'
export type EventFormValue = { name: string; eventType: string; startsAt: string; endsAt: string; venueName: string; addressLine: string; mapUrl: string; isPublic: boolean }
export function buildEventInput(form: EventFormValue, timezone: string, editing: boolean): EventInput {
  const startsAt = new Date(form.startsAt), endsAt = form.endsAt ? new Date(form.endsAt) : null
  if (endsAt && endsAt < startsAt) throw new Error('Thời gian kết thúc phải sau thời gian bắt đầu.')
  const optional = (value: string) => value.trim() || undefined
  return { name: form.name.trim(), eventType: form.eventType, startsAt: startsAt.toISOString(), timezone, isPublic: form.isPublic,
    ...(endsAt ? { endsAt: endsAt.toISOString() } : editing ? { endsAt: null } : {}),
    ...(optional(form.venueName) ? { venueName: optional(form.venueName) } : editing ? { venueName: null } : {}),
    ...(optional(form.addressLine) ? { addressLine: optional(form.addressLine) } : editing ? { addressLine: null } : {}),
    ...(optional(form.mapUrl) ? { mapUrl: optional(form.mapUrl) } : editing ? { mapUrl: null } : {}),
  }
}
