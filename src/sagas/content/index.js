import { takeLatest } from 'redux-saga/effects'

import loadManifestSaga from './toc'
import loadSectionSaga from './section'
import changeLanguage from './changeLanguage'
import { actionTypes as contentActionTypes } from '../../store/actions/content'
import { actionTypes as i18nActionTypes } from '../../store/actions/i18n'

export default [
  takeLatest(contentActionTypes.LOAD_MANIFEST, loadManifestSaga),
  takeLatest(contentActionTypes.LOAD_SECTION, loadSectionSaga),
  takeLatest(i18nActionTypes.CHANGE_LANGUAGE, changeLanguage),
]
