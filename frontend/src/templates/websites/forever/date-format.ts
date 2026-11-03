export function toForeverDateInputValue(value: string) {
  const isoDate = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (isoDate) return value

  const displayedDate = value.match(/^(\d{1,2})\D+(\d{1,2})\D+(\d{4})$/)
  if (!displayedDate) return ''

  const [, day, month, year] = displayedDate
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

export function formatForeverDate(value: string) {
  const inputValue = toForeverDateInputValue(value)
  const match = inputValue.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return value

  const [, year, month, day] = match
  return `${day} — ${month} — ${year}`
}
