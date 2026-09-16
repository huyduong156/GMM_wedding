import { UsersThree } from '@phosphor-icons/react'
import { activeWedding as fallbackWedding } from '../../../entities/wedding/model/active-wedding'
import { useOptionalWeddingWorkspace } from '../../../entities/wedding/model/wedding-context'
import { WorkspaceMembersSection } from '../../wedding-settings/ui/WorkspaceMembersSection'

export function WorkspaceMembersPage() {
  const activeWedding = useOptionalWeddingWorkspace()?.activeWedding ?? fallbackWedding

  return (
    <div className="wedding-page workspace-members-page">
      <header className="workspace-page-heading">
        <div>
          <p className="eyebrow">Vận hành</p>
          <h1>Thành viên Wedding</h1>
          <p>Quản lý những người cùng vận hành Wedding, quyền truy cập và các link tham gia đang chờ.</p>
        </div>
        <UsersThree size={34} aria-hidden="true" />
      </header>
      <WorkspaceMembersSection key={activeWedding.id} weddingId={activeWedding.id} />
    </div>
  )
}
