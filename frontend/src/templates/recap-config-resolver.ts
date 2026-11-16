type ConfigRecord = Record<string, unknown>

const recapConfigModules = import.meta.glob('./recaps/*/template-config.ts', { eager: true }) as Record<
  string,
  Record<string, unknown>
>

const asRecord = (value: unknown): ConfigRecord =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as ConfigRecord) : {}

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
