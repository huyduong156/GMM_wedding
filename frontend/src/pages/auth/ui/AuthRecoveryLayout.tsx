import type { ReactNode } from 'react'
import { ShieldCheck } from '@phosphor-icons/react'
import { WeddingAmbient } from '../../../shared/ui/wedding-ambient/WeddingAmbient'

export function AuthRecoveryLayout({ children, titleId }: { children: ReactNode; titleId: string }) {
  return (
    <main className="login-page">
      <section className="login-story" aria-label="Giới thiệu GMM Wedding">
        <div className="login-brand"><img src="/assets/logo/wedding_logo.png" alt="" /><span>GMM Wedding</span></div>
        <div className="login-story-copy">
          <span className="login-eyebrow">Một nơi cho ngày trọng đại</span>
          <h1>Thiệp đẹp, khách mời đủ, kỷ niệm còn mãi.</h1>
          <p>Quản lý thiệp online và website cưới trong một không gian riêng tư, gọn gàng.</p>
        </div>
        <p className="login-trust"><ShieldCheck size={18} /> Dữ liệu của bạn được bảo vệ và không chia sẻ với bên thứ ba.</p>
      </section>
      <section className="login-panel" aria-labelledby={titleId}>
        <WeddingAmbient variant="login" />
        {children}
      </section>
    </main>
  )
}
