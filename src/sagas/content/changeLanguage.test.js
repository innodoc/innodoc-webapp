import { put, select } from 'redux-saga/effects'
import { cloneableGenerator } from 'redux-saga/utils'

import changeLanguage from './changeLanguage'
import { loadManifest, loadSection } from '../../store/actions/content'
import selectors from '../../store/selectors/content'

describe('changeLanguage', () => {
  const gen = cloneableGenerator(changeLanguage)()

  it('should reload content', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(put(loadManifest()))
    expect(clone.next().value).toEqual(select(selectors.getCurrentSectionPath))
    expect(clone.next('/path/').value).toEqual(put(loadSection('/path/')))
    expect(clone.next().done).toEqual(true)
  })

  it('should reload toc but not section without section path', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(put(loadManifest()))
    expect(clone.next().value).toEqual(select(selectors.getCurrentSectionPath))
    expect(clone.next().done).toEqual(true)
  })
})
