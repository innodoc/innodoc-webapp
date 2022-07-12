import { createSelector } from 'redux-orm'

import { constants } from '@innodoc/client-misc'

import orm from '../orm'
import { selectId } from '.'

const getExercise = createSelector(orm, selectId, (session, id) => {
  const exercise = session.Exercise.withId(id)
  const questions = session.Question.filter({ exerciseId: id }).toRefArray()
  const answeredQuestions = questions.filter((q) => q.result !== constants.RESULT.NEUTRAL)
  const isAnswered = answeredQuestions && answeredQuestions.length === exercise.questionCount

  return {
    id: exercise.id,
    isAnswered,
    isCorrect: isAnswered && answeredQuestions.every((q) => q.result === constants.RESULT.CORRECT),
    isTouched: questions.some((q) => q.result !== constants.RESULT.NEUTRAL),
  }
})

export default { getExercise }
