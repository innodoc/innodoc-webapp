import { call, put, select } from 'redux-saga/effects'
import { cloneableGenerator } from 'redux-saga/utils'

import loadSectionSaga from './section'
import loadManifestSaga from './manifest'
import {
  clearError,
  loadSection,
  loadSectionSuccess,
  loadSectionFailure,
} from '../../store/actions/content'
import { fetchSection } from '../../lib/api'
import { parseSectionId, scrollToHash } from '../../lib/util'
import appSelectors from '../../store/selectors'
import courseSelectors from '../../store/selectors/course'
import sectionSelectors from '../../store/selectors/section'

describe('loadSectionSaga', () => {
  const language = 'en'
  const sectionTable = {
    items: ['foo/bar'],
  }
  const sectionId = 'foo/bar'
  const section = {
    content: {
      en: ['sectioncontent'],
    },
  }
  const contentRoot = 'https://foo.com/content'

  const gen = cloneableGenerator(loadSectionSaga)(loadSection(sectionId))

  it('should not fetch without manifest', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(call(parseSectionId, 'foo/bar'))
    expect(clone.next(['foo/bar']).value).toEqual(select(courseSelectors.getCurrentCourse))
    expect(clone.next().value).toEqual(call(loadManifestSaga))
    expect(clone.next().value).toEqual(put(clearError()))
  })

  it('should not fetch a section without language', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(call(parseSectionId, 'foo/bar'))
    expect(clone.next(['foo/bar']).value).toEqual(select(courseSelectors.getCurrentCourse))
    expect(clone.next(true).value).toEqual(put(clearError()))
    expect(clone.next().value).toEqual(select(sectionSelectors.getSectionTable))
    expect(clone.next(sectionTable).value).toEqual(select(appSelectors.getApp).language)
    expect(clone.next().done).toEqual(true)
  })

  it('should fetch a section', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(call(parseSectionId, 'foo/bar'))
    expect(clone.next(['foo/bar']).value).toEqual(select(courseSelectors.getCurrentCourse))
    expect(clone.next(true).value).toEqual(put(clearError()))
    expect(clone.next().value).toEqual(select(sectionSelectors.getSectionTable))
    expect(clone.next(sectionTable).value).toEqual(select(appSelectors.getApp).language)
    expect(clone.next(language).value).toEqual(
      select(sectionSelectors.getSection, sectionId))
    expect(clone.next().value).toEqual(select(appSelectors.getApp).contentRoot)
    expect(clone.next(contentRoot).value).toEqual(
      call(fetchSection, contentRoot, language, sectionId))
    expect(clone.next(section.content[language]).value).toEqual(
      put(loadSectionSuccess({ language, sectionId, content: section.content[language] })))
    expect(clone.next().value).toEqual(call(scrollToHash))
    expect(clone.next().done).toEqual(true)
  })

  it('should return cached section', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(call(parseSectionId, 'foo/bar'))
    expect(clone.next(['foo/bar']).value).toEqual(select(courseSelectors.getCurrentCourse))
    expect(clone.next(true).value).toEqual(put(clearError()))
    expect(clone.next().value).toEqual(select(sectionSelectors.getSectionTable))
    expect(clone.next(sectionTable).value).toEqual(select(appSelectors.getApp).language)
    expect(clone.next(language).value).toEqual(
      select(sectionSelectors.getSection, sectionId))
    expect(clone.next(section).value).toEqual(
      put(loadSectionSuccess({ language, sectionId, content: section.content[language] })))
    expect(clone.next().done).toEqual(true)
  })

  it('should put loadSectionFailure on invalid sectionId', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(call(parseSectionId, 'foo/bar'))
    expect(clone.next(['foo/bar']).value).toEqual(select(courseSelectors.getCurrentCourse))
    expect(clone.next(true).value).toEqual(put(clearError()))
    expect(clone.next().value).toEqual(select(sectionSelectors.getSectionTable))
    expect(clone.next({ items: [] }).value).toEqual(select(appSelectors.getApp).language)
    expect(clone.next(language).value).toEqual(
      put(loadSectionFailure({ language, statusCode: 404 })))
    expect(clone.next().done).toEqual(true)
  })

  it('should put loadSectionFailure on error', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(call(parseSectionId, 'foo/bar'))
    expect(clone.next(['foo/bar']).value).toEqual(select(courseSelectors.getCurrentCourse))
    expect(clone.next(true).value).toEqual(put(clearError()))
    expect(clone.next().value).toEqual(select(sectionSelectors.getSectionTable))
    expect(clone.next(sectionTable).value).toEqual(select(appSelectors.getApp).language)
    expect(clone.next(language).value).toEqual(
      select(sectionSelectors.getSection, sectionId))
    expect(clone.next().value).toEqual(select(appSelectors.getApp).contentRoot)
    expect(clone.next(contentRoot).value).toEqual(
      call(fetchSection, contentRoot, language, sectionId))
    const error = new Error('error')
    expect(clone.throw(error).value).toEqual(put(loadSectionFailure({ language, error })))
  })
})
