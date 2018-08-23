import { call, put, select } from 'redux-saga/effects'
import { cloneableGenerator } from 'redux-saga/utils'

import loadSectionSaga from './section'
import { loadSection, loadSectionSuccess, loadSectionFailure } from '../../store/actions/content'
import { fetchSection } from '../../lib/api'
import contentSelectors from '../../store/selectors/content'
import i18nSelectors from '../../store/selectors/i18n'

describe('loadSectionSaga', () => {
  const language = 'en'
  const id = 78
  const content = ['sectioncontent']

  const gen = cloneableGenerator(loadSectionSaga)(loadSection(id))

  it('should not fetch a section without language', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(i18nSelectors.getLanguage))
    expect(clone.next().done).toEqual(true)
  })

  it('should fetch a section', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(i18nSelectors.getLanguage))
    expect(clone.next(language).value).toEqual(
      select(contentSelectors.getSectionContent, language, id))
    expect(clone.next().value).toEqual(call(fetchSection, language, id))
    expect(clone.next(content).value).toEqual(put(loadSectionSuccess({ language, id, content })))
    expect(clone.next().done).toEqual(true)
  })

  it('should return cached section', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(i18nSelectors.getLanguage))
    expect(clone.next(language).value).toEqual(
      select(contentSelectors.getSectionContent, language, id))
    expect(clone.next(content).value).toEqual(put(loadSectionSuccess({ language, id, content })))
    expect(clone.next().done).toEqual(true)
  })

  it('should put loadSectionFailure on error', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(i18nSelectors.getLanguage))
    expect(clone.next(language).value).toEqual(
      select(contentSelectors.getSectionContent, language, id))
    expect(clone.next().value).toEqual(call(fetchSection, language, id))
    const error = new Error('error')
    expect(clone.throw(error).value).toEqual(put(loadSectionFailure({ language, error })))
  })
})
