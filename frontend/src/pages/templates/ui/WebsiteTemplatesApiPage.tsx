import { PencilSimple } from '@phosphor-icons/react'
import { TemplatesApiPage } from './TemplatesApiPage'
import { studioRoutes } from '../../../shared/config/routes'
import { AppLink } from '../../../shared/lib/navigation/AppLink'

export function WebsiteTemplatesApiPage() {
  return (
    <div className="website-themes-route">
      <div className="website-themes-edit-shortcut">
        <AppLink className="button button-primary" to={studioRoutes.siteEditor}>
          <PencilSimple size={16} /> Chỉnh sửa website
        </AppLink>
      </div>
      <TemplatesApiPage kind="website" />
    </div>
  )
}
