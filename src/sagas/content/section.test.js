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
  const id = 78
  const content = ['sectioncontent']
  const section = { id, content }

  const gen = cloneableGenerator(loadSection)({ id })

  it('should fetch a section', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(selectors.getSectionContent, id))
    expect(clone.next().value).toEqual(call(fetchSection, id, 'de'))
    expect(clone.next(content).value).toEqual(put(loadSectionSuccess(section)))
  })

  it('should return cached section', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(selectors.getSectionContent, id))
    expect(clone.next(content).value).toEqual(put(loadSectionSuccess(section)))
  })

  it('should put loadSectionFailure on error', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(selectors.getSectionContent, id))
    expect(clone.next().value).toEqual(call(fetchSection, id, 'de'))
    const err = new Error('error')
    expect(clone.throw(err).value).toEqual(put(loadSectionFailure(err)))
  })
})

describe('watchLoadSection', () => {
  const gen = watchLoadSection()

  it('should fork loadSection saga on LOAD_SECTION', () => {
    expect(gen.next().value).toEqual(take(actionTypes.LOAD_SECTION))
    expect(gen.next(67).value).toEqual(fork(loadSection, 67))
  })
})
