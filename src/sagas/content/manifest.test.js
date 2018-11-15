import { call, put, select } from 'redux-saga/effects'
import { cloneableGenerator } from 'redux-saga/utils'

import loadManifestSaga from './manifest'
import { loadManifest, loadManifestSuccess, loadManifestFailure } from '../../store/actions/content'
import appSelectors from '../../store/selectors/app'
import { fetchManifest } from '../../lib/api'

const title = 'coursetitle'
const contentRoot = 'https://foo.com/content'

describe('loadManifestSaga', () => {
  const content = ['toccontent']
  const gen = cloneableGenerator(loadManifestSaga)(loadManifest())

  it('should fetch the manifest', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(appSelectors.getTitle))
    expect(clone.next().value).toEqual(select(appSelectors.getContentRoot))
    expect(clone.next(contentRoot).value).toEqual(call(fetchManifest, contentRoot))
    expect(clone.next(content).value)
      .toEqual(put(loadManifestSuccess({ content, parsed: false })))
    expect(clone.next().done).toEqual(true)
  })

  it('should not load manifest if already loaded', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(appSelectors.getTitle))
    expect(clone.next(title).value).toEqual(put(loadManifestSuccess({ parsed: true })))
    expect(clone.next().done).toEqual(true)
  })

  it('should put loadTocFailure on error', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(appSelectors.getTitle))
    expect(clone.next().value).toEqual(select(appSelectors.getContentRoot))
    expect(clone.next(contentRoot).value).toEqual(call(fetchManifest, contentRoot))
    const error = new Error('error')
    expect(clone.throw(error).value).toEqual(put(loadManifestFailure({ error })))
  })
})
