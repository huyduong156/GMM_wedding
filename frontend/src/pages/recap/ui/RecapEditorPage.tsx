import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CaretDown,
  Check,
  CheckCircle,
  Copy,
  Desktop,
  DeviceMobile,
  Eye,
  FacebookLogo,
  FloppyDisk,
  Link,
  PaperPlaneTilt,
  Plus,
  ShareNetwork,
  X,
} from '@phosphor-icons/react'
import { useOptionalWeddingWorkspace } from '../../../entities/wedding/model/wedding-context'
import {
  MediaAsset,
  RecapDraft,
  TemplateFieldConfig,
  WeddingApiError,
  Wish,
  weddingApi,
  wishApi,
} from '../../../shared/api/weddings'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { studioRoutes } from '../../../shared/config/routes'
import { useLiveEditorBridge } from '../../../shared/lib/live-template-editor'
import { EditorPreviewModal } from '../../../shared/ui/EditorPreviewModal'
import { MobileEditorAdviceModal } from '../../../shared/ui/MobileEditorAdviceModal'
import { TemplateSchemaFields } from '../../../shared/ui/template-editor/TemplateSchemaFields'
import { useMediaLibrary } from '../../../features/media/model/useMediaLibrary'
import { MediaManagerModal } from '../../../features/media/ui/MediaManagerModal'
import { notifications } from '../../../shared/ui/notifications/notifications'
import { useNavigation } from '../../../shared/lib/navigation/navigation-context'
import { resolveRecapTemplateConfig } from '../../../templates/recap-config-resolver'
import './recap.css'
import './recap-accordion.css'
import './recap-repeatable.css'

type EditorSection = {
  key: string
  label: string
  detail: string
  title: string
  body: string
  required: boolean
  canToggle: boolean
  canReorder: boolean
  repeatable: boolean
  minItems?: number
  maxItems?: number
  itemMediaField?: string
  galleryField?: string
  maxMediaPerItem?: number
  interaction?: string
  itemLabel?: string
  addLabel?: string
  approvedWishes?: boolean
  wishMode?: 'curated' | 'all-approved'
  mediaRoles?: string[]
  itemFields?: Record<string, TemplateFieldConfig>
  fields?: Record<string, TemplateFieldConfig>
  editorAction?: { label: string; href: string }
}

type RecapMediaRole = string
type RecapMediaContextValue = {
  assets: MediaAsset[]
  selectedIds: Set<string>
  openManager: (
    target?: string,
    role?: RecapMediaRole,
    multiple?: boolean,
    limits?: { minSelection?: number; maxSelection?: number },
  ) => void
}
const RecapMediaContext = createContext<RecapMediaContextValue | null>(null)

function mediaRoleFor(section: EditorSection, field: TemplateFieldConfig, fallback: string) {
  return field.mediaRole ?? section.mediaRoles?.[0] ?? fallback
}

function mediaValueForRole(role: string) {
  return { src: '', alt: '', role }
}

function buildEditorSections(
  config: { sections?: readonly unknown[] } | null | undefined,
): EditorSection[] {
  const sections = Array.isArray(config?.sections) ? config.sections : []
  return sections.map((entry) => {
    const section =
      typeof entry === 'string'
        ? { sectionKey: entry }
        : entry && typeof entry === 'object'
          ? (entry as Record<string, unknown>)
          : {}
    const sectionKey =
      typeof section.sectionKey === 'string'
        ? section.sectionKey
        : typeof section.key === 'string'
          ? section.key
          : 'section'
    const required = typeof section.required === 'boolean' ? section.required : false
    const canToggle = required
      ? false
      : typeof section.canToggle === 'boolean'
        ? section.canToggle
        : true
    const canReorder = typeof section.canReorder === 'boolean' ? section.canReorder : true
    const fields = section.fields && typeof section.fields === 'object'
      ? (section.fields as Record<string, TemplateFieldConfig>)
      : undefined
    const rule = section.repeatable ? section : null
    const itemFieldConfig = fields
      ? Object.values(fields).find(
          (field) => field && typeof field === 'object' && field.type === 'items',
        )
      : undefined
    const itemFields =
      section.itemFields && typeof section.itemFields === 'object'
        ? (section.itemFields as Record<string, TemplateFieldConfig>)
        : itemFieldConfig?.itemFields
    return {
      key: sectionKey,
      label: typeof section.label === 'string' ? section.label : sectionKey,
      detail: typeof section.description === 'string' ? section.description : '',
      title: typeof section.editorTitle === 'string' ? section.editorTitle : (typeof section.label === 'string' ? section.label : sectionKey),
      body: typeof section.editorDescription === 'string' ? section.editorDescription : '',
      fields,
      itemFields,
      editorAction:
        section.editorAction && typeof section.editorAction === 'object' &&
        typeof (section.editorAction as Record<string, unknown>).label === 'string' &&
        typeof (section.editorAction as Record<string, unknown>).href === 'string'
          ? {
              label: (section.editorAction as Record<string, string>).label,
              href: (section.editorAction as Record<string, string>).href,
            }
          : undefined,
      itemLabel: typeof itemFieldConfig?.label === 'string' ? itemFieldConfig.label : undefined,
      addLabel: typeof itemFieldConfig?.addLabel === 'string' ? itemFieldConfig.addLabel : undefined,
      approvedWishes: section.approvedWishes === true,
      wishMode:
        section.wishMode === 'all-approved'
          ? 'all-approved'
          : section.approvedWishes === true
            ? 'curated'
            : undefined,
      required,
      canToggle,
      canReorder,
      repeatable: Boolean(rule || itemFieldConfig),
      minItems:
        typeof rule?.minItems === 'number'
          ? rule.minItems
          : typeof itemFieldConfig?.minItems === 'number'
            ? itemFieldConfig.minItems
            : undefined,
      maxItems:
        typeof rule?.maxItems === 'number'
          ? rule.maxItems
          : typeof itemFieldConfig?.maxItems === 'number'
            ? itemFieldConfig.maxItems
            : undefined,
      itemMediaField: typeof rule?.itemMediaField === 'string' ? rule.itemMediaField : undefined,
      maxMediaPerItem: typeof rule?.maxMediaPerItem === 'number' ? rule.maxMediaPerItem : undefined,
      galleryField: typeof rule?.galleryField === 'string' ? rule.galleryField : undefined,
      interaction: typeof rule?.interaction === 'string' ? rule.interaction : undefined,
      mediaRoles: Array.isArray(rule?.mediaRoles)
        ? rule.mediaRoles.filter((role): role is string => typeof role === 'string')
        : undefined,
    }
  })
}

const normalizeSectionConfig = (
  value: { enabled?: unknown; order?: unknown } | null | undefined,
  sections: EditorSection[],
) => {
  const keys = sections.map((section) => section.key)
  const order = [
    ...new Set(
      (Array.isArray(value?.order) ? value.order : []).filter(
        (key): key is string => typeof key === 'string' && keys.includes(key),
      ),
    ),
  ]
  keys.forEach((key) => {
    if (!order.includes(key)) order.push(key)
  })
  const required = new Set(
    sections.filter((section) => section.required).map((section) => section.key),
  )
  const enabled = [
    ...new Set(
      (Array.isArray(value?.enabled) ? value.enabled : []).filter(
        (key): key is string => typeof key === 'string' && order.includes(key),
      ),
    ),
  ]
  required.forEach((key) => {
    if (!enabled.includes(key)) enabled.push(key)
  })
  return { order, enabled: order.filter((key) => enabled.includes(key) || required.has(key)) }
}

