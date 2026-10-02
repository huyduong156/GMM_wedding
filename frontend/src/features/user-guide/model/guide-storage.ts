export type GuideKey =
  | 'started'
  | 'invitation_template'
  | 'wedding_template'
  | 'recap_template'
  | 'invite_member'
  | 'guest'

export type GuideList = Record<GuideKey, boolean>

export const defaultGuideList: GuideList = {
  started: false,
  invitation_template: false,
  wedding_template: false,
  recap_template: false,
  invite_member: false,
  guest: false,
}

export const GUIDE_STORAGE_KEY = 'gmm-guide-list'

export function readGuideList(): GuideList {
  if (typeof window === 'undefined') return defaultGuideList

  try {
    const raw = window.localStorage.getItem(GUIDE_STORAGE_KEY)
    if (!raw) {
      writeGuideList(defaultGuideList)
      return defaultGuideList
    }

    return { ...defaultGuideList, ...JSON.parse(raw) } as GuideList
  } catch {
    writeGuideList(defaultGuideList)
    return defaultGuideList
  }
}

export function writeGuideList(value: GuideList) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(GUIDE_STORAGE_KEY, JSON.stringify(value))
  }
}

export function markGuideComplete(key: GuideKey): GuideList {
  const next = { ...readGuideList(), [key]: true }
  writeGuideList(next)
  return next
}
