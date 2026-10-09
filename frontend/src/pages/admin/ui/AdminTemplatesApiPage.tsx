import { notifications } from '../../../shared/ui/notifications/notifications'
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowClockwise,
  Browser,
  Code,
  Eye,
  FileArrowUp,
  GearSix,
  ImageSquare,
  MagnifyingGlass,
  Plus,
  Tag,
  WarningCircle,
  X,
} from '@phosphor-icons/react'
import {
  AdminTemplateApiError,
  adminTemplateApi,
  type AdminTemplate,
  type AdminTemplateReviewStatus,
  type AdminTemplateVersion,
} from '../../../shared/api/admin-templates'
import { publicTemplateRoutes } from '../../../shared/config/routes'
import { TemplateThumbnail } from '../../../shared/ui/TemplateThumbnail'
import {
  adminTemplateStylesApi,
  type TemplateStyle,
} from '../../../shared/api/admin-template-styles'
import { AdminTemplateStyleDialog } from './AdminTemplateStyleDialog'
import { AdminStyleFilterSelect } from './AdminStyleFilterSelect'
import { ModalSavingStatus } from '../../../shared/ui/ModalSavingStatus'
type Filter = 'ALL' | AdminTemplateReviewStatus
const labels: Record<AdminTemplateReviewStatus, string> = {
  PENDING_REVIEW: 'Chờ kiểm duyệt',
  RELEASED: 'Đã xuất bản',
  DEPRECATED: 'Ngừng phân phối',
}
const sourceLabels = {
  DEVELOPMENT: 'Đang phát triển',
  REVIEW: 'Đang phát triển',
  READY: 'Chờ kiểm duyệt',
  DEPRECATED: 'Ngừng phân phối',
} as const
const previews: Record<string, string> = {
  'modern-luxe': publicTemplateRoutes.modernLuxePreview,
  'verdant-promise': publicTemplateRoutes.verdantPromisePreview,
  'chibi-daydream': publicTemplateRoutes.chibiDaydreamPreview,
  'editorial-vows': publicTemplateRoutes.editorialVowsPreview,
  'green-hydrangea': publicTemplateRoutes.greenHydrangeaPreview,
  'enchanted-forest': publicTemplateRoutes.enchantedForestPreview,
  'cherry-blossom-garden': publicTemplateRoutes.cherryBlossomGardenPreview,
  'red-spider-lily-recap': publicTemplateRoutes.redSpiderLilyRecapPreview,
}
const dateLabel = (value?: string | null) =>
  value ? new Intl.DateTimeFormat('vi-VN').format(new Date(value)) : '—'
const compatibilityOf = (version: AdminTemplateVersion) =>
  version.compatibility ?? {
    compatible:
      version.templateConfigVersion === 1 &&
      version.contentSchemaVersion === 1 &&
      version.rendererApiVersion === 1,
    issues:
      version.templateConfigVersion === 1 &&
      version.contentSchemaVersion === 1 &&
      version.rendererApiVersion === 1
        ? []
        : ['Backend hiện tại chưa trả kết quả kiểm tra tương thích.'],
    supported: { templateConfigVersion: 1, contentSchemaVersion: 1, rendererApiVersion: 1 },
  }
