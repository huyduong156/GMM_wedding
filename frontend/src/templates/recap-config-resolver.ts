type ConfigRecord = Record<string, unknown>

const recapConfigModules = import.meta.glob('./recaps/*/template-config.ts', { eager: true }) as Record<
  string,
  Record<string, unknown>
>

const asRecord = (value: unknown): ConfigRecord =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as ConfigRecord) : {}

function sectionEntries(config: Record<string, unknown>) {
  return (Array.isArray(config.sections) ? config.sections : []).flatMap((entry) => {
    if (typeof entry === 'string') return [{ key: entry, required: false }]
    const section = asRecord(entry)
    const key = typeof section.sectionKey === 'string'
      ? section.sectionKey
      : typeof section.key === 'string'
        ? section.key
        : ''
    return key ? [{ key, required: section.required === true }] : []
  })
}

export function getDeclaredRecapSectionOrder(config: Record<string, unknown>) {
  return sectionEntries(config).map((section) => section.key)
}

/** Resolve the authored composition order, expanding the `optional` slot in place. */
export function getRecapSectionOrder(config: Record<string, unknown>) {
  const sections = sectionEntries(config)
  const keys = sections.map((section) => section.key)
  const optionalKeys = sections.filter((section) => !section.required).map((section) => section.key)
  const composition = asRecord(config.composition)
  const authoredOrder = Array.isArray(composition.order) ? composition.order : []
  const order: string[] = []

  for (const entry of authoredOrder) {
    if (entry === 'optional') {
      order.push(...optionalKeys)
    } else if (typeof entry === 'string' && keys.includes(entry)) {
      order.push(entry)
    }
  }

  for (const key of keys) {
    if (!order.includes(key)) order.push(key)
  }
  return [...new Set(order)]
}

export function orderMatchesDeclaration(value: unknown, config: Record<string, unknown>) {
  const declared = getDeclaredRecapSectionOrder(config)
  return Array.isArray(value) && value.length === declared.length &&
    value.every((key, index) => key === declared[index])
}

/** Use the checked-in template schema for editor fields; API config supplies the assigned version metadata. */
export function resolveRecapTemplateConfig(
  templateKey: string,
  remoteValue: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
  const localConfig = Object.values(recapConfigModules)
    .flatMap((module) => Object.values(module))
    .map(asRecord)
    .find((config) => config.templateKey === templateKey)
  const remoteConfig = asRecord(remoteValue)
  if (!localConfig) return remoteConfig

  const localSections = Array.isArray(localConfig.sections) ? localConfig.sections : []
  return {
    ...localConfig,
    ...remoteConfig,
    quickEdit: localConfig.quickEdit ?? remoteConfig.quickEdit,
    sections: localSections,
  }
}
