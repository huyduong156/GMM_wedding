import { useState } from 'react'
import { RedSpiderLilyRecap } from '../../../templates/recaps/red-spider-lily/RedSpiderLilyRecap'
import type { RedSpiderLilyRecapContent } from '../../../templates/recaps/red-spider-lily/content'

type PreviewState = {
  data?: RedSpiderLilyRecapContent
  sectionConfig?: { enabled: string[]; order: string[] }
}

export function RedSpiderLilyRecapPreviewPage() {
  const params = new URLSearchParams(window.location.search)
  const draft = params.get('draft') === '1'
  const templateKey = params.get('template') ?? 'red-spider-lily-recap'
  const stored = draft ? readPreviewState(templateKey) : null
  const [state] = useState<PreviewState | null>(stored)
  return <RedSpiderLilyRecap data={state?.data} sectionConfig={state?.sectionConfig} />
}

function readPreviewState(templateKey: string): PreviewState | null {
  try {
    return JSON.parse(
      sessionStorage.getItem('gmm-recap-preview:' + templateKey) ?? 'null',
    ) as PreviewState | null
  } catch {
    return null
  }
}
