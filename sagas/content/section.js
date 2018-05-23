import { fork, put, take } from 'redux-saga/effects'

import {
  actionTypes,
  loadSectionSuccess,
  loadSectionFailure,
} from '../../store/actions/content'

const contentRoot = process.env.CONTENT_ROOT

function* loadSection({ sectionId }) {
  const loc = `${contentRoot}/de/${sectionId}/content.json`
  try {
    const res = yield fetch(loc)
    if (res.status === 404) {
      // it's ok if content.json is not there
      yield put(loadSectionSuccess({
        id: sectionId,
        content: [],
      }))
    }
    const data = yield res.json()
    yield put(loadSectionSuccess({
      id: sectionId,
      content: data,
    }))
  } catch (err) {
    yield put(loadSectionFailure(err))
  }
}

export default function* watchLoadSection() {
  while (true) {
    const sectionId = yield take(actionTypes.LOAD_SECTION)
    yield fork(loadSection, sectionId)
  }
}
