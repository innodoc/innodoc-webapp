import { call, put, select } from 'redux-saga/effects'
import { cloneableGenerator } from 'redux-saga/utils'

import loadManifestSaga from './manifest'
import {
  changeCourse,
  loadManifest,
  loadManifestSuccess,
  loadManifestFailure,
} from '../../store/actions/content'
import appSelectors from '../../store/selectors/app'
import courseSelectors from '../../store/selectors/course'
import { fetchManifest } from '../../lib/api'

const course = {
  id: 0,
  currentSectionId: 'foo',
  homeLink: 'bar',
  languages: ['de', 'en'],
  title: {
    en: ['foobar'],
    de: ['Foobar'],
  },
}
const contentRoot = 'https://foo.com/content'

describe('loadManifestSaga', () => {
  const content = ['toccontent']
  const gen = cloneableGenerator(loadManifestSaga)(loadManifest())

  it('should fetch the manifest', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(courseSelectors.getCurrentCourse))
    expect(clone.next().value).toEqual(select(appSelectors.getContentRoot))
    expect(clone.next(contentRoot).value).toEqual(call(fetchManifest, contentRoot))
    expect(clone.next(content).value)
      .toEqual(put(loadManifestSuccess({ content, parsed: false })))
    expect(clone.next().value).toEqual(select(courseSelectors.getCourses))
    expect(clone.next([0]).value).toEqual(put(changeCourse(0)))
    expect(clone.next().done).toEqual(true)
  })

  it('should not load manifest if already loaded', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(courseSelectors.getCurrentCourse))
    expect(clone.next(course).value).toEqual(put(loadManifestSuccess({ parsed: true })))
    expect(clone.next().done).toEqual(true)
  })

  it('should put loadTocFailure on error', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(courseSelectors.getCurrentCourse))
    expect(clone.next().value).toEqual(select(appSelectors.getContentRoot))
    expect(clone.next(contentRoot).value).toEqual(call(fetchManifest, contentRoot))
    const error = new Error('error')
    expect(clone.throw(error).value).toEqual(put(loadManifestFailure({ error })))
  })
})
