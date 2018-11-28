import { put, select } from 'redux-saga/effects'
import { cloneableGenerator } from 'redux-saga/utils'

import changeLanguage from './changeLanguage'
import { loadSection } from '../../store/actions/content'
import courseSelectors from '../../store/selectors/course'

const course = {
  currentSectionId: '/path/',
}

describe('changeLanguage', () => {
  const gen = cloneableGenerator(changeLanguage)()

  it('should reload content', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(courseSelectors.getCurrentCourse))
    expect(clone.next(course).value).toEqual(put(loadSection('/path/')))
    expect(clone.next().done).toEqual(true)
  })

  it('should reload toc but not section without section path', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(courseSelectors.getCurrentCourse))
    expect(clone.next().done).toEqual(true)
  })
})
