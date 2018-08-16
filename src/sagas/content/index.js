import { takeLatest } from 'redux-saga/effects'

import loadTocSaga from './toc'
import loadSectionSaga from './section'
import changeLanguage from './changeLanguage'
import { actionTypes as contentActionTypes } from '../../store/actions/content'
import { actionTypes as i18nActionTypes } from '../../store/actions/i18n'

export default [
  takeLatest(contentActionTypes.LOAD_TOC, loadTocSaga),
  takeLatest(contentActionTypes.LOAD_SECTION, loadSectionSaga),
  takeLatest(i18nActionTypes.CHANGE_LANGUAGE, changeLanguage),
]
