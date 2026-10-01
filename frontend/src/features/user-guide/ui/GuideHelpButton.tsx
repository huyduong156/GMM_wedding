import { Question } from '@phosphor-icons/react'
import { guideKeyForPath } from '../model/guide-content'
import { useGuide } from './GuideProvider'

export function GuideHelpButton({ pathname }: { pathname: string }) {
  const { startGuide } = useGuide()
  const key = guideKeyForPath(pathname) ?? 'started'

  return (
    <button
      className="icon-button guide-help-button"
      type="button"
      aria-label="Mở hướng dẫn sử dụng"
      title="Hướng dẫn sử dụng"
      onClick={() => startGuide(key, true)}
    >
      <Question size={19} weight="bold" />
    </button>
  )
}
