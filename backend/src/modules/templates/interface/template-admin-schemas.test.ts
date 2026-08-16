import { describe, expect, it } from 'vitest'
import { templateConfigHash } from '../application/template-admin-service'
import { templateReleaseBundleSchema } from './template-admin-schemas'

const validBundle = { bundleVersion: 1, generatedAt: '2026-08-10T00:00:00.000Z', sourceRevision: 'abc123', templates: [{ templateKey: 'elan-amour', displayName: 'Élan d’Amour', productType: 'ONLINE_INVITATION', templateVersion: '1.0.0', sourceStatus: 'READY', templateConfigVersion: 1, contentSchemaVersion: 1, rendererApiVersion: 1, config: { sections: [{ key: 'hero' }] } }] } as const

describe('templateReleaseBundleSchema', () => {
  it('accepts a release bundle', () => { expect(templateReleaseBundleSchema.parse(validBundle).templates).toHaveLength(1) })
  it('rejects duplicate template versions', () => { expect(() => templateReleaseBundleSchema.parse({ ...validBundle, templates: [validBundle.templates[0], validBundle.templates[0]] })).toThrow() })
  it('uses a deterministic config hash', () => { expect(templateConfigHash({ b: 2, a: { d: 4, c: 3 } })).toBe(templateConfigHash({ a: { c: 3, d: 4 }, b: 2 })) })
})
