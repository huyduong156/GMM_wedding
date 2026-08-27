import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import type { TemplateReleaseBundle } from '../interface/template-admin-schemas'

const sourceRoot = () => process.env.TEMPLATE_SOURCE_ROOT ? path.resolve(process.env.TEMPLATE_SOURCE_ROOT) : path.resolve(process.cwd(), '..', 'frontend', 'src', 'templates')
const readField = (source: string, field: string) => source.match(new RegExp(`${field}\\s*:\\s*['\"]([^'\"]+)['\"]`))?.[1] ?? null
const readNumberField = (source: string, field: string) => Number(readField(source, field) ?? source.match(new RegExp(`${field}\\s*:\\s*(\\d+)`))?.[1] ?? 0)
function matchingArray(source: string, start: number) {
  const open = source.indexOf('[', start)
  if (open < 0) return null
  let depth = 0
  let quote = ''
  let escaped = false
  for (let index = open; index < source.length; index += 1) {
    const character = source[index]
    if (quote) {
      if (escaped) escaped = false
      else if (character === '\\') escaped = true
      else if (character === quote) quote = ''
      continue
    }
    if (character === '"' || character === "'") { quote = character; continue }
    if (character === '[') depth += 1
    if (character === ']') {
      depth -= 1
      if (depth === 0) return source.slice(open, index + 1)
    }
  }
  return null
}

const unique = (keys: Array<string | undefined>) => [...new Set(keys.filter((key): key is string => Boolean(key)))].map((sectionKey) => ({ sectionKey }))
const stringLiterals = (value: string) => [...value.matchAll(/['"]([^'"\n]+)['"]/g)].flatMap((match) => match[1] ? [match[1]] : [])
const firstTupleValues = (value: string) => [...value.matchAll(/(?:\[|,)\s*\[\s*['"]([^'"\n]+)['"]/g)].flatMap((match) => match[1] ? [match[1]] : [])
const mappedArrayNames = (value: string) => [...value.matchAll(/\b([A-Za-z_$][\w$]*)\.map\s*\(/g)].flatMap((match) => match[1] ? [match[1]] : [])
function declaredArray(source: string, name: string) {
  const declaration = new RegExp(`(?:const|let|var)\\s+${name}\\s*=\\s*`).exec(source)
  return declaration ? matchingArray(source, declaration.index + declaration[0].length) : null
}

export function readSectionKeys(source: string) {
  const configuredKeys = [...source.matchAll(/\bsectionKey\s*:\s*['"]([^'"\n]+)['"]/g)].map((match) => match[1])
  if (configuredKeys.length) return unique(configuredKeys)

  const declaredSections = declaredArray(source, 'sections')
  const propertyMatches = [...source.matchAll(/\bsections\s*:\s*/g)]
  const property = propertyMatches.at(-1)
  const propertyValueStart = property ? property.index + property[0].length : -1
  const mappedName = property ? source.slice(propertyValueStart).match(/^([A-Za-z_$][\w$]*)\s*(?:\.map\s*\()?/)?.[1] : null
  const array = declaredSections ?? (mappedName
    ? declaredArray(source, mappedName)
      : property
      ? matchingArray(source, propertyValueStart)
      : null)
  if (!array) return []
  const spreadMapKeys = mappedArrayNames(array).flatMap((name) => {
    const mappedArray = declaredArray(source, name)
    return mappedArray ? stringLiterals(mappedArray) : []
  })
  if (spreadMapKeys.length) return unique(spreadMapKeys)
  const tupleKeys = firstTupleValues(array)
  return unique(tupleKeys.length ? tupleKeys : stringLiterals(array))
}
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
    const sections = readSectionKeys(source)
    if (!sections.length) throw new Error(`Template sections are missing: ${file}`)
    const sourceStatus = (readField(source, 'status') ?? 'review').toUpperCase()
    const previewPath = readField(source, 'previewPath'); const type = readField(source, 'type'); const rawProductType = readField(source, 'productType') ?? (type === 'website' ? 'WEDDING_WEBSITE' : type === 'recap' ? 'RECAP' : 'ONLINE_INVITATION'); const productType = rawProductType === 'WEDDING_RECAP' ? 'RECAP' : rawProductType
    return { sourceStatus: sourceStatus as 'DEVELOPMENT' | 'REVIEW' | 'READY' | 'DEPRECATED', templateKey, displayName, productType: productType as 'ONLINE_INVITATION' | 'WEDDING_WEBSITE' | 'RECAP', templateVersion, templateConfigVersion: readNumberField(source, 'templateConfigVersion'), contentSchemaVersion: readNumberField(source, 'contentSchemaVersion'), rendererApiVersion: readNumberField(source, 'rendererApiVersion'), description: readField(source, 'description'), config: { sections, sourceFile: path.relative(root, file).replaceAll(path.sep, '/'), sourceHash: createHash('sha256').update(source).digest('hex'), ...(previewPath ? { previewPath } : {}) }, source }
  })).then((items) => items.filter((item): item is NonNullable<typeof item> => item !== null))
  const sourceRevision = createHash('sha256').update(scanned.map((item) => item.source).join('\n')).digest('hex').slice(0, 64)
  return {
    bundleVersion: 1,
    generatedAt: new Date().toISOString(),
    sourceRevision,
    templates: scanned.map((item) => {
      const { source, ...template } = item
      void source
      return template
    }),
  }
}

