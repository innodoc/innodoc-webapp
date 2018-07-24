import {
  call,
  fork,
  put,
  select,
  take,
} from 'redux-saga/effects'
import { cloneableGenerator } from 'redux-saga/utils'

import watchLoadToc, { loadToc } from './toc'
import { actionTypes, loadTocSuccess, loadTocFailure } from '../../store/actions/content'
import { actionTypes as i18nActionTypes } from '../../store/actions/i18n'
import { selectors as contentSelectors } from '../../store/reducers/content'
import { selectors as i18nSelectors } from '../../store/reducers/i18n'
import { fetchToc } from '../../lib/api'

const lang = 'de'

describe('loadToc', () => {
  const content = ['toccontent']
  const gen = cloneableGenerator(loadToc)(lang)

  it('should fetch the TOC', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(contentSelectors.getToc))
    expect(clone.next().value).toEqual(call(fetchToc, lang))
    expect(clone.next(content).value).toEqual(put(loadTocSuccess(content)))
  })

  it('should return cached TOC', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(contentSelectors.getToc))
    expect(clone.next(content).value).toEqual(put(loadTocSuccess(content)))
  })

  it('should put loadTocFailure on error', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(contentSelectors.getToc))
    expect(clone.next().value).toEqual(call(fetchToc, lang))
    const err = new Error('error')
    expect(clone.throw(err).value).toEqual(put(loadTocFailure(err)))
  })
})

describe('watchLoadToc', () => {
  const gen = watchLoadToc()

  it('should select language and fork loadToc on LOAD_TOC', () => {
    expect(gen.next().value).toEqual(take(actionTypes.LOAD_TOC))
    expect(gen.next().value).toEqual(select(i18nSelectors.getLanguage))
    expect(gen.next(lang).value).toEqual(fork(loadToc, lang))
  })

  it('should wait for changeLanguage and then fork loadToc if language not available', () => {
    expect(gen.next().value).toEqual(take(actionTypes.LOAD_TOC))
    expect(gen.next().value).toEqual(select(i18nSelectors.getLanguage))
    expect(gen.next().value).toEqual(take(i18nActionTypes.CHANGE_LANGUAGE))
    expect(gen.next().value).toEqual(select(i18nSelectors.getLanguage))
    expect(gen.next(lang).value).toEqual(fork(loadToc, lang))
  })
})
