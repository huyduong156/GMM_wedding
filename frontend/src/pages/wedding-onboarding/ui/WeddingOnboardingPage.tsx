import { useState } from 'react'
import { CalendarBlank, Heart, Sparkle } from '@phosphor-icons/react'
import { useWeddingWorkspace } from '../../../entities/wedding/model/wedding-context'
import { weddingApi } from '../../../shared/api/weddings'

export function WeddingOnboardingPage() {
  const { addWedding } = useWeddingWorkspace()
  const [name, setName] = useState(''), [date, setDate] = useState('')
  const [saving, setSaving] = useState(false), [error, setError] = useState<string | null>(null)
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError(null)
    if (!name.trim()) { setError('Hãy nhập tên hai bạn hoặc tên đám cưới.'); return }
    setSaving(true)
    try {
      const result = await weddingApi.create({ name: name.trim(), ...(date ? { primaryDate: new Date(`${date}T12:00:00+07:00`).toISOString() } : {}) })
      addWedding(result.wedding)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Chưa thể tạo đám cưới.') }
    finally { setSaving(false) }
  }
  return <main className="wedding-onboarding">
    <section className="onboarding-story"><span className="onboarding-kicker"><Sparkle size={15} weight="fill" /> Không gian của hai bạn</span><h1>Mọi chuẩn bị đẹp đẽ đều bắt đầu từ một ngày được chọn.</h1><p>Tạo hồ sơ cưới để quản lý lịch lễ, thiệp, khách mời và những lời chúc trong cùng một nơi.</p><div className="onboarding-milestones" aria-hidden="true"><i /><i /><i /></div></section>
    <form className="onboarding-form" onSubmit={submit}><span className="onboarding-heart"><Heart size={24} weight="duotone" /></span><p className="eyebrow">Bước đầu tiên</p><h2>Tạo đám cưới của bạn</h2><label>Tên hai bạn hoặc tên đám cưới<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ví dụ: Mai & Đức" maxLength={160} autoFocus /></label><label>Ngày cưới chính <small>Có thể bổ sung sau</small><span className="date-input"><CalendarBlank size={18} /><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></span></label>{error ? <p className="workspace-form-error" role="alert">{error}</p> : null}<button className="button button-primary" disabled={saving}>{saving ? 'Đang tạo không gian…' : 'Bắt đầu chuẩn bị'}</button><small className="form-footnote">Bạn có thể thêm nhiều lễ và tiệc sau khi hoàn tất.</small></form>
  </main>
}
