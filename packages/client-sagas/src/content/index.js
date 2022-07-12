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
import { api } from '@innodoc/client-misc'

import changeLanguageSaga from './changeLanguageSaga'
import changeCourseSaga from './changeCourseSaga'
import loadFragmentSaga from './loadFragmentSaga'
import makeLoadContentSaga from './makeLoadContentSaga'
import loadManifestSaga from './loadManifestSaga'
import loadManifestSuccessSaga from './loadManifestSuccessSaga'
import loadManifestFailureSaga from './loadManifestFailureSaga'

const loadPageSaga = makeLoadContentSaga(
  pageSelectors.getCurrentPage,
  pageSelectors.pageExists,
  pageSelectors.getPage,
  loadPageSuccess,
  loadPageFailure,
  api.fetchPage
)

const loadSectionSaga = makeLoadContentSaga(
  sectionSelectors.getCurrentSection,
  sectionSelectors.sectionExists,
  sectionSelectors.getSection,
  loadSectionSuccess,
  loadSectionFailure,
  api.fetchSection
)

export default [
  takeEvery(contentActionTypes.LOAD_FRAGMENT, loadFragmentSaga),
  takeLeading(contentActionTypes.LOAD_MANIFEST, loadManifestSaga),
  takeLeading(contentActionTypes.LOAD_MANIFEST_SUCCESS, loadManifestSuccessSaga),
  takeLeading(contentActionTypes.LOAD_MANIFEST_FAILURE, loadManifestFailureSaga),
  takeLeading(contentActionTypes.LOAD_PAGE, loadPageSaga),
  takeLeading(contentActionTypes.LOAD_SECTION, loadSectionSaga),
  takeLeading(contentActionTypes.CHANGE_COURSE, changeCourseSaga),
  takeLeading(i18nActionTypes.CHANGE_LANGUAGE, changeLanguageSaga),
]
