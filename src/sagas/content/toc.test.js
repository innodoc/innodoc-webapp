import { call, put, select } from 'redux-saga/effects'
import { cloneableGenerator } from 'redux-saga/utils'

import loadTocSaga from './toc'
import { loadToc, loadTocSuccess, loadTocFailure } from '../../store/actions/content'
import { selectors as contentSelectors } from '../../store/reducers/content'
import { selectors as i18nSelectors } from '../../store/reducers/i18n'
import { fetchToc } from '../../lib/api'

const language = 'de'

describe('loadTocSaga', () => {
  const content = ['toccontent']
  const gen = cloneableGenerator(loadTocSaga)(loadToc())

  it('should not fetch the TOC without language', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(i18nSelectors.getLanguage))
    expect(clone.next().done).toEqual(true)
  })

  it('should fetch the TOC', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(i18nSelectors.getLanguage))
    expect(clone.next(language).value).toEqual(select(contentSelectors.getToc, language))
    expect(clone.next().value).toEqual(call(fetchToc, language))
    expect(clone.next(content).value).toEqual(put(loadTocSuccess({ language, content })))
    expect(clone.next().done).toEqual(true)
  })

  it('should return TOC from store', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(i18nSelectors.getLanguage))
    expect(clone.next(language).value).toEqual(select(contentSelectors.getToc, language))
    expect(clone.next(content).value).toEqual(put(loadTocSuccess({ language, content })))
    expect(clone.next().done).toEqual(true)
  })

  it('should put loadTocFailure on error', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(i18nSelectors.getLanguage))
    expect(clone.next(language).value).toEqual(select(contentSelectors.getToc, language))
    expect(clone.next().value).toEqual(call(fetchToc, language))
    const error = new Error('error')
    expect(clone.throw(error).value).toEqual(put(loadTocFailure({ language, error })))
  })
})
