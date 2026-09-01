import type { Element, Root } from 'hast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

/** GitHub-slugger style suffixing: `dup` + 1 -> `dup-1` (string concat; numeric template expressions are banned by the lint config). */
const withSuffix = (base: string, suffix: number): string => base + '-' + suffix.toString()

/**
 * Resolve duplicate heading ids that `rehype-slug` leaves behind.
 *
 * `rehype-slug` skips any heading that already carries an `id` and never registers
 * that id with its slugger, so a custom `{#id}` (from `remark-heading-id`) that
 * collides with an auto-generated slug — or with another custom id — survives as a
 * duplicated DOM id. This pass runs right after `rehype-slug` and de-duplicates
 * whatever collision is left, in document order:
 *
 * - the FIRST occurrence of an id keeps its exact id, so existing anchors and links
 *   to `{#id}` keep working;
 * - only later occurrences get a suffix, using the same `-1`/`-2` style the slugger
 *   itself uses for auto headings;
 * - a renamed id never collides with an id kept by any other heading, so suffixes
 *   never chain (a heading keeps `dup-1`, a colliding `dup` becomes `dup-2`);
 * - a non-colliding id is never renamed.
 *
 * All state is created per transform, so the de-duplication can never leak between
 * documents (the repeat-parse pin in `markdown-to-hast-headings.test.ts` guards this).
 */
function transformer(tree: Root) {
  const headings: Element[] = []
  visit(tree, 'element', (node) => {
    if (/^h[1-6]$/u.test(node.tagName)) {
      headings.push(node)
    }
  })

  // Every id string present in the tree is kept by its first occurrence, so it is
  // reserved: a later renamed heading must not take it.
  const keptIds = new Set<string>()
  for (const heading of headings) {
    if (typeof heading.properties.id === 'string') {
      keptIds.add(heading.properties.id)
    }
  }

  const usedIds = new Set<string>()
  for (const heading of headings) {
    const id = heading.properties.id
    if (typeof id !== 'string') {
      continue
    }
    if (!usedIds.has(id)) {
      usedIds.add(id)
      continue
    }

    let suffix = 1
    while (keptIds.has(withSuffix(id, suffix)) || usedIds.has(withSuffix(id, suffix))) {
      suffix += 1
    }
    heading.properties.id = withSuffix(id, suffix)
    usedIds.add(heading.properties.id)
  }
}

/** De-duplicate the heading ids that `rehype-slug` leaves colliding (custom vs auto). */
const rehypeHeadingIdDedupe: Plugin<[], Root, Root> = () => transformer

export default rehypeHeadingIdDedupe
