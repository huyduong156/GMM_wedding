import { createHash } from 'node:crypto'
import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import type { TemplateReleaseBundle } from '../interface/template-admin-schemas'

const sourceRoot = () => process.env.TEMPLATE_SOURCE_ROOT ? path.resolve(process.env.TEMPLATE_SOURCE_ROOT) : path.resolve(process.cwd(), '..', 'frontend', 'src', 'templates')
const readField = (source: string, field: string) => source.match(new RegExp(`${field}\\s*:\\s*['\"]([^'\"]+)['\"]`))?.[1] ?? null
const readNumberField = (source: string, field: string) => Number(readField(source, field) ?? source.match(new RegExp(`${field}\\s*:\\s*(\\d+)`))?.[1] ?? 0)
const knownSectionKeys = ['navigation', 'hero', 'announcement', 'couple', 'story', 'events', 'countdown', 'venues', 'gallery', 'schedule', 'weddingParty', 'dressCode', 'travel', 'faq', 'rsvp', 'guestbook', 'gift', 'footer', 'music'] as const
const readSectionKeys = (source: string) => knownSectionKeys.filter((sectionKey) => new RegExp(`["']${sectionKey}["']`).test(source)).map((sectionKey) => ({ sectionKey }))
async function configFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map(async (entry) => { const absolute = path.join(directory, entry.name); if (entry.isDirectory()) return configFiles(absolute); return entry.name === 'template-config.ts' ? [absolute] : [] }))
  return nested.flat()
}

export async function scanTemplateSource(): Promise<TemplateReleaseBundle> {
  const root = sourceRoot(); const files = (await configFiles(root)).sort()
  if (!files.length) throw new Error(`No template-config.ts files found in ${root}`)
  const scanned = await Promise.all(files.map(async (file) => {
    const source = await readFile(file, 'utf8'); const templateKey = readField(source, 'templateKey'); const displayName = readField(source, 'displayName'); const templateVersion = readField(source, 'templateVersion')
    if (!templateKey || !displayName || !templateVersion) throw new Error(`Template metadata is incomplete: ${file}`)
    const previewPath = readField(source, 'previewPath'); const type = readField(source, 'type'); const productType = readField(source, 'productType') ?? (type === 'website' ? 'WEDDING_WEBSITE' : type === 'recap' ? 'RECAP' : 'ONLINE_INVITATION')
    return { templateKey, displayName, productType: productType as 'ONLINE_INVITATION' | 'WEDDING_WEBSITE' | 'RECAP', templateVersion, templateConfigVersion: readNumberField(source, 'templateConfigVersion'), contentSchemaVersion: readNumberField(source, 'contentSchemaVersion'), rendererApiVersion: readNumberField(source, 'rendererApiVersion'), description: readField(source, 'description'), config: { sections: readSectionKeys(source), sourceFile: path.relative(root, file).replaceAll(path.sep, '/'), sourceHash: createHash('sha256').update(source).digest('hex'), ...(previewPath ? { previewPath } : {}) }, source }
  }))
  const sourceRevision = createHash('sha256').update(scanned.map((item) => item.source).join('\n')).digest('hex').slice(0, 64)
  return { bundleVersion: 1, generatedAt: new Date().toISOString(), sourceRevision, templates: scanned.map(({ source: _source, ...template }) => template) }
}

