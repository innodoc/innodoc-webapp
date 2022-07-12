import { testSaga, expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { debounce, select, takeEvery } from 'redux-saga/effects'

import { api } from '@innodoc/client-misc'
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

import progressSaga, {
  LOCAL_STORAGE_KEY,
  PERSIST_DEBOUNCE_TIME,
  clearSaga,
  monitorActions,
  persistSaga,
  questionAnsweredSaga,
  restoreSaga,
  submitTestSaga,
} from './progress'

const mockProgress = {
  answeredQuestions: [],
  visitedSections: ['foo/section'],
  testScores: {},
}

const mockProgressLS = {
  answeredQuestions: [],
  visitedSections: ['foo/section', 'bar/section'],
  testScores: { 'bar/section': 12 },
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
  [matchers.call.fn(api.persistProgress), { result: 'ok' }],
  [matchers.call.fn(api.fetchProgress), { result: 'ok', progress: mockProgress }],
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
      .call(api.persistProgress, 'csrfToken123!', mockProgress)
      .not.call.fn(JSON.stringify)
      .not.call.fn(localStorage.setItem)
      .run())

  it('should persist to localStorage if not logged in', () =>
    expectSaga(persistSaga)
      .provide(providesNotLoggedIn)
      .call([JSON, JSON.stringify], mockProgress)
      .call([localStorage, localStorage.setItem], LOCAL_STORAGE_KEY, mockSerializedProgressLS)
      .not.call.fn(api.persistProgress)
      .run())
})

describe('restoreSaga', () => {
  it('should restore from LS and server, sync LS to server and clear LS if logged in', () =>
    expectSaga(restoreSaga)
      .provide(defaultProvides)
      // restore from LS
      .call([localStorage, localStorage.getItem], LOCAL_STORAGE_KEY)
      .call([JSON, JSON.parse], mockSerializedProgressLS)
      .put(
        loadProgress(
          mockProgressLS.answeredQuestions,
          mockProgressLS.visitedSections,
          mockProgressLS.testScores
        )
      )
      // restore from server
      .call(api.fetchProgress)
      .put(
        loadProgress(
          mockProgress.answeredQuestions,
          mockProgress.visitedSections,
          mockProgress.testScores
        )
      )
      // sync back to server and clear LS
      .call(persistSaga)
      .call([localStorage, localStorage.removeItem], LOCAL_STORAGE_KEY)
      .run())

  it("should skip sync'ing back to server if LS was empty", () =>
    expectSaga(restoreSaga)
      .provide([[matchers.call.fn(localStorage.getItem), undefined], ...defaultProvides])
      .not.call.fn(JSON.parse)
      .not.put(
        loadProgress(
          mockProgressLS.answeredQuestions,
          mockProgressLS.visitedSections,
          mockProgressLS.testScores
        )
      )
      .call(api.fetchProgress)
      .put(
        loadProgress(
          mockProgress.answeredQuestions,
          mockProgress.visitedSections,
          mockProgress.testScores
        )
      )
      .not.call.fn(persistSaga)
      .run())

  it('should restore from localStorage if not logged in', () =>
    expectSaga(restoreSaga)
      .provide(providesNotLoggedIn)
      .call([localStorage, localStorage.getItem], LOCAL_STORAGE_KEY)
      .call([JSON, JSON.parse], mockSerializedProgressLS)
      .put(
        loadProgress(
          mockProgressLS.answeredQuestions,
          mockProgressLS.visitedSections,
          mockProgressLS.testScores
        )
      )
      .not.call.fn(api.fetchProgress)
      .not.put(
        loadProgress(
          mockProgress.answeredQuestions,
          mockProgress.visitedSections,
          mockProgress.testScores
        )
      )
      .not.call.fn(localStorage.removeItem)
      .not.call.fn(persistSaga)
      .run())
})

describe('clearSaga', () => {
  it('should put clearProgress', () => expectSaga(clearSaga).put(clearProgress()).run())
})

describe('submitTestSaga', () => {
  it('should calculate score', () =>
    expectSaga(submitTestSaga, { sectionId: 'section/bar' })
      .provide([[select(progressSelectors.calculateTestScore, 'section/bar'), 27]])
      .put(testScore('section/bar', 27))
      .run())
})

describe('questionAnsweredSaga', () => {
  it('should reset test score', () =>
    expectSaga(questionAnsweredSaga, { id: 'Q123' })
      .provide([[select(sectionSelectors.getSectionByQuestion, 'Q123'), { id: 'section/foo' }]])
      .put(testScore('section/foo', undefined))
      .run())
})

describe('monitorActions', () => {
  it('should monitor user actions', () => {
    testSaga(monitorActions)
      .next()
      .all([
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
      .next()
      .isDone()
  })
})

describe('progressSaga', () => {
  it('should fork monitorActions and call restoreSaga', () => {
    testSaga(progressSaga).next().fork(monitorActions).next().call(restoreSaga).next().isDone()
  })
})
