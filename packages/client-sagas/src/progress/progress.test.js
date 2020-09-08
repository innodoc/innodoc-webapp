import { testSaga, expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { debounce, select, takeEvery } from 'redux-saga/effects'

import { persistProgress, fetchProgress } from '@innodoc/client-misc/src/api'
import { actionTypes as contentActionTypes } from '@innodoc/client-store/src/actions/content'
import { actionTypes as questionActionTypes } from '@innodoc/client-store/src/actions/question'
import {
  actionTypes as userActionTypes,
  clearProgress,
  loadProgress,
} from '@innodoc/client-store/src/actions/user'
import appSelectors from '@innodoc/client-store/src/selectors'
import progressSelectors from '@innodoc/client-store/src/selectors/progress'

import progressSaga, {
  LOCAL_STORAGE_KEY,
  PERSIST_DEBOUNCE_TIME,
  clearSaga,
  monitorActions,
  persistSaga,
  restoreSaga,
} from './progress'

const mockProgress = {
  answeredQuestions: [],
  visitedSections: ['foo/section'],
}

const mockProgressLS = {
  answeredQuestions: [],
  visitedSections: ['foo/section', 'bar/section'],
}
const mockSerializedProgressLS = 'SERIALIZED_DATA'

const defaultProvides = [
  [
    select(appSelectors.getApp),
    {
      appRoot: 'https://app.example.com/',
      csrfToken: 'csrfToken123!',
      loggedInEmail: 'alice@example.com',
    },
  ],
  [select(progressSelectors.getPersistedProgress), mockProgress],
  [matchers.call.fn(persistProgress), { result: 'ok' }],
  [matchers.call.fn(fetchProgress), { result: 'ok', progress: mockProgress }],
  [matchers.call.fn(JSON.parse), mockProgressLS],
  [matchers.call.fn(JSON.stringify), mockSerializedProgressLS],
  [matchers.call.fn(localStorage.getItem), mockSerializedProgressLS],
]

const providesNotLoggedIn = [
  [
    select(appSelectors.getApp),
    {
      appRoot: 'https://app.example.com/',
      csrfToken: 'csrfToken123!',
    },
  ],
  ...defaultProvides,
]

describe('persistSaga', () => {
  it('should persist to server if logged in', () =>
    expectSaga(persistSaga)
      .provide(defaultProvides)
      .call(persistProgress, 'https://app.example.com/', 'csrfToken123!', mockProgress)
      .not.call.fn(JSON.stringify)
      .not.call.fn(localStorage.setItem)
      .run())

  it('should persist to localStorage if not logged in', () =>
    expectSaga(persistSaga)
      .provide(providesNotLoggedIn)
      .call([JSON, JSON.stringify], mockProgress)
      .call([localStorage, localStorage.setItem], LOCAL_STORAGE_KEY, mockSerializedProgressLS)
      .not.call.fn(persistProgress)
      .run())
})

describe('restoreSaga', () => {
  it('should restore from LS and server, sync LS to server and clear LS if logged in', () =>
    expectSaga(restoreSaga)
      .provide(defaultProvides)
      // restore from LS
      .call([localStorage, localStorage.getItem], LOCAL_STORAGE_KEY)
      .call([JSON, JSON.parse], mockSerializedProgressLS)
      .put(loadProgress(mockProgressLS.answeredQuestions, mockProgressLS.visitedSections))
      // restore from server
      .call(fetchProgress, 'https://app.example.com/')
      .put(loadProgress(mockProgress.answeredQuestions, mockProgress.visitedSections))
      // sync back to server and clear LS
      .call([localStorage, localStorage.removeItem], LOCAL_STORAGE_KEY)
      .call(persistSaga)
      .run())

  it("should skip sync'ing back to server if LS was empty", () =>
    expectSaga(restoreSaga)
      .provide([[matchers.call.fn(localStorage.getItem), undefined], ...defaultProvides])
      .not.call.fn(JSON.parse)
      .not.put(loadProgress(mockProgressLS.answeredQuestions, mockProgressLS.visitedSections))
      .call(fetchProgress, 'https://app.example.com/')
      .put(loadProgress(mockProgress.answeredQuestions, mockProgress.visitedSections))
      .not.call.fn(persistSaga)
      .run())

  it('should restore from localStorage if not logged in', () =>
    expectSaga(restoreSaga)
      .provide(providesNotLoggedIn)
      .call([localStorage, localStorage.getItem], LOCAL_STORAGE_KEY)
      .call([JSON, JSON.parse], mockSerializedProgressLS)
      .put(loadProgress(mockProgressLS.answeredQuestions, mockProgressLS.visitedSections))
      .not.call.fn(fetchProgress)
      .not.put(loadProgress(mockProgress.answeredQuestions, mockProgress.visitedSections))
      .not.call.fn(localStorage.removeItem)
      .not.call.fn(persistSaga)
      .run())
})

describe('clearSaga', () => {
  it('should put clearProgress', () => expectSaga(clearSaga).put(clearProgress()).run())
})

describe('monitorActions', () => {
  it('should monitor user actions', () => {
    testSaga(monitorActions)
      .next()
      .all([
        takeEvery(userActionTypes.USER_LOGGED_IN, restoreSaga),
        takeEvery(userActionTypes.USER_LOGGED_OUT, clearSaga),
        debounce(
          PERSIST_DEBOUNCE_TIME,
          [questionActionTypes.QUESTION_EVALUATED, contentActionTypes.SECTION_VISIT],
          persistSaga
        ),
      ])
      .next()
      .isDone()
  })
})

describe('progressSaga', () => {
  it('should fork monitorActions and call restoreSaga', () => {
    testSaga(progressSaga).next().fork(monitorActions).next().call(restoreSaga).next().isDone()
  })
})
