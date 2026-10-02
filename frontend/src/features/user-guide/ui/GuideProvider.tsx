/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { GuideKey, GuideList } from '../model/guide-storage'
import { defaultGuideList, markGuideComplete, readGuideList } from '../model/guide-storage'

type GuideContextValue = {
  guideList: GuideList
  activeGuide: GuideKey | null
  startGuide: (key: GuideKey, force?: boolean) => void
  finishGuide: (key: GuideKey) => void
  closeGuide: () => void
}

const GuideContext = createContext<GuideContextValue | null>(null)

export function GuideProvider({ children }: { children: ReactNode }) {
  const [guideList, setGuideList] = useState(readGuideList)
  const [activeGuide, setActiveGuide] = useState<GuideKey | null>(null)

  const startGuide = useCallback((key: GuideKey, force = false) => {
    const current = readGuideList()
    setGuideList(current)
    if (force || !current[key]) setActiveGuide(key)
  }, [])

  const finishGuide = useCallback((key: GuideKey) => {
    setGuideList(markGuideComplete(key))
    setActiveGuide(null)
  }, [])

  const value = useMemo(
    () => ({
      guideList,
      activeGuide,
      startGuide,
      finishGuide,
      closeGuide: () => setActiveGuide(null),
    }),
    [activeGuide, finishGuide, guideList, startGuide],
  )

  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>
}

export function useGuide() {
  const value = useContext(GuideContext)
  if (value) return value

  return {
    guideList: defaultGuideList,
    activeGuide: null,
    startGuide: () => undefined,
    finishGuide: () => undefined,
    closeGuide: () => undefined,
  } satisfies GuideContextValue
}
