import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { weddingApi, type Wedding } from '../../../shared/api/weddings'
import { WeddingContext } from './wedding-context'

const storageKey = 'gmm-active-wedding-id'

export function WeddingProvider({ children }: { children: ReactNode }) {
  const [weddings, setWeddings] = useState<Wedding[]>([])
  const [activeId, setActiveId] = useState(() => localStorage.getItem(storageKey))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const refresh = useCallback(async () => {
    setError(null)
    try {
      const result = await weddingApi.list()
      setWeddings(result.items)
      setActiveId((current) => result.items.some((item) => item.id === current) ? current : result.items[0]?.id ?? null)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Không thể tải không gian cưới.') }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { void refresh() }, [refresh])
  useEffect(() => { if (activeId) localStorage.setItem(storageKey, activeId); else localStorage.removeItem(storageKey) }, [activeId])
  const value = useMemo(() => ({
    weddings, activeWedding: weddings.find((item) => item.id === activeId) ?? null, loading, error,
    selectWedding: setActiveId, refresh,
    addWedding: (wedding: Wedding) => { setWeddings((items) => [wedding, ...items]); setActiveId(wedding.id) },
    replaceWedding: (wedding: Wedding) => setWeddings((items) => items.map((item) => item.id === wedding.id ? wedding : item)),
    removeWedding: (id: string) => setWeddings((items) => { const next = items.filter((item) => item.id !== id); setActiveId(next[0]?.id ?? null); return next }),
  }), [activeId, error, loading, refresh, weddings])
  return <WeddingContext.Provider value={value}>{children}</WeddingContext.Provider>
}
