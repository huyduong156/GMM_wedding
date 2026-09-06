import { Heart } from '@phosphor-icons/react'

export function PageLoading({
  label = 'Đang tải trang',
  detail = 'Vui lòng chờ trong giây lát.',
}: {
  label?: string
  detail?: string
}) {
  return (
    <main className="page-loading" role="status" aria-live="polite" aria-label={label}>
      <div className="page-loading-orbit" aria-hidden="true">
        <span />
        <span />
        <Heart size={18} weight="fill" />
      </div>
      <p className="page-loading-kicker">GMM Wedding</p>
      <h1>{label}</h1>
      <p className="page-loading-detail">{detail}</p>
    </main>
  )
}
