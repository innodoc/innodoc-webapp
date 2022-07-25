import { takeEvery } from 'redux-saga/effects'

import { actionTypes } from '@innodoc/store/actions/question'

import handleQuestionAnsweredSaga from './handleQuestionAnsweredSaga'

export default [takeEvery(actionTypes.QUESTION_ANSWERED, handleQuestionAnsweredSaga)]
