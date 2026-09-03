const MAX_GUEST_SLUG_LENGTH = 64
const normalizeGuestSlug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_GUEST_SLUG_LENGTH)
    .replace(/-+$/g, "") || "guest"

export async function newGuestSlug(name: string, isTaken: (slug: string) => Promise<boolean>) {
  const base = normalizeGuestSlug(name)
  if (!(await isTaken(base))) return base
  for (let suffix = 1; ; suffix += 1) {
    const suffixText = "-" + suffix
    const candidate = base.slice(0, MAX_GUEST_SLUG_LENGTH - suffixText.length) + suffixText
    if (!(await isTaken(candidate))) return candidate
  }
}