function addApiOnlySectionKeys(
  current: { enabled: string[]; order: string[] },
  templateConfig: Record<string, unknown>,
  previous: { enabled?: unknown; order?: unknown },
) {
  const apiSections = Array.isArray(templateConfig.sections) ? templateConfig.sections : []
  const apiKeys = apiSections.flatMap((entry) => {
    if (!entry || typeof entry !== 'object') return []
    const section = entry as Record<string, unknown>
    const key = typeof section.sectionKey === 'string' ? section.sectionKey : section.key
    return typeof key === 'string' ? [key] : []
  })
  const localKeys = new Set(current.order)
  const apiOnlyKeys = apiKeys.filter((key) => !localKeys.has(key))
  const previousEnabled = Array.isArray(previous.enabled) ? previous.enabled : []
  return {
    order: [...current.order, ...apiOnlyKeys],
    enabled: [...current.enabled, ...apiOnlyKeys.filter((key) => previousEnabled.includes(key))],
  }
}

async function loadAllApprovedWishes(weddingId: string) {
  const items: Wish[] = []
  let cursor: string | undefined
  do {
    const page = await wishApi.list(weddingId, { status: 'APPROVED', limit: 100, cursor })
    items.push(...page.items)
    cursor = page.nextCursor ?? undefined
  } while (cursor && items.length < 200)
  return items.slice(0, 200)
}

const clone = <T,>(value: T): T => structuredClone(value)
const getPath = (value: Record<string, unknown>, path: string) =>
  path
    ? path
        .split('.')
        .reduce<unknown>(
          (current, part) =>
            current && typeof current === 'object'
              ? (current as Record<string, unknown>)[part]
              : undefined,
          value,
        )
    : undefined
const setPath = (
  value: Record<string, unknown>,
  path: string,
  nextValue: unknown,
): Record<string, unknown> => {
  const next = clone(value) as Record<string, unknown>
  const parts = path.split('.')
  let cursor = next
  parts.slice(0, -1).forEach((part) => {
    cursor[part] = cursor[part] && typeof cursor[part] === 'object' ? cursor[part] : {}
    cursor = cursor[part] as Record<string, unknown>
  })
  cursor[parts.at(-1)!] = nextValue
  return next
}
const seedQuickEditFallbacks = (
  content: Record<string, unknown>,
  config: Record<string, unknown>,
) => {
  const quickEdit = Array.isArray(config.quickEdit) ? config.quickEdit : []
  return quickEdit.reduce((current, entry) => {
    if (!entry || typeof entry !== 'object') return current
    const field = entry as Record<string, unknown>
    if (
      typeof field.contentKey !== 'string' ||
      typeof field.fallbackContentKey !== 'string' ||
      typeof field.fallbackSplit !== 'string' ||
      typeof field.fallbackIndex !== 'number' ||
      getPath(current, field.contentKey) !== undefined
    ) return current
    const legacyValue = getPath(current, field.fallbackContentKey)
    if (typeof legacyValue !== 'string') return current
    const value = legacyValue.split(field.fallbackSplit)[field.fallbackIndex]?.trim()
    return value ? setPath(current, field.contentKey, value) : current
  }, content)
}
type TemplateValidationIssue = {
  sectionKey: string
  path: string
  message: string
  itemIndex?: number
}

function validateTemplateContent(content: Record<string, unknown>, sections: EditorSection[]) {
  const errors: TemplateValidationIssue[] = []
  const addError = (sectionKey: string, path: string, message: string, itemIndex?: number) => {
    errors.push({ sectionKey, path, message, itemIndex })
  }
  for (const section of sections) {
    for (const [key, field] of Object.entries(section.fields ?? {})) {
      const path = field.contentKey ?? `${section.key}.${key}`
      const value = getPath(content, path)
      if (field.type === 'items') {
        const items = Array.isArray(value) ? value : []
        const minItems = field.minItems ?? section.minItems ?? 0
        const maxItems = field.maxItems ?? section.maxItems
        if (items.length < minItems) addError(section.key, path, `Cần có ít nhất ${minItems} mục.`)
        if (maxItems !== undefined && items.length > maxItems) addError(section.key, path, `Chỉ được có tối đa ${maxItems} mục.`)
        items.forEach((item, index) => {
          if (!item || typeof item !== 'object') return
          for (const [itemKey, itemField] of Object.entries(field.itemFields ?? section.itemFields ?? {})) {
            const itemValue = (item as Record<string, unknown>)[itemKey]
            const itemPath = `${path}.${index}.${itemKey}`
            if (itemField.type === 'images' || itemField.type === 'image') {
              const mediaItems = itemField.type === 'image'
                ? [itemValue]
                : Array.isArray(itemValue) ? itemValue : []
              const selectedCount = mediaItems.filter((media) =>
                typeof media === 'string'
                  ? Boolean(media.trim())
                  : Boolean(media && typeof media === 'object' && 'src' in media && typeof media.src === 'string' && media.src.trim()),
              ).length
              const minimum = itemField.minItems ?? (itemField.required ? 1 : 0)
              if (selectedCount < minimum) {
                const detail = itemField.maxItems === undefined
                  ? `Cần chọn ít nhất ${minimum} ảnh.`
                  : `Cần chọn từ ${minimum} đến ${itemField.maxItems} ảnh.`
                addError(section.key, itemPath, detail, index)
              } else if (itemField.maxItems !== undefined && selectedCount > itemField.maxItems) {
                addError(section.key, itemPath, `Chỉ được chọn tối đa ${itemField.maxItems} ảnh.`, index)
              }
            }
            if (itemField.type !== 'images' && itemField.type !== 'image' && itemField.required && (typeof itemValue !== 'string' || !itemValue.trim())) {
              addError(section.key, itemPath, `${itemField.label ?? itemKey} không được để trống.`, index)
            } else if (typeof itemValue === 'string' && itemField.maxLength && itemValue.length > itemField.maxLength) {
              addError(section.key, itemPath, `${itemField.label ?? itemKey} vượt quá ${itemField.maxLength} ký tự.`, index)
            }
          }
        })
      } else if (field.required && (typeof value !== 'string' || !value.trim())) {
        addError(section.key, path, `${field.label ?? key} không được để trống.`)
      } else if (typeof value === 'string' && field.maxLength && value.length > field.maxLength) {
        addError(section.key, path, `${field.label ?? key} vượt quá ${field.maxLength} ký tự.`)
      }
      if (field.type === 'url' && typeof value === 'string' && value.trim()) {
        try {
          const url = new URL(value)
          if (!['http:', 'https:'].includes(url.protocol)) addError(section.key, path, `${field.label ?? key} phải là URL HTTP(S) hợp lệ.`)
        } catch {
          addError(section.key, path, `${field.label ?? key} phải là URL HTTP(S) hợp lệ.`)
        }
      }
    }
  }
  return errors.slice(0, 1)
}

