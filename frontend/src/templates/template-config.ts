import type { TemplateFieldConfig, TemplateSectionConfig } from '../shared/api/weddings'

export type TemplateConfig = {
  templateKey: string
  displayName: string
  productType?: 'ONLINE_INVITATION' | 'WEDDING_WEBSITE' | 'WEDDING_RECAP'
  templateVersion: string
  templateConfigVersion: number | string
  contentSchemaVersion: number | string
  rendererApiVersion: number | string
  status: string
  type: 'invitation' | 'website' | 'recap' | string
  previewPath: string
  palettes?: readonly { key: string; label: string; default?: boolean }[]
  sections: readonly TemplateSectionConfig[]
  [key: string]: unknown
}

export type { TemplateFieldConfig, TemplateSectionConfig }
