import { ArrowLeft, House, LockKey, Warning, WarningCircle } from '@phosphor-icons/react'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { marketingRoutes, statusRoutes, studioRoutes } from '../../../shared/config/routes'

type StatusKind = 'unauthorized' | 'forbidden' | 'not-found' | 'server-error'
type StatusIcon = typeof LockKey
const content: Record<StatusKind, { code: string; title: string; description: string; Icon: StatusIcon }> = {
  unauthorized: { code: '401', title: 'Bạn cần đăng nhập để tiếp tục', description: 'Phiên làm việc chưa sẵn sàng hoặc đã hết hạn. Hãy đăng nhập lại để truy cập nội dung này.', Icon: LockKey },
  forbidden: { code: '403', title: 'Bạn không có quyền truy cập', description: 'Tài khoản hiện tại không được phép xem hoặc thực hiện thao tác này.', Icon: LockKey },
  'not-found': { code: '404', title: 'Không tìm thấy trang', description: 'Đường dẫn này không tồn tại hoặc nội dung đã được chuyển sang một nơi khác.', Icon: WarningCircle },
  'server-error': { code: '500', title: 'Đã có lỗi xảy ra', description: 'Hệ thống gặp sự cố khi tải trang. Bạn có thể thử lại hoặc quay về studio.', Icon: Warning },
}
export function StatusPage({ kind = 'not-found', onRetry }: { kind?: StatusKind; onRetry?: () => void }) {
  const item = content[kind]
  const home = kind === 'unauthorized' ? marketingRoutes.login : studioRoutes.home
  const homeLabel = kind === 'unauthorized' ? 'Đăng nhập' : 'Về studio'
  return <main className="status-page" aria-labelledby="status-page-title"><div className="status-page-card"><div className="status-page-icon"><item.Icon size={32} weight="duotone" /></div><span className="status-page-code">{item.code}</span><h1 id="status-page-title">{item.title}</h1><p>{item.description}</p><div className="status-page-actions">{onRetry ? <button className="button button-primary" type="button" onClick={onRetry}>Thử lại</button> : null}<AppLink className={onRetry ? 'button button-secondary' : 'button button-primary'} to={home}><House size={16} />{homeLabel}</AppLink>{kind !== 'unauthorized' ? <AppLink className="status-page-back" to={marketingRoutes.home}><ArrowLeft size={15} /> Trang chủ</AppLink> : null}</div></div></main>
}
export const statusPathToKind: Record<string, StatusKind> = { [statusRoutes.unauthorized]: 'unauthorized', [statusRoutes.forbidden]: 'forbidden', [statusRoutes.notFound]: 'not-found', [statusRoutes.serverError]: 'server-error' }