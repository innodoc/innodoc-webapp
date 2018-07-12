import {
  fork,
  put,
  select,
  take,
} from 'redux-saga/effects'

import { selectors } from '../../store/reducers/content'
import {
  actionTypes,
  loadSectionSuccess,
  loadSectionFailure,
} from '../../store/actions/content'
import { showMessage } from '../../store/actions/ui'

const contentRoot = process.env.CONTENT_ROOT

function* loadSection({ sectionId }) {
  const cachedContent = yield select(selectors.getSectionContent, sectionId)
  if (cachedContent) {
    yield put(loadSectionSuccess({
      id: sectionId,
      content: cachedContent,
    }))
  } else {
    const url = `${contentRoot}/de/${sectionId}/content.json`
    try {
      const response = yield fetch(url)
      if (response.status === 404) {
        // it's ok if content.json is not there
        yield put(loadSectionSuccess({
          id: sectionId,
          content: [],
        }))
      } else {
        if (!response.ok) {
          throw new Error(`Could not fetch section. (Status: ${response.status} URL: ${url})`)
        }
        const data = yield response.json()
        yield put(loadSectionSuccess({
          id: sectionId,
          content: data,
        }))
      }
    } catch (err) {
      yield put(loadSectionFailure(err))
      yield put(showMessage({
        title: 'Loading section failed!',
        msg: err.message,
        level: 'error',
      }))
    }
  }
}

export default function* watchLoadSection() {
  while (true) {
    const sectionId = yield take(actionTypes.LOAD_SECTION)
    yield fork(loadSection, sectionId)
  }
}
