import { put, select } from 'redux-saga/effects'
import { cloneableGenerator } from 'redux-saga/utils'

import changeLanguage from './changeLanguage'
import { loadSection } from '../../store/actions/content'
import selectors from '../../store/selectors/app'

describe('changeLanguage', () => {
  const gen = cloneableGenerator(changeLanguage)()

  it('should reload content', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(selectors.getCurrentSectionId))
    expect(clone.next('/path/').value).toEqual(put(loadSection('/path/')))
    expect(clone.next().done).toEqual(true)
  })

  it('should reload toc but not section without section path', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(selectors.getCurrentSectionId))
    expect(clone.next().done).toEqual(true)
  })
})
