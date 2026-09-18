import { getInvitationTemplate } from './template-registry'

type ConfigRecord = Record<string, unknown>

function asRecord(value: unknown): ConfigRecord {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as ConfigRecord)
    : {}
}

/**
 * Resolve the editor-facing invitation config from the released API config,
 * filling any missing fields/sections from the checked-in template contract.
 *
 * The API config is still the primary source. The local config is the safe
 * compatibility fallback for older TemplateVersion rows that predate a
 * template's current section contract.
 */
export function resolveInvitationTemplateConfig(
  templateKey: string,
  remoteConfig: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
  const localConfig = getInvitationTemplate(templateKey)?.config as
    | Record<string, unknown>
    | undefined
  if (!localConfig) return remoteConfig ?? {}

  const remote = remoteConfig ?? {}
  const localSections = Array.isArray(localConfig.sections) ? localConfig.sections : []
  const remoteSections = Array.isArray(remote.sections) ? remote.sections : []
  if (!remoteSections.length) return { ...localConfig, ...remote, sections: localConfig.sections }

  const sections = localSections.map((localSection) => {
    if (!localSection || typeof localSection !== 'object') return localSection
    const localRecord = localSection as ConfigRecord
    const remoteSection = remoteSections.find(
      (item) =>
        item &&
        typeof item === 'object' &&
        (item as Record<string, unknown>).sectionKey === localRecord.sectionKey,
    ) as ConfigRecord | undefined
    if (!remoteSection) return localSection

    const localFields = asRecord(localRecord.fields)
    const remoteFields = asRecord(remoteSection.fields)
    const fields = Object.fromEntries(
      Object.entries(localFields).map(([key, field]) => [
        key,
        { ...asRecord(field), ...asRecord(remoteFields[key]) },
      ]),
    )
    return { ...localRecord, ...remoteSection, fields: { ...fields, ...remoteFields } }
  })

  return { ...localConfig, ...remote, sections: sections.length ? sections : remoteSections }
}

export function resolveInvitationTemplateSections(
  templateKey: string,
  remoteConfig: Record<string, unknown> | null | undefined,
) {
  const config = resolveInvitationTemplateConfig(templateKey, remoteConfig)
  return Array.isArray(config.sections) ? config.sections : []
}
