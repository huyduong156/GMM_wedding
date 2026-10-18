import ts from 'typescript'
import { describe, expect, it } from 'vitest'

const sources = import.meta.glob<string>(
  ['./invitations/**/*.tsx', './websites/**/*.tsx', './recaps/**/*.tsx'],
  { query: '?raw', import: 'default', eager: true },
)

describe('countdown render ownership across templates', () => {
  for (const [path, source] of Object.entries(sources)) {
    if (path.includes('.test.')) continue
    const ast = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    const roots = ast.statements.filter(
      (node): node is ts.FunctionDeclaration =>
        ts.isFunctionDeclaration(node) &&
        Boolean(node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)),
    )

    for (const root of roots) {
      it(`${path}: ${root.name?.text} does not own countdown ticks`, () => {
        const violations: string[] = []
        const inspect = (node: ts.Node) => {
          if (ts.isCallExpression(node)) {
            const callee = node.expression.getText(ast)
            if (/^(useWeddingCountdown|useCountdown|setCountdown\w*|setTick|setNow|setRemaining|setLeft)$/.test(callee)) {
              violations.push(callee)
            }
          }
          ts.forEachChild(node, inspect)
        }
        if (root.body) inspect(root.body)
        expect(violations).toEqual([])
      })
    }
  }
})
