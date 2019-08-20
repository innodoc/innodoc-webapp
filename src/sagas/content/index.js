import { takeEvery, takeLeading } from 'redux-saga/effects'

import changeLanguageSaga from './changeLanguageSaga'
import loadFragmentSaga from './loadFragmentSaga'
import loadManifestSaga from './loadManifestSaga'
import makeLoadContentSaga from './makeLoadContentSaga'
import {
  actionTypes as contentActionTypes,
  loadPageFailure,
  loadPageSuccess,
  loadSectionFailure,
  loadSectionSuccess,
} from '../../store/actions/content'
import { actionTypes as i18nActionTypes } from '../../store/actions/i18n'
import pageSelectors from '../../store/selectors/page'
import sectionSelectors from '../../store/selectors/section'
import { fetchPage, fetchSection } from '../../lib/api'

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
  takeEvery(contentActionTypes.LOAD_FRAGMENT, loadFragmentSaga),
  takeLeading(contentActionTypes.LOAD_MANIFEST, loadManifestSaga),
  takeLeading(contentActionTypes.LOAD_PAGE, loadPageSaga),
  takeLeading(contentActionTypes.LOAD_SECTION, loadSectionSaga),
  takeLeading(i18nActionTypes.CHANGE_LANGUAGE, changeLanguageSaga),
]
