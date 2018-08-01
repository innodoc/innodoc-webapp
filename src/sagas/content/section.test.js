import {
  call,
  fork,
  put,
  select,
  take,
} from 'redux-saga/effects'
import { cloneableGenerator } from 'redux-saga/utils'

import watchLoadSection, { loadSection } from './section'
import { actionTypes, loadSectionSuccess, loadSectionFailure } from '../../store/actions/content'
import { fetchSection } from '../../lib/api'
import { selectors } from '../../store/reducers/content'

describe('loadSection', () => {
  const language = 'en'
  const id = 78
  const content = ['sectioncontent']

  const gen = cloneableGenerator(loadSection)(language, id)

  it('should fetch a section', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(selectors.getSectionContent, language, id))
    expect(clone.next().value).toEqual(call(fetchSection, language, id))
    expect(clone.next(content).value).toEqual(put(loadSectionSuccess({ language, id, content })))
  })

  it('should return cached section', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(selectors.getSectionContent, language, id))
    expect(clone.next(content).value).toEqual(put(loadSectionSuccess({ language, id, content })))
  })

  it('should put loadSectionFailure on error', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(selectors.getSectionContent, language, id))
    expect(clone.next().value).toEqual(call(fetchSection, language, id))
    const error = new Error('error')
    expect(clone.throw(error).value).toEqual(put(loadSectionFailure({ language, error })))
  })
})

describe('watchLoadSection', () => {
  const gen = watchLoadSection()

  xit('should fork loadSection saga on LOAD_SECTION', () => {
    expect(gen.next().value).toEqual(take(actionTypes.LOAD_SECTION))
    expect(gen.next(67).value).toEqual(fork(loadSection, 67))
  })
})
