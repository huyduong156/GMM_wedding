import { useDeferredValue, useMemo, useState } from 'react'
import {
  Check,
  EyeSlash,
  Heart,
  MagnifyingGlass,
  PushPin,
  Sparkle,
  X,
} from '@phosphor-icons/react'

type WishStatus = 'pending' | 'approved' | 'hidden'

type Wish = {
  id: number
  author: string
  relationship: string
  message: string
  receivedAt: string
  status: WishStatus
  pinned?: boolean
}

const initialWishes: Wish[] = [
  { id: 1, author: 'Nguyễn Hoàng Nam', relationship: 'Bạn chú rể', message: 'Chúc hai bạn luôn giữ được sự dịu dàng và tiếng cười như những ngày đầu. Hẹn gặp trong ngày vui nhé!', receivedAt: 'Hôm nay, 20:14', status: 'pending' },
  { id: 2, author: 'Trần Thu Hà', relationship: 'Đồng nghiệp cô dâu', message: 'Chúc Mai và Đức một hành trình mới thật nhiều yêu thương, bình an và những chuyến đi đáng nhớ.', receivedAt: 'Hôm nay, 18:02', status: 'pending' },
  { id: 3, author: 'Cô Lan', relationship: 'Họ nhà gái', message: 'Chúc hai con trăm năm hạnh phúc, luôn yêu thương và cùng nhau vun đắp một mái ấm bình yên.', receivedAt: 'Hôm qua, 21:40', status: 'approved', pinned: true },
  { id: 4, author: 'Minh Anh', relationship: 'Bạn đại học', message: 'Thật vui khi được chứng kiến câu chuyện của hai bạn bước sang một chương mới. Mãi hạnh phúc nha!', receivedAt: 'Hôm qua, 16:18', status: 'approved' },
  { id: 5, author: 'Khách ẩn danh', relationship: 'Từ website cưới', message: 'Chúc mừng ngày trọng đại của hai bạn.', receivedAt: '27/07, 09:32', status: 'hidden' },
]

const tabs = [
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'hidden', label: 'Đã ẩn' },
] as const

export function WishesPage() {
  const [wishes, setWishes] = useState(initialWishes)
  const [activeTab, setActiveTab] = useState<WishStatus>('pending')
  const [query, setQuery] = useState('')
  const [feedback, setFeedback] = useState('')
  const deferredQuery = useDeferredValue(query)

  const filteredWishes = useMemo(() => {
    const normalized = deferredQuery.trim().toLocaleLowerCase('vi')
    return wishes.filter((wish) => wish.status === activeTab && (!normalized || `${wish.author} ${wish.message}`.toLocaleLowerCase('vi').includes(normalized)))
  }, [activeTab, deferredQuery, wishes])

  const updateWish = (id: number, changes: Partial<Wish>, message: string) => {
    setWishes((current) => current.map((wish) => wish.id === id ? { ...wish, ...changes } : wish))
    setFeedback(message)
  }

  return (
    <section className="wishes-page" aria-labelledby="wishes-heading">
      <header className="wishes-heading">
        <div>
          <p className="breadcrumb">Mai & Đức <span>/</span> Lời chúc</p>
          <h1 id="wishes-heading">Lời chúc</h1>
          <p>Duyệt những lời nhắn sẽ xuất hiện trên website cưới của bạn.</p>
        </div>
        <div className="wishes-highlight" aria-label="Tổng số lời chúc đã nhận"><Heart size={18} weight="fill" /><span><strong>{wishes.length}</strong> lời chúc</span></div>
      </header>

      <div className="panel wishes-workspace">
        <div className="wishes-toolbar">
          <div className="wishes-tabs" role="tablist" aria-label="Trạng thái lời chúc">
            {tabs.map((tab) => {
              const count = wishes.filter((wish) => wish.status === tab.value).length
              return <button key={tab.value} type="button" role="tab" aria-selected={activeTab === tab.value} className={activeTab === tab.value ? 'is-active' : ''} onClick={() => setActiveTab(tab.value)}>{tab.label}<span>{count}</span></button>
            })}
          </div>
          <label className="wishes-search"><span className="sr-only">Tìm người gửi hoặc nội dung lời chúc</span><MagnifyingGlass size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm lời chúc" /></label>
        </div>

        <div className="wishes-list" role="tabpanel">
          {filteredWishes.length ? filteredWishes.map((wish) => (
            <article className={`wish-card ${wish.pinned ? 'is-pinned' : ''}`} key={wish.id}>
              <div className="wish-avatar" aria-hidden="true">{wish.author.split(' ').slice(-2).map((part) => part[0]).join('')}</div>
              <div className="wish-content">
                <header><div><strong>{wish.author}</strong><span>{wish.relationship} · {wish.receivedAt}</span></div>{wish.pinned ? <span className="pinned-label"><PushPin size={13} weight="fill" /> Đã ghim</span> : null}</header>
                <p>{wish.message}</p>
                <div className="wish-actions">
                  {wish.status !== 'approved' ? <button type="button" className="wish-action approve" onClick={() => updateWish(wish.id, { status: 'approved' }, `Đã duyệt lời chúc của ${wish.author}`)}><Check size={16} /> Duyệt</button> : null}
                  {wish.status === 'approved' ? <button type="button" className="wish-action" aria-pressed={Boolean(wish.pinned)} onClick={() => updateWish(wish.id, { pinned: !wish.pinned }, wish.pinned ? 'Đã bỏ ghim lời chúc' : 'Đã ghim lời chúc')}><PushPin size={16} /> {wish.pinned ? 'Bỏ ghim' : 'Ghim'}</button> : null}
                  {wish.status !== 'hidden' ? <button type="button" className="wish-action hide" onClick={() => updateWish(wish.id, { status: 'hidden', pinned: false }, `Đã ẩn lời chúc của ${wish.author}`)}><EyeSlash size={16} /> Ẩn</button> : <button type="button" className="wish-action" onClick={() => updateWish(wish.id, { status: 'pending' }, `Đã chuyển lời chúc của ${wish.author} về chờ duyệt`)}><Sparkle size={16} /> Khôi phục</button>}
                </div>
              </div>
            </article>
          )) : <div className="wishes-empty"><Sparkle size={28} /><h2>Không có lời chúc ở đây</h2><p>{query ? 'Thử tìm bằng từ khóa khác.' : 'Các lời chúc mới sẽ xuất hiện để bạn xem xét.'}</p>{query ? <button className="button button-secondary" type="button" onClick={() => setQuery('')}>Xóa tìm kiếm</button> : null}</div>}
        </div>
      </div>

      {feedback ? <div className="wishes-feedback" role="status"><Check size={16} /><span>{feedback}</span><button type="button" onClick={() => setFeedback('')} aria-label="Đóng thông báo"><X size={15} /></button></div> : null}
    </section>
  )
}
