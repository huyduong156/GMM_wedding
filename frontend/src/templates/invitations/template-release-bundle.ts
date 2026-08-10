import type { TemplateReleaseBundle } from '../../shared/api/admin-templates'
import { chibiDaydreamTemplateConfig } from './chibi-daydream/template-config'
import { modernLuxeTemplateConfig } from './modern-luxe/template-config'
import { verdantPromiseTemplateConfig } from './verdant-promise/template-config'

const invitationConfigs = [modernLuxeTemplateConfig, verdantPromiseTemplateConfig, chibiDaydreamTemplateConfig]
const contractVersion = (value: string) => Number(value.split('.')[0])

export function createInvitationTemplateReleaseBundle(): TemplateReleaseBundle {
  return {
    bundleVersion: 1,
    generatedAt: new Date().toISOString(),
    sourceRevision: `frontend:${invitationConfigs.map((config) => `${config.templateKey}@${config.templateVersion}`).join(',')}`,
    templates: invitationConfigs.map((config) => ({
      templateKey: config.templateKey,
      displayName: config.displayName,
      productType: 'ONLINE_INVITATION',
      templateVersion: config.templateVersion,
      templateConfigVersion: contractVersion(config.templateConfigVersion),
      contentSchemaVersion: contractVersion(config.contentSchemaVersion),
      rendererApiVersion: contractVersion(config.rendererApiVersion),
      config: { palettes: config.palettes, sections: config.sections },
    })),
  }
}
