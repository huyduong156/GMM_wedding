import { useState } from 'react'
import { ModernLuxeInvitation, type ModernLuxePalette } from '../../../templates/invitations/modern-luxe/ModernLuxeInvitation'

const palettes: Array<{ key: ModernLuxePalette; label: string }> = [{ key: 'champagne', label: 'Champagne' }, { key: 'midnight', label: 'Midnight' }, { key: 'sage', label: 'Sage' }]

export function ModernLuxePreviewPage() {
  const [palette, setPalette] = useState<ModernLuxePalette>('champagne')
  return <><aside className="template-preview-toolbar" aria-label="Tùy chọn xem trước"><div><strong>Modern Luxe</strong><span>Preview v1.0.0</span></div><div role="group" aria-label="Chọn bảng màu">{palettes.map((item) => <button key={item.key} className={palette === item.key ? 'is-active' : ''} aria-pressed={palette === item.key} onClick={() => setPalette(item.key)}><i className={`palette-dot ${item.key}`} />{item.label}</button>)}</div><a href="/gmm_admin/library/invites">Đóng xem trước</a></aside><ModernLuxeInvitation palette={palette} preview /></>
}

