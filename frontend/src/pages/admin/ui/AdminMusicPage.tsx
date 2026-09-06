import { notifications } from '../../../shared/ui/notifications/notifications'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowClockwise,
  Check,
  CloudArrowUp,
  MagnifyingGlass,
  MusicNote,
  PencilSimple,
  Play,
  Stop,
  Trash,
  X,
} from '@phosphor-icons/react'
import {
  AdminMusicApiError,
  adminMusicApi,
  type MusicTrack,
  type MusicTrackStatus,
} from '../../../shared/api/admin-music'
import { SelectField } from '../../../shared/ui/form-controls/SelectField'

const labels: Record<MusicTrackStatus, string> = {
  DRAFT: 'Bản nháp',
  PROCESSING: 'Đang xử lý',
  FAILED: 'Tải lỗi',
  READY: 'Đang hoạt động',
  RETIRED: 'Ngừng phân phối',
}
const sizeLabel = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`
const durationLabel = (seconds: number | null) =>
  seconds == null ? '—' : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
const errorLabel = (cause: unknown) => {
  if (cause instanceof AdminMusicApiError && cause.code === 'MUSIC_REVISION_CONFLICT')
    return 'Bài nhạc vừa được cập nhật ở nơi khác. Hãy mở lại rồi lưu lại.'
  return cause instanceof AdminMusicApiError
    ? cause.message
    : 'Không thể kết nối đến máy chủ. Vui lòng thử lại.'
}

function fireMusicToast(title: string) {
  return notifications.success(title, { timer: 1500 })
}
async function confirmRetire(track: MusicTrack, onConfirm: () => Promise<void>) {
  const result = await notifications.fire({
    icon: 'warning',
    title: 'Ngừng phân phối nhạc?',
    text: `“${track.displayName}” sẽ không còn được chọn mới. Snapshot đang live vẫn giữ tham chiếu.`,
    showCancelButton: true,
    allowOutsideClick: true,
    allowEscapeKey: true,
    confirmButtonText: 'Ngừng phân phối',
    cancelButtonText: 'Hủy',
    reverseButtons: true,
    focusCancel: true,
    heightAuto: false,
    didClose: notifications.close,
    didDestroy: notifications.close,
  })
  if (result.isConfirmed) await onConfirm()
  notifications.close()
}
export function AdminMusicPage() {
  const [items, setItems] = useState<MusicTrack[]>([]),
    [query, setQuery] = useState(''),
    [status, setStatus] = useState<MusicTrackStatus | 'ALL'>('ALL')
  const [loading, setLoading] = useState(true),
    [error, setError] = useState(''),
    [working, setWorking] = useState('')
  const [uploadOpen, setUploadOpen] = useState(false),
    [editTrack, setEditTrack] = useState<MusicTrack | null>(null),
    [previewId, setPreviewId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setItems((await adminMusicApi.list(query.trim() || undefined)).items)
    } catch (cause) {
      setError(errorLabel(cause))
    } finally {
      setLoading(false)
    }
  }, [query])
  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 220)
    return () => window.clearTimeout(timer)
  }, [load])
  useEffect(() => () => audioRef.current?.pause(), [])
  const visible = useMemo(
    () => items.filter((item) => status === 'ALL' || item.status === status),
    [items, status],
  )
  const count = (value: MusicTrackStatus) => items.filter((item) => item.status === value).length
  const mutate = async (key: string, action: () => Promise<unknown>, successMessage?: string) => {
    setWorking(key)
    setError('')
    try {
      await action()
      await load()
      if (successMessage) await fireMusicToast(successMessage)
    } catch (cause) {
      setError(errorLabel(cause))
    } finally {
      setWorking('')
    }
  }
  const togglePreview = (track: MusicTrack) => {
    if (!track.playbackUrl) return
    if (previewId === track.id) {
      audioRef.current?.pause()
      setPreviewId(null)
      return
    }
    audioRef.current?.pause()
    const audio = new Audio(track.playbackUrl)
    audio.loop = true
    audioRef.current = audio
    void audio
      .play()
      .then(() => setPreviewId(track.id))
      .catch(() => setError('Không thể phát bản xem thử này.'))
  }
  return (
    <div className="admin-dashboard admin-music-page">
      <header className="admin-page-heading">
        <div>
          <p>
            Nội dung & giao diện <span>/</span> Âm nhạc
          </p>
          <h1>Quản lý âm nhạc</h1>
          <span>Quản lý kho nhạc nền dùng chung cho thiệp và website cưới.</span>
        </div>
        <button className="button button-primary" type="button" onClick={() => setUploadOpen(true)}>
          <CloudArrowUp size={18} /> Tải nhạc lên
        </button>
      </header>
      <section className="admin-music-summary" aria-label="Tổng quan kho nhạc">
        <div>
          <strong>{items.length}</strong>
          <span>Tất cả bài nhạc</span>
        </div>
        <div>
          <strong>{count('READY')}</strong>
          <span>Đang hoạt động</span>
        </div>
        <div>
          <strong>{count('DRAFT') + count('PROCESSING')}</strong>
          <span>Chờ xử lý</span>
        </div>
        <div>
          <strong>{count('RETIRED')}</strong>
          <span>Ngừng phân phối</span>
        </div>
      </section>
      <section className="admin-panel admin-music-panel">
        <div className="admin-music-toolbar">
          <label>
            <MagnifyingGlass size={18} />
            <span className="sr-only">Tìm nhạc</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm theo tên bài nhạc hoặc nghệ sĩ"
            />
          </label>
          <SelectField
            label="Lọc trạng thái"
            value={status}
            onChange={(value) => setStatus(value as MusicTrackStatus | 'ALL')}
            options={[
              { value: 'ALL', label: 'Tất cả trạng thái' },
              ...(Object.keys(labels) as MusicTrackStatus[]).map((key) => ({
                value: key,
                label: labels[key],
              })),
            ]}
          />
        </div>
        {loading ? (
          <div className="admin-music-state">Đang tải kho nhạc…</div>
        ) : error ? (
          <div className="admin-music-state">
            <MusicNote size={28} />
            <h2>Chưa tải được kho nhạc</h2>
            <p>{error}</p>
            <button type="button" onClick={() => void load()}>
              <ArrowClockwise /> Thử lại
            </button>
          </div>
        ) : visible.length ? (
          <div className="admin-table-wrap">
            <table className="admin-music-table">
              <thead>
                <tr>
                  <th>Bài nhạc</th>
                  <th>Trạng thái</th>
                  <th>License</th>
                  <th>Dung lượng</th>
                  <th>Cập nhật</th>
                  <th>
                    <span className="sr-only">Thao tác</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((track) => (
                  <tr key={track.id}>
                    <td>
                      <div className="admin-music-identity">
                        <span>
                          <MusicNote size={20} />
                        </span>
                        <div>
                          <strong>{track.displayName}</strong>
                          <small>
                            {track.artistName || 'Chưa có nghệ sĩ'} ·{' '}
                            {durationLabel(track.durationSeconds)}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`admin-status music-${track.status.toLowerCase()}`}>
                        {labels[track.status]}
                      </span>
                    </td>
                    <td>
                      <strong>{track.licenseType || '—'}</strong>
                      <small className="admin-music-credit">
                        {track.creditText || track.licenseReference || 'Chưa có ghi chú'}
                      </small>
                    </td>
                    <td>{sizeLabel(track.sizeBytes)}</td>
                    <td>
                      {new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(
                        new Date(track.updatedAt),
                      )}
                    </td>
                    <td>
                      <div className="admin-music-actions">
                        {track.playbackUrl ? (
                          <button
                            type="button"
                            aria-label={`${previewId === track.id ? 'Dừng' : 'Nghe thử'} ${track.displayName}`}
                            onClick={() => togglePreview(track)}
                          >
                            {previewId === track.id ? <Stop /> : <Play />}
                          </button>
                        ) : null}
                        <button
                          type="button"
                          aria-label={`Sửa ${track.displayName}`}
                          onClick={() => setEditTrack(track)}
                        >
                          <PencilSimple />
                        </button>
                        {track.status === 'READY' ? (
                          <button
                            type="button"
                            disabled={Boolean(working)}
                            onClick={() =>
                              void confirmRetire(track, () =>
                                mutate(
                                  track.id,
                                  () => adminMusicApi.retire(track.id),
                                  'Đã ngừng phân phối nhạc',
                                ),
                              )
                            }
                            title="Ngừng phân phối"
                          >
                            <Trash />
                          </button>
                        ) : track.status === 'DRAFT' || track.status === 'FAILED' ? (
                          <button
                            type="button"
                            disabled={Boolean(working)}
                            onClick={() =>
                              void mutate(track.id, () => adminMusicApi.activate(track.id))
                            }
                            title="Phân phối"
                          >
                            <Check />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-music-state">
            <MusicNote size={28} />
            <h2>{items.length ? 'Không tìm thấy bài nhạc' : 'Kho nhạc đang trống'}</h2>
            <p>
              {items.length
                ? 'Thử đổi từ khóa hoặc bộ lọc.'
                : 'Tải bài nhạc đầu tiên lên để bắt đầu xây dựng catalog.'}
            </p>
          </div>
        )}
      </section>
      {uploadOpen ? (
        <UploadDialog
          close={() => setUploadOpen(false)}
          onDone={() => {
            setUploadOpen(false)
            void load()
          }}
        />
      ) : null}
      {editTrack ? (
        <EditDialog
          track={editTrack}
          onDone={() => {
            setEditTrack(null)
            void load()
          }}
        />
      ) : null}
    </div>
  )
}

function UploadDialog({ close, onDone }: { close: () => void; onDone: () => void }) {
  const [name, setName] = useState(''),
    [artist, setArtist] = useState(''),
    [licenseType, setLicenseType] = useState(''),
    [licenseReference, setLicenseReference] = useState(''),
    [credit, setCredit] = useState(''),
    [file, setFile] = useState<File | null>(null),
    [error, setError] = useState(''),
    [working, setWorking] = useState(false)
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!file) {
      setError('Vui lòng chọn file âm thanh.')
      return
    }
    if (
      !['audio/mpeg', 'audio/mp4', 'audio/ogg'].includes(file.type) ||
      file.size > 15 * 1024 * 1024
    ) {
      setError('Chỉ nhận MP3, M4A hoặc OGG tối đa 15MB.')
      return
    }
    setWorking(true)
    setError('')
    try {
      const intent = await adminMusicApi.createIntent({
        displayName: name,
        artistName: artist || undefined,
        mimeType: file.type,
        sizeBytes: file.size,
        licenseType,
        licenseReference,
        creditText: credit || undefined,
      })
      await adminMusicApi.uploadBytes(intent, file)
      await adminMusicApi.complete(intent.track.id)
      await notifications.fire({
        icon: 'success',
        title: 'Đã thêm nhạc',
        text: 'Bài nhạc đã được tải lên và sẵn sàng sử dụng.',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      })
      onDone()
    } catch (cause) {
      setError(errorLabel(cause))
      setWorking(false)
    }
  }
  return (
    <div
      className="admin-music-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !working) close()
      }}
    >
      <form className="admin-music-modal" onSubmit={(event) => void submit(event)}>
        <header>
          <div>
            <h2>Thêm nhạc hệ thống</h2>
            <p>Bài nhạc chỉ xuất hiện cho owner sau khi asset và license hợp lệ.</p>
          </div>
          <button type="button" aria-label="Đóng" onClick={close} disabled={working}>
            <X />
          </button>
        </header>
        <label>
          Tên bài nhạc
          <input
            required
            maxLength={160}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <div className="admin-music-form-grid">
          <label>
            Nghệ sĩ
            <input value={artist} onChange={(event) => setArtist(event.target.value)} />
          </label>
          <label>
            Loại license
            <input
              required
              value={licenseType}
              onChange={(event) => setLicenseType(event.target.value)}
            />
          </label>
        </div>
        <label>
          Tham chiếu license
          <input
            required
            value={licenseReference}
            onChange={(event) => setLicenseReference(event.target.value)}
          />
        </label>
        <label>
          Credit hiển thị
          <input value={credit} onChange={(event) => setCredit(event.target.value)} />
        </label>
        <label className="admin-music-file">
          <input
            required
            type="file"
            accept="audio/mpeg,audio/mp4,audio/ogg"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          <CloudArrowUp />
          <strong>{file?.name ?? 'Chọn file âm thanh'}</strong>
          <small>MP3, M4A hoặc OGG · tối đa 15MB</small>
        </label>
        {error ? (
          <p className="admin-form-error" role="alert">
            {error}
          </p>
        ) : null}
        <footer>
          <button
            className="button button-secondary"
            type="button"
            onClick={close}
            disabled={working}
          >
            Hủy
          </button>
          <button className="button button-primary" type="submit" disabled={working}>
            {working ? 'Đang tải lên…' : 'Thêm nhạc'}
          </button>
        </footer>
      </form>
    </div>
  )
}

function EditDialog({ track, onDone }: { track: MusicTrack; onDone: () => void }) {
  const [name, setName] = useState(track.displayName),
    [artist, setArtist] = useState(track.artistName ?? ''),
    [licenseType, setLicenseType] = useState(track.licenseType ?? ''),
    [licenseReference, setLicenseReference] = useState(track.licenseReference ?? ''),
    [credit, setCredit] = useState(track.creditText ?? ''),
    [error, setError] = useState(''),
    [working, setWorking] = useState(false),
    [closing, setClosing] = useState(false)
  const closeTimer = useRef<number | null>(null)
  const closeAnimated = () => {
    if (closing) return
    setClosing(true)
    closeTimer.current = window.setTimeout(onDone, 170)
  }
  useEffect(
    () => () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current)
    },
    [],
  )
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const displayName = name.trim(),
      nextLicenseType = licenseType.trim(),
      nextLicenseReference = licenseReference.trim()
    if (!displayName || !nextLicenseType || !nextLicenseReference) {
      setError('Tên bài nhạc, loại license và tham chiếu license không được để trống.')
      return
    }
    setWorking(true)
    setError('')
    try {
      const latest = (await adminMusicApi.list()).items.find((item) => item.id === track.id)
      if (!latest)
        throw new AdminMusicApiError(
          404,
          'MUSIC_TRACK_NOT_FOUND',
          'Không tìm thấy bài nhạc để cập nhật.',
        )
      await adminMusicApi.update(track.id, {
        displayName,
        artistName: artist.trim() || null,
        licenseType: nextLicenseType,
        licenseReference: nextLicenseReference,
        creditText: credit.trim() || null,
        revision: latest.revision,
      })
      closeAnimated()
      await notifications.fire({
        icon: 'success',
        title: 'Đã lưu thay đổi',
        timer: 1300,
        timerProgressBar: true,
        showConfirmButton: false,
      })
    } catch (cause) {
      setError(errorLabel(cause))
      setWorking(false)
    }
  }
  return (
    <div
      className={closing ? 'admin-music-modal-backdrop is-closing' : 'admin-music-modal-backdrop'}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !working) closeAnimated()
      }}
    >
      <form className="admin-music-modal" onSubmit={(event) => void submit(event)}>
        <header>
          <div>
            <h2>Sửa thông tin nhạc</h2>
            <p>Cập nhật metadata và giữ nguyên file đang lưu trữ.</p>
          </div>
          <button type="button" aria-label="Đóng" onClick={closeAnimated} disabled={working}>
            <X />
          </button>
        </header>
        <label>
          Tên bài nhạc
          <input
            required
            maxLength={160}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <div className="admin-music-form-grid">
          <label>
            Nghệ sĩ
            <input value={artist} onChange={(event) => setArtist(event.target.value)} />
          </label>
          <label>
            Loại license
            <input
              required
              value={licenseType}
              onChange={(event) => setLicenseType(event.target.value)}
            />
          </label>
        </div>
        <label>
          Tham chiếu license
          <input
            required
            value={licenseReference}
            onChange={(event) => setLicenseReference(event.target.value)}
          />
        </label>
        <label>
          Credit hiển thị
          <input value={credit} onChange={(event) => setCredit(event.target.value)} />
        </label>
        {error ? (
          <p className="admin-form-error" role="alert">
            {error}
          </p>
        ) : null}
        <footer>
          <button
            className="button button-secondary"
            type="button"
            onClick={closeAnimated}
            disabled={working}
          >
            Hủy
          </button>
          <button className="button button-primary" type="submit" disabled={working}>
            {working ? 'Đang lưu…' : 'Lưu thông tin nhạc'}
          </button>
        </footer>
      </form>
    </div>
  )
}
