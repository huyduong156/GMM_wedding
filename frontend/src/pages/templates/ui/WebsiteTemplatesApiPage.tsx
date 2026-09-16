import { PencilSimple } from '@phosphor-icons/react'
import { TemplatesApiPage } from './TemplatesApiPage'
import { studioRoutes } from '../../../shared/config/routes'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { useOptionalWeddingWorkspace } from '../../../entities/wedding/model/wedding-context'

export function WebsiteTemplatesApiPage() {
  const workspace = useOptionalWeddingWorkspace()
  const canEdit = workspace?.activeRole === 'OWNER' || workspace?.activeRole === 'EDITOR'
  return (
    <div className="website-themes-route">
      {canEdit ? <div className="website-themes-edit-shortcut">
        <AppLink className="button button-primary" to={studioRoutes.siteEditor}>
          <PencilSimple size={16} /> Chỉnh sửa website
        </AppLink>
      </div> : null}
      <TemplatesApiPage kind="website" />
    </div>
  )
}
