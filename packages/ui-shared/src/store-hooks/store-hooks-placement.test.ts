/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { expect, test } from 'vitest'

/**
 * Placement guardrail for the store hooks.
 *
 * Every memoisation bug in these hooks came from a `createSelector` built inside a render body:
 * the cache is born empty and dies at the end of the call, so the selector memoises nothing,
 * and a per-render empty-array constant makes the "no data" branch unstable.
 * `oxlint` does not implement `no-restricted-syntax`, so this test scans the hook sources
 * directly (same spirit as `apps/frontend/src/env-exposure.test.ts`) and fails if
 * `createSelector(` appears inside a `use*` hook or component body.
 *
 * Module-scope selectors in these files are allowed - they are the immediate fix shape - but
 * the rule they are stepping stones to is: selectors live in `packages/shared-store/src/slices/**`
 * next to the entities they read, and hook files only import and call them. See
 * `docs/selectors.md`.
 */

/**
 * Fix tasks that still build their selector inside the hook body, file by file. Remove an
 * entry when its fix lands on `dev`: the test asserts the violating set equals this list, so
 * it fails both on a new violation and on a stale entry, and becomes the full guardrail once
 * empty.
 */
const PENDING_SELECTOR_IN_HOOK_BODY: Record<string, string> = {
  'use-select-current-course.ts': 'hoist the selector to module scope',
}

/** Names that own a component or hook body: `use*` hooks and PascalCase components */
function isHookOrComponentName(name: string): boolean {
  return name.startsWith('use') || /^[A-Z]/u.test(name)
}

/** A call that is a hook call: `useX(...)` or `api.useGetXQuery(...)` */
function isHookCall(node: ts.Node): boolean {
  if (!ts.isCallExpression(node)) {
    return false
  }
  const { expression } = node
  if (ts.isIdentifier(expression)) {
    return expression.text.startsWith('use')
  }
  return (
    ts.isPropertyAccessExpression(expression) &&
    ts.isIdentifier(expression.name) &&
    expression.name.text.startsWith('use')
  )
}

/** Whether the subtree rooted at `node` contains a hook call */
function callsAnyHook(node: ts.Node): boolean {
  if (isHookCall(node)) {
    return true
  }
  let found = false
  ts.forEachChild(node, (child) => {
    found = found || callsAnyHook(child)
  })
  return found
}

/**
 * Classify `func` as a hook/component body:
 * - a `use*` or PascalCase function declaration, or a variable holding such a function, or
 * - an anonymous function that calls hooks (e.g. the hook `makeUseSelectContentUnit` returns)
 */
function hookBodyName(func: ts.Node): string | undefined {
  if (ts.isFunctionDeclaration(func) && func.name) {
    return isHookOrComponentName(func.name.text) ? func.name.text : undefined
  }
  if (ts.isVariableDeclaration(func) && ts.isIdentifier(func.name) && isHookOrComponentName(func.name.text)) {
    const initializer = func.initializer
    if (initializer !== undefined && (ts.isArrowFunction(initializer) || ts.isFunctionExpression(initializer))) {
      return func.name.text
    }
  }
  if ((ts.isArrowFunction(func) || ts.isFunctionExpression(func)) && callsAnyHook(func)) {
    return 'anonymous hook'
  }
  return undefined
}

function isFunctionLike(node: ts.Node): boolean {
  return (
    ts.isFunctionDeclaration(node) ||
    ts.isArrowFunction(node) ||
    ts.isFunctionExpression(node) ||
    ts.isVariableDeclaration(node)
  )
}

// TypeScript 6 declares `Node.parent` as non-optional, but at runtime it is `undefined` for the
// root source file - the traversal must treat it as optional to terminate.
const parentOf = (node: ts.Node): ts.Node | undefined => node.parent

/** The nearest enclosing hook/component body that contains `node`, if any */
function enclosingHookOrComponent(node: ts.Node): string | undefined {
  for (let ancestor = parentOf(node); ancestor; ancestor = parentOf(ancestor)) {
    if (isFunctionLike(ancestor)) {
      const name = hookBodyName(ancestor)
      if (name !== undefined) {
        return name
      }
    }
  }
  return undefined
}

/** `createSelector` calls made inside a hook/component body, per file name */
function scanDirectory(dir: string): Map<string, string[]> {
  const violations = new Map<string, string[]>()

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (
      !entry.isFile() ||
      !/\.(ts|tsx)$/u.test(entry.name) ||
      entry.name.endsWith('.test.ts') ||
      entry.name.endsWith('.test.tsx')
    ) {
      continue
    }

    const source = fs.readFileSync(path.join(dir, entry.name), 'utf8')
    const sourceFile = ts.createSourceFile(entry.name, source, ts.ScriptTarget.Latest, true)
    const found: string[] = []

    function visit(node: ts.Node) {
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'createSelector') {
        const owner = enclosingHookOrComponent(node)
        if (owner !== undefined) {
          found.push(owner)
        }
      }
      ts.forEachChild(node, visit)
    }

    visit(sourceFile)
    if (found.length > 0) {
      violations.set(entry.name, found)
    }
  }

  return violations
}

test('store-hooks: no createSelector inside hook bodies (pending list can only shrink)', () => {
  const dir = path.dirname(fileURLToPath(import.meta.url))
  const violating = scanDirectory(dir)

  expect([...violating.keys()].toSorted()).toEqual(Object.keys(PENDING_SELECTOR_IN_HOOK_BODY).toSorted())
})
