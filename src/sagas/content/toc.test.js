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

const language = 'de'

describe('loadToc', () => {
  const content = ['toccontent']
  const gen = cloneableGenerator(loadToc)(language)

  it('should fetch the TOC', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(contentSelectors.getToc, language))
    expect(clone.next().value).toEqual(call(fetchToc, language))
    expect(clone.next(content).value).toEqual(put(loadTocSuccess({ language, content })))
  })

  it('should return cached TOC', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(contentSelectors.getToc, language))
    expect(clone.next(content).value).toEqual(put(loadTocSuccess({ language, content })))
  })

  it('should put loadTocFailure on error', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(select(contentSelectors.getToc, language))
    expect(clone.next().value).toEqual(call(fetchToc, language))
    const error = new Error('error')
    expect(clone.throw(error).value).toEqual(put(loadTocFailure({ language, error })))
  })
})

describe('watchLoadToc', () => {
  const gen = watchLoadToc()

  xit('should select languageuage and fork loadToc on LOAD_TOC', () => {
    expect(gen.next().value).toEqual(take(actionTypes.LOAD_TOC))
    expect(gen.next().value).toEqual(select(i18nSelectors.getlanguageuage))
    expect(gen.next(language).value).toEqual(fork(loadToc, language))
  })

  xit('should wait for changelanguageuage and then fork loadToc if languageuage not available', () => {
    expect(gen.next().value).toEqual(take(actionTypes.LOAD_TOC))
    expect(gen.next().value).toEqual(select(i18nSelectors.getlanguageuage))
    expect(gen.next().value).toEqual(take(i18nActionTypes.CHANGE_languageUAGE))
    expect(gen.next().value).toEqual(select(i18nSelectors.getlanguageuage))
    expect(gen.next(language).value).toEqual(fork(loadToc, language))
  })
})
