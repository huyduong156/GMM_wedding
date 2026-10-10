import { NativeSelectField } from '../../../shared/ui/form-controls/NativeSelectField'
import { notifications } from '../../../shared/ui/notifications/notifications'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Archive,
  ArrowSquareOut,
  Check,
  CircleNotch,
  Copy,
  DotsThree,
  MagnifyingGlass,
  PaperPlaneTilt,
  Plus,
  UploadSimple,
  UserPlus,
  Users,
  WarningCircle,
  X,
} from '@phosphor-icons/react'
import {
  guestApi,
  guestCategoryApi,
  weddingApi,
  type Guest,
  type GuestCategory,
  type Wedding,
} from '../../../shared/api/weddings'
import { useOptionalWeddingWorkspace } from '../../../entities/wedding/model/wedding-context'
import { GuestsPage } from './GuestsPage'

type FormState = {
  name: string
  displayName: string
  phone: string
  email: string
  tableName: string
  maxPartySize: string
  categoryId: string
  familySide: '' | 'BRIDE' | 'GROOM'
  note: string
}
const REMOVE_CATEGORY = '__remove_category__'
const REMOVE_FAMILY_SIDE = '__remove_family_side__'
const blank: FormState = {
  name: '',
  displayName: '',
  phone: '',
  email: '',
  tableName: '',
  maxPartySize: '1',
  categoryId: '',
  familySide: '',
  note: '',
}
const guestName = (guest: Guest) => guest.name || guest.displayName || 'Chưa có tên'
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || '?'
const date = (value: string) =>
  new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(new Date(value))
const categoryPath = (categories: GuestCategory[], category: GuestCategory) => {
  const names = [category.name]
  let parentId = category.parentId
  while (parentId) {
    const parent = categories.find((item) => item.id === parentId)
    if (!parent) break
    names.unshift(parent.name)
    parentId = parent.parentId
  }
  return names.join(' / ')
}
const categoryFamilySideName = (side: GuestCategory['familySide']) =>
  side === 'BRIDE' ? 'Nhà gái' : side === 'GROOM' ? 'Nhà trai' : 'Chung'
const categoryFamilySide = (categories: GuestCategory[], category: GuestCategory) => {
  let current = category
  while (current.parentId) {
    const parent = categories.find((item) => item.id === current.parentId)
    if (!parent) break
    current = parent
  }
  return current.familySide
}
const categoryOptionLabel = (categories: GuestCategory[], category: GuestCategory) =>
  `${categoryFamilySideName(categoryFamilySide(categories, category))} · ${categoryPath(categories, category)}`
const catName = (categories: GuestCategory[], id: string | null) => {
  const category = categories.find((item) => item.id === id)
  return category ? categoryPath(categories, category) : 'Chưa phân loại'
}
const normalizeGuestFamilySide = (value: string): Guest['familySide'] =>
  value === 'GROOM' || value === 'BRIDE' ? value : null
const GUEST_PAGE_SIZE = 20
type GuestFamilyBlockKey = 'GROOM' | 'BRIDE' | 'COMMON'
type GuestFamilyBlockState = {
  key: GuestFamilyBlockKey
  label: string
  items: Guest[]
  total: number
  nextCursor: string | null
  cursors: Array<string | null>
  page: number
  loading: boolean
}
const guestFamilyBlockDefinitions: Array<Pick<GuestFamilyBlockState, 'key' | 'label'>> = [
  { key: 'GROOM', label: 'Nhà trai' },
  { key: 'BRIDE', label: 'Nhà gái' },
  { key: 'COMMON', label: 'Chung' },
]
const emptyGuestFamilyBlocks = (): GuestFamilyBlockState[] =>
  guestFamilyBlockDefinitions.map((block) => ({
    ...block,
    items: [],
    total: 0,
    nextCursor: null,
    cursors: [null],
    page: 1,
    loading: false,
  }))

