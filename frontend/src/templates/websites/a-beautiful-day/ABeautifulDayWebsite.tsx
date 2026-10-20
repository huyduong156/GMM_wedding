import './a-beautiful-day.css'

export function ABeautifulDayWebsite() {
  return (
    <main className="abd-site" aria-labelledby="abd-preview-title">
      <div className="abd-site__canvas">
        <div className="abd-site__boundary" aria-label="Template content boundary">
          <p className="abd-site__eyebrow">Wedding website preview</p>
          <h1 id="abd-preview-title">A Beautiful Day</h1>
          <p className="abd-site__status">Phase 0 · Spatial shell</p>
        </div>
      </div>
    </main>
  )
}
