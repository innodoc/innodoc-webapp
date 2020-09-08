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

export const LOCAL_STORAGE_KEY = 'user-progress'
export const PERSIST_DEBOUNCE_TIME = 2000

export function* persistSaga() {
  const { appRoot, csrfToken, loggedInEmail } = yield select(appSelectors.getApp)
  const progress = yield select(progressSelectors.getPersistedProgress)

  console.log('persistSaga')

  if (loggedInEmail) {
    // From server
    yield call(persistProgress, appRoot, csrfToken, progress)
    console.log('persisted to server')
  } else {
    // localStorage
    const serializedProgress = yield call([JSON, JSON.stringify], progress)
    try {
      yield call([localStorage, localStorage.setItem], LOCAL_STORAGE_KEY, serializedProgress)
      console.log('persist to local success')
    } catch (err) {
      console.log('persist to local failed')
      console.log(err)
      // Might throw (storage full, Mobile Safari private mode)
    }
  }
}

export function* restoreSaga() {
  const { appRoot, loggedInEmail } = yield select(appSelectors.getApp)
  let gotLocalStorageData = false

  console.log('restoreSaga')

  // localStorage
  try {
    const serializedProgress = yield call([localStorage, localStorage.getItem], LOCAL_STORAGE_KEY)
    if (serializedProgress) {
      const progress = yield call([JSON, JSON.parse], serializedProgress)
      if (progress && progress.answeredQuestions && progress.visitedSections) {
        yield put(loadProgress(progress.answeredQuestions, progress.visitedSections))
        console.log('restore from local success')
        gotLocalStorageData = true
      }
    }
  } catch (err) {
    console.log('restore from local failed')
    console.log(err)
    // ignore
  }

  // server
  if (loggedInEmail) {
    try {
      const { progress } = yield call(fetchProgress, appRoot)
      console.log('server loaded')
      if (progress && progress.answeredQuestions && progress.visitedSections) {
        yield call([localStorage, localStorage.removeItem], LOCAL_STORAGE_KEY)
        console.log('local cleared')
        yield put(loadProgress(progress.answeredQuestions, progress.visitedSections))
        if (gotLocalStorageData) {
          // Sync localStorage back to server
          yield call(persistSaga)
          console.log('pesistSaga called to sync local back to server')
        }
      }
    } catch (err) {
      console.log('persist to server failed')
      console.log(err)
      // ignore
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
