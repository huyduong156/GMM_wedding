import { useRef, useState, type FormEvent } from 'react'
import type { PublicInteractions } from '../../../shared/lib/navigation/public-interaction-types'

export function ABeautifulDayForm({ kind, guestName, interactions, editorMode }: {
  kind: 'rsvp' | 'wish'
  guestName?: string | null
  interactions?: PublicInteractions
  editorMode: boolean
}) {
  const controller = kind === 'rsvp' ? interactions?.rsvp : interactions?.wishes
  const personalized = Boolean(guestName?.trim() || interactions?.isPersonalized)
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [attendance, setAttendance] = useState<'ATTENDING' | 'DECLINED'>('ATTENDING')
  const [partySize, setPartySize] = useState(1)
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const sending = useRef(false)
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!controller || editorMode || sending.current || sent || controller.submitted) return
    if (!personalized && !name.trim()) { setError('Vui lòng nhập tên của bạn.'); return }
    if (kind === 'wish' && !content.trim()) { setError('Vui lòng viết lời chúc.'); return }
    sending.current = true
    setPending(true)
    setError('')
    const author = personalized ? guestName?.trim() || interactions?.guestName || undefined : name.trim()
    try {
      const accepted = kind === 'rsvp'
        ? await interactions!.rsvp.submit({ guestName: author, attendance, partySize: attendance === 'DECLINED' ? 0 : partySize })
        : await interactions!.wishes.submit({ guestName: author, content: content.trim() })
      setSent(accepted)
      if (!accepted) setError('Chưa gửi được. Vui lòng thử lại.')
    } catch { setError('Chưa gửi được. Vui lòng thử lại.') }
    finally { sending.current = false; setPending(false) }
  }
  const completed = sent || controller?.submitted
  const disabled = !controller || editorMode || pending || controller.submitting || completed
  return <form className="abd-form" aria-label={kind === 'rsvp' ? 'Biểu mẫu RSVP' : 'Biểu mẫu lời chúc'} onSubmit={(event) => void submit(event)}>
    {personalized ? <p data-motion-variant="copy" className="abd-form__guest">Khách mời: <strong>{guestName || interactions?.guestName || 'Khách mời'}</strong></p> : <label data-motion-variant="copy" data-motion-step="1"><span>Tên của bạn</span><input name="guestName" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" maxLength={80} required disabled={Boolean(disabled)} /></label>}
    {kind === 'rsvp' ? <>
      <fieldset disabled={Boolean(disabled)}><legend data-motion-variant="copy">Bạn có thể tham dự?</legend><label data-motion-variant="copy" data-motion-step="1"><input type="radio" name="attendance" checked={attendance === 'ATTENDING'} onChange={() => setAttendance('ATTENDING')} /> Có, mình sẽ đến</label><label data-motion-variant="copy" data-motion-step="1"><input type="radio" name="attendance" checked={attendance === 'DECLINED'} onChange={() => setAttendance('DECLINED')} /> Tiếc là mình không thể</label></fieldset>
      {attendance === 'ATTENDING' ? <label data-motion-variant="copy" data-motion-step="2"><span>Số người tham dự</span><input type="number" min={1} max={20} required value={partySize} onChange={(event) => setPartySize(event.target.valueAsNumber)} disabled={Boolean(disabled)} /></label> : null}
    </> : <label data-motion-variant="copy" data-motion-step="1"><span>Lời chúc</span><textarea rows={3} value={content} onChange={(event) => setContent(event.target.value)} required maxLength={2000} disabled={Boolean(disabled)} /></label>}
    <button data-motion-variant="copy" data-motion-step="3" type="submit" disabled={Boolean(disabled)}>{completed ? 'Đã gửi' : pending || controller?.submitting ? 'Đang gửi…' : kind === 'rsvp' ? 'Xác nhận tham dự' : 'Gửi lời chúc'} <span aria-hidden="true">↗</span></button>
    {error || controller?.error ? <p role="alert">{controller?.error || error}</p> : null}
    <small role="status">{completed ? kind === 'rsvp' ? 'Cảm ơn bạn đã phản hồi.' : 'Cảm ơn bạn. Lời chúc sẽ xuất hiện sau khi được duyệt.' : !controller || editorMode ? 'Bản xem trước · chưa nhận phản hồi.' : ''}</small>
  </form>
}
