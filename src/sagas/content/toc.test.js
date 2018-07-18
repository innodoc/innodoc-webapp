import {
  call,
  fork,
  put,
  take,
} from 'redux-saga/effects'
// import { cloneableGenerator } from 'redux-saga/utils'

import watchLoadToc, { loadToc } from './toc'
import { actionTypes, loadTocSuccess } from '../../store/actions/content'
import { fetchToc } from '../../lib/api'

process.env.CONTENT_ROOT = 'http://content.example.com/'

describe('loadToc', () => {
  // const generator = cloneableGenerator(loadToc)()
  const gen = loadToc()

  it('should fetch the TOC', () => {
    expect(gen.next().value).toEqual(call(fetchToc, process.env.CONTENT_ROOT, 'de'))
    expect(gen.next(['tocdata']).value).toEqual(put(loadTocSuccess(['tocdata'])))
  })

  it('should return a cached TOC', () => {})
  it('should put loadTocFailure and showMessage on error', () => {})
})

describe('watchLoadToc', () => {
  const gen = watchLoadToc()

  it('should fork loadToc saga on LOAD_TOC', () => {
    expect(gen.next().value).toEqual(take(actionTypes.LOAD_TOC))
    expect(gen.next().value).toEqual(fork(loadToc))
  })
})
