import { memo, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Image, MusicNote, Plus, Trash, X } from '@phosphor-icons/react'
import type { MusicTrack } from '../../api/admin-music'
import { musicApi } from '../../api/music'
import type { TemplateFieldConfig } from '../../api/weddings'
import { NativeDateField } from '../form-controls/NativeDateField'
import { NativeSelectField } from '../form-controls/NativeSelectField'

export type TemplateMediaPicker = (target: {
  path: string
  multiple: boolean
  role: string
  mediaValue?: 'url' | 'object'
}) => void
export type TemplateSchemaFieldsProps = {
  fields: Record<string, TemplateFieldConfig>
  data: Record<string, unknown>
  update: (path: string, value: unknown) => void
  openMediaManager?: TemplateMediaPicker
  mediaEnabled?: boolean
  errors?: Record<string, string>
  emptyState?: ReactNode
  layout?: string
  autoSelectFirstAudio?: boolean
}

const getPath = (data: Record<string, unknown>, path: string) =>
  path
    .split('.')
    .reduce<unknown>(
      (value, part) =>
        value && typeof value === 'object' ? (value as Record<string, unknown>)[part] : undefined,
      data,
    )
const fieldValue = (field: TemplateFieldConfig) =>
  field.default ??
  (field.type === 'items' || field.type === 'images' ? [] : field.type === 'boolean' ? false : '')

export function TemplateSchemaFields({
  fields,
  data,
  update,
  openMediaManager,
  mediaEnabled = false,
  errors = {},
  emptyState,
  layout,
  autoSelectFirstAudio = false,
}: TemplateSchemaFieldsProps) {
  const entries = Object.entries(fields)
  if (!entries.length)
    return (
      emptyState ?? (
        <div className="editor-field-placeholder">
          <strong>Section cố định</strong>
          <p>Section này không có field chỉnh sửa trong template config.</p>
        </div>
      )
    )
  return (
    <div className={`editor-schema-fields${layout ? ` is-${layout}` : ''}`}>
      {entries.map(([key, field]) => (
        <TemplateField
          key={key}
          fieldKey={key}
          field={field}
          data={data}
          update={update}
          openMediaManager={openMediaManager}
          mediaEnabled={mediaEnabled}
          errors={errors}
          autoSelectFirstAudio={autoSelectFirstAudio}
        />
      ))}
    </div>
  )
}

