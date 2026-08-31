import { expect, test } from 'vitest'
import type { HastResult } from '@innodoc/shared-core/types'
import makeStore from '#make-store'
import { addHastResult, selectHast, selectHastResultByHash } from '#slices/hast'

const result: HastResult = { root: { type: 'root', children: [] } }

test('selectHastResultByHash returns the result stored under its hash', () => {
  const store = makeStore()

  store.dispatch(addHastResult({ hash: '0abc123', ...result }))

  expect(selectHastResultByHash(store.getState(), '0abc123')).toEqual(result)
  // selectHast exposes the same slice state the keyed lookup reads from
  expect(selectHast(store.getState()).content['0abc123']).toEqual(result)
})

test('selectHastResultByHash returns undefined for an unknown hash', () => {
  const store = makeStore()

  expect(selectHastResultByHash(store.getState(), 'nope')).toBeUndefined()
})

test('selectHast returns the initial hast slice state', () => {
  const store = makeStore()

  expect(selectHast(store.getState())).toEqual({ content: {}, isProcessing: false })
})
