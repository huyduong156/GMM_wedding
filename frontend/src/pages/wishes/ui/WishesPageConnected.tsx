import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Check, EyeSlash, Heart, MagnifyingGlass, PushPin, Sparkle, X } from '@phosphor-icons/react'
import { useOptionalWeddingWorkspace } from '../../../entities/wedding/model/wedding-context'
import { wishApi, type Wish, type WishStatus } from '../../../shared/api/weddings'
import { WishesPage } from './WishesPage'

type WishTab = 'pending' | 'approved' | 'hidden'
const tabs: Array<{ value: WishTab; label: string }> = [
  { value: 'pending', label: 'Chờ duyệt' }, { value: 'approved', label: 'Đã duyệt' }, { value: 'hidden', label: 'Đã ẩn' },
]
const toTab = (status: WishStatus): WishTab => status === 'APPROVED' ? 'approved' : status === 'PENDING' ? 'pending' : 'hidden'
const toDate = (value: string) => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
const initials = (name: string) => name.split(' ').filter(Boolean).slice(-2).map((part) => part[0]).join('').toUpperCase() || '♡'

export function WishesPageConnected() {
  const workspace = useOptionalWeddingWorkspace()
  if (!workspace) return <WishesPage />
  return <WishesContent activeWedding={workspace.activeWedding} />
}

function WishesContent({ activeWedding }: { activeWedding: { id: string; name: string } | null }) {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [activeTab, setActiveTab] = useState<WishTab>('pending')
  const [query, setQuery] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const deferredQuery = useDeferredValue(query)

  const load = async () => {
    if (!activeWedding) { setWishes([]); setLoading(false); return }
    setLoading(true); setError('')
    try {
      const result = await wishApi.list(activeWedding.id, { q: deferredQuery.trim() || undefined, limit: 100 })
      setWishes(result.items)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Không thể tải lời chúc.') }
    finally { setLoading(false) }
  }
  // The selected wedding and search query define the refresh boundary.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void load() }, [activeWedding?.id, deferredQuery])

  const counts = useMemo(() => ({
    total: wishes.length,
    pending: wishes.filter((wish) => toTab(wish.status) === 'pending').length,
    approved: wishes.filter((wish) => toTab(wish.status) === 'approved').length,
    hidden: wishes.filter((wish) => toTab(wish.status) === 'hidden').length,
  }), [wishes])
  const visibleWishes = wishes.filter((wish) => toTab(wish.status) === activeTab)
  const moderate = async (wish: Wish, input: { status?: WishStatus; isPinned?: boolean }, message: string) => {
    if (!activeWedding) return
    try {
      const result = await wishApi.moderate(activeWedding.id, wish.id, input)
      setWishes((current) => current.map((item) => item.id === wish.id ? result.wish : item))
      setFeedback(message)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Không thể cập nhật lời chúc.') }
  }

  return <section className="wishes-page" aria-labelledby="wishes-heading">
    <header className="wishes-heading"><div><p className="breadcrumb">{activeWedding?.name ?? 'Đám cưới'} <span>/</span> Lời chúc</p><h1 id="wishes-heading">Lời chúc</h1><p>Duyệt những lời nhắn sẽ xuất hiện trên website cưới của bạn.</p></div><div className="wishes-highlight" aria-label="Tổng số lời chúc đã nhận"><Heart size={18} weight="fill" /><span><strong>{counts.total}</strong> lời chúc</span></div></header>
    <div className="panel wishes-workspace">
      <div className="wishes-toolbar"><div className="wishes-tabs" role="tablist" aria-label="Trạng thái lời chúc">{tabs.map((tab) => <button key={tab.value} type="button" role="tab" aria-selected={activeTab === tab.value} className={activeTab === tab.value ? 'is-active' : ''} onClick={() => setActiveTab(tab.value)}>{tab.label}<span>{counts[tab.value]}</span></button>)}</div><label className="wishes-search"><span className="sr-only">Tìm người gửi hoặc nội dung lời chúc</span><MagnifyingGlass size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm lời chúc" /></label></div>
      {loading ? <div className="wishes-empty"><Sparkle size={28} /><h2>Đang tải lời chúc…</h2></div> : error ? <div className="wishes-empty"><X size={28} /><h2>Không thể tải lời chúc</h2><p>{error}</p><button className="button button-secondary" type="button" onClick={() => void load()}>Thử lại</button></div> : <div className="wishes-list" role="tabpanel">
        {visibleWishes.length ? visibleWishes.map((wish) => { const author = wish.guestName || wish.authorName || 'Khách mời'; const isApproved = wish.status === 'APPROVED'; const isHidden = toTab(wish.status) === 'hidden'; return <article className={`wish-card ${wish.isPinned ? 'is-pinned' : ''}`} key={wish.id}><div className="wish-avatar" aria-hidden="true">{initials(author)}</div><div className="wish-content"><header><div><strong>{author}</strong><span>{wish.authorName !== author ? wish.authorName : 'Khách mời'} · {toDate(wish.submittedAt)}</span></div>{wish.isPinned ? <span className="pinned-label"><PushPin size={13} weight="fill" /> Đã ghim</span> : null}</header><p>{wish.content}</p><div className="wish-actions">{!isApproved && !isHidden ? <button type="button" className="wish-action approve" onClick={() => void moderate(wish, { status: 'APPROVED' }, `Đã duyệt lời chúc của ${author}`)}><Check size={16} /> Duyệt</button> : null}{isApproved ? <button type="button" className="wish-action" aria-pressed={wish.isPinned} onClick={() => void moderate(wish, { isPinned: !wish.isPinned }, wish.isPinned ? 'Đã bỏ ghim lời chúc' : 'Đã ghim lời chúc')}><PushPin size={16} /> {wish.isPinned ? 'Bỏ ghim' : 'Ghim'}</button> : null}{!isHidden ? <button type="button" className="wish-action hide" onClick={() => void moderate(wish, { status: 'HIDDEN', isPinned: false }, `Đã ẩn lời chúc của ${author}`)}><EyeSlash size={16} /> Ẩn</button> : <button type="button" className="wish-action" onClick={() => void moderate(wish, { status: 'PENDING' }, `Đã chuyển lời chúc của ${author} về chờ duyệt`)}><Sparkle size={16} /> Khôi phục</button>}</div></div></article> }) : <div className="wishes-empty"><Sparkle size={28} /><h2>Không có lời chúc ở đây</h2><p>{query ? 'Thử tìm bằng từ khóa khác.' : 'Các lời chúc mới sẽ xuất hiện để bạn xem xét.'}</p>{query ? <button className="button button-secondary" type="button" onClick={() => setQuery('')}>Xóa tìm kiếm</button> : null}</div>}
      </div>}
    </div>
    {feedback ? <div className="wishes-feedback" role="status"><Check size={16} /><span>{feedback}</span><button type="button" onClick={() => setFeedback('')} aria-label="Đóng thông báo"><X size={15} /></button></div> : null}
  </section>
}