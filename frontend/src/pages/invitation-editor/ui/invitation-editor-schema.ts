import type { TemplateFieldConfig, TemplateSectionConfig } from '../../../shared/api/weddings'

export type EditorSectionDefinition = {
  sectionKey: string
  label: string
  required: boolean
  canToggle: boolean
  canReorder: boolean
  editorLayout?: string
  emptyMessage?: string
  fields: Record<string, TemplateFieldConfig>
}

export function resolveEditorSections(
  config: Record<string, unknown> | null | undefined,
  storedOrder: string[],
): EditorSectionDefinition[] {
  const raw = Array.isArray(config?.sections)
    ? (config.sections as TemplateSectionConfig[])
    : storedOrder
  return raw
    .map((item) => (typeof item === 'string' ? { sectionKey: item } : item))
    .filter((item) => item.sectionKey)
    .map((item) => ({
      sectionKey: item.sectionKey,
      label: item.label ?? item.sectionKey,
      required: item.required ?? false,
      canToggle: item.canToggle ?? true,
      canReorder: item.canReorder ?? true,
      editorLayout: item.editorLayout,
      emptyMessage: item.emptyMessage,
      fields: Object.fromEntries(
        Object.entries(item.fields ?? {}).map(([key, field]) => [
          field.contentKey ?? key,
          { ...field, contentKey: field.contentKey ?? key },
        ]),
      ),
    }))
}

export function validateSchemaContent(
  content: Record<string, unknown>,
  sections: EditorSectionDefinition[],
  enabled: string[],
) {
  const errors: Record<string, string> = {}
  for (const section of sections)
    if (enabled.includes(section.sectionKey))
      for (const [key, field] of Object.entries(section.fields)) {
        if (['image', 'images', 'audio'].includes(field.type)) continue
        const value = content[key]
        if (
          field.required &&
          (value === undefined || value === null || String(value).trim() === '')
        )
          errors[key] = `Vui lòng nhập ${(field.label ?? key).toLowerCase()}.`
        else if (
          field.maxLength &&
          typeof value === 'string' &&
          value.trim().length > field.maxLength
        )
          errors[key] = `${field.label ?? key} không được vượt quá ${field.maxLength} ký tự.`
        else if (field.type === 'url' && typeof value === 'string' && value.trim()) {
          try {
            new URL(value)
          } catch {
            errors[key] = `${field.label ?? key} chưa đúng định dạng.`
          }
        } else if (field.type === 'items' && Array.isArray(value)) {
          if (field.maxItems && value.length > field.maxItems)
            errors[key] = `${field.label ?? key} chỉ được tối đa ${field.maxItems} mục.`
          value.forEach((item, index) => {
            if (!item || typeof item !== 'object') return
            for (const [itemKey, itemField] of Object.entries(field.itemFields ?? {})) {
              const itemValue = (item as Record<string, unknown>)[itemKey]
              if (
                itemField.required &&
                (itemValue === undefined || String(itemValue).trim() === '')
              )
                errors[`${key}.${index}.${itemKey}`] =
                  `Vui lòng nhập ${(itemField.label ?? itemKey).toLowerCase()}.`
            }
          })
        }
      }
  return errors
}
