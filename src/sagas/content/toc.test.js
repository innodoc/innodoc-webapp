import { call, put, select } from 'redux-saga/effects'
import { cloneableGenerator } from 'redux-saga/utils'

import loadTocSaga from './toc'
import { loadToc, loadTocSuccess, loadTocFailure } from '../../store/actions/content'
import appSelectors from '../../store/selectors/app'
import sectionSelectors from '../../store/selectors/section'
import { fetchToc } from '../../lib/api'

const language = 'de'
const contentRoot = 'https://foo.com/content'

describe('loadTocSaga', () => {
  const content = ['toccontent']
  const gen = cloneableGenerator(loadTocSaga)(loadToc())

  it('should not fetch the TOC without language', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(appSelectors.getLanguage))
    expect(clone.next().done).toEqual(true)
  })

  it('should fetch the TOC', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(appSelectors.getLanguage))
    expect(clone.next(language).value).toEqual(select(sectionSelectors.getToc))
    expect(clone.next().value).toEqual(select(appSelectors.getContentRoot))
    expect(clone.next(contentRoot).value).toEqual(call(fetchToc, contentRoot, language))
    expect(clone.next(content).value)
      .toEqual(put(loadTocSuccess({ language, content, parsed: false })))
    expect(clone.next().done).toEqual(true)
  })

  it('should return TOC from store', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(appSelectors.getLanguage))
    expect(clone.next(language).value).toEqual(select(sectionSelectors.getToc))
    expect(clone.next(content).value).toEqual(put(loadTocSuccess({ language, parsed: true })))
    expect(clone.next().done).toEqual(true)
  })

  it('should put loadTocFailure on error', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(appSelectors.getLanguage))
    expect(clone.next(language).value).toEqual(select(sectionSelectors.getToc))
    expect(clone.next().value).toEqual(select(appSelectors.getContentRoot))
    expect(clone.next(contentRoot).value).toEqual(call(fetchToc, contentRoot, language))
    const error = new Error('error')
    expect(clone.throw(error).value).toEqual(put(loadTocFailure({ language, error })))
  })
})
