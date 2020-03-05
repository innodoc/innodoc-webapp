import { takeEvery } from 'redux-saga/effects'

import { actionTypes as contentActionTypes } from '@innodoc/client-store/src/actions/content'
import loadContentFailureSaga from './loadContentFailureSaga'
import loadManifestFailureSaga from './loadManifestFailureSaga'

export default [
  takeEvery(contentActionTypes.LOAD_SECTION_FAILURE, loadContentFailureSaga),
  takeEvery(contentActionTypes.LOAD_PAGE_FAILURE, loadContentFailureSaga),
  takeEvery(contentActionTypes.LOAD_MANIFEST_FAILURE, loadManifestFailureSaga),
]
