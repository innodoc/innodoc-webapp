import { takeEvery, takeLeading } from 'redux-saga/effects'

import { fetchPage, fetchSection } from '@innodoc/misc/api'
import {
  actionTypes as contentActionTypes,
  loadPageFailure,
  loadPageSuccess,
  loadSectionFailure,
  loadSectionSuccess,
} from '@innodoc/store/actions/content'
import { actionTypes as i18nActionTypes } from '@innodoc/store/actions/i18n'
import { getCurrentPage, pageExists, getPage } from '@innodoc/store/selectors/page'
import { getCurrentSection, sectionExists, getSection } from '@innodoc/store/selectors/section'

import changeLanguageSaga from './changeLanguageSaga'
import changeCourseSaga from './changeCourseSaga'
import loadFragmentSaga from './loadFragmentSaga'
import makeLoadContentSaga from './makeLoadContentSaga'
import loadManifestSaga from './loadManifestSaga'
import loadManifestSuccessSaga from './loadManifestSuccessSaga'
import loadManifestFailureSaga from './loadManifestFailureSaga'

const loadPageSaga = makeLoadContentSaga(
  getCurrentPage,
  pageExists,
  getPage,
  loadPageSuccess,
  loadPageFailure,
  fetchPage
)

const loadSectionSaga = makeLoadContentSaga(
  getCurrentSection,
  sectionExists,
  getSection,
  loadSectionSuccess,
  loadSectionFailure,
  fetchSection
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