function GuestShareDialog({
  weddingId,
  weddingSlug,
  guest,
  close,
}: {
  weddingId: string
  weddingSlug: string | null
  guest: Guest
  close: () => void
}) {
  const [state, setState] = useState<'loading' | 'ready' | 'not-public' | 'error'>('loading')
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        if (!weddingSlug) throw new Error('Đám cưới chưa có đường dẫn công khai.')
        const dashboardResult = await weddingApi.dashboard(weddingId)
        const publication = dashboardResult.dashboard.publication.invitation
        if (!publication.published) {
          if (active) setState('not-public')
          return
        }
        if (!guest.slug) throw new Error('Khách mời chưa có guest-slug để tạo link riêng.')
        await weddingApi.publicInvitationGuest(weddingSlug, guest.slug)
        if (active) {
          setUrl(
            `${window.location.origin}/${encodeURIComponent(weddingSlug)}/invitation/${encodeURIComponent(guest.slug)}`,
          )
          setState('ready')
        }
      } catch (cause) {
        if (active) {
          setError(cause instanceof Error ? cause.message : 'Không thể tạo link gửi thiệp.')
          setState('error')
        }
      }
    }
    void load()
    return () => {
      active = false
    }
  }, [guest.id, guest.slug, weddingId, weddingSlug])

  const copy = async () => {
    if (!url) return
    await navigator.clipboard.writeText(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div
      className="category-dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <section
        className="category-dialog guest-share-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guest-share-dialog-title"
      >
        <header>
          <div>
            <h2 id="guest-share-dialog-title">Gửi thiệp cho {guestName(guest)}</h2>
            <p>Link này chỉ dành cho khách mời đang chọn.</p>
          </div>
          <button type="button" onClick={close} aria-label="Đóng">
            <X size={18} />
          </button>
        </header>
        {state === 'loading' ? (
          <div className="guest-share-state">
            <CircleNotch size={28} className="is-spinning" />
            <strong>Đang kiểm tra trạng thái thiệp…</strong>
            <p>Đang lấy link riêng của khách mời.</p>
          </div>
        ) : state === 'ready' ? (
          <div className="guest-share-content">
            <div className="guest-share-success">
              <Check size={18} weight="bold" />
              <span>Thiệp đã được công khai</span>
            </div>
            <label htmlFor="guest-share-url">Link thiệp riêng</label>
            <div className="guest-share-url">
              <input id="guest-share-url" value={url} readOnly />
              <button type="button" onClick={() => void copy()} aria-label="Sao chép link">
                {copied ? <Check size={17} /> : <Copy size={17} />}
              </button>
            </div>
            {copied && (
              <p className="guest-share-copied" role="status">
                Đã sao chép link.
              </p>
            )}
            <footer>
              <button className="button button-secondary" type="button" onClick={close}>
                Đóng
              </button>
              <a className="button button-primary" href={url} target="_blank" rel="noreferrer">
                <ArrowSquareOut size={17} /> Mở thiệp
              </a>
            </footer>
          </div>
        ) : state === 'not-public' ? (
          <div className="guest-share-state is-warning">
            <WarningCircle size={28} />
            <strong>Cần công khai thiệp trước</strong>
            <p>Hãy công khai thiệp cưới để có thể tạo link riêng gửi cho khách mời.</p>
            <footer>
              <button className="button button-secondary" type="button" onClick={close}>
                Đóng
              </button>
            </footer>
          </div>
        ) : (
          <div className="guest-share-state is-error">
            <WarningCircle size={28} />
            <strong>Không thể lấy link gửi thiệp</strong>
            <p>{error}</p>
            <footer>
              <button className="button button-secondary" type="button" onClick={close}>
                Đóng
              </button>
            </footer>
          </div>
        )}
      </section>
    </div>
  )
}
function GuestDialogLoading() {
  return (
    <div className="guest-dialog-loading" role="status" aria-live="polite">
      <CircleNotch size={22} aria-hidden="true" />
      <span>Đang lưu thông tin…</span>
    </div>
  )
}

function GuestAssignmentFields({
  form,
  categories,
  change,
}: {
  form: FormState
  categories: GuestCategory[]
  change: (key: keyof FormState, value: string) => void
}) {
  return (
    <>
      <label
        className={form.categoryId ? 'guest-category-field is-selected' : 'guest-category-field'}
      >
        <span>Danh mục {form.categoryId ? <em>Đang giữ cho khách tiếp theo</em> : null}</span>
        <NativeSelectField
          value={form.categoryId}
          onChange={(event) => change('categoryId', event.target.value)}
        >
          <option value="">Chưa phân loại</option>
          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {categoryOptionLabel(categories, item)}
            </option>
          ))}
        </NativeSelectField>
        {form.categoryId ? <small>Danh mục này sẽ được giữ lại sau khi thêm khách.</small> : null}
      </label>
      <fieldset className="guest-family-side-field">
        <legend>Phía gia đình</legend>
        <div className="guest-family-side-options" role="radiogroup" aria-label="Phía gia đình">
          <label>
            <input
              type="radio"
              name="guest-family-side"
              value="GROOM"
              checked={form.familySide === 'GROOM'}
              onChange={(event) => change('familySide', event.target.value)}
            />
            <span>Nhà trai</span>
          </label>
          <label>
            <input
              type="radio"
              name="guest-family-side"
              value="BRIDE"
              checked={form.familySide === 'BRIDE'}
              onChange={(event) => change('familySide', event.target.value)}
            />
            <span>Nhà gái</span>
          </label>
          <label>
            <input
              type="radio"
              name="guest-family-side"
              value=""
              checked={form.familySide === ''}
              onChange={() => change('familySide', '')}
            />
            <span>Chung</span>
          </label>
        </div>
      </fieldset>
    </>
  )
}