function TemplateField({
  fieldKey,
  field,
  data,
  update,
  openMediaManager,
  mediaEnabled,
  errors,
  autoSelectFirstAudio,
}: {
  fieldKey: string
  field: TemplateFieldConfig
  data: Record<string, unknown>
  update: (path: string, value: unknown) => void
  openMediaManager?: TemplateMediaPicker
  mediaEnabled: boolean
  errors: Record<string, string>
  autoSelectFirstAudio: boolean
}) {
  const path = field.contentKey ?? fieldKey
  const value = getPath(data, path)
  if (field.type === 'items')
    return (
      <TemplateItems
        path={path}
        label={field.label ?? fieldKey}
        value={Array.isArray(value) ? (value as Record<string, unknown>[]) : []}
        itemFields={field.itemFields ?? {}}
        maxItems={field.maxItems ?? 20}
        emptyMessage={field.emptyMessage}
        recommendedMinItems={field.recommendedMinItems}
        update={update}
        openMediaManager={openMediaManager}
        mediaEnabled={mediaEnabled}
      />
    )
  if (field.type === 'audio')
    return (
      <TemplateAudioField
        label={field.label ?? fieldKey}
        value={String(value ?? '')}
        nameKey={field.audioNameKey}
        update={update}
        path={path}
        data={data}
        autoSelectFirstAudio={autoSelectFirstAudio}
      />
    )
  if (field.type === 'image' || field.type === 'images')
    return (
      <TemplateMediaField
        label={field.label ?? fieldKey}
        value={value}
        path={path}
        multiple={field.type === 'images'}
        role={field.mediaRole ?? fieldKey}
        mediaValue={field.mediaValue}
        openMediaManager={openMediaManager}
        enabled={mediaEnabled}
        onRemove={(index) =>
          update(
            path,
            Array.isArray(value) ? value.filter((_, itemIndex) => itemIndex !== index) : '',
          )
        }
      />
    )
  if (field.type === 'boolean')
    return (
      <label className="editor-setting-row">
        <span>
          <strong>{field.label ?? fieldKey}</strong>
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={Boolean(value)}
          className={'editor-switch ' + (value ? 'is-on' : '')}
          onClick={() => update(path, !value)}
        >
          <span />
        </button>
      </label>
    )
  if (field.type === 'select')
    return (
      <label className="editor-field">
        <span>{field.label ?? fieldKey}</span>
        <NativeSelectField
          value={String(value ?? fieldValue(field))}
          onChange={(event) => update(path, event.target.value)}
        >
          {(field.options ?? []).map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </NativeSelectField>
      </label>
    )
  const input =
    field.type === 'date' ? (
      <NativeDateField
        value={String(value ?? '')}
        onChange={(event) => update(path, event.target.value)}
        aria-label={field.label ?? fieldKey}
      />
    ) : field.type === 'text' ? (
      <textarea
        rows={4}
        value={String(value ?? '')}
        onChange={(event) => update(path, event.target.value)}
      />
    ) : (
      <input
        type={field.type === 'url' ? 'url' : 'text'}
        value={String(value ?? '')}
        onChange={(event) => update(path, event.target.value)}
      />
    )
  return (
    <label className={'editor-field ' + (errors[path] ? 'has-error' : '')}>
      <span>{field.label ?? fieldKey}</span>
      {input}
      {errors[path] ? <small className="editor-field-error">{errors[path]}</small> : null}
    </label>
  )
}

function TemplateAudioField({
  label,
  value,
  nameKey,
  update,
  path,
  data,
  autoSelectFirstAudio,
}: {
  label: string
  value: string
  nameKey?: string
  update: (path: string, value: unknown) => void
  path: string
  data: Record<string, unknown>
  autoSelectFirstAudio: boolean
}) {
  const [tracks, setTracks] = useState<MusicTrack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null)
  const previewRef = useRef<{
    trackId: string
    audio: HTMLAudioElement
    detach: () => void
  } | null>(null)
  const stopPreview = useCallback((updateState = true) => {
    const previous = previewRef.current
    previewRef.current = null
    if (previous) {
      previous.detach()
      previous.audio.pause()
      previous.audio.removeAttribute('src')
      previous.audio.load()
    }
    if (updateState) setPlayingTrackId(null)
  }, [])
  const autoplayPath = path.replace(/(?:^|\.)[^.]+$/, (segment) =>
    segment.startsWith('.') ? `${segment}backgroundMusicAutoplay` : 'backgroundMusicAutoplay',
  )
  useEffect(() => {
    let active = true
    const onVisibility = () => {
      if (document.hidden) stopPreview()
    }
    const onPageHide = () => stopPreview()
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', onPageHide)
    void musicApi
      .list()
      .then((result) => {
        if (active)
          setTracks(result.items.filter((track) => track.status === 'READY' && track.playbackUrl))
      })
      .catch(() => {
        if (active) setError('Không thể tải kho nhạc.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', onPageHide)
      stopPreview(false)
    }
  }, [stopPreview])
  useEffect(() => {
    const firstTrack = tracks[0]
    if (!autoSelectFirstAudio || !firstTrack?.playbackUrl || value) return

    update(path, firstTrack.playbackUrl)
    if (nameKey) update(nameKey, firstTrack.displayName)

    // A brand-new invitation should make the selected track discoverable in
    // the saved preview. Preserve an explicit user choice when a track was
    // already selected.
    update(autoplayPath, true)
  }, [autoSelectFirstAudio, autoplayPath, nameKey, path, tracks, update, value])
  const currentName = nameKey ? String(getPath(data, nameKey) ?? '') : ''
  const playingTrack = tracks.find((track) => track.id === playingTrackId)
  const togglePreview = useCallback(
    async (track: MusicTrack) => {
      if (!track.playbackUrl || document.hidden) return
      if (previewRef.current?.trackId === track.id) {
        stopPreview()
        return
      }
      stopPreview()
      // One media instance per attempt isolates late events/promises from old tracks.
      const audio = new Audio()
      audio.preload = 'metadata'
      audio.src = track.playbackUrl
      const isCurrent = () => previewRef.current?.audio === audio
      const onPlay = () => {
        if (isCurrent() && !document.hidden) setPlayingTrackId(track.id)
        else audio.pause()
      }
      const onStop = () => {
        if (isCurrent()) stopPreview()
      }
      audio.addEventListener('play', onPlay)
      audio.addEventListener('playing', onPlay)
      audio.addEventListener('pause', onStop)
      audio.addEventListener('ended', onStop)
      audio.addEventListener('error', onStop)
      previewRef.current = {
        trackId: track.id,
        audio,
        detach: () => {
          audio.removeEventListener('play', onPlay)
          audio.removeEventListener('playing', onPlay)
          audio.removeEventListener('pause', onStop)
          audio.removeEventListener('ended', onStop)
          audio.removeEventListener('error', onStop)
        },
      }
      // The same button can cancel a pending request before play() settles.
      setPlayingTrackId(track.id)
      try {
        await audio.play()
        if (!isCurrent()) audio.pause()
      } catch {
        if (isCurrent()) stopPreview()
      }
    },
    [stopPreview],
  )
  const selectTrack = useCallback(
    (track: MusicTrack) => {
      update(path, track.playbackUrl)
      if (nameKey) update(nameKey, track.displayName)
    },
    [nameKey, path, update],
  )
  return (
    <div className="editor-audio-library">
      <div className="editor-audio-library-heading">
        <div className="editor-audio-library-heading-copy">
          <strong>{label}</strong>
          <span>{currentName || 'Chọn một bài nhạc từ kho'}</span>
        </div>
        {playingTrack ? (
          <div className="editor-audio-now-playing">
            <span className="editor-audio-now-playing-name">
              <span className="editor-audio-now-playing-label">Đang nghe thử</span>
              <span className="editor-audio-now-playing-track" title={playingTrack.displayName}>
                {playingTrack.displayName}
              </span>
            </span>
            <button
              className="editor-audio-stop-button"
              type="button"
              onClick={() => stopPreview()}
              aria-label="Dừng nghe thử nhạc"
            >
              Dừng
            </button>
          </div>
        ) : null}
      </div>
      <div className="editor-audio-library-list">
        {loading ? (
          <small>Đang tải kho nhạc…</small>
        ) : error ? (
          <small className="editor-upload-error">{error}</small>
        ) : tracks.length ? (
          tracks.map((track) => (
            <TemplateAudioTrack
              key={track.id}
              track={track}
              selected={value === track.playbackUrl}
              previewing={playingTrackId === track.id}
              onPreview={togglePreview}
              onSelect={selectTrack}
            />
          ))
        ) : (
          <small>Chưa có bài nhạc sẵn sàng.</small>
        )}
      </div>
    </div>
  )
}
const TemplateAudioTrack = memo(function TemplateAudioTrack({
  track,
  selected,
  previewing,
  onPreview,
  onSelect,
}: {
  track: MusicTrack
  selected: boolean
  previewing: boolean
  onPreview: (track: MusicTrack) => Promise<void>
  onSelect: (track: MusicTrack) => void
}) {
  return (
    <div className={'editor-audio-track ' + (selected ? 'is-selected' : '')}>
      <div>
        <strong>{track.displayName}</strong>
        <small>{track.artistName || 'Không rõ nghệ sĩ'}</small>
      </div>
      <div>
        <button
          className="editor-audio-preview-button"
          type="button"
          onClick={() => void onPreview(track)}
          aria-label={(previewing ? 'Dừng' : 'Nghe thử') + ' ' + track.displayName}
          aria-pressed={previewing}
        >
          <MusicNote />
          <span key={previewing ? 'stop' : 'preview'}>{previewing ? 'Dừng' : 'Nghe thử'}</span>
        </button>
        <button type="button" onClick={() => onSelect(track)}>
          {selected ? 'Đã chọn' : 'Chọn'}
        </button>
      </div>
    </div>
  )
})

function TemplateMediaField({
  label,
  value,
  path,
  multiple,
  role,
  mediaValue,
  openMediaManager,
  enabled,
  onRemove,
}: {
  label: string
  value: unknown
  path: string
  multiple: boolean
  role: string
  mediaValue?: 'url' | 'object'
  openMediaManager?: TemplateMediaPicker
  enabled: boolean
  onRemove?: (index: number) => void
}) {
  const urls = multiple
    ? Array.isArray(value)
      ? value
          .map((item) =>
            typeof item === 'string'
              ? item
              : item && typeof item === 'object' && 'src' in item
                ? String((item as { src: unknown }).src)
                : '',
          )
          .filter(Boolean)
      : []
    : [
        typeof value === 'string'
          ? value
          : value && typeof value === 'object' && 'src' in value
            ? String((value as { src: unknown }).src)
            : '',
      ].filter(Boolean)
  if (!multiple)
    return (
      <div className="editor-media-field">
        <button
          type="button"
          className={'editor-image-picker ' + (urls.length ? 'has-image' : '')}
          disabled={!enabled || !openMediaManager}
          onClick={() => openMediaManager?.({ path, multiple: false, role, mediaValue })}
          aria-label={(urls.length ? 'Thay ảnh: ' : 'Chọn ảnh: ') + label}
        >
          {urls[0] ? <img src={urls[0]} alt="" /> : <Image />}
          <strong>{urls.length ? 'Thay ảnh' : 'Chọn ảnh'}</strong>
        </button>
      </div>
    )
  return (
    <div className="editor-media-field">
      <button
        type="button"
        className="editor-upload"
        disabled={!enabled || !openMediaManager}
        onClick={() => openMediaManager?.({ path, multiple: true, role, mediaValue })}
      >
        <Image />
        <strong>{urls.length ? 'Thay ảnh trong album' : 'Thêm ảnh vào album'}</strong>
        <span>Chọn nhiều ảnh từ kho media</span>
      </button>
      {urls.length ? (
        <div className="editor-image-grid">
          {urls.map((url, index) => (
            <figure key={url + index}>
              <img src={url} alt={label + ' ' + (index + 1)} />
              <button
                type="button"
                aria-label={'Xóa ảnh ' + (index + 1)}
                onClick={() => onRemove?.(index)}
              >
                <X size={12} weight="bold" />
              </button>
            </figure>
          ))}
        </div>
      ) : null}
    </div>
  )
}
function TemplateItems({
  path,
  label,
  value,
  itemFields,
  maxItems,
  emptyMessage,
  recommendedMinItems,
  update,
  openMediaManager,
  mediaEnabled,
}: {
  path: string
  label: string
  value: Record<string, unknown>[]
  itemFields: Record<string, TemplateFieldConfig>
  maxItems: number
  emptyMessage?: string
  recommendedMinItems?: number
  update: (path: string, value: unknown) => void
  openMediaManager?: TemplateMediaPicker
  mediaEnabled: boolean
}) {
  const change = (index: number, key: string, next: unknown) =>
    update(
      path,
      value.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: next } : item)),
    )
  return (
    <div className="editor-timeline-fields">
      <strong>{label}</strong>
      {recommendedMinItems && value.length > 0 && value.length < recommendedMinItems ? (
        <p className="editor-items-note">
          Gợi ý: thêm tối thiểu {recommendedMinItems} mục để giao diện cân đối nhất.
        </p>
      ) : null}
      {value.length === 0 ? (
        <p className="editor-items-empty">
          {emptyMessage ?? 'Chưa có nội dung. Hãy thêm ít nhất một mục để hiển thị phần này.'}
        </p>
      ) : null}
      <div className="editor-items-scroll">
        {value.map((item, index) => (
          <article key={index}>
            <header>
              <strong>Mục {index + 1}</strong>
              <button
                type="button"
                onClick={() =>
                  update(
                    path,
                    value.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                aria-label={'Xóa mục ' + (index + 1)}
              >
                <Trash />
              </button>
            </header>
            {Object.entries(itemFields).map(([key, field]) => (
              <TemplateItemField
                key={key}
                path={path + '.' + index + '.' + key}
                fieldKey={key}
                field={field}
                value={item[key]}
                change={(next) => change(index, key, next)}
                openMediaManager={openMediaManager}
                mediaEnabled={mediaEnabled}
              />
            ))}
          </article>
        ))}
      </div>
      <button
        className="editor-add-item"
        type="button"
        disabled={value.length >= maxItems}
        onClick={() =>
          update(path, [
            ...value,
            Object.fromEntries(
              Object.entries(itemFields).map(([key, field]) => [key, fieldValue(field)]),
            ),
          ])
        }
      >
        <Plus /> Thêm mục
      </button>
    </div>
  )
}
function TemplateItemField({
  path,
  fieldKey,
  field,
  value,
  change,
  openMediaManager,
  mediaEnabled,
}: {
  path: string
  fieldKey: string
  field: TemplateFieldConfig
  value: unknown
  change: (value: unknown) => void
  openMediaManager?: TemplateMediaPicker
  mediaEnabled: boolean
}) {
  if (field.type === 'image' || field.type === 'images')
    return (
      <TemplateMediaField
        label={field.label ?? fieldKey}
        value={value}
        path={path}
        multiple={field.type === 'images'}
        role={field.mediaRole ?? fieldKey}
        mediaValue={field.mediaValue}
        openMediaManager={openMediaManager}
        enabled={mediaEnabled}
        onRemove={(index) =>
          change(Array.isArray(value) ? value.filter((_, itemIndex) => itemIndex !== index) : '')
        }
      />
    )
  if (field.type === 'text')
    return (
      <label className="editor-field">
        <span>{field.label ?? fieldKey}</span>
        <textarea
          rows={3}
          value={String(value ?? '')}
          onChange={(event) => change(event.target.value)}
        />
      </label>
    )
  return (
    <label className="editor-field">
      <span>{field.label ?? fieldKey}</span>
      <input value={String(value ?? '')} onChange={(event) => change(event.target.value)} />
    </label>
  )
}
