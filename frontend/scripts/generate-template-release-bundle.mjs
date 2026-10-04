import { createHash } from 'node:crypto'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const frontendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = path.join(frontendRoot, 'src', 'templates')
const outputFile = path.join(frontendRoot, 'public', 'template-release-bundle.json')

const readField = (source, field) =>
  source.match(new RegExp(`${field}\\s*:\\s*['"]([^'"]+)['"]`))?.[1] ?? null
const readNumberField = (source, field) =>
  Number(readField(source, field) ?? source.match(new RegExp(`${field}\\s*:\\s*(\\d+)`))?.[1] ?? 0)

function matchingArray(source, start) {
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
    if (character === '"' || character === "'") {
      quote = character
      continue
    }
    if (character === '[') depth += 1
    if (character === ']') {
      depth -= 1
      if (depth === 0) return source.slice(open, index + 1)
    }
  }
  return null
}

const unique = (keys) => [...new Set(keys.filter(Boolean))].map((sectionKey) => ({ sectionKey }))
const stringLiterals = (value) =>
  [...value.matchAll(/['"]([^'"\n]+)['"]/g)].flatMap((match) => (match[1] ? [match[1]] : []))
const firstTupleValues = (value) =>
  [...value.matchAll(/(?:\[|,)\s*\[\s*['"]([^'"\n]+)['"]/g)].flatMap((match) =>
    match[1] ? [match[1]] : [],
  )
const mappedArrayNames = (value) =>
  [...value.matchAll(/\b([A-Za-z_$][\w$]*)\.map\s*\(/g)].flatMap((match) =>
    match[1] ? [match[1]] : [],
  )

function declaredArray(source, name) {
  const declaration = new RegExp(`(?:const|let|var)\\s+${name}\\s*=\\s*`).exec(source)
  return declaration ? matchingArray(source, declaration.index + declaration[0].length) : null
}

function readSectionKeys(source) {
  const configuredKeys = [...source.matchAll(/\bsectionKey\s*:\s*['"]([^'"\n]+)['"]/g)].map(
    (match) => match[1],
  )
  if (configuredKeys.length) return unique(configuredKeys)

  const declaredSections = declaredArray(source, 'sections')
  const propertyMatches = [...source.matchAll(/\bsections\s*:\s*/g)]
  const property = propertyMatches.at(-1)
  const propertyValueStart = property ? property.index + property[0].length : -1
  const mappedName = property
    ? source.slice(propertyValueStart).match(/^([A-Za-z_$][\w$]*)\s*(?:\.map\s*\()?/)?.[1]
    : null
  const array =
    declaredSections ??
    (mappedName
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

async function configFiles(directory, rootDirectory = directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const absolute = path.join(directory, entry.name)
      if (entry.isDirectory()) return configFiles(absolute, rootDirectory)
      return directory !== rootDirectory && entry.name === 'template-config.ts' ? [absolute] : []
    }),
  )
  return nested.flat()
}

const sha256 = (value) => createHash('sha256').update(value).digest('hex')
const withoutLifecycleStatus = (source) =>
  source.replace(/\bstatus\s*:\s*(['"])[^'"]+\1/, "status: '__LIFECYCLE_STATUS__'")

export async function generateTemplateReleaseBundle() {
  const files = (await configFiles(sourceRoot)).sort()
  if (!files.length) throw new Error(`No template-config.ts files found in ${sourceRoot}`)
  const scanned = await Promise.all(
    files.map(async (file) => {
      const source = await readFile(file, 'utf8')
      const templateKey = readField(source, 'templateKey')
      const displayName = readField(source, 'displayName')
      const templateVersion = readField(source, 'templateVersion')
      if (!templateKey || !displayName || !templateVersion)
        throw new Error(`Template metadata is incomplete: ${file}`)
      const sections = readSectionKeys(source)
      if (!sections.length) throw new Error(`Template sections are missing: ${file}`)
      const rawSourceStatus = (readField(source, 'status') ?? 'review').toUpperCase()
      const sourceStatus = rawSourceStatus === 'DRAFT' ? 'DEVELOPMENT' : rawSourceStatus
      const previewPath = readField(source, 'previewPath')
      const type = readField(source, 'type')
      const rawProductType =
        readField(source, 'productType') ??
        (type === 'website' ? 'WEDDING_WEBSITE' : type === 'recap' ? 'RECAP' : 'ONLINE_INVITATION')
      const productType = rawProductType === 'WEDDING_RECAP' ? 'RECAP' : rawProductType
      return {
        sourceStatus,
        templateKey,
        displayName,
        productType,
        templateVersion,
        templateConfigVersion: readNumberField(source, 'templateConfigVersion'),
        contentSchemaVersion: readNumberField(source, 'contentSchemaVersion'),
        rendererApiVersion: readNumberField(source, 'rendererApiVersion'),
        description: readField(source, 'description'),
        config: {
          sections,
          sourceFile: path.relative(sourceRoot, file).replaceAll(path.sep, '/'),
          sourceHash: sha256(source),
          sourceContentHash: sha256(withoutLifecycleStatus(source)),
          ...(previewPath ? { previewPath } : {}),
        },
        source,
      }
    }),
  )
  const releasable = scanned.filter((template) => template.sourceStatus !== 'DEVELOPMENT')
  if (!releasable.length) throw new Error('No reviewable template versions found')
  const identities = new Set()
  for (const template of releasable) {
    const identity = `${template.templateKey}@${template.templateVersion.split('.')[0]}`
    if (identities.has(identity)) throw new Error(`Duplicate template major version: ${identity}`)
    identities.add(identity)
    if (!['DEVELOPMENT', 'REVIEW', 'READY', 'DEPRECATED'].includes(template.sourceStatus))
      throw new Error(`Invalid source status for ${identity}: ${template.sourceStatus}`)
    if (
      ![
        template.templateConfigVersion,
        template.contentSchemaVersion,
        template.rendererApiVersion,
      ].every((value) => Number.isInteger(value) && value > 0)
    )
      throw new Error(`Invalid contract version for ${identity}`)
  }
  return {
    bundleVersion: 1,
    generatedAt: new Date().toISOString(),
    sourceRevision: sha256(releasable.map((item) => item.source).join('\n')).slice(0, 64),
    templates: releasable.map(({ source, ...template }) => {
      void source
      return template
    }),
  }
}

export async function writeTemplateReleaseBundle() {
  const bundle = await generateTemplateReleaseBundle()
  await mkdir(path.dirname(outputFile), { recursive: true })
  await writeFile(outputFile, `${JSON.stringify(bundle, null, 2)}\n`, 'utf8')
  console.log(
    `Generated ${path.relative(frontendRoot, outputFile)} with ${bundle.templates.length} templates.`,
  )
  return bundle
}

const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : null
if (invokedFile === fileURLToPath(import.meta.url)) await writeTemplateReleaseBundle()