function GuestDialog({
  form,
  categories,
  editing,
  busy,
  error,
  change,
  save,
  close,
}: {
  form: FormState
  categories: GuestCategory[]
  editing: boolean
  busy: boolean
  error: string
  change: (key: keyof FormState, value: string) => void
  save: () => void
  close: () => void
}) {
  const [nameTouched, setNameTouched] = useState(false)
  useEffect(() => {
    // The create dialog stays open on mobile and clears the form after a
    // successful save. Start the next entry with a clean validation state.
    if (!form.name.trim()) setNameTouched(false)
  }, [form.name])
  const nameError = nameTouched
    ? !form.name.trim()
      ? 'Vui lòng nhập tên khách mời.'
      : form.name.trim().length > 160
        ? 'Tên khách mời không được vượt quá 160 ký tự.'
        : ''
    : ''
  return (
    <div
      className="category-dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <section
        className="category-dialog guest-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guest-dialog-title"
      >
        <header>
          <div>
            <h2 id="guest-dialog-title">{editing ? 'Chỉnh sửa khách mời' : 'Thêm khách mời'}</h2>
            <p>Thông tin riêng tư trong không gian cưới của bạn.</p>
            {!editing && (
              <span className="guest-dialog-mobile-note">
                Hộp thoại sẽ không đóng cho đến khi bạn tắt nó.
              </span>
            )}
          </div>
          <button type="button" onClick={close} aria-label="Đóng">
            <X size={18} />
          </button>
        </header>
        <label htmlFor="guest-name">Tên khách mời</label>
        <input
          id="guest-name"
          autoFocus
          maxLength={160}
          autoComplete="off"
          aria-invalid={Boolean(nameError)}
          onBlur={() => setNameTouched(true)}
          value={form.name}
          onChange={(event) => change('name', event.target.value)}
          placeholder="Nguyễn Văn A"
        />
        {nameError && <p className="field-error guest-name-error">{nameError}</p>}
        <label htmlFor="guest-display-name">
          Tên hiển thị trên thiệp <span className="field-hint">(tùy chọn)</span>
        </label>
        <input
          id="guest-display-name"
          autoComplete="off"
          value={form.displayName}
          onChange={(event) => change('displayName', event.target.value)}
          placeholder="Ví dụ: anh Ba Hưng"
        />
        <GuestAssignmentFields form={form} categories={categories} change={change} />
        <div className="guest-form-grid">
          <label>
            Số điện thoại
            <input value={form.phone} onChange={(event) => change('phone', event.target.value)} />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => change('email', event.target.value)}
            />
          </label>
          <label>
            Số người tối đa
            <input
              type="number"
              min="1"
              max="50"
              value={form.maxPartySize}
              onChange={(event) => change('maxPartySize', event.target.value)}
            />
          </label>
          <label>
            Bàn / khu vực
            <input
              value={form.tableName}
              onChange={(event) => change('tableName', event.target.value)}
            />
          </label>
        </div>
        <label>
          Ghi chú
          <textarea
            rows={3}
            value={form.note}
            onChange={(event) => change('note', event.target.value)}
          />
        </label>
        {error && <p className="field-error">{error}</p>}
        <footer>
          <button className="button button-secondary" type="button" onClick={close}>
            Hủy
          </button>
          <button
            className="button button-primary"
            type="button"
            disabled={busy}
            onClick={() => {
              setNameTouched(true)
              if (form.name.trim() && form.name.trim().length <= 160) save()
            }}
          >
            {busy ? 'Đang lưu…' : editing ? 'Lưu thay đổi' : 'Thêm khách'}
          </button>
        </footer>
        {busy && <GuestDialogLoading />}
      </section>
    </div>
  )
}