type SectionFormProps = {
  section: EditorSection
  content?: Record<string, unknown>
  updateContent?: (path: string, value: unknown) => void
  isOpen: boolean
  validationIssue?: TemplateValidationIssue | null
  wishSelections?: RecapDraft['wishSelections']
  approvedWishes?: Wish[]
  onWishSelectionsChange?: (wishes: RecapDraft['wishSelections']) => void
}
function SectionForm({
  section,
  content,
  updateContent,
  isOpen,
  validationIssue,
  wishSelections,
  approvedWishes,
  onWishSelectionsChange,
}: SectionFormProps) {
  return (
    <ConfigDrivenSectionForm
      section={section}
      content={content ?? {}}
      update={updateContent ?? (() => undefined)}
      isOpen={isOpen}
      validationIssue={validationIssue}
      wishSelections={wishSelections}
      approvedWishes={approvedWishes}
      onWishSelectionsChange={onWishSelectionsChange}
    />
  )
}
function ConfigDrivenItemList({
  path,
  section,
  content,
  update,
  isOpen,
  validationIssue,
}: {
  path: string
  section: EditorSection
  content: Record<string, unknown>
  update: (path: string, value: unknown) => void
  isOpen: boolean
  validationIssue?: TemplateValidationIssue | null
}) {
  const media = useContext(RecapMediaContext)
  const itemFields = section.itemFields ?? {}
  const items = (getPath(content, path) as Array<Record<string, unknown>> | undefined) ?? []
  const itemLabel = section.itemLabel ?? 'mục'
  const [expandedItemId, setExpandedItemId] = useState<string | null | undefined>(undefined)
  useEffect(() => {
    if (expandedItemId === undefined) {
      setExpandedItemId(items.length ? String(items[0].id ?? 0) : null)
    }
  }, [expandedItemId, items])
  useEffect(() => {
    if (isOpen && validationIssue?.itemIndex !== undefined) {
      const item = items[validationIssue.itemIndex]
      if (item) setExpandedItemId(String(item.id ?? validationIssue.itemIndex))
    }
  }, [isOpen, items, validationIssue])
  const addItem = () => {
    const nextItem = Object.fromEntries(
      Object.entries(itemFields).map(([key, field]) => {
        if (field.type === 'image') return [key, mediaValueForRole(mediaRoleFor(section, field, section.key))]
        if (field.type === 'images') return [key, []]
        if (field.type === 'boolean') return [key, Boolean(field.default)]
        return [key, field.default ?? '']
      }),
    )
    const id = `${section.key}-${Date.now()}-${items.length}`
    update(path, [...items, { id, ...nextItem }])
    setExpandedItemId(id)
  }
  return (
    <div className="recap-card-editor">
      <div className="recap-repeatable-heading">
        <div>
          <strong>{section.label}</strong>
          <small>{items.length}{section.maxItems === undefined ? '' : ` / ${section.maxItems}`} {itemLabel}</small>
        </div>
        <button
          type="button"
          className="recap-add-button"
          onClick={addItem}
          disabled={!isOpen || (section.maxItems !== undefined && items.length >= section.maxItems)}
        >
          <Plus size={16} /> {section.addLabel ?? `Thêm ${itemLabel.toLocaleLowerCase('vi-VN')}`}
        </button>
      </div>
      {items.map((item, index) => {
        const itemId = String(item.id ?? index)
        const isExpanded = expandedItemId === itemId
        const itemSummary = typeof item.title === 'string' ? item.title.trim() : ''
        const fields = Object.fromEntries(
          Object.entries(itemFields).map(([key, field]) => [
            key,
            {
              ...field,
              contentKey: `${path}.${index}.${key}`,
              ...(field.type === 'image' || field.type === 'images'
                ? { mediaRole: mediaRoleFor(section, field, section.key), mediaValue: field.mediaValue ?? 'object' }
                : {}),
            },
          ]),
        ) as Record<string, TemplateFieldConfig>
        return (
          <article className={`recap-card-editor-item ${isExpanded ? 'is-expanded' : ''}`} key={itemId}>
            <header className="recap-card-editor-item-header">
              <button
                type="button"
                className="recap-card-editor-item-toggle"
                aria-expanded={isExpanded}
                aria-controls={`recap-card-editor-fields-${section.key}-${index}`}
                disabled={!isOpen}
                onClick={() => setExpandedItemId(isExpanded ? null : itemId)}
              >
                <span className="recap-card-editor-item-heading">
                  <strong>{section.label} {String(index + 1).padStart(2, '0')}</strong>
                  {itemSummary ? <small>{itemSummary}</small> : null}
                </span>
                <CaretDown size={17} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="recap-card-remove"
                disabled={!isOpen || (section.minItems !== undefined && items.length <= section.minItems)}
                onClick={() => {
                  update(path, items.filter((_, itemIndex) => itemIndex !== index))
                  if (isExpanded) {
                    const nextItem = items[index + 1] ?? items[index - 1]
                    setExpandedItemId(nextItem ? String(nextItem.id ?? (index > 0 ? index - 1 : 0)) : null)
                  }
                }}
                aria-label={`Xóa ${section.label.toLowerCase()} ${index + 1}`}
              >
                <X size={15} />
              </button>
            </header>
            <div id={`recap-card-editor-fields-${section.key}-${index}`} hidden={!isExpanded}>
              {isExpanded ? (
                <fieldset className="recap-schema-fields recap-card-editor-fields" disabled={!isOpen}>
                  <TemplateSchemaFields
                    fields={fields}
                    data={content}
                    update={update}
                    errors={validationIssue ? { [validationIssue.path]: validationIssue.message } : {}}
                    mediaEnabled
                    openMediaManager={({ path: mediaPath, multiple, role, minItems, maxItems }) =>
                      media?.openManager(mediaPath, role, multiple, {
                        minSelection: minItems,
                        maxSelection: maxItems,
                      })
                    }
                  />
                </fieldset>
              ) : null}
            </div>
          </article>
        )
      })}
      {!items.length ? <small className="recap-card-empty">No items yet. Add one to begin.</small> : null}
    </div>
  )
}
function ApprovedWishPicker({
  wishes,
  selections,
  onChange,
  disabled,
}: {
  wishes: Wish[]
  selections: RecapDraft['wishSelections']
  onChange: (wishes: RecapDraft['wishSelections']) => void
  disabled: boolean
}) {
  const selectedIds = selections.map((selection) => selection.wishId)
  const toggle = (wish: Wish) => {
    const nextIds = selectedIds.includes(wish.id)
      ? selectedIds.filter((id) => id !== wish.id)
      : selectedIds.length < 12 ? [...selectedIds, wish.id] : selectedIds
    onChange(nextIds.flatMap((id, sortOrder) => {
      const item = wishes.find((candidate) => candidate.id === id)
      const existing = selections.find((selection) => selection.wishId === id)
      return item
        ? [{ id: item.id, wishId: item.id, sortOrder, authorName: item.authorName, content: item.content, isPinned: item.isPinned }]
        : existing ? [{ ...existing, sortOrder }] : []
    }))
  }
  return (
    <fieldset className="recap-approved-wishes" disabled={disabled}>
      <legend>Lời chúc đã duyệt</legend>
      <p>Chọn tối đa 12 lời chúc để hiện trong recap. Các lời chúc mới cần được duyệt trước.</p>
      <small>{selectedIds.length} / 12 đã chọn</small>
      {wishes.length ? (
        <div className="recap-approved-wishes-list">
          {wishes.map((wish) => {
            const selected = selectedIds.includes(wish.id)
            return (
              <label className={selected ? 'is-selected' : ''} key={wish.id}>
                <input type="checkbox" checked={selected} disabled={!selected && selectedIds.length >= 12} onChange={() => toggle(wish)} />
                <span><strong>{wish.authorName || wish.guestName || 'Khách mời'}</strong><small>{wish.content}</small></span>
              </label>
            )
          })}
        </div>
      ) : <small>Chưa có lời chúc nào được duyệt.</small>}
    </fieldset>
  )
}

