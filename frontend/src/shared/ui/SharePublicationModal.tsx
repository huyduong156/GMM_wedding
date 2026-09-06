import { useState } from 'react'
import { Check, Copy, FacebookLogo, Link, ShareNetwork, X } from '@phosphor-icons/react'

type SharePublicationModalProps = {
  url: string
  surface: 'Thiệp online' | 'Website cưới'
  onClose: () => void
}

export function SharePublicationModal({ url, surface, onClose }: SharePublicationModalProps) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard?.writeText(url)
    setCopied(true)
  }
  const nativeShare = async () => {
    if (navigator.share) await navigator.share({ title: surface, url })
  }
  const facebookUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url)

  return (
    <div
      className="recap-share-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="recap-share-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recap-share-title"
      >
        <button type="button" className="recap-share-close" onClick={onClose} aria-label="Đóng">
          <X size={18} />
        </button>
        <span className="recap-share-kicker">{surface.toUpperCase()} ĐÃ SẴN SÀNG</span>
        <h2 id="recap-share-title">Chia sẻ đường dẫn công khai</h2>
        <p>Gửi đường dẫn đến gia đình và bạn bè.</p>
        <div className="recap-share-link">
          <Link size={17} />
          <span>{url}</span>
          <button type="button" onClick={() => void copy()} aria-label="Sao chép đường dẫn">
            {copied ? <Check size={17} /> : <Copy size={17} />}
          </button>
        </div>
        <div className="recap-share-actions">
          <a
            className="button button-secondary"
            href={facebookUrl}
            target="_blank"
            rel="noreferrer"
          >
            <FacebookLogo size={17} /> Facebook
          </a>
          {'share' in navigator ? (
            <button
              className="button button-secondary"
              type="button"
              onClick={() => void nativeShare()}
            >
              <ShareNetwork size={17} /> Chia sẻ
            </button>
          ) : null}
          <button className="button button-primary" type="button" onClick={() => void copy()}>
            <Copy size={17} /> {copied ? 'Đã sao chép' : 'Sao chép link'}
          </button>
        </div>
      </section>
    </div>
  )
}
