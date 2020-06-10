import { createSelector } from 'redux-orm'

import RESULT_VALUE from '@innodoc/client-misc/src/resultDef'

import orm from '../orm'
import { selectId } from '.'

// Check if all questions for exercise are answered
const getExerciseAnswered = createSelector(orm, selectId, (session, id) =>
  session.Question.all()
    .filter({ exerciseId: id })
    .toRefArray()
    .every((question) => question.result !== RESULT_VALUE.NEUTRAL)
)

// Check if all questions for exercise are answered correctly
const getExerciseCorrect = createSelector(orm, selectId, (session, id) =>
  session.Question.all()
    .filter({ exerciseId: id })
    .toRefArray()
    .every((question) => question.result === RESULT_VALUE.CORRECT)
)

export default {
  getExerciseAnswered,
  getExerciseCorrect,
}
