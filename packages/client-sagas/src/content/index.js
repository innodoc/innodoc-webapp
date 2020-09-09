import { takeEvery, takeLeading } from 'redux-saga/effects'

import {
  actionTypes as contentActionTypes,
  loadPageFailure,
  loadPageSuccess,
  loadSectionFailure,
  loadSectionSuccess,
} from '@innodoc/client-store/src/actions/content'
import { actionTypes as i18nActionTypes } from '@innodoc/client-store/src/actions/i18n'
import pageSelectors from '@innodoc/client-store/src/selectors/page'
import sectionSelectors from '@innodoc/client-store/src/selectors/section'
import { fetchPage, fetchSection } from '@innodoc/client-misc/src/api'

import changeLanguageSaga from './changeLanguageSaga'
import loadFragmentSaga from './loadFragmentSaga'
import makeLoadContentSaga from './makeLoadContentSaga'
import loadManifestSuccessSaga from './loadManifestSuccessSaga'

const loadPageSaga = makeLoadContentSaga(
  pageSelectors.getCurrentPage,
  pageSelectors.pageExists,
  pageSelectors.getPage,
  loadPageSuccess,
  loadPageFailure,
  fetchPage
)

const loadSectionSaga = makeLoadContentSaga(
  sectionSelectors.getCurrentSection,
  sectionSelectors.sectionExists,
  sectionSelectors.getSection,
  loadSectionSuccess,
  loadSectionFailure,
  fetchSection
)

export default [
  takeEvery(contentActionTypes.LOAD_FRAGMENT, loadFragmentSaga),
  takeEvery(contentActionTypes.LOAD_MANIFEST_SUCCESS, loadManifestSuccessSaga),
  takeLeading(contentActionTypes.LOAD_PAGE, loadPageSaga),
  takeLeading(contentActionTypes.LOAD_SECTION, loadSectionSaga),
  takeLeading(i18nActionTypes.CHANGE_LANGUAGE, changeLanguageSaga),
]
