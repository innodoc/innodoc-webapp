import { takeLatest } from 'redux-saga/effects'

import makeLoadContentSaga from './makeLoadContentSaga'
import pageSelectors from '../../store/selectors/page'
import sectionSelectors from '../../store/selectors/section'
import { fetchPage, fetchSection } from '../../lib/api'
import loadManifestSaga from './manifest'
import changeLanguageSaga from './changeLanguage'
import { actionTypes as i18nActionTypes } from '../../store/actions/i18n'
import {
  actionTypes as contentActionTypes,
  loadPageFailure,
  loadPageSuccess,
  loadSectionFailure,
  loadSectionSuccess,
} from '../../store/actions/content'

const loadPageSaga = makeLoadContentSaga(
  pageSelectors.getCurrentPage,
  pageSelectors.pageExists,
  pageSelectors.getPage,
  loadPageSuccess,
  loadPageFailure,
  fetchPage,
)

const loadSectionSaga = makeLoadContentSaga(
  sectionSelectors.getCurrentSection,
  sectionSelectors.sectionExists,
  sectionSelectors.getSection,
  loadSectionSuccess,
  loadSectionFailure,
  fetchSection,
)

export default [
  takeLatest(contentActionTypes.LOAD_MANIFEST, loadManifestSaga),
  takeLatest(contentActionTypes.LOAD_PAGE, loadPageSaga),
  takeLatest(contentActionTypes.LOAD_SECTION, loadSectionSaga),
  takeLatest(i18nActionTypes.CHANGE_LANGUAGE, changeLanguageSaga),
]
