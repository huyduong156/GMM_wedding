import { useMemo } from 'react'

import './rose-garden.css'

export type RoseGardenData = {
  brideName?: string
  groomName?: string
  weddingDate?: string
}

const defaults: Required<RoseGardenData> = {
  brideName: 'Mai Anh',
  groomName: 'Minh Khang',
  weddingDate: '18 · 10 · 2026',
}

export function RoseGardenInvitation({ data }: { data?: RoseGardenData }) {
  const content = { ...defaults, ...data }
  const glints = useMemo(
    () =>
      Array.from({ length: 20 }, (_, index) => {
        const random = Math.random
        const isRight = index % 2 === 1

        return {
          id: index,
          left: `${isRight ? 66 + random() * 29 : 5 + random() * 29}%`,
          top: `${8 + random() * 84}%`,
          size: `${3 + Math.round(random() * 2)}px`,
          delay: `${-(random() * 6).toFixed(2)}s`,
          duration: `${(4.2 + random() * 2.8).toFixed(2)}s`,
        }
      }),
    [],
  )

  return (
    <div className="rg-page">
      <div className="rg-backdrop" aria-hidden="true">
        {glints.map((glint) => (
          <i
            key={glint.id}
            className="rg-glint"
            style={{
              left: glint.left,
              top: glint.top,
              width: glint.size,
              height: glint.size,
              animationDelay: glint.delay,
              animationDuration: glint.duration,
            }}
          />
        ))}
      </div>
      <main className="rg-invitation" aria-label="Thiệp cưới Rose Garden">
        <div className="rg-invitation-decor rg-invitation-decor-top" aria-hidden="true" />
        <div className="rg-invitation-decor rg-invitation-decor-bottom" aria-hidden="true" />
        <section className="rg-opening">
          <span className="rg-kicker">Rose Garden</span>
          <div className="rg-seal" aria-hidden="true">
            <span>RG</span>
          </div>
          <p className="rg-opening-label">Trân trọng kính mời</p>
          <h1>
            {content.brideName} <em>&amp;</em> {content.groomName}
          </h1>
          <p className="rg-date">{content.weddingDate}</p>
          <p className="rg-opening-note">
            Khung thiệp mobile đang được dựng theo ngôn ngữ khu vườn hồng.
          </p>
        </section>
      </main>
    </div>
  )
}
