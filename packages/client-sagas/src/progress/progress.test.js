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
  PERSIST_DEBOUNCE_TIME,
  clearSaga,
  persistSaga,
  restoreSaga,
} from './progress'

const mockProgress = {
  answeredQuestions: [],
  visitedSections: ['foo/section'],
}
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
]

describe('persistSaga', () => {
  it('should persist progress if logged in', () =>
    expectSaga(persistSaga)
      .provide(defaultProvides)
      .call(persistProgress, 'https://app.example.com/', 'csrfToken123!', mockProgress)
      .run())

  it('should not persist progress if not logged in', () =>
    expectSaga(persistSaga)
      .provide([
        [
          select(appSelectors.getApp),
          {
            appRoot: 'https://app.example.com/',
            csrfToken: 'csrfToken123!',
          },
        ],
        ...defaultProvides,
      ])
      .not.call.fn(persistProgress)
      .run())
})

describe('restoreSaga', () => {
  it('should restore progress if logged in', () =>
    expectSaga(restoreSaga)
      .provide(defaultProvides)
      .call(fetchProgress, 'https://app.example.com/')
      .put(loadProgress(mockProgress.answeredQuestions, mockProgress.visitedSections))
      .run())

  it('should not restore progress if not logged in', () =>
    expectSaga(restoreSaga)
      .provide([
        [
          select(appSelectors.getApp),
          {
            appRoot: 'https://app.example.com/',
            csrfToken: 'csrfToken123!',
          },
        ],
        ...defaultProvides,
      ])
      .not.call.fn(fetchProgress)
      .not.put.actionType(userActionTypes.LOAD_PROGRESS)
      .run())
})

describe('clearSaga', () => {
  it('should put clearProgress', () => expectSaga(clearSaga).put(clearProgress()).run())
})

describe('progressSaga', () => {
  it('should restore, fork and debounce persist', () => {
    testSaga(progressSaga)
      .next()
      .call(restoreSaga)
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