export function GuestsPageConnected() {
  const workspace = useOptionalWeddingWorkspace()
  if (!workspace) return <GuestsPage />
  return (
    <GuestsPageConnectedContent
      activeWedding={workspace.activeWedding}
      canEdit={workspace.activeRole === 'OWNER' || workspace.activeRole === 'EDITOR'}
    />
  )
}

function GuestsPageConnectedContent({
  activeWedding,
  canEdit,
}: {
  activeWedding: Wedding | null
  canEdit: boolean
}) {
  const [guestBlocks, setGuestBlocks] = useState<GuestFamilyBlockState[]>(emptyGuestFamilyBlocks)
  const [sharingGuest, setSharingGuest] = useState<Guest | null>(null)
  const [categories, setCategories] = useState<GuestCategory[]>([])
  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [familySide, setFamilySide] = useState<'' | 'BRIDE' | 'GROOM' | 'COMMON'>('')
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [form, setForm] = useState(blank)
  const [editing, setEditing] = useState<Guest | null>(null)
  const [creating, setCreating] = useState(false)
  const [busy, setBusy] = useState(false)
  const [bulkCategoryAction, setBulkCategoryAction] = useState('')
  const [bulkFamilySideAction, setBulkFamilySideAction] = useState('')
  const weddingId = activeWedding?.id
  const guests = useMemo(() => guestBlocks.flatMap((block) => block.items), [guestBlocks])
  const guestTotal = useMemo(
    () => guestBlocks.reduce((sum, block) => sum + block.total, 0),
    [guestBlocks],
  )
  const load = useCallback(async () => {
    if (!weddingId) return
    setLoading(true)
    setError('')
    try {
      const blocksToLoad = familySide
        ? guestFamilyBlockDefinitions.filter((block) => block.key === familySide)
        : guestFamilyBlockDefinitions
      const [guestResults, categoryResult] = await Promise.all([
        Promise.all(
          blocksToLoad.map((block) =>
            guestApi.list(weddingId, {
              q: query.trim() || undefined,
              categoryId: categoryId || undefined,
              familySide: block.key === 'COMMON' ? undefined : block.key,
              familySideNull: block.key === 'COMMON',
              limit: GUEST_PAGE_SIZE,
            }),
          ),
        ),
        guestCategoryApi.list(weddingId),
      ])
      setGuestBlocks((blocks) =>
        blocks.map((block) => {
          const resultIndex = blocksToLoad.findIndex((item) => item.key === block.key)
          if (resultIndex < 0) return { ...block, items: [], total: 0, nextCursor: null, cursors: [null], page: 1, loading: false }
          const result = guestResults[resultIndex]
          return {
            ...block,
            items: result.items,
            total: result.total,
            nextCursor: result.nextCursor,
            cursors: [null],
            page: 1,
            loading: false,
          }
        }),
      )
      setCategories(categoryResult.items)
      setSelected([])
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không thể tải danh sách khách mời.')
    } finally {
      setLoading(false)
    }
  }, [categoryId, familySide, query, weddingId])
  useEffect(() => {
    void load()
  }, [load])
  const totalParty = useMemo(
    () => guests.reduce((sum, guest) => sum + guest.maxPartySize, 0),
    [guests],
  )
  const updateLoadedGuests = (update: (guest: Guest) => Guest) =>
    setGuestBlocks((blocks) =>
      blocks.map((block) => ({ ...block, items: block.items.map(update) })),
    )
  const removeLoadedGuests = (ids: string[]) =>
    setGuestBlocks((blocks) =>
      blocks.map((block) => ({
        ...block,
        items: block.items.filter((guest) => !ids.includes(guest.id)),
        total: Math.max(0, block.total - block.items.filter((guest) => ids.includes(guest.id)).length),
      })),
    )
  const loadGuestBlockPage = async (key: GuestFamilyBlockKey, page: number, cursor: string | null) => {
    if (!weddingId) return
    setGuestBlocks((blocks) =>
      blocks.map((block) => (block.key === key ? { ...block, loading: true } : block)),
    )
    try {
      const result = await guestApi.list(weddingId, {
        q: query.trim() || undefined,
        categoryId: categoryId || undefined,
        familySide: key === 'COMMON' ? undefined : key,
        familySideNull: key === 'COMMON',
        limit: GUEST_PAGE_SIZE,
        cursor: cursor || undefined,
      })
      setGuestBlocks((blocks) =>
        blocks.map((block) =>
          block.key === key
            ? { ...block, items: result.items, total: result.total, nextCursor: result.nextCursor, page, loading: false }
            : block,
        ),
      )
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không thể tải danh sách khách mời.')
      setGuestBlocks((blocks) =>
        blocks.map((block) => (block.key === key ? { ...block, loading: false } : block)),
      )
    }
  }
  const changeGuestBlockPage = (block: GuestFamilyBlockState, direction: 'next' | 'previous') => {
    if (block.loading) return
    if (direction === 'next' && block.nextCursor) {
      void loadGuestBlockPage(block.key, block.page + 1, block.nextCursor)
      setGuestBlocks((blocks) =>
        blocks.map((item) =>
          item.key === block.key ? { ...item, cursors: [...item.cursors, block.nextCursor] } : item,
        ),
      )
    }
    if (direction === 'previous' && block.page > 1) {
      void loadGuestBlockPage(block.key, block.page - 1, block.cursors[block.page - 2] ?? null)
      setGuestBlocks((blocks) =>
        blocks.map((item) =>
          item.key === block.key ? { ...item, cursors: item.cursors.slice(0, -1) } : item,
        ),
      )
    }
  }
  const openShare = (guest: Guest) => setSharingGuest(guest)
  const openCreate = () => {
    if (!canEdit) return
    setCreating(true)
    setEditing(null)
    setForm({ ...blank })
    setFeedback('')
  }
  const openEdit = (guest: Guest) => {
    if (!canEdit) return
    setCreating(false)
    setEditing(guest)
    setForm({
      name: guestName(guest),
      displayName: guest.displayName ?? '',
      phone: guest.phone ?? '',
      email: guest.email ?? '',
      tableName: guest.tableName ?? '',
      maxPartySize: String(guest.maxPartySize),
      categoryId: guest.categoryId ?? '',
      familySide: guest.familySide ?? '',
      note: guest.note ?? '',
    })
    setFeedback('')
  }
  const change = (key: keyof FormState, value: string) =>
    setForm((current) => ({ ...current, [key]: value }))
  const close = () => {
    setCreating(false)
    setEditing(null)
    setFeedback('')
  }
  const closeShare = () => setSharingGuest(null)
  const save = async () => {
    if (!canEdit || !activeWedding || !form.name.trim()) return
    setBusy(true)
    setFeedback('')
    const selectedFamilySide = normalizeGuestFamilySide(form.familySide)
    const input = {
      name: form.name.trim(),
      displayName: form.displayName.trim() || null,
      phone: form.phone || null,
      email: form.email || null,
      tableName: form.tableName || null,
      note: form.note || null,
      maxPartySize: Math.max(1, Math.min(50, Number(form.maxPartySize) || 1)),
      categoryId: form.categoryId || null,
      familySide: selectedFamilySide,
    }
    try {
      if (editing) {
        await guestApi.update(activeWedding.id, editing.id, input)
        await load()
      } else {
        await guestApi.create(activeWedding.id, input)
        await load()
      }
      await notifications.success(editing ? 'Đã cập nhật khách mời' : 'Đã thêm khách mời')
      const keepCreateDialogOpen = !editing
      if (keepCreateDialogOpen) {
        setForm({ ...blank, categoryId: form.categoryId, familySide: selectedFamilySide || '' })
        setFeedback('')
      } else {
        close()
      }
    } catch (cause) {
      setFeedback(cause instanceof Error ? cause.message : 'Không thể lưu khách mời.')
    } finally {
      setBusy(false)
    }
  }
  const remove = async () => {
    if (!canEdit || !activeWedding || !selected.length) return
    const result = await notifications.fire({
      icon: 'warning',
      title: 'Xóa khách mời?',
      text: `${selected.length} khách mời sẽ được xóa khỏi danh sách.`,
      showCancelButton: true,
      confirmButtonText: 'Xóa khách mời',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#a43d34',
    })
    if (!result.isConfirmed) return
    setBusy(true)
    try {
      await guestApi.removeMany(activeWedding.id, selected)
      removeLoadedGuests(selected)
      setSelected([])
      await notifications.fire({
        icon: 'success',
        title: 'Đã xóa khách mời',
        timer: 900,
        timerProgressBar: true,
        showConfirmButton: false,
      })
    } catch (cause) {
      await notifications.fire({
        icon: 'error',
        title: 'Không thể xóa khách mời',
        text: cause instanceof Error ? cause.message : 'Vui lòng thử lại.',
        confirmButtonText: 'Đã hiểu',
      })
    } finally {
      setBusy(false)
    }
  }
  const assign = async (value: string) => {
    if (!canEdit || !activeWedding || !selected.length) return
    setBusy(true)
    try {
      await guestApi.assignCategory(activeWedding.id, selected, value || null)
      updateLoadedGuests((item) =>
        selected.includes(item.id) ? { ...item, categoryId: value || null } : item,
      )
      setSelected([])
      setFeedback('Đã cập nhật danh mục.')
      await notifications.success('Đã cập nhật danh mục')
    } catch (cause) {
      setFeedback(cause instanceof Error ? cause.message : 'Không thể cập nhật danh mục.')
    } finally {
      setBusy(false)
    }
  }
  const toggle = (id: string) =>
    setSelected((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    )
  const handleBulkCategoryChange = (value: string) => {
    setBulkCategoryAction('')
    void assign(value === REMOVE_CATEGORY ? '' : value)
  }
  const handleBulkFamilySideChange = (value: string) => {
    setBulkFamilySideAction('')
    if (!activeWedding || !selected.length) return
    setBusy(true)
    void guestApi
      .assignFamilySide(
        activeWedding.id,
        selected,
        value === REMOVE_FAMILY_SIDE ? null : (value as 'BRIDE' | 'GROOM'),
      )
      .then(async () => {
        await load()
        setSelected([])
        setFeedback('Đã cập nhật phía gia đình.')
        return notifications.success('Đã cập nhật phía gia đình')
      })
      .catch((cause) => {
        setFeedback(cause instanceof Error ? cause.message : 'Không thể cập nhật phía gia đình.')
      })
      .finally(() => setBusy(false))
  }
  const dialog = sharingGuest ? (
    <GuestShareDialog
      weddingId={activeWedding?.id ?? ''}
      weddingSlug={activeWedding?.slug ?? null}
      guest={sharingGuest}
      close={closeShare}
    />
  ) : creating || editing ? (
    <GuestDialog
      form={form}
      categories={categories}
      editing={Boolean(editing)}
      busy={busy}
      error={feedback}
      change={change}
      save={() => void save()}
      close={close}
    />
  ) : null
  const renderGuestBlock = (block: GuestFamilyBlockState) => {
    const blockGuests = block.items
    return (
      <section
        className="guest-family-block"
        key={block.label}
        aria-labelledby={`guest-family-${block.key ?? 'common'}`}
      >
        <header className="guest-family-block-header">
          <div>
            <h2 id={`guest-family-${block.key ?? 'common'}`}>{block.label}</h2>
            <span>{block.total} khách mời</span>
          </div>
          <span>
            {blockGuests.reduce((sum, guest) => sum + guest.maxPartySize, 0)} người dự kiến
          </span>
        </header>
        {blockGuests.length ? (
          <>
            <div className="guest-table-wrap">
              <div className="guest-table-scroll">
              <table className={`guest-table ${canEdit ? '' : 'is-read-only'}`}>
                <caption className="sr-only">Danh sách khách mời {block.label}</caption>
                <thead>
                  <tr>
                    {canEdit ? <th /> : null}
                    <th>Khách mời</th>
                    <th>Tên hiển thị</th>
                    <th>Danh mục</th>
                    <th>Số người</th>
                    {canEdit ? <th /> : null}
                  </tr>
                </thead>
                <tbody>
                  {blockGuests.map((guest) => (
                    <tr key={guest.id} className={selected.includes(guest.id) ? 'is-selected' : ''}>
                      {canEdit ? (
                        <td>
                          <input
                            className="guest-checkbox"
                            type="checkbox"
                            checked={selected.includes(guest.id)}
                            onChange={() => toggle(guest.id)}
                            aria-label={`Chọn ${guestName(guest)}`}
                          />
                        </td>
                      ) : null}
                      <td>
                        <div className="guest-identity">
                          <span>{initials(guestName(guest))}</span>
                          <div>
                            <div className="guest-name-row">
                              {canEdit ? (
                                <button type="button" onClick={() => openEdit(guest)}>
                                  {guestName(guest)}
                                </button>
                              ) : (
                                <strong>{guestName(guest)}</strong>
                              )}
                              <button
                                type="button"
                                className="guest-share-button"
                                onClick={() => openShare(guest)}
                              >
                                <span>Gửi thiệp</span>
                                <PaperPlaneTilt size={14} weight="fill" aria-hidden="true" />
                              </button>
                            </div>
                            <small>{guest.phone || guest.email || 'Chưa có liên hệ'}</small>
                          </div>
                        </div>
                      </td>
                      <td>{guest.displayName || '—'}</td>
                      <td>
                        <span className="guest-group-tag">
                          {catName(categories, guest.categoryId)}
                        </span>
                      </td>
                      <td>{guest.maxPartySize}</td>
                      {canEdit ? (
                        <td>
                          <button
                            className="row-menu"
                            type="button"
                            onClick={() => openEdit(guest)}
                            aria-label={`Sửa ${guestName(guest)}`}
                          >
                            <DotsThree size={20} weight="bold" />
                          </button>
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
            <div className="guest-mobile-list">
              {blockGuests.map((guest) => (
                <article
                  className={selected.includes(guest.id) ? 'guest-card is-selected' : 'guest-card'}
                  key={guest.id}
                >
                  <div className={`guest-card-top ${canEdit ? '' : 'is-read-only'}`}>
                    {canEdit ? (
                      <input
                        className="guest-checkbox"
                        type="checkbox"
                        checked={selected.includes(guest.id)}
                        onChange={() => toggle(guest.id)}
                        aria-label={`Chọn ${guestName(guest)}`}
                      />
                    ) : null}
                    <div className="guest-identity">
                      <span>{initials(guestName(guest))}</span>
                      <div>
                        <div className="guest-name-row">
                          {canEdit ? (
                            <button type="button" onClick={() => openEdit(guest)}>
                              {guestName(guest)}
                            </button>
                          ) : (
                            <strong>{guestName(guest)}</strong>
                          )}
                          <button
                            type="button"
                            className="guest-share-button"
                            onClick={() => openShare(guest)}
                          >
                            <span>Gửi thiệp</span>
                            <PaperPlaneTilt size={14} weight="fill" aria-hidden="true" />
                          </button>
                        </div>
                        <small>{catName(categories, guest.categoryId)}</small>
                      </div>
                    </div>
                    {canEdit ? (
                      <button
                        className="row-menu"
                        type="button"
                        onClick={() => openEdit(guest)}
                        aria-label={`Sửa ${guestName(guest)}`}
                      >
                        <DotsThree size={20} weight="bold" />
                      </button>
                    ) : null}
                  </div>
                  <div className="guest-card-meta">
                    <span>{guest.maxPartySize} người</span>
                    <span>Tên trên thiệp: {guest.displayName || '—'}</span>
                    <span>{guest.phone || guest.email || 'Chưa có liên hệ'}</span>
                    <span>{date(guest.updatedAt)}</span>
                  </div>
                </article>
              ))}
            </div>
            <div className="guest-block-pagination">
              <button
                className="button button-secondary"
                type="button"
                disabled={block.loading || block.page === 1}
                onClick={() => changeGuestBlockPage(block, 'previous')}
              >
                Trước
              </button>
              <span>
                Trang {block.page} · {block.total} khách
              </span>
              <button
                className="button button-secondary"
                type="button"
                disabled={block.loading || !block.nextCursor}
                onClick={() => changeGuestBlockPage(block, 'next')}
              >
                Sau
              </button>
            </div>
          </>
        ) : (
          <p className="guest-family-empty">Chưa có khách mời.</p>
        )}
      </section>
    )
  }
  return (
    <section className="guests-page">
      <header className="guests-heading" data-guide="guest-heading">
        <div>
          <p className="breadcrumb">
            Đám cưới <span>/</span> Khách mời
          </p>
          <h1>Quản lý khách mời</h1>
          <p>Danh sách riêng tư của đám cưới, được đồng bộ trực tiếp với máy chủ.</p>
        </div>
        <div className="page-actions" data-guide="guest-actions">
          <button
            className="button button-secondary"
            type="button"
            onClick={() =>
              void notifications.info(
                'Tính năng nhập danh sách hiện chưa khả dụng.',
                'Vui lòng quay lại sau.',
              )
            }
          >
            <UploadSimple size={17} /> Nhập danh sách
          </button>
          {canEdit ? (
            <button className="button button-primary" type="button" onClick={openCreate}>
              <UserPlus size={17} weight="bold" /> Thêm khách mời
            </button>
          ) : null}
        </div>
        {!canEdit ? (
          <p className="workspace-readonly-note">Bạn có quyền chỉ xem danh sách khách mời.</p>
        ) : null}
      </header>
      <div className="guest-summary">
        <div>
          <span>
            <Users size={17} /> Tổng khách mời
          </span>
          <strong>{guestTotal}</strong>
          <small>{query || categoryId ? 'Theo bộ lọc hiện tại' : 'Tổng danh sách'}</small>
        </div>
        <div>
          <span>
            <Users size={17} /> Số người dự kiến
          </span>
          <strong>{totalParty}</strong>
          <small>Theo số người tối đa</small>
        </div>
        <div>
          <span>
            <Archive size={17} /> Có danh mục
          </span>
          <strong>{guests.filter((guest) => guest.categoryId).length}</strong>
          <small>Đã được phân loại</small>
        </div>
      </div>
      <div className="guest-directory panel" data-guide="guest-directory">
        <div className="guest-toolbar">
          <label className="guest-search">
            <MagnifyingGlass size={17} aria-hidden="true" />
            <span className="sr-only">Tìm khách mời</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm theo tên khách…"
            />
          </label>
          <label className="guest-group-filter guest-category-filter">
            <span>Danh mục</span>
            <NativeSelectField
              contentClassName="guest-category-filter-content"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {categoryOptionLabel(categories, item)}
                </option>
              ))}
            </NativeSelectField>
          </label>
          <label className="guest-group-filter">
            <span>Phía gia đình</span>
            <NativeSelectField
              value={familySide}
              onChange={(event) => setFamilySide(event.target.value as typeof familySide)}
            >
              <option value="">Tất cả</option>
              <option value="BRIDE">Nhà gái</option>
              <option value="GROOM">Nhà trai</option>
              <option value="COMMON">Chung</option>
            </NativeSelectField>
          </label>
        </div>
        {canEdit && selected.length > 0 && (
          <div className="guest-bulk-bar">
            <strong>{selected.length} khách đã chọn</strong>
            <div>
              <label className="bulk-category-select">
                Gán danh mục{' '}
                <NativeSelectField
                  value={bulkCategoryAction}
                  disabled={busy}
                  onChange={(event) => handleBulkCategoryChange(event.target.value)}
                >
                  <option value="">Chọn…</option>
                  <option value={REMOVE_CATEGORY}>Gỡ danh mục</option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </NativeSelectField>
              </label>
              <label className="bulk-category-select">
                Gán phía gia đình{' '}
                <NativeSelectField
                  value={bulkFamilySideAction}
                  disabled={busy}
                  onChange={(event) => handleBulkFamilySideChange(event.target.value)}
                >
                  <option value="">Chọn…</option>
                  <option value="BRIDE">Nhà gái</option>
                  <option value="GROOM">Nhà trai</option>
                  <option value={REMOVE_FAMILY_SIDE}>Bỏ phân loại</option>
                </NativeSelectField>
              </label>
              <button
                type="button"
                className="danger"
                disabled={busy}
                onClick={() => void remove()}
              >
                <Archive size={15} /> Xóa
              </button>
              <button type="button" className="bulk-close" onClick={() => setSelected([])}>
                Bỏ chọn
              </button>
            </div>
          </div>
        )}
        {loading ? (
          <div className="guest-empty">
            <Users size={28} />
            <h2>Đang tải khách mời…</h2>
          </div>
        ) : error ? (
          <div className="guest-empty">
            <Users size={28} />
            <h2>Không thể tải dữ liệu</h2>
            <p>{error}</p>
            <button className="button button-secondary" type="button" onClick={() => void load()}>
              Thử lại
            </button>
          </div>
        ) : guests.length === 0 ? (
          <div className="guest-empty">
            <Users size={28} />
            <h2>Chưa có khách mời</h2>
            <p>Thêm khách đầu tiên để bắt đầu quản lý danh sách.</p>
            {canEdit ? (
              <button className="button button-secondary" type="button" onClick={openCreate}>
                Thêm khách mời
              </button>
            ) : null}
          </div>
        ) : (
          <>
            <div className="guest-family-blocks">
              {guestBlocks.map(renderGuestBlock)}
            </div>
            <footer className="guest-pagination">
              <span>
                Đang hiển thị <strong>{guests.length}</strong> khách trên trang hiện tại · tổng{' '}
                <strong>{guestTotal}</strong>
              </span>
            </footer>
          </>
        )}
      </div>
      {canEdit ? (
        <button
          className="guest-mobile-add mobile-floating-action"
          type="button"
          onClick={openCreate}
          aria-label="Thêm khách mời"
        >
          <Plus size={22} weight="bold" />
        </button>
      ) : null}
      {feedback && !creating && !editing && (
        <div className="guest-feedback" role="status">
          {feedback}
        </div>
      )}
      {dialog}
    </section>
  )
}
