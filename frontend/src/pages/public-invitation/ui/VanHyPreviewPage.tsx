import { VanHyInvitation } from '../../../templates/invitations/van-hy/VanHyInvitation'
import { vanHyFixture } from '../../../templates/invitations/van-hy/fixture'
import { vanHyTemplateConfig } from '../../../templates/invitations/van-hy/template-config'

export function VanHyPreviewPage() {
  return <VanHyInvitation data={vanHyFixture} sectionConfig={{ enabled: vanHyTemplateConfig.sections.map((section) => section.sectionKey), order: vanHyTemplateConfig.sections.map((section) => section.sectionKey) }} />
}
