import { call, put, select } from 'redux-saga/effects'
import { cloneableGenerator } from 'redux-saga/utils'

import loadSectionSaga from './section'
import { loadSection, loadSectionSuccess, loadSectionFailure } from '../../store/actions/content'
import { fetchSection } from '../../lib/api'
import { scrollToHash } from '../../lib/util'
import appSelectors from '../../store/selectors/app'
import sectionSelectors from '../../store/selectors/section'

describe('loadSectionSaga', () => {
  const language = 'en'
  const sectionId = 'foo/bar'
  const section = {
    content: {
      en: ['sectioncontent'],
    },
  }
  const contentRoot = 'https://foo.com/content'

  const gen = cloneableGenerator(loadSectionSaga)(loadSection(sectionId))

  it('should not fetch a section without language', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(appSelectors.getLanguage))
    expect(clone.next().done).toEqual(true)
  })

  it('should fetch a section', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(appSelectors.getLanguage))
    expect(clone.next(language).value).toEqual(
      select(sectionSelectors.getSection, sectionId))
    expect(clone.next().value).toEqual(select(appSelectors.getContentRoot))
    expect(clone.next(contentRoot).value).toEqual(
      call(fetchSection, contentRoot, language, sectionId))
    expect(clone.next(section.content[language]).value).toEqual(
      put(loadSectionSuccess({ language, sectionId, content: section.content[language] })))
    expect(clone.next().value).toEqual(call(scrollToHash))
    expect(clone.next().done).toEqual(true)
  })

  it('should return cached section', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(appSelectors.getLanguage))
    expect(clone.next(language).value).toEqual(
      select(sectionSelectors.getSection, sectionId))
    expect(clone.next(section).value).toEqual(
      put(loadSectionSuccess({ language, sectionId, content: section.content[language] })))
    expect(clone.next().done).toEqual(true)
  })

  it('should put loadSectionFailure on error', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(appSelectors.getLanguage))
    expect(clone.next(language).value).toEqual(
      select(sectionSelectors.getSection, sectionId))
    expect(clone.next().value).toEqual(select(appSelectors.getContentRoot))
    expect(clone.next(contentRoot).value).toEqual(
      call(fetchSection, contentRoot, language, sectionId))
    const error = new Error('error')
    expect(clone.throw(error).value).toEqual(put(loadSectionFailure({ language, error })))
  })
})
