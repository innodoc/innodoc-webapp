import { all, call, fork, debounce, put, select, takeEvery } from 'redux-saga/effects'

import api from '@innodoc/misc/api'
import { actionTypes as contentActionTypes } from '@innodoc/store/actions/content'
import { actionTypes as exerciseActionTypes } from '@innodoc/store/actions/exercise'
import { actionTypes as questionActionTypes } from '@innodoc/store/actions/question'
import {
  actionTypes as userActionTypes,
  clearProgress,
  loadProgress,
  testScore,
} from '@innodoc/store/actions/user'
import { getApp } from '@innodoc/store/selectors/misc'
import { getPersistedProgress, calculateTestScore } from '@innodoc/store/selectors/progress'
import { getSectionByQuestion } from '@innodoc/store/selectors/section'

export const LOCAL_STORAGE_KEY = 'user-progress'
export const PERSIST_DEBOUNCE_TIME = 2000

export function* persistSaga() {
  const { csrfToken, loggedInEmail } = yield select(getApp)
  const progress = yield select(getPersistedProgress)

  if (loggedInEmail) {
    // server
    yield call(api.persistProgress, csrfToken, progress)
  } else {
    // localStorage
    const serializedProgress = yield call([JSON, JSON.stringify], progress)
    try {
      yield call([localStorage, localStorage.setItem], LOCAL_STORAGE_KEY, serializedProgress)
    } catch {
      // Might throw (storage full, Mobile Safari private mode)
    }
  }
}

export function* restoreSaga() {
  const { loggedInEmail } = yield select(getApp)
  let localProgress

  // localStorage
  try {
    const serializedProgress = yield call([localStorage, localStorage.getItem], LOCAL_STORAGE_KEY)
    if (serializedProgress) {
      localProgress = yield call([JSON, JSON.parse], serializedProgress)
      if (
        localProgress &&
        localProgress.answeredQuestions &&
        localProgress.visitedSections &&
        localProgress.testScores
      ) {
        yield put(
          loadProgress(
            localProgress.answeredQuestions,
            localProgress.visitedSections,
            localProgress.testScores
          )
        )
      }
    }
  } catch {
    // ignore
  }

  // server
  if (loggedInEmail) {
    try {
      const { progress: remoteProgress } = yield call(api.fetchProgress)
      if (
        remoteProgress &&
        remoteProgress.answeredQuestions &&
        remoteProgress.visitedSections &&
        remoteProgress.testScores
      ) {
        yield put(
          loadProgress(
            remoteProgress.answeredQuestions,
            remoteProgress.visitedSections,
            remoteProgress.testScores
          )
        )
      }
    } catch {
      // ignore
    } finally {
      // Sync local back to server and delete local progress
      if (localProgress) {
        yield call(persistSaga)
        yield call([localStorage, localStorage.removeItem], LOCAL_STORAGE_KEY)
      }
    }
  }
}

export function* clearSaga() {
  yield put(clearProgress())
}

export function* submitTestSaga({ sectionId }) {
  const score = yield select(calculateTestScore, sectionId)
  yield put(testScore(sectionId, score))
}

// When a question in a submitted test is answered we need to reset the test score
export function* questionAnsweredSaga({ id }) {
  const section = yield select(getSectionByQuestion, id)
  if (section) {
    yield put(testScore(section.id, undefined))
  }
}

export function* monitorActions() {
  yield all([
    takeEvery(questionActionTypes.QUESTION_ANSWERED, questionAnsweredSaga),
    takeEvery(userActionTypes.USER_LOGGED_IN, restoreSaga),
    takeEvery(userActionTypes.USER_LOGGED_OUT, clearSaga),
    takeEvery(userActionTypes.SUBMIT_TEST, submitTestSaga),
    debounce(
      PERSIST_DEBOUNCE_TIME,
      [
        contentActionTypes.SECTION_VISIT,
        exerciseActionTypes.RESET_EXERCISE,
        questionActionTypes.QUESTION_EVALUATED,
        userActionTypes.RESET_TEST,
        userActionTypes.TEST_SCORE,
      ],
      persistSaga
    ),
  ])
}

export default function* progressSaga() {
  yield fork(monitorActions)
  yield call(restoreSaga)
}