const previewOf = (item: AdminTemplate) => {
  const path = item.versions.find((version) => typeof version.config.previewPath === 'string')
    ?.config.previewPath
  return typeof path === 'string' && path.startsWith('/') ? path : previews[item.key]
}
export function AdminTemplatesApiPage({ kind }: { kind: 'invitation' | 'website' | 'recap' }) {
  const productType =
    kind === 'invitation' ? 'ONLINE_INVITATION' : kind === 'website' ? 'WEDDING_WEBSITE' : 'RECAP'
  const [items, setItems] = useState<AdminTemplate[]>([]),
    [pending, setPending] = useState(0),
    [loading, setLoading] = useState(true)
  const [query, setQuery] = useState(''),
    [filter, setFilter] = useState<Filter>('ALL'),
    [styleFilter, setStyleFilter] = useState(''),
    [styles, setStyles] = useState<TemplateStyle[]>([]),
    [error, setError] = useState('')
  const [selected, setSelected] = useState<AdminTemplate | null>(null),
    [preview, setPreview] = useState<AdminTemplate | null>(null),
    [styleTarget, setStyleTarget] = useState<AdminTemplate | null>(null),
    [working, setWorking] = useState(''),
    [dialogError, setDialogError] = useState('')
  const mountedRef = useRef(true)
  const deferredQuery = useDeferredValue(query)
  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [result, styleResult] = await Promise.all([
        adminTemplateApi.list(productType, styleFilter || undefined),
        adminTemplateStylesApi.list(false),
      ])
      if (!mountedRef.current) return
      setStyles(styleResult.items)
      setItems(
        result.items.map((item) => ({
          ...item,
          versions: item.versions.map((version) => ({
            ...version,
            usageCount: version.usageCount ?? 0,
            recentAudit: version.recentAudit ?? [],
          })),
        })),
      )
      setPending(result.pendingReviewCount)
    } catch {
      if (mountedRef.current) setError('Không thể tải kho template. Vui lòng thử lại.')
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [productType, styleFilter])
  useEffect(() => {
    setStyleFilter('')
    setFilter('ALL')
  }, [productType])
  useEffect(() => {
    mountedRef.current = true
    void load()
    return () => {
      mountedRef.current = false
    }
  }, [load])
  useEffect(() => {
    if (!selected && !preview) return
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !working) {
        setSelected(null)
        setPreview(null)
      }
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', close)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', close)
    }
  }, [selected, preview, working])
  const visible = useMemo(() => {
    const value = deferredQuery.trim().toLocaleLowerCase('vi')
    return items.filter(
      (item) =>
        (filter === 'ALL' || item.versions.some((v) => v.reviewStatus === filter)) &&
        (!value ||
          `${item.name} ${item.key} ${item.description ?? ''}`
            .toLocaleLowerCase('vi')
            .includes(value)),
    )
  }, [deferredQuery, filter, items])
  const count = (status: AdminTemplateReviewStatus) =>
    items.filter((item) => item.versions.some((v) => v.reviewStatus === status)).length
  const lifecycle = async (
    item: AdminTemplate,
    version: AdminTemplateVersion,
    action: 'release' | 'deprecate',
  ) => {
    if (action === 'deprecate') {
      const result = await notifications.confirm({
        icon: 'warning',
        title: 'Ngừng phân phối template?',
        text: `${item.name} v${version.version} sẽ không còn được dùng cho Wedding mới. ${version.usageCount} đám cưới đang dùng vẫn được giữ.`,
        confirmButtonText: 'Ngừng phân phối',
        cancelButtonText: 'Hủy',
        confirmButtonColor: '#a43d34',
        reverseButtons: true,
        focusCancel: true,
        heightAuto: false,
      })
      if (!result.isConfirmed) return
    }
    setWorking(version.id)
    setDialogError('')
    try {
      if (action === 'release') await adminTemplateApi.release(item.key, version.version)
      else await adminTemplateApi.deprecate(item.key, version.version)
      setSelected(null)
      await load()
      await notifications.fire({
        icon: 'success',
        title: action === 'release' ? 'Đã phát hành version' : 'Đã ngừng phân phối version',
        timer: 1400,
        timerProgressBar: true,
        showConfirmButton: false,
        position: 'center',
      })
    } catch (cause) {
      setDialogError(
        cause instanceof AdminTemplateApiError && cause.code === 'TEMPLATE_VERSION_INCOMPATIBLE'
          ? `Chưa thể phát hành: ${cause.message}`
          : 'Không thể cập nhật trạng thái version. Vui lòng thử lại.',
      )
    } finally {
      setWorking('')
    }
  }
  const updateThumbnail = async (
    item: AdminTemplate,
    version: AdminTemplateVersion,
    thumbnailUrl: string | null,
  ) => {
    setWorking(`thumbnail:${version.id}`)
    setDialogError('')
    try {
      await adminTemplateApi.updateThumbnail(item.key, version.version, thumbnailUrl)
      setSelected(null)
      await load()
      await notifications.fire({
        icon: 'success',
        title: thumbnailUrl ? 'Đã cập nhật ảnh đại diện' : 'Đã xóa ảnh đại diện',
        timer: 1400,
        timerProgressBar: true,
        showConfirmButton: false,
        position: 'center',
      })
    } catch (cause) {
      setDialogError(cause instanceof Error ? cause.message : 'Không thể cập nhật ảnh đại diện.')
    } finally {
      setWorking('')
    }
  }
  const uploadThumbnail = async (item: AdminTemplate, version: AdminTemplateVersion, file: File) => {
    setWorking(`thumbnail:${version.id}`)
    setDialogError('')
    try {
      await adminTemplateApi.uploadThumbnail(item.key, version.version, file)
      setSelected(null)
      await load()
      await notifications.fire({
        icon: 'success',
        title: 'Đã tải ảnh đại diện lên',
        timer: 1400,
        timerProgressBar: true,
        showConfirmButton: false,
        position: 'center',
      })
    } catch (cause) {
      setDialogError(cause instanceof Error ? cause.message : 'Không thể tải ảnh đại diện lên.')
    } finally {
      setWorking('')
    }
  }
  const openManagement = async (item: AdminTemplate, targetVersion?: AdminTemplateVersion) => {
    setSelected(item)
    setDialogError('')
    try {
      const version = targetVersion ?? item.versions[0]
      if (!version) {
        setSelected(item)
        return
      }
      const result = await adminTemplateApi.detail(item.key, version.version)
      const detailVersion = result.template.version
      if (mountedRef.current)
        setSelected({
          ...item,
          name: result.template.name,
          description: result.template.description,
          status: result.template.status,
          versions: item.versions.map((entry) =>
            entry.id === detailVersion.id
              ? {
                  ...entry,
                  ...detailVersion,
                  usageCount: entry.usageCount ?? 0,
                  compatibility: entry.compatibility ?? version.compatibility,
                  recentAudit: entry.recentAudit ?? version.recentAudit,
                }
              : entry,
          ),
        })
    } catch {
      if (mountedRef.current) {
        setDialogError('Không thể tải chi tiết template. Vui lòng thử lại.')
        setSelected(item)
      }
    } finally {
      if (mountedRef.current) setWorking('')
    }
  }
  const sync = async () => {
    setWorking('sync')
    setDialogError('')
    try {
      const result = await adminTemplateApi.sync()
      await load()
      await notifications.fire({
        icon: 'success',
        title: 'Đồng bộ thành công',
        text:
          result.created +
          ' version mới, ' +
          (result.updated ?? 0) +
          ' version đã cập nhật, ' +
          result.unchanged +
          ' version không thay đổi.',
        timer: 1400,
        timerProgressBar: true,
        showConfirmButton: false,
        position: 'center',
      })
    } catch (cause) {
      const message =
        cause instanceof AdminTemplateApiError
          ? `${cause.message}${cause.requestId ? ` (Request ID: ${cause.requestId})` : ''}`
          : cause instanceof Error
            ? cause.message
            : 'Không thể quét và đồng bộ template. Vui lòng thử lại.'
      setDialogError(message)
      await notifications.fire({
        icon: 'error',
        title: 'Đồng bộ thất bại',
        text: message,
        confirmButtonText: 'Đã hiểu',
      })
    } finally {
      setWorking('')
    }
  }
  return (
    <div className="admin-dashboard admin-library-page">
      <header className="admin-page-heading">
        <div>
          <p>
            Nội dung & giao diện <span>/</span> Kho giao diện
          </p>
          <h1>
            Kho{' '}
            {kind === 'invitation'
              ? 'thiệp online'
              : kind === 'website'
                ? 'website cưới'
                : 'Wedding Recap'}
          </h1>
          <span>Kiểm duyệt, phát hành và quản lý vòng đời template từ dữ liệu hệ thống.</span>
        </div>
        <button
          aria-label="Đồng bộ template"
          className="button button-primary"
          type="button"
          disabled={working === 'sync'}
          onClick={() => void sync()}
        >
          <Plus /> {working === 'sync' ? 'Đang kiểm tra…' : 'Đồng bộ template'}
        </button>
      </header>
      <section className="admin-library-summary" aria-label="Tổng quan kho template">
        <div>
          <span>Tất cả template</span>
          <strong>{items.length}</strong>
        </div>
        <div>
          <span>Đang hoạt động</span>
          <strong>{count('RELEASED')}</strong>
          <small className="positive">Sẵn sàng sử dụng</small>
        </div>
        <div>
          <span>Chờ kiểm duyệt</span>
          <strong>{pending}</strong>
          <small>Cần xử lý</small>
        </div>
        <div>
          <span>Ngừng phân phối</span>
          <strong>{count('DEPRECATED')}</strong>
          <small>Giữ tương thích bản cũ</small>
        </div>
      </section>
      <section className="admin-panel admin-theme-library">
        <div className="admin-library-toolbar">
          <div className="admin-library-primary-filters">
            <label>
              <MagnifyingGlass />
              <input
                aria-label="Tìm template"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm theo tên, mã hoặc mô tả"
              />
            </label>
            <AdminStyleFilterSelect styles={styles} value={styleFilter} onChange={setStyleFilter} />
          </div>
          <div role="group" aria-label="Lọc trạng thái">
            {(
              [
                ['ALL', 'Tất cả'],
                ['RELEASED', 'Đã xuất bản'],
                ['PENDING_REVIEW', 'Chờ duyệt'],
                ['DEPRECATED', 'Ngừng phân phối'],
              ] as const
            ).map(([value, label]) => (
              <button
                type="button"
                key={value}
                className={filter === value ? 'is-active' : ''}
                onClick={() => setFilter(value)}
              >
                {label}{' '}
                <b>
                  {value === 'ALL'
                    ? items.length
                    : value === 'PENDING_REVIEW'
                      ? pending
                      : count(value)}
                </b>
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="admin-theme-grid" aria-label="Đang tải template">
            {[1, 2, 3].map((key) => (
              <article className="admin-theme-card admin-theme-skeleton" key={key}>
                <div />
                <span />
              </article>
            ))}
          </div>
        ) : error ? (
          <Empty icon={<WarningCircle />} title="Chưa tải được kho template" text={error}>
            <button onClick={() => void load()}>
              <ArrowClockwise /> Thử lại
            </button>
          </Empty>
        ) : visible.length ? (
          <div className="admin-theme-grid">
            {visible.flatMap((item) =>
              item.versions.length
                ? item.versions.map((version) => {
                    const state = version.reviewStatus,
                      previewPath = previewOf(item)
                    return (
                      <article className="admin-theme-card" key={`${item.key}-${version.id}`}>
                        <div className={`admin-theme-preview ${item.key}`}>
                          {version.thumbnailUrl ? (
                            <TemplateThumbnail
                              className="admin-theme-thumbnail"
                              src={version.thumbnailUrl}
                              alt={`Ảnh đại diện ${item.name}`}
                              loading="lazy"
                            />
                          ) : null}
                          <div className="admin-preview-chrome">
                            <i />
                            <i />
                            <i />
                            <span>{item.key}</span>
                          </div>
                          <div className="admin-preview-canvas">
                            <small>THE WEDDING OF</small>
                            <strong>{item.name}</strong>
                            <i />
                            <span>{item.description ?? 'Chưa có mô tả'}</span>
                          </div>
                          <span
                            className={`admin-status ${compatibilityOf(version).compatible ? state.toLowerCase() : 'unavailable'}`}
                          >
                            {compatibilityOf(version).compatible
                              ? version.sourceStatus === 'READY' && state === 'PENDING_REVIEW'
                                ? labels[state]
                                : state === 'RELEASED'
                                  ? labels[state]
                                  : sourceLabels[version.sourceStatus]
                              : 'Chưa thể xuất bản'}
                          </span>
                          {(item.styles ?? []).length ? (
                            <div
                              className="admin-theme-style-badges"
                              aria-label="Danh mục phong cách"
                            >
                              {(item.styles ?? []).map((style) => (
                                <span key={style.id}>{style.name}</span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                        <div className="admin-theme-card-body">
                          <header>
                            <div>
                              <h2>{item.name}</h2>
                              <code>{item.key}</code>
                            </div>
                            <span>v{version.version}</span>
                          </header>
                          <p>{item.description ?? 'Chưa cập nhật mô tả.'}</p>
                          <dl>
                            <div>
                              <dt>Đang sử dụng</dt>
                              <dd>{version.usageCount}</dd>
                            </div>
                            <div>
                              <dt>Cập nhật</dt>
                              <dd>{dateLabel(version.createdAt)}</dd>
                            </div>
                          </dl>
                        </div>
                        <footer>
                          {previewPath ? (
                            <button type="button" onClick={() => setPreview(item)}>
                              <Eye /> Xem trước
                            </button>
                          ) : (
                            <button disabled>
                              <Eye /> Thiếu previewPath
                            </button>
                          )}
                          <button type="button" onClick={() => void openManagement(item, version)}>
                            <GearSix /> Quản lý
                          </button>
                        </footer>
                      </article>
                    )
                  })
                : [
                    <article className="admin-theme-card" key={`${item.key}-empty`}>
                      <div className="admin-theme-card-body">
                        <h2>{item.name}</h2>
                        <p>Template chưa có version nên chưa thể xuất bản hoặc quản lý.</p>
                      </div>
                    </article>,
                  ],
            )}
          </div>
        ) : (
          <Empty
            icon={<Browser />}
            title={items.length ? 'Không tìm thấy template' : 'Chưa có template'}
            text={
              items.length
                ? 'Thử thay đổi từ khóa hoặc bộ lọc.'
                : 'Bấm đồng bộ để quét và cập nhật template từ source.'
            }
          >
            <button onClick={() => void sync()} disabled={working === 'sync'}>
              <FileArrowUp /> Mở đồng bộ template
            </button>
          </Empty>
        )}
      </section>
      {selected ? (
        <ManageDialog
          item={selected}
          working={working}
          error={dialogError}
          close={() => setSelected(null)}
          lifecycle={lifecycle}
          openStyles={(item) => setStyleTarget(item)}
          updateThumbnail={updateThumbnail}
          uploadThumbnail={uploadThumbnail}
        />
      ) : null}
      {styleTarget ? (
        <AdminTemplateStyleDialog
          templateKey={styleTarget.key}
          templateName={styleTarget.name}
          close={() => setStyleTarget(null)}
        />
      ) : null}
      {preview && previewOf(preview) ? (
        <Dialog
          close={() => setPreview(null)}
          title={`Xem trước ${preview.name}`}
          subtitle="Preview được cô lập và chỉ tải khi admin chủ động mở."
          icon={<Eye />}
        >
          <iframe
            className="admin-template-preview-frame"
            sandbox="allow-scripts allow-same-origin allow-forms"
            src={previewOf(preview)}
            title={`Preview ${preview.name}`}
          />
        </Dialog>
      ) : null}
    </div>
  )
}

function Empty({
  icon,
  title,
  text,
  children,
}: {
  icon: React.ReactNode
  title: string
  text: string
  children: React.ReactNode
}) {
  return (
    <div className="admin-library-empty">
      {icon}
      <h2>{title}</h2>
      <p>{text}</p>
      {children}
    </div>
  )
}
function Dialog({
  close,
  title,
  subtitle,
  icon,
  children,
  loading = false,
}: {
  close: () => void
  title: string
  subtitle: string
  icon: React.ReactNode
  children: React.ReactNode
  loading?: boolean
}) {
  const dialogRef = useRef<HTMLElement>(null),
    returnFocus = useRef<HTMLElement | null>(document.activeElement as HTMLElement | null)
  useEffect(() => {
    const dialog = dialogRef.current,
      focusTarget = returnFocus.current
    dialog
      ?.querySelector<HTMLElement>('button,textarea,input,[tabindex]:not([tabindex="-1"])')
      ?.focus()
    const trap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !dialog) return
      const nodes = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not(:disabled),textarea:not(:disabled),input:not(:disabled),[tabindex]:not([tabindex="-1"])',
        ),
      )
      if (!nodes.length) return
      const first = nodes[0],
        last = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', trap)
    return () => {
      document.removeEventListener('keydown', trap)
      focusTarget?.focus()
    }
  }, [])
  return (
    <div
      className="admin-template-dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <section
        ref={dialogRef}
        className={`admin-template-dialog${loading ? ' modal-saving-dialog' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header>
          <div>
            {icon}
            <span>
              <h2>{title}</h2>
              <p>{subtitle}</p>
            </span>
          </div>
          <button aria-label="Đóng" onClick={close}>
            <X />
          </button>
        </header>
        {children}
        {loading ? <ModalSavingStatus label="Đang phát hành thiệp…" /> : null}
      </section>
    </div>
  )
}
function ManageDialog({
  item,
  working,
  error,
  close,
  lifecycle,
  openStyles,
  updateThumbnail,
  uploadThumbnail,
}: {
  item: AdminTemplate
  working: string
  error: string
  close: () => void
  lifecycle: (
    item: AdminTemplate,
    version: AdminTemplateVersion,
    action: 'release' | 'deprecate',
  ) => Promise<void>
  openStyles: (item: AdminTemplate) => void
  updateThumbnail: (item: AdminTemplate, version: AdminTemplateVersion, thumbnailUrl: string | null) => Promise<void>
  uploadThumbnail: (item: AdminTemplate, version: AdminTemplateVersion, file: File) => Promise<void>
}) {
  return (
    <Dialog
      close={close}
      title={item.name}
      subtitle={`${item.key} · ${item.productType}`}
      icon={<Code />}
      loading={Boolean(working)}
    >
      <div className="admin-template-version-list">
        {item.versions.map((version) => (
          <VersionCard
            key={version.id}
            item={item}
            version={version}
            working={working}
            lifecycle={lifecycle}
            openStyles={openStyles}
            updateThumbnail={updateThumbnail}
            uploadThumbnail={uploadThumbnail}
          />
        ))}
      </div>
      {error ? (
        <p className="admin-template-dialog-error" role="alert">
          {error}
        </p>
      ) : null}
    </Dialog>
  )
}
function VersionCard({
  item,
  version,
  working,
  lifecycle,
  openStyles,
  updateThumbnail,
  uploadThumbnail,
}: {
  item: AdminTemplate
  version: AdminTemplateVersion
  working: string
  lifecycle: (
    item: AdminTemplate,
    version: AdminTemplateVersion,
    action: 'release' | 'deprecate',
  ) => Promise<void>
  openStyles: (item: AdminTemplate) => void
  updateThumbnail: (item: AdminTemplate, version: AdminTemplateVersion, thumbnailUrl: string | null) => Promise<void>
  uploadThumbnail: (item: AdminTemplate, version: AdminTemplateVersion, file: File) => Promise<void>
}) {
  const compatibility = compatibilityOf(version),
    auditEntries = version.recentAudit ?? []
  return (
    <article>
      <header>
        <div>
          <strong>v{version.version}</strong>
          <span className={`admin-status ${version.reviewStatus.toLowerCase()}`}>
            {labels[version.reviewStatus]}
          </span>
        </div>
        <small>
          Config {version.templateConfigVersion} · Content {version.contentSchemaVersion} · Renderer{' '}
          {version.rendererApiVersion}
        </small>
      </header>
      <div
        className={`admin-template-compatibility ${compatibility.compatible ? 'is-compatible' : 'is-incompatible'}`}
      >
        <strong>
          {compatibility.compatible ? 'Tương thích để phát hành' : 'Chưa tương thích'}
        </strong>
        {compatibility.issues.map((issue) => (
          <span key={issue}>{issue}</span>
        ))}
      </div>
      <dl>
        <div>
          <dt>Đám cưới đang dùng</dt>
          <dd>{version.usageCount ?? 0}</dd>
        </div>
        <div>
          <dt>Source revision</dt>
          <dd>{version.codeRevision ?? '—'}</dd>
        </div>
        <div>
          <dt>Config hash</dt>
          <dd>{version.configHash.slice(0, 12)}…</dd>
        </div>
      </dl>
      <ThumbnailEditor
        item={item}
        version={version}
        working={working}
        updateThumbnail={updateThumbnail}
        uploadThumbnail={uploadThumbnail}
      />
      <details>
        <summary>Xem config</summary>
        <pre>{JSON.stringify(version.config, null, 2)}</pre>
      </details>
      <details>
        <summary>Lịch sử thao tác ({auditEntries.length})</summary>
        <ol className="admin-template-audit">
          {auditEntries.length ? (
            auditEntries.map((audit) => (
              <li key={audit.id}>
                <strong>{audit.action}</strong>
                <span>
                  {audit.actorUser?.displayName ?? audit.actorUser?.email ?? 'Hệ thống'} ·{' '}
                  {dateLabel(audit.occurredAt)}
                </span>
              </li>
            ))
          ) : (
            <li>Chưa có thao tác được ghi nhận.</li>
          )}
        </ol>
      </details>
      <footer>
        <button
          className="button button-secondary"
          type="button"
          disabled={Boolean(working)}
          onClick={() => openStyles(item)}
        >
          <Tag size={16} /> Điều chỉnh danh mục
        </button>
        {version.reviewStatus === 'PENDING_REVIEW' &&
        version.sourceStatus === 'READY' &&
        compatibility.compatible ? (
          <button
            className="button button-primary"
            disabled={Boolean(working)}
            onClick={() => void lifecycle(item, version, 'release')}
          >
            Phát hành version
          </button>
        ) : !compatibility.compatible ? (
          <span>Chưa thể xuất bản</span>
        ) : version.reviewStatus === 'RELEASED' ? (
          <button
            className="button button-secondary"
            disabled={Boolean(working)}
            onClick={() => void lifecycle(item, version, 'deprecate')}
          >
            Ngừng phân phối
          </button>
        ) : (
          <span>Được giữ để tương thích thiệp cũ.</span>
        )}
      </footer>
    </article>
  )
}

function ThumbnailEditor({
  item,
  version,
  working,
  updateThumbnail,
  uploadThumbnail,
}: {
  item: AdminTemplate
  version: AdminTemplateVersion
  working: string
  updateThumbnail: (item: AdminTemplate, version: AdminTemplateVersion, thumbnailUrl: string | null) => Promise<void>
  uploadThumbnail: (item: AdminTemplate, version: AdminTemplateVersion, file: File) => Promise<void>
}) {
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const busy = working === `thumbnail:${version.id}`
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])
  const save = () => { if (file) void uploadThumbnail(item, version, file) }
  const selectFile = (selected: File | undefined) => {
    setFileError('')
    if (!selected) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)) {
      setFile(null)
      setFileError('Chỉ hỗ trợ JPG, PNG hoặc WebP.')
      return
    }
    setFile(selected)
  }
  return (
    <section className="admin-template-thumbnail-editor" aria-labelledby={`thumbnail-${version.id}`}>
      <div className="admin-template-thumbnail-heading">
        <div>
          <strong id={`thumbnail-${version.id}`}>Ảnh đại diện template</strong>
          <span>Nhập URL ảnh đã upload lên kho lưu trữ.</span>
        </div>
        {version.thumbnailUrl ? (
          <img src={version.thumbnailUrl} alt={`Ảnh đại diện ${item.name}`} />
        ) : null}
      </div>
      <label className="admin-template-thumbnail-upload">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => selectFile(event.target.files?.[0])}
          aria-label="Chọn ảnh đại diện template"
          disabled={Boolean(working)}
        />
        {previewUrl || version.thumbnailUrl ? (
          <img src={previewUrl ?? version.thumbnailUrl ?? undefined} alt={`Ảnh đại diện ${item.name}`} />
        ) : (
          <span className="admin-template-thumbnail-upload-icon"><ImageSquare size={25} /></span>
        )}
        <span className="admin-template-thumbnail-upload-copy">
          <strong>{file ? file.name : version.thumbnailUrl ? 'Đổi ảnh đại diện' : 'Chọn ảnh đại diện'}</strong>
          <small>JPG, PNG hoặc WebP · không giới hạn kích thước</small>
        </span>
      </label>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => selectFile(event.target.files?.[0])}
        aria-label="URL ảnh đại diện template"
        disabled={Boolean(working)}
      />
      {file ? <small>{file.name}</small> : null}
      {fileError ? <span className="admin-template-dialog-error" role="alert">{fileError}</span> : null}
      <div className="admin-template-thumbnail-actions">
        <button className="button button-primary" type="button" onClick={save} disabled={!file || busy}>
          {busy ? 'Đang lưu…' : 'Lưu ảnh'}
        </button>
        {version.thumbnailUrl ? (
          <button
            className="button button-secondary"
            type="button"
            disabled={Boolean(working)}
            onClick={() => void updateThumbnail(item, version, null)}
          >
            Xóa ảnh, dùng mặc định
          </button>
        ) : null}
      </div>
    </section>
  )
}
