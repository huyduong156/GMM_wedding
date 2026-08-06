import { useEffect, useMemo, useState } from 'react'
import { Check, FloppyDisk, ImageSquare, Phone, UserCircle, X } from '@phosphor-icons/react'
import { useAuth } from '../../../features/auth/model/auth-context'
import { AuthApiError } from '../../../shared/api/auth'

function initials(name: string | null, email: string) {
  const source = name?.trim() || email
  return source.split(/\s+/).slice(-2).map((part) => part[0]).join('').toUpperCase().slice(0, 2)
}

export function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [phone, setPhone] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [locale, setLocale] = useState('vi-VN')
  const [timezone, setTimezone] = useState('Asia/Ho_Chi_Minh')
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ tone: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (!user) return
    setDisplayName(user.displayName ?? '')
    setPhone(user.phone ?? '')
    setAvatarUrl(user.avatarUrl ?? '')
    setLocale(user.locale)
    setTimezone(user.timezone)
  }, [user])

  const avatarInitials = useMemo(() => initials(displayName || (user?.displayName ?? null), user?.email ?? ''), [displayName, user?.displayName, user?.email])

  if (!user) return null

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true); setFeedback(null)
    try {
      await updateProfile({
        displayName: displayName.trim() || null,
        phone: phone.trim() || null,
        avatarUrl: avatarUrl.trim() || null,
        locale,
        timezone,
      })
      setFeedback({ tone: 'success', text: 'Đã cập nhật thông tin tài khoản.' })
    } catch (error) {
      setFeedback({ tone: 'error', text: error instanceof AuthApiError ? error.message : 'Không thể lưu thông tin. Vui lòng thử lại.' })
    } finally { setSaving(false) }
  }

  return <div className="wedding-page profile-page">
    <header className="workspace-page-heading">
      <div><p className="eyebrow">Tài khoản</p><h1>Thông tin cá nhân</h1><p>Quản lý thông tin hiển thị và cách GMM Wedding liên hệ với bạn.</p></div>
    </header>
    <form className="profile-layout" onSubmit={save}>
      <section className="settings-panel profile-identity-panel">
        <header><UserCircle size={20} /><div><h2>Hồ sơ của bạn</h2><p>Thông tin này chỉ dành cho tài khoản đang đăng nhập.</p></div></header>
        <div className="profile-identity-content">
          <div className="profile-avatar-wrap">
            {avatarUrl ? <img className="profile-avatar" src={avatarUrl} alt="Ảnh đại diện" /> : <span className="profile-avatar profile-avatar-fallback">{avatarInitials}</span>}
            <span className="profile-avatar-note">Ảnh đại diện</span>
          </div>
          <div className="profile-fields">
            <label>Tên hiển thị<input autoComplete="name" maxLength={120} value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Tên của bạn" required /></label>
            <label>Email <span className="field-readonly-note">Không thể đổi tại đây</span><input value={user.email} readOnly aria-describedby="profile-email-help" /></label>
            <small id="profile-email-help" className="profile-help">Email dùng để đăng nhập và nhận thông báo tài khoản.</small>
          </div>
        </div>
      </section>
      <section className="settings-panel">
        <header><Phone size={20} /><div><h2>Liên hệ & hiển thị</h2><p>Bạn có thể để trống số điện thoại hoặc ảnh đại diện.</p></div></header>
        <div className="settings-fields profile-fields-grid">
          <label>Số điện thoại<input autoComplete="tel" inputMode="tel" maxLength={32} value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+84 912 345 678" /></label>
          <label className="profile-field-wide">URL ảnh đại diện<input type="url" maxLength={2048} value={avatarUrl} onChange={(event) => setAvatarUrl(event.target.value)} placeholder="https://..." /></label>
        </div>
      </section>
      <section className="settings-panel">
        <header><ImageSquare size={20} /><div><h2>Ngôn ngữ & múi giờ</h2><p>Được dùng cho định dạng ngày giờ và thông báo.</p></div></header>
        <div className="settings-fields profile-fields-grid">
          <label>Ngôn ngữ<select value={locale} onChange={(event) => setLocale(event.target.value)}><option value="vi-VN">Tiếng Việt (Việt Nam)</option><option value="en-US">English (United States)</option></select></label>
          <label>Múi giờ<select value={timezone} onChange={(event) => setTimezone(event.target.value)}><option value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</option><option value="Asia/Bangkok">Bangkok (GMT+7)</option><option value="Asia/Singapore">Singapore (GMT+8)</option></select></label>
        </div>
      </section>
      {feedback ? <p className={`workspace-save-message profile-feedback ${feedback.tone}`} role="status">{feedback.tone === 'success' ? <Check size={16} /> : <X size={16} />}{feedback.text}</p> : null}
      <div className="settings-save"><button className="button button-primary" type="submit" disabled={saving}>{saving ? 'Đang lưu…' : <><FloppyDisk size={17} /> Lưu thông tin</>}</button></div>
    </form>
  </div>
}
