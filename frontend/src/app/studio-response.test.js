import { describe, expect, it } from 'vitest'
import postcss from 'postcss'
import { readFileSync } from 'node:fs'

const styles = readFileSync('src/app/styles/index.css', 'utf8')

describe('studio interaction motion budget', () => {
  it('does not add entrance delays to arbitrary page descendants', () => {
    const css = postcss.parse(styles)
    const violations = []
    css.walkRules((rule) => {
      if (!rule.selector.includes('.main-content')) return
      rule.walkDecls(/^animation/, (declaration) => {
        if (/\.main-content\s*>\s*\*\s*>/.test(rule.selector)) {
          violations.push(rule.selector)
        }
        if (declaration.prop === 'animation-delay' && declaration.value !== '0ms') {
          violations.push(declaration.toString())
        }
      })
    })
    expect(violations).toEqual([])
    expect(styles).toContain('animation: studio-page-enter 160ms ease-out;')
  })
})
