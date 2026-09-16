import { createContext, useContext } from 'react'
import type { Wedding, WeddingMemberRole } from '../../../shared/api/weddings'

export type WeddingContextValue = {
  weddings: Wedding[]
  activeWedding: Wedding | null
  activeRole: WeddingMemberRole | null
  rolesByWedding: Record<string, WeddingMemberRole>
  loading: boolean
  error: string | null
  selectWedding(id: string): void
  refresh(): Promise<void>
  addWedding(wedding: Wedding): void
  replaceWedding(wedding: Wedding): void
  removeWedding(id: string): void
}

export const WeddingContext = createContext<WeddingContextValue | null>(null)
export function useWeddingWorkspace() {
  const value = useContext(WeddingContext)
  if (!value) throw new Error('useWeddingWorkspace must be used inside WeddingProvider')
  return value
}
export function useOptionalWeddingWorkspace() {
  return useContext(WeddingContext)
}
