import { expect, test } from 'vitest'
import { EMPTY_SECTION_TREE, EMPTY_TRANSLATED_PAGES, EMPTY_TRANSLATED_SECTIONS } from './sentinels.js'

const sentinels: readonly (readonly unknown[])[] = [
  EMPTY_TRANSLATED_SECTIONS,
  EMPTY_SECTION_TREE,
  EMPTY_TRANSLATED_PAGES,
]

// Their reference stability is what the store selectors rely on, and it is asserted per hook by
// the re-render tests next to them. What no hook exercises is the other half of the contract: the
// sentinel is shared, so a write from one consumer would corrupt all of them at once.
test('the empty sentinels are frozen, so a consumer write throws instead of poisoning every reader', () => {
  for (const sentinel of sentinels) {
    expect(sentinel).toHaveLength(0)
    expect(Object.isFrozen(sentinel)).toBe(true)
    expect(() => (sentinel as unknown[]).push({})).toThrow(TypeError)
  }
})
