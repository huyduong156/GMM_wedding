type ABeautifulDayBotanicalProps = {
  className: string
  variant?: 'sprig' | 'bloom'
}

/** Renderer-owned line art: lightweight, recolorable and independent of wedding photos. */
export function ABeautifulDayBotanical({ className, variant = 'sprig' }: ABeautifulDayBotanicalProps) {
  return (
    <svg className={className} viewBox="0 0 240 300" fill="none" aria-hidden="true" focusable="false">
      <path className="abd-botanical__stem" d="M24 280C77 234 82 180 111 130s51-79 105-111" />
      <path className="abd-botanical__stem" d="M61 248c-7-42 2-78 28-112M91 190c-27-13-48-15-71-8M119 136c-24-20-37-41-40-68M156 92c24-3 42 1 59 13M184 54c-3-23 1-39 12-53" />
      <path className="abd-botanical__leaf" d="M83 144c-28-8-40-24-43-48 24 1 40 12 43 48Zm11-15c2-28 14-44 37-51 4 24-6 42-37 51Zm-45 43c-23 7-43 3-60-13 19-14 39-13 60 13Zm78-73c-20-17-26-37-20-60 22 9 31 28 20 60Zm28-18c22-17 43-18 64-5-14 21-35 27-64 5Zm28-42c-12-22-10-42 6-61 17 17 18 38-6 61Z" />
      {variant === 'bloom' ? (
        <g className="abd-botanical__flower">
          <path d="M192 37c-19-19-3-35 8-20 8-22 29-11 17 8 23-6 27 15 5 20 16 16-2 31-14 12-10 22-30 10-15-8-22 7-28-14-1-17Z" />
          <circle cx="204" cy="40" r="7" />
          <path d="M117 105c-13-13-2-24 6-13 6-16 21-8 12 6 17-4 20 11 4 14 12 12-1 22-10 9-7 16-22 7-11-6-16 5-20-10-1-12Z" />
          <circle cx="126" cy="107" r="5" />
        </g>
      ) : (
        <g className="abd-botanical__bud"><circle cx="208" cy="32" r="8" /><circle cx="124" cy="101" r="5" /></g>
      )}
    </svg>
  )
}
