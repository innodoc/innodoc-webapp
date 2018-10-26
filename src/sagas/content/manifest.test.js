import { call, put, select } from 'redux-saga/effects'
import { cloneableGenerator } from 'redux-saga/utils'

import loadManifestSaga from './toc'
import { loadManifest, loadManifestSuccess, loadManifestFailure } from '../../store/actions/content'
import contentSelectors from '../../store/selectors/content'
import i18nSelectors from '../../store/selectors/i18n'
import { fetchToc } from '../../lib/api'

const language = 'de'
const contentRoot = 'https://foo.com/content'

describe('loadManifestSaga', () => {
  const content = ['toccontent']
  const gen = cloneableGenerator(loadManifestSaga)(loadManifest())

  it('should not fetch the TOC without language', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(i18nSelectors.getLanguage))
    expect(clone.next().done).toEqual(true)
  })

  it('should fetch the TOC', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(i18nSelectors.getLanguage))
    expect(clone.next(language).value).toEqual(select(contentSelectors.getToc))
    expect(clone.next().value).toEqual(select(contentSelectors.getContentRoot))
    expect(clone.next(contentRoot).value).toEqual(call(fetchToc, contentRoot, language))
    expect(clone.next(content).value).toEqual(put(loadManifestSuccess({ language, content })))
    expect(clone.next().done).toEqual(true)
  })

  it('should return TOC from store', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(i18nSelectors.getLanguage))
    expect(clone.next(language).value).toEqual(select(contentSelectors.getToc))
    expect(clone.next(content).value).toEqual(put(loadManifestSuccess({ language, content })))
    expect(clone.next().done).toEqual(true)
  })

  it('should put loadManifestFailure on error', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(i18nSelectors.getLanguage))
    expect(clone.next(language).value).toEqual(select(contentSelectors.getToc))
    expect(clone.next().value).toEqual(select(contentSelectors.getContentRoot))
    expect(clone.next(contentRoot).value).toEqual(call(fetchToc, contentRoot, language))
    const error = new Error('error')
    expect(clone.throw(error).value).toEqual(put(loadManifestFailure({ language, error })))
  })
})