function ApprovedWishesNotice({
  wishes,
  action,
}: {
  wishes: Wish[]
  action?: { label: string; href: string }
}) {
  const hasWishes = wishes.length > 0
  return (
    <div className="recap-approved-wishes-notice">
      <div className="recap-approved-wishes-notice-icon" aria-hidden="true">
        <CheckCircle size={19} weight="fill" />
      </div>
      <div className="recap-approved-wishes-notice-copy">
        <strong>{hasWishes ? `${wishes.length} lời chúc đã duyệt` : 'Chưa có lời chúc được duyệt'}</strong>
        <p>{hasWishes
          ? 'Tất cả sẽ tự động xuất hiện trong recap.'
          : 'Lời chúc sẽ tự động xuất hiện trong recap sau khi được duyệt.'}</p>
      </div>
      {action ? (
        <a
          className="recap-approved-wishes-action"
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {action.label} <Link size={15} aria-hidden="true" />
        </a>
      ) : null}
    </div>
  )
}
function ConfigDrivenSectionForm({
  section,
  content,
  update,
  isOpen,
  validationIssue,
  wishSelections,
  approvedWishes,
  onWishSelectionsChange,
}: {
  section: EditorSection
  content: Record<string, unknown>
  update: (path: string, value: unknown) => void
  isOpen: boolean
  validationIssue?: TemplateValidationIssue | null
  wishSelections?: RecapDraft['wishSelections']
  approvedWishes?: Wish[]
  onWishSelectionsChange?: (wishes: RecapDraft['wishSelections']) => void
}) {
  const media = useContext(RecapMediaContext)
  const fields = section.fields ?? {}
  const entries = Object.entries(fields)
  const repeatableEntry =
    entries.find(([, field]) => field.type === 'items') ??
    (section.repeatable && section.itemFields
      ? ([
          'items',
          {
            type: 'items',
            contentKey: section.key,
            itemFields: section.itemFields,
          } as TemplateFieldConfig,
        ] as const)
      : undefined)
  const sharedFields = Object.fromEntries(
    entries
      .filter(([key, field]) => key !== repeatableEntry?.[0] && field.type !== 'items')
      .map(([key, field]) => [
        key,
        {
          ...field,
          contentKey: field.contentKey ?? `${section.key}.${key}`,
          ...(field.type === 'image' || field.type === 'images'
            ? {
                mediaRole: mediaRoleFor(section, field, section.key),
                mediaValue: field.mediaValue ?? 'object',
              }
            : {}),
        },
      ]),
  ) as Record<string, TemplateFieldConfig>
  return (
    <div className={`recap-accordion ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
      <div className="recap-accordion-content">
        <div className="recap-form-panel">
          <div className="recap-form-eyebrow">Đang chỉnh sửa</div>
          <h2>{section.title}</h2>
          <p className="recap-form-lead">{section.body}</p>
          <fieldset className="recap-schema-fields" disabled={!isOpen}>
            <TemplateSchemaFields
              fields={sharedFields}
              data={content}
              update={update}
              errors={validationIssue?.itemIndex === undefined
                ? (validationIssue ? { [validationIssue.path]: validationIssue.message } : {})
                : {}}
              mediaEnabled
              openMediaManager={({ path, multiple, role, minItems, maxItems }) =>
                media?.openManager(path, role, multiple, {
                  minSelection: minItems,
                  maxSelection: maxItems,
                })
              }
            />
          </fieldset>
          {repeatableEntry ? (
            <ConfigDrivenItemList
              path={(repeatableEntry[1] as TemplateFieldConfig).contentKey ?? `${section.key}.${repeatableEntry[0]}`}
              section={section}
              content={content}
              update={update}
              isOpen={isOpen}
              validationIssue={validationIssue}
            />
          ) : null}
          {section.wishMode === 'all-approved' ? (
            <ApprovedWishesNotice wishes={approvedWishes ?? []} action={section.editorAction} />
          ) : section.wishMode === 'curated' ? (
            <ApprovedWishPicker
              wishes={approvedWishes ?? []}
              selections={wishSelections ?? []}
              onChange={onWishSelectionsChange ?? (() => undefined)}
              disabled={!isOpen}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

export function RecapEditorPage() {
  const { navigate } = useNavigation()
  const workspace = useOptionalWeddingWorkspace()
  const wedding = workspace?.activeWedding ?? null
  const [active, setActive] = useState<string | null>('hero')
  const [content, setContent] = useState<Record<string, unknown>>({})
  const [recap, setRecap] = useState<RecapDraft | null>(null)
  const [approvedWishes, setApprovedWishes] = useState<Wish[]>([])
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [order, setOrder] = useState<string[]>([])
  const [enabled, setEnabled] = useState<string[]>([])
  const [saved, setSaved] = useState(true)
  const [published, setPublished] = useState(false)
  const [mobileAdviceOpen, setMobileAdviceOpen] = useState(
    () =>
      typeof window !== 'undefined' && Boolean(window.matchMedia?.('(max-width: 767px)').matches),
  )
  const [publishing, setPublishing] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [publicWeddingSlug, setPublicWeddingSlug] = useState<string | null>(wedding?.slug ?? null)
  const [shareOpen, setShareOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<Array<{ order: string[]; enabled: string[] }>>([])
  const [future, setFuture] = useState<Array<{ order: string[]; enabled: string[] }>>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [validationIssue, setValidationIssue] = useState<TemplateValidationIssue | null>(null)
  const [mediaManagerOpen, setMediaManagerOpen] = useState(false)
  const {
    assets: mediaAssets,
    loading: mediaLoading,
    uploading: mediaUploading,
    error: mediaError,
    setError: setMediaError,
    upload: uploadRecapMedia,
  } = useMediaLibrary({ weddingId: wedding?.id ?? null })
  const [mediaTarget, setMediaTarget] = useState<{
    path: string
    role: RecapMediaRole
    multiple: boolean
    minSelection?: number
    maxSelection?: number
  } | null>(null)
  const [mediaSelectionMode, setMediaSelectionMode] = useState<'single' | 'multiple'>('single')
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const templateConfig = recap
    ? resolveRecapTemplateConfig(recap.templateVersion.key, recap.templateVersion.config)
    : {}
  const templateSections = buildEditorSections(templateConfig)
  const previewPath =
    typeof templateConfig.previewPath === 'string'
      ? templateConfig.previewPath
      : ''
  const quickEditFields = Object.fromEntries(
    (Array.isArray(templateConfig.quickEdit)
      ? templateConfig.quickEdit
      : []
    ).flatMap((value, index) => {
      if (!value || typeof value !== 'object') return []
      const field = value as Record<string, unknown>
      if (typeof field.contentKey !== 'string') return []
      const key = `quickEdit${index}`
      return [[key, {
        type: field.type === 'date' ? 'date' as const : 'string' as const,
        label: typeof field.label === 'string' ? field.label : field.contentKey,
        contentKey: field.contentKey,
        maxLength: typeof field.maxLength === 'number' ? field.maxLength : undefined,
      }]]
    }),
  ) as Record<string, TemplateFieldConfig>
  const visibleSections = order.filter((key) => enabled.includes(key))
  const { frameRef, ready, hydrated, sendState, scrollToSection } = useLiveEditorBridge<
    {
      data: Record<string, unknown>
      sectionConfig: { enabled: string[]; order: string[] }
      wishes?: Array<{ id: string; authorName: string; content: string }>
    },
    string
  >({
    data: content,
    sectionConfig: { enabled, order },
    wishes: templateSections.some((section) => section.wishMode === 'all-approved')
      ? approvedWishes.map((wish) => ({ id: wish.id, authorName: wish.authorName, content: wish.content }))
      : templateSections.some((section) => section.wishMode === 'curated') && recap?.wishSelections.length
      ? recap.wishSelections.map((wish) => ({
            id: wish.wishId,
            authorName: wish.authorName,
            content: wish.content,
          }))
      : undefined,
  })

  const load = useCallback(async () => {
    if (!wedding) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    setShareUrl('')
    setPublished(false)
    try {
      const resolvedWedding = wedding.slug ? wedding : (await weddingApi.get(wedding.id)).wedding
      setPublicWeddingSlug(resolvedWedding.slug)
      const [recapResult, wishesResult] = await Promise.all([
        weddingApi.recap(wedding.id),
        loadAllApprovedWishes(wedding.id).catch(() => []),
      ])
      const result = recapResult.recap
      setApprovedWishes(wishesResult)
      if (!result) {
        setError('')
        setRecap(null)
        return
      }
      setRecap(result)
      const resolvedConfig = resolveRecapTemplateConfig(
        result.templateVersion.key,
        result.templateVersion.config,
      )
      const recapSlug = result.slug ?? resolvedWedding.slug
      setPublicWeddingSlug(recapSlug)
      if (result.status === 'PUBLISHED' && recapSlug) {
        setPublished(true)
        setShareUrl(window.location.origin + '/' + encodeURIComponent(recapSlug) + '/recaps')
      }
      setContent(seedQuickEditFallbacks(result.content, resolvedConfig))
      const normalized = normalizeSectionConfig(
        result.sectionConfig,
        buildEditorSections(resolvedConfig),
      )
      setOrder(normalized.order)
      setEnabled(normalized.enabled)
      setActive(normalized.order[0] ?? 'hero')
      setSaved(true)
    } catch (cause) {
      setApprovedWishes([])
      setError(cause instanceof Error ? cause.message : 'Không thể tải nội dung recap.')
    } finally {
      setLoading(false)
    }
  }, [wedding])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    const receiveDeviceChange = (event: Event) => {
      const next = (event as CustomEvent<'desktop' | 'mobile'>).detail
      if (next === 'desktop' || next === 'mobile') setDevice(next)
    }
    window.addEventListener('gmm-editor-preview-device-change', receiveDeviceChange)
    return () => window.removeEventListener('gmm-editor-preview-device-change', receiveDeviceChange)
  }, [])
  useEffect(() => {
    if (ready && active) scrollToSection(active)
  }, [active, ready, scrollToSection])
  useEffect(() => {
    if (!validationIssue || active !== validationIssue.sectionKey) return
    const timeout = window.setTimeout(() => {
      const field = Array.from(document.querySelectorAll<HTMLElement>('[data-editor-field-path]'))
        .find((element) => element.dataset.editorFieldPath === validationIssue.path)
      field?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 120)
    return () => window.clearTimeout(timeout)
  }, [active, validationIssue])

  const checkpoint = () => {
    setHistory((items) => [...items.slice(-49), { order: [...order], enabled: [...enabled] }])
    setFuture([])
  }
  const moveSection = (key: string, direction: -1 | 1) => {
    const index = order.indexOf(key)
    const nextIndex = index + direction
    const section = templateSections.find((item) => item.key === key)
    const target = templateSections.find((item) => item.key === order[nextIndex])
    if (!section?.canReorder || !target?.canReorder || nextIndex < 0 || nextIndex >= order.length)
      return
    checkpoint()
    const next = [...order]
    ;[next[index], next[nextIndex]] = [next[nextIndex], next[index]]
    setOrder(next)
    setSaved(false)
  }
  const toggleSection = (section: EditorSection) => {
    if (!section.canToggle) return
    const isEnabled = enabled.includes(section.key)
    checkpoint()
    setEnabled((items) =>
      isEnabled ? items.filter((key) => key !== section.key) : [...items, section.key],
    )
    if (!isEnabled) {
      setActive(section.key)
      scrollToSection(section.key)
    }
    setSaved(false)
  }
  const undo = () => {
    const previous = history.at(-1)
    if (!previous) return
    setHistory((items) => items.slice(0, -1))
    setFuture((items) => [...items, { order: [...order], enabled: [...enabled] }])
    setOrder(previous.order)
    setEnabled(previous.enabled)
    setSaved(false)
  }
  const redo = () => {
    const next = future.at(-1)
    if (!next) return
    setFuture((items) => items.slice(0, -1))
    setHistory((items) => [...items, { order: [...order], enabled: [...enabled] }])
    setOrder(next.order)
    setEnabled(next.enabled)
    setSaved(false)
  }

  const updateContent = (path: string, value: unknown) => {
    setContent((current) => setPath(current, path, value))
    if (validationIssue && path === validationIssue.path) {
      setValidationIssue(null)
      setError('')
    }
    setSaved(false)
  }
  const selectedMediaIds = new Set((recap?.mediaItems ?? []).map((item) => item.mediaAssetId))
  const attachMediaAsset = (asset: MediaAsset, target: { path: string; role: RecapMediaRole }) => {
    updateContent(target.path, {
      src: asset.publicUrl,
      alt: asset.originalName ?? 'Ảnh đã tải lên',
      role: target.role,
      mediaAssetId: asset.id,
    })
    setRecap((current) => {
      if (!current || current.mediaItems.some((item) => item.mediaAssetId === asset.id))
        return current
      return {
        ...current,
        mediaItems: [
          ...current.mediaItems,
          {
            id: asset.id,
            mediaAssetId: asset.id,
            caption: null,
            sortOrder: current.mediaItems.length,
            publicUrl: asset.publicUrl,
          },
        ],
      }
    })
    setSaved(false)
  }
  const attachMediaAssets = (
    assets: MediaAsset[],
    target: { path: string; role: RecapMediaRole },
  ) => {
    updateContent(
      target.path,
      assets.map((asset) => ({
        src: asset.publicUrl,
        alt: asset.originalName ?? 'Ảnh đã tải lên',
        role: target.role,
        mediaAssetId: asset.id,
      })),
    )
    setRecap((current) => {
      if (!current) return current
      const existing = new Set(current.mediaItems.map((item) => item.mediaAssetId))
      const additions = assets
        .filter((asset) => !existing.has(asset.id))
        .map((asset, index) => ({
          id: asset.id,
          mediaAssetId: asset.id,
          caption: null,
          sortOrder: current.mediaItems.length + index,
          publicUrl: asset.publicUrl,
        }))
      return additions.length
        ? { ...current, mediaItems: [...current.mediaItems, ...additions] }
        : current
    })
    setSaved(false)
  }
  const save = async (options?: { suppressRepublishPrompt?: boolean }): Promise<boolean> => {
    if (!wedding || !recap || saving) return false
    const validationErrors = validateTemplateContent(
      content as unknown as Record<string, unknown>,
      templateSections,
    )
    if (validationErrors.length) {
      const issue = validationErrors[0]
      setValidationIssue(issue)
      setActive(issue.sectionKey)
      const sectionLabel = templateSections.find((section) => section.key === issue.sectionKey)?.label
      setError(`${sectionLabel ? `${sectionLabel} · ` : ''}${issue.message}`)
      return false
    }
    setValidationIssue(null)
    setSaving(true)
    setError('')
    try {
      const result = await weddingApi.saveRecap(wedding.id, {
        templateVersionId: recap.templateVersion.id,
        title: recap.title,
        thankYouMessage: recap.thankYouMessage,
        ogTitle: recap.ogTitle,
        ogDescription: recap.ogDescription,
        ogImageUrl: recap.ogImageUrl,
        content: content as unknown as Record<string, unknown>,
        themeConfig: recap.themeConfig,
        sectionConfig: addApiOnlySectionKeys(
          { enabled, order },
          recap.templateVersion.config,
          recap.sectionConfig,
        ),
        mediaItems: recap.mediaItems.map((item) => ({
          mediaAssetId: item.mediaAssetId,
          caption: item.caption,
          sortOrder: item.sortOrder,
        })),
        wishSelections: templateSections.some((section) => section.wishMode === 'all-approved')
          ? approvedWishes.map((wish, sortOrder) => ({ wishId: wish.id, sortOrder }))
          : recap.wishSelections.map((item) => ({ wishId: item.wishId, sortOrder: item.sortOrder })),
        revision: recap.revision,
      })
      setRecap(result.recap)
      setContent(seedQuickEditFallbacks(result.recap.content, templateConfig))
      const dashboard = await weddingApi.dashboard(wedding.id)
      const nextPublished = dashboard.dashboard.publication.recap.published
      setPublished(nextPublished)
      if (published && !nextPublished && !options?.suppressRepublishPrompt) {
        const result = await notifications.confirm({
          icon: 'info',
          title: 'Recap đã tạm đóng',
          text: 'Recap đã được tạm đóng vì bạn vừa cập nhật nội dung. Bạn có muđn mở lại ngay không?',
          confirmButtonText: 'Mở lại recap',
          cancelButtonText: 'Để sau',
          reverseButtons: true,
          focusCancel: true,
        })
        if (result.isConfirmed) {
          try {
            const latest = await weddingApi.recap(wedding.id)
            if (latest.recap) {
              const publishedResult = await weddingApi.publishRecap(wedding.id, {
                revision: latest.recap.revision,
              })
              const publishedSlug =
                publishedResult.snapshot.slug || publicWeddingSlug || wedding.slug
              setPublished(true)
              if (publishedSlug) {
                setPublicWeddingSlug(publishedSlug)
                setShareUrl(
                  window.location.origin + '/' + encodeURIComponent(publishedSlug) + '/recaps',
                )
                setShareOpen(true)
              }
              await notifications.success('Đã mở lại recap')
              await workspace?.refresh()
            }
          } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'Không thể mở lại recap.')
          }
        }
      }
      setSaved(true)
      notifications.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Đã lưu recap',
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
      })
      return true
    } catch (cause) {
      setError(
        cause instanceof WeddingApiError && cause.status === 409
          ? 'Nội dung vừa thay đổi ở nơi khác. Hãy tải lại để tiếp tục.'
          : cause instanceof Error
            ? cause.message
            : 'Không thể lưu nội dung recap.',
      )
      if (cause instanceof WeddingApiError && cause.code === 'RECAP_REVISION_CONFLICT') await load()
      return false
    } finally {
      setSaving(false)
    }
  }

  const managerSelectedIds = mediaTarget
    ? (() => {
        const value = getPath(content as unknown as Record<string, unknown>, mediaTarget.path)
        const values = Array.isArray(value) ? value : [value]
        return values.flatMap((item) => {
          if (!item || typeof item !== 'object') return []
          const record = item as Record<string, unknown>
          const asset = mediaAssets.find(
            (candidate) =>
              record.mediaAssetId === candidate.id || record.src === candidate.publicUrl,
          )
          return asset ? [asset.id] : []
        })
      })()
    : mediaSelectionMode === 'multiple'
      ? mediaAssets.map((asset) => asset.id)
      : [...selectedMediaIds]
  const openDraftPreview = async () => {
    const slug =
      recap?.slug ??
      publicWeddingSlug ??
      wedding?.slug ??
      (wedding ? (await weddingApi.get(wedding.id)).wedding.slug : null)
    if (!slug) {
      setError('Wedding chưa có slug để mở recap.')
      return
    }
    window.open(
      window.location.origin + '/' + encodeURIComponent(slug) + '/recaps',
      '_blank',
      'noopener,noreferrer',
    )
  }

  const publishRecap = async () => {
    if (!wedding || !recap || saving || publishing) return
    setPublishing(true)
    setError('')
    const didSave = saved || (await save({ suppressRepublishPrompt: true }))
    if (!didSave) {
      setPublishing(false)
      return
    }
    try {
      const resolvedSlug =
        recap.slug ??
        publicWeddingSlug ??
        wedding.slug ??
        (await weddingApi.get(wedding.id)).wedding.slug
      if (!resolvedSlug) {
        setError(
          'Wedding chưa sẵn sàng để chia sẻ recap. Vui lòng tải lại trang hoặc liên hệ hỗ trợ.',
        )
        return
      }
      const latest = (await weddingApi.recap(wedding.id)).recap
      if (!latest) return
      const result = await weddingApi.publishRecap(wedding.id, { revision: latest.revision })
      const publishedSlug = result.snapshot.slug || resolvedSlug
      setPublicWeddingSlug(publishedSlug)
      const publicUrl = window.location.origin + '/' + encodeURIComponent(publishedSlug) + '/recaps'
      setPublished(true)
      setShareUrl(publicUrl)
      setShareOpen(true)
      setCopied(false)
      notifications.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Đã xuất bản recap',
        showConfirmButton: false,
        timer: 2600,
        timerProgressBar: true,
      })
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Không thể xuất bản recap.'
      setError(message)
      notifications.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 3200,
        timerProgressBar: true,
      })
    } finally {
      setPublishing(false)
    }
  }

  const unpublishRecap = async () => {
    if (!wedding || !recap || publishing) return
    setPublishing(true)
    setError('')
    try {
      await weddingApi.unpublish(wedding.id, { surface: 'RECAP', revision: recap.revision })
      setPublished(false)
      setShareUrl('')
      setShareOpen(false)
      await load()
      await notifications.success('Đã tạm đóng recap')
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Không thể tạm đóng recap.'
      setError(message)
      await notifications.error('Không thể tạm đóng recap', message)
    } finally {
      setPublishing(false)
    }
  }

  const hasUnsavedChanges = saved === false
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault()
        event.returnValue = ''
      }
    }
    const intercept = (event: MouseEvent) => {
      if (
        !hasUnsavedChanges ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return
      const anchor = (event.target as Element | null)?.closest(
        'a[href]',
      ) as HTMLAnchorElement | null
      if (!anchor || anchor.target === '_blank') return
      const target = new URL(anchor.href, window.location.href)
      if (target.origin !== window.location.origin || target.pathname === window.location.pathname)
        return
      event.preventDefault()
      event.stopPropagation()
      setPendingNavigation(`${target.pathname}${target.search}${target.hash}`)
    }
    window.addEventListener('beforeunload', warn)
    document.addEventListener('click', intercept, true)
    return () => {
      window.removeEventListener('beforeunload', warn)
      document.removeEventListener('click', intercept, true)
    }
  }, [hasUnsavedChanges])

  if (!wedding || (!loading && !recap))
    return (
      <section className="recap-editor-empty" aria-labelledby="recap-editor-empty-heading">
        <div className="recap-editor-empty-card">
          <CheckCircle size={48} weight="duotone" aria-hidden="true" />
          <h1 id="recap-editor-empty-heading">Bạn chưa chọn giao diện recap</h1>
          <p>Hãy chọn một giao diện trong kho recap trước khi bắt đầu chỉnh sửa.</p>
          <AppLink className="button button-primary" to={studioRoutes.recapThemes}>
            Đi đến kho giao diện recap
          </AppLink>
        </div>
      </section>
    )

  return (
    <RecapMediaContext.Provider
      value={{
        assets: mediaAssets,
        selectedIds: selectedMediaIds,
        openManager: (target, role = 'hero', multiple = false, limits) => {
          setMediaError('')
          setMediaTarget(target ? { path: target, role, multiple, ...limits } : null)
          setMediaSelectionMode(multiple ? 'multiple' : 'single')
          setMediaManagerOpen(true)
        },
      }}
    >
      <section className="recap-editor-page" aria-labelledby="recap-editor-heading">
        <header className="recap-editor-toolbar">
          <div className="recap-editor-title">
            <AppLink to={studioRoutes.recapThemes} ariaLabel="Quay lại kho giao diện recap">
              <ArrowLeft size={18} />
            </AppLink>
            <div>
              <p className="breadcrumb">
                Wedding Recap <span>/</span>{' '}
                {typeof templateConfig.displayName === 'string'
                  ? templateConfig.displayName
                  : 'Wedding Recap'}
              </p>
              <h1 id="recap-editor-heading">Kể lại ngày vui</h1>
            </div>
          </div>
          {Object.keys(quickEditFields).length ? (
            <div className="editor-couple-quick-edit recap-couple-quick-edit">
              <TemplateSchemaFields
                fields={quickEditFields}
                data={content}
                update={updateContent}
              />
            </div>
          ) : null}
          <div className="recap-editor-actions">
            <span className={`recap-save-state ${saved ? 'is-saved' : ''}`}>
              <Check size={14} />{' '}
              {loading
                ? 'Đang tải'
                : saving
                  ? 'Đang lưu'
                  : error || (saved ? 'Đã lưu' : 'Chưa lưu')}
            </span>
            <div className="recap-history-actions">
              <button type="button" disabled={!history.length} onClick={undo} aria-label="Hoàn tác">
                <ArrowUp size={15} />
              </button>
              <button type="button" disabled={!future.length} onClick={redo} aria-label="Làm lại">
                <ArrowDown size={15} />
              </button>
            </div>
            <div className="recap-device-toggle" aria-label="Kích thước xem trước">
              <button
                type="button"
                className={device === 'desktop' ? 'is-active' : ''}
                aria-pressed={device === 'desktop'}
                onClick={() => setDevice('desktop')}
                aria-label="Xem dạng máy tính"
              >
                <Desktop size={15} />
              </button>
              <button
                type="button"
                className={device === 'mobile' ? 'is-active' : ''}
                aria-pressed={device === 'mobile'}
                onClick={() => setDevice('mobile')}
                aria-label="Xem dạng điện thoại"
              >
                <DeviceMobile size={15} />
              </button>
            </div>
            <button
              className="button button-secondary"
              type="button"
              disabled={!previewPath}
              onClick={() => window.open(window.location.origin + previewPath, '_blank', 'noopener,noreferrer')}
            >
              <Eye size={16} /> Xem thiệp mẫu
            </button>
            <button
              className="button button-secondary"
              type="button"
              disabled={!recap || saving || loading}
              onClick={() => void save()}
            >
              <FloppyDisk size={16} /> {saving ? 'Đang lưu' : 'Lưu thay đổi'}
            </button>
            <button
              className="button button-secondary"
              type="button"
              disabled={!recap || saving || loading}
              onClick={openDraftPreview}
            >
              <Eye size={16} /> Xem recap của tôi
            </button>
            {published ? (
              <button
                className="button button-secondary"
                type="button"
                disabled={!shareUrl}
                onClick={() => {
                  setCopied(false)
                  setShareOpen(true)
                }}
              >
                <ShareNetwork size={16} /> Chia sẻ recap
              </button>
            ) : null}
            <button
              className="button button-primary"
              type="button"
              disabled={!recap || saving || loading || publishing}
              onClick={() => void (published ? unpublishRecap() : publishRecap())}
            >
              <PaperPlaneTilt size={16} />{' '}
              {publishing
                ? published
                  ? 'Đang tạm đóng…'
                  : 'Đang công khai…'
                : published
                  ? 'Tạm đóng recap'
                  : 'Công khai recap'}
            </button>
          </div>
        </header>
        <div className="recap-editor-layout">
          <aside className="recap-section-panel">
            <div className="recap-panel-intro">
              <span>
                {typeof templateConfig.displayName === 'string'
                  ? templateConfig.displayName
                  : 'Wedding Recap'}
              </span>
              <strong>
                {visibleSections.length}/{order.length} section đang hiển thị
              </strong>
              <small>Mở từng phần để chỉnh sửa nội dung.</small>
              {published ? (
                <div className="recap-publication-status">
                  <span>Recap đang được công khai</span>
                  {shareUrl ? (
                    <a href={shareUrl} target="_blank" rel="noreferrer">
                      {shareUrl}
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
            <ol>
              {order.map((key, index) => {
                const section = templateSections.find((item) => item.key === key) ?? {
                  key,
                  label: key,
                  detail: 'Nội dung section',
                  title: key,
                  body: 'Nội dung section',
                  required: false,
                  canToggle: true,
                  canReorder: true,
                  repeatable: false,
                }
                const isEnabled = enabled.includes(key)
                return (
                  <li
                    className={`recap-section-card ${active === key ? 'is-active' : ''} ${isEnabled ? '' : 'is-disabled'}`}
                    key={key}
                  >
                    <div className="recap-section-row">
                      <button
                        className="recap-section-item"
                        type="button"
                        aria-expanded={active === key}
                        onClick={() => {
                          setActive((value) => (value === key ? null : key))
                          scrollToSection(key)
                          setSaved(false)
                        }}
                      >
                        <span className="recap-section-index">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span>
                          <strong>{section.label}</strong>
                          <small>
                            {section.required ? 'Bắt buộc' : isEnabled ? section.detail : 'Đang ẩn'}
                          </small>
                        </span>
                        <Check className="recap-section-check" size={16} weight="bold" />
                      </button>
                      <div className="recap-section-tools">
                        <button
                          type="button"
                          disabled={
                            !section.canReorder ||
                            index === 0 ||
                            !templateSections.find((item) => item.key === order[index - 1])
                              ?.canReorder
                          }
                          onClick={() => moveSection(key, -1)}
                          aria-label={`Đưa ${section.label} lên`}
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={
                            !section.canReorder ||
                            index === order.length - 1 ||
                            !templateSections.find((item) => item.key === order[index + 1])
                              ?.canReorder
                          }
                          onClick={() => moveSection(key, 1)}
                          aria-label={`Đưa ${section?.label ?? key} xuđng`}
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={isEnabled}
                          disabled={!section.canToggle}
                          className={`editor-switch ${isEnabled ? 'is-on' : ''}`}
                          onClick={() => toggleSection(section)}
                          aria-label={`${isEnabled ? 'An' : 'Hien'} ${section?.label ?? key}`}
                        >
                          <span />
                        </button>
                      </div>
                    </div>
                    <SectionForm
                      section={section}
                      content={content}
                      updateContent={updateContent}
                      isOpen={active === key}
                      validationIssue={validationIssue?.sectionKey === key ? validationIssue : null}
                      wishSelections={recap?.wishSelections}
                      approvedWishes={approvedWishes}
                      onWishSelectionsChange={(wishes) => {
                        setRecap((current) => (current ? { ...current, wishSelections: wishes } : current))
                        setSaved(false)
                      }}
                    />
                  </li>
                )
              })}
            </ol>
          </aside>
          <aside className="recap-live-preview">
            <div className="recap-live-preview-head">
              <span>Preview</span>
              <strong>{device === 'desktop' ? 'Desktop' : 'Mobile'}</strong>
              <AppLink className="recap-open-preview" to={studioRoutes.recapThemes}>
                Đổi giao diện
              </AppLink>
            </div>
            <RecapPreviewFrame
              templateKey={recap?.templateVersion.key ?? ''}
              frameRef={frameRef}
              route={previewPath ? `${previewPath}?editor=1&template=${encodeURIComponent(recap?.templateVersion.key ?? '')}` : ''}
              device={device}
              ready={ready && hydrated}
              open={previewOpen}
              onToggleOpen={() => setPreviewOpen((value) => !value)}
              onLoad={sendState}
            />
          </aside>
        </div>
        {pendingNavigation ? (
          <div className="recap-unsaved-backdrop" role="presentation">
            <section
              className="recap-unsaved-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="recap-unsaved-title"
            >
              <FloppyDisk size={28} />
              <h2 id="recap-unsaved-title">Bạn có thay đổi chưa lưu</h2>
              <p>Bạn có muđn lưu nội dung recap trước khi rời khỏi trang này không?</p>
              <footer>
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => setPendingNavigation(null)}
                >
                  Ở lại
                </button>
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => {
                    const target = pendingNavigation
                    setPendingNavigation(null)
                    navigate(target)
                  }}
                >
                  Rời đi không lưu
                </button>
                <button
                  className="button button-primary"
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    void (async () => {
                      const didSave = await save()
                      if (didSave) {
                        const target = pendingNavigation
                        setPendingNavigation(null)
                        navigate(target)
                      }
                    })()
                  }
                >
                  {saving ? 'Đang lưu…' : 'Lưu và rời đi'}
                </button>
              </footer>
            </section>
          </div>
        ) : null}
        <MobileEditorAdviceModal
          open={mobileAdviceOpen}
          onClose={() => setMobileAdviceOpen(false)}
        />
        {shareOpen && shareUrl ? (
          <ShareRecapModal
            url={shareUrl}
            copied={copied}
            onClose={() => setShareOpen(false)}
            onCopy={async () => {
              await navigator.clipboard?.writeText(shareUrl)
              setCopied(true)
            }}
            onNativeShare={async () => {
              if (navigator.share) await navigator.share({ title: 'Wedding recap', url: shareUrl })
            }}
          />
        ) : null}
        <MediaManagerModal
          selectionMode={mediaSelectionMode}
          minSelection={mediaTarget?.minSelection}
          maxSelection={mediaTarget?.maxSelection}
          open={mediaManagerOpen}
          assets={mediaAssets}
          selectedIds={managerSelectedIds}
          loading={mediaLoading}
          uploading={mediaUploading}
          error={mediaError}
          onClose={() => setMediaManagerOpen(false)}
          onUpload={uploadRecapMedia}
          onConfirm={(selected) => {
            if (mediaTarget) {
              if (selected.length) {
                if (mediaTarget.multiple) attachMediaAssets(selected, mediaTarget)
                else attachMediaAsset(selected[0], mediaTarget)
              } else {
                updateContent(
                  mediaTarget.path,
                  mediaTarget.multiple ? [] : { src: '', alt: '', role: mediaTarget.role },
                )
              }
            } else {
              setRecap((current) =>
                current
                  ? {
                      ...current,
                      mediaItems: selected.map((asset, index) => ({
                        id: asset.id,
                        mediaAssetId: asset.id,
                        caption: null,
                        sortOrder: index,
                        publicUrl: asset.publicUrl,
                      })),
                    }
                  : current,
              )
              setSaved(false)
            }
            setMediaManagerOpen(false)
          }}
        />
      </section>
    </RecapMediaContext.Provider>
  )
}

function ShareRecapModal({
  url,
  copied,
  onClose,
  onCopy,
  onNativeShare,
}: {
  url: string
  copied: boolean
  onClose: () => void
  onCopy: () => Promise<void>
  onNativeShare: () => Promise<void>
}) {
  const facebookUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url)
  return (
    <div
      className="publication-share-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="publication-share-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="publication-share-title"
      >
        <button
          type="button"
          className="publication-share-close"
          onClick={onClose}
          aria-label="Đóng"
        >
          <X size={18} />
        </button>
        <span className="publication-share-kicker">RECAP Để SẴN SÀNG</span>
        <h2 id="publication-share-title">Chia sẻ câu chuyện của hai bạn</h2>
        <p>Gửi đường dẫn recap đến gia đình và bạn bè.</p>
        <div className="publication-share-link">
          <Link size={17} />
          <span>{url}</span>
          <button type="button" onClick={() => void onCopy()} aria-label="Sao chép đường dẫn">
            <Copy size={17} />
          </button>
        </div>
        <div className="publication-share-actions">
          <a
            className="button button-secondary"
            href={facebookUrl}
            target="_blank"
            rel="noreferrer"
          >
            <FacebookLogo size={17} /> Facebook
          </a>
          {typeof navigator !== 'undefined' && 'share' in navigator ? (
            <button
              className="button button-secondary"
              type="button"
              onClick={() => void onNativeShare()}
            >
              <ShareNetwork size={17} /> Chia sẻ
            </button>
          ) : null}
          <button className="button button-primary" type="button" onClick={() => void onCopy()}>
            <Copy size={17} /> {copied ? 'Đã sao chép' : 'Sao chép link'}
          </button>
        </div>
      </section>
    </div>
  )
}

function RecapPreviewFrame({
  frameRef,
  route,
  device,
  ready,
  open,
  onToggleOpen,
  onLoad,
  templateKey,
}: {
  frameRef: React.Ref<HTMLIFrameElement>
  route: string
  device: 'desktop' | 'mobile'
  ready: boolean
  open: boolean
  onToggleOpen: () => void
  onLoad: () => void
  templateKey: string
}) {
  return (
    <EditorPreviewModal
      frameRef={frameRef}
      route={route}
      device={device}
      defaultDevice="desktop"
      ready={ready}
      templateKey={templateKey}
      title="Bản xem trước recap"
      open={open}
      onToggleOpen={onToggleOpen}
      onDeviceChange={(next) =>
        window.dispatchEvent(new CustomEvent('gmm-editor-preview-device-change', { detail: next }))
      }
      onLoad={onLoad}
      viewportDimensions={{
        desktop: { width: 1024, height: 683 },
        mobile: { width: 450, height: 800 },
      }}
    />
  )
}
