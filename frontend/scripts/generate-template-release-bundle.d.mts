export type GeneratedTemplateReleaseBundle = {
  bundleVersion: 1
  generatedAt: string
  sourceRevision: string
  templates: Array<Record<string, unknown>>
}

export function generateTemplateReleaseBundle(): Promise<GeneratedTemplateReleaseBundle>
export function writeTemplateReleaseBundle(): Promise<GeneratedTemplateReleaseBundle>
