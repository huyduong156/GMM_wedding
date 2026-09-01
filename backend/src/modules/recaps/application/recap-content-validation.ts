type Issue = { path: string; message: string }

const textRules: Array<[string, number, boolean]> = [
  ['hero.couple', 80, true],
  ['hero.date', 40, true],
  ['hero.place', 80, false],
  ['hero.tagline', 240, true],
  ['hero.ctaLabel', 80, true],
  ['ourStory.eyebrow', 80, false],
  ['ourStory.title', 180, true],
  ['ourStory.body', 800, true],
  ['ourStory.quote', 300, false],
  ['photoDelivery.eyebrow', 80, false],
  ['photoDelivery.title', 180, true],
  ['photoDelivery.body', 800, true],
  ['photoDelivery.ctaLabel', 80, true],
  ['thankYou.title', 180, true],
  ['thankYou.body', 800, true],
  ['thankYou.signature', 100, true],
  ['thankYou.date', 40, true],
]

const arrayRules: Array<[string, number, number]> = [
  ['chapters', 1, 12],
  ['moments', 1, 12],
  ['optional.peopleBehindTheDay.people', 0, 24],
  ['optional.behindTheScenes.items', 0, 24],
]

const cardRules: Array<[string, Array<[string, number, boolean]>]> = [
  [
    'chapters',
    [
      ['dateLabel', 40, true],
      ['title', 180, true],
      ['description', 360, true],
    ],
  ],
  [
    'moments',
    [
      ['title', 180, true],
      ['description', 360, true],
    ],
  ],
  [
    'optional.peopleBehindTheDay.people',
    [
      ['name', 100, true],
      ['role', 160, true],
    ],
  ],
  [
    'optional.behindTheScenes.items',
    [
      ['title', 180, true],
      ['caption', 360, true],
    ],
  ],
]

function readPath(value: unknown, path: string) {
  return path
    .split('.')
    .reduce<unknown>(
      (current, part) =>
        current && typeof current === 'object'
          ? (current as Record<string, unknown>)[part]
          : undefined,
      value,
    )
}

function checkText(
  value: unknown,
  path: string,
  max: number,
  required: boolean,
  issues: Issue[],
  allowMissing: boolean,
) {
  if (value === undefined || value === null) {
    if (required && !allowMissing) issues.push({ path, message: 'Field is required' })
    return
  }
  if (typeof value !== 'string') {
    if (required) issues.push({ path, message: 'Field is required' })
    return
  }
  if (required && !value.trim()) issues.push({ path, message: 'Field is required' })
  if (value.length > max) issues.push({ path, message: `Must be at most ${max} characters` })
}

function checkUrl(value: unknown, path: string, issues: Issue[]) {
  if (value === undefined || value === null || value === '') return
  if (typeof value !== 'string') {
    issues.push({ path, message: 'Must be a valid URL' })
    return
  }
  try {
    const url = new URL(value)
    if (!['http:', 'https:'].includes(url.protocol))
      issues.push({ path, message: 'Must be a valid URL' })
  } catch {
    issues.push({ path, message: 'Must be a valid URL' })
  }
}

export function validateRecapContent(templateKey: string, content: unknown): Issue[] {
  if (templateKey !== 'red-spider-lily-recap') return []
  const issues: Issue[] = []
  const allowMissing = !content || typeof content !== 'object' || Object.keys(content).length === 0
  textRules.forEach(([path, max, required]) =>
    checkText(readPath(content, path), path, max, required, issues, allowMissing),
  )
  checkUrl(readPath(content, 'photoDelivery.albumUrl'), 'photoDelivery.albumUrl', issues)
  arrayRules.forEach(([path, min, max]) => {
    const value = readPath(content, path)
    if (value === undefined || value === null) {
      if (min > 0 && !allowMissing) issues.push({ path, message: 'Field is required' })
      return
    }
    if (!Array.isArray(value)) {
      issues.push({ path, message: 'Must be an array' })
      return
    }
    if (value.length < min || value.length > max)
      issues.push({ path, message: `Must contain between ${min} and ${max} items` })
  })
  cardRules.forEach(([path, fields]) => {
    const items = readPath(content, path)
    if (!Array.isArray(items)) return
    items.forEach((item, index) =>
      fields.forEach(([field, max, required]) =>
        checkText(
          item && typeof item === 'object' ? (item as Record<string, unknown>)[field] : undefined,
          `${path}.${index}.${field}`,
          max,
          required,
          issues,
          false,
        ),
      ),
    )
  })
  return issues
}
