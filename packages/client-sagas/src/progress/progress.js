import { all, call, debounce, put, select, takeEvery } from 'redux-saga/effects'

import { fetchProgress, persistProgress } from '@innodoc/client-misc/src/api'
import { actionTypes as contentActionTypes } from '@innodoc/client-store/src/actions/content'
import { actionTypes as questionActionTypes } from '@innodoc/client-store/src/actions/question'
import {
  actionTypes as userActionTypes,
  clearProgress,
  loadProgress,
} from '@innodoc/client-store/src/actions/user'
import appSelectors from '@innodoc/client-store/src/selectors'
import progressSelectors from '@innodoc/client-store/src/selectors/progress'

export const PERSIST_DEBOUNCE_TIME = 2000

export function* persistSaga() {
  const { appRoot, csrfToken, loggedInEmail } = yield select(appSelectors.getApp)

  if (loggedInEmail) {
    const progress = yield select(progressSelectors.getPersistedProgress)
    yield call(persistProgress, appRoot, csrfToken, progress)
  }
}

export function* restoreSaga() {
  const { appRoot, loggedInEmail } = yield select(appSelectors.getApp)

  if (loggedInEmail) {
    let response
    try {
      response = yield call(fetchProgress, appRoot)
    } catch {
      // ignore
    }

    if (
      response.progress &&
      response.progress.answeredQuestions &&
      response.progress.visitedSections
    ) {
      yield put(
        loadProgress(response.progress.answeredQuestions, response.progress.visitedSections)
      )
    }
  }
}

export function* clearSaga() {
  yield put(clearProgress())
}

export default function* progressSaga() {
  yield call(restoreSaga)
  yield all([
    takeEvery(userActionTypes.USER_LOGGED_IN, restoreSaga),
    takeEvery(userActionTypes.USER_LOGGED_OUT, clearSaga),
    debounce(
      PERSIST_DEBOUNCE_TIME,
      [questionActionTypes.QUESTION_EVALUATED, contentActionTypes.SECTION_VISIT],
      persistSaga
    ),
  ])
}
