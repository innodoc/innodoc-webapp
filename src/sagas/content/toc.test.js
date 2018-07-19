import {
  call,
  fork,
  put,
  select,
  take,
} from 'redux-saga/effects'
import { cloneableGenerator } from 'redux-saga/utils'

import watchLoadToc, { loadToc } from './toc'
import { actionTypes, loadTocSuccess, loadTocFailure } from '../../store/actions/content'
import { fetchToc } from '../../lib/api'
import { selectors } from '../../store/reducers/content'

describe('loadToc', () => {
  const content = ['toccontent']
  const gen = cloneableGenerator(loadToc)()

  it('should fetch the TOC', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(selectors.getToc))
    expect(clone.next().value).toEqual(call(fetchToc, 'de'))
    expect(clone.next(content).value).toEqual(put(loadTocSuccess(content)))
  })

  it('should return cached TOC', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(selectors.getToc))
    expect(clone.next(content).value).toEqual(put(loadTocSuccess(content)))
  })

  it('should put loadTocFailure on error', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(selectors.getToc))
    expect(clone.next().value).toEqual(call(fetchToc, 'de'))
    const err = new Error('error')
    expect(clone.throw(err).value).toEqual(put(loadTocFailure(err)))
  })
})

describe('watchLoadToc', () => {
  const gen = watchLoadToc()

  it('should fork loadToc saga on LOAD_TOC', () => {
    expect(gen.next().value).toEqual(take(actionTypes.LOAD_TOC))
    expect(gen.next().value).toEqual(fork(loadToc))
  })
})
