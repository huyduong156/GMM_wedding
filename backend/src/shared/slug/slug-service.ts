const MAX_SLUG_LENGTH = 64

export type SlugTaken = (slug: string) => Promise<boolean>

export class SlugService {
  normalize(value: string, fallback = 'wedding') {
    const normalized = value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/gi, 'd')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, MAX_SLUG_LENGTH)
      .replace(/-+$/g, '')
    return normalized || fallback
  }

  candidates(value: string) {
    const base = this.normalize(value)
    const preferred = [
      base,
      `${base}-wedding`,
      `wedding-${base}`,
      `${base}-web-wedding`,
      `web-wedding-${base}`,
    ].map((candidate) => this.normalize(candidate))
    return [...new Set(preferred)]
  }

  async unique(value: string, isTaken: SlugTaken) {
    for (const candidate of this.candidates(value)) {
      if (!(await isTaken(candidate))) return candidate
    }

    const base = this.normalize(value)
    for (let suffix = 1; ; suffix += 1) {
      const candidate = this.normalize(`${base}-wedding-${suffix}`)
      if (!(await isTaken(candidate))) return candidate
    }
  }
}
