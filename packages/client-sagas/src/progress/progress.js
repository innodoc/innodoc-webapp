import { all, call, fork, debounce, put, select, takeEvery } from 'redux-saga/effects'

import { fetchProgress, persistProgress } from '@innodoc/client-misc/src/api'
import { actionTypes as contentActionTypes } from '@innodoc/client-store/src/actions/content'
import { actionTypes as exerciseActionTypes } from '@innodoc/client-store/src/actions/exercise'
import { actionTypes as questionActionTypes } from '@innodoc/client-store/src/actions/question'
import {
  actionTypes as userActionTypes,
  clearProgress,
  loadProgress,
  testScore,
} from '@innodoc/client-store/src/actions/user'
import appSelectors from '@innodoc/client-store/src/selectors'
import progressSelectors from '@innodoc/client-store/src/selectors/progress'
import sectionSelectors from '@innodoc/client-store/src/selectors/section'

export const LOCAL_STORAGE_KEY = 'user-progress'
export const PERSIST_DEBOUNCE_TIME = 2000

export function* persistSaga() {
  const { appRoot, csrfToken, loggedInEmail } = yield select(appSelectors.getApp)
  const progress = yield select(progressSelectors.getPersistedProgress)

  if (loggedInEmail) {
    // server
    yield call(persistProgress, appRoot, csrfToken, progress)
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
  const { appRoot, loggedInEmail } = yield select(appSelectors.getApp)
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
      const { progress: remoteProgress } = yield call(fetchProgress, appRoot)
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
  const score = yield select(progressSelectors.calculateTestScore, sectionId)
  yield put(testScore(sectionId, score))
}

// When a question in a submitted test is answered we need to reset the test score
export function* questionAnsweredSaga({ id }) {
  const section = yield select(sectionSelectors.getSectionByQuestion, id)
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
