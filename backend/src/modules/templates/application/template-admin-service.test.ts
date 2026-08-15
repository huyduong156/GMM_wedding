import { describe, expect, it } from 'vitest'
import { templateCompatibility } from './template-admin-service'

describe('templateCompatibility', () => {
  it('accepts the currently supported contracts', () => {
    expect(templateCompatibility({ templateConfigVersion: 1, contentSchemaVersion: 1, rendererApiVersion: 1, config: { sections: ['hero'] } })).toMatchObject({ compatible: true, issues: [] })
  })

  it('reports every incompatible contract before release', () => {
    const result = templateCompatibility({ templateConfigVersion: 2, contentSchemaVersion: 3, rendererApiVersion: 4, config: [] })
    expect(result.compatible).toBe(false)
    expect(result.issues).toHaveLength(4)
  })
})
