import { createSelector } from 'redux-orm'

import RESULT_VALUE from '@innodoc/client-misc/src/resultDef'

import orm from '../orm'
import { selectId } from '.'

const getExercise = createSelector(orm, selectId, (session, id) => {
  const exercise = session.Exercise.withId(id)
  const questions = session.Question.filter({ exerciseId: id }).toRefArray()
  const answeredQuestions = questions.filter((q) => q.result !== RESULT_VALUE.NEUTRAL)
  const isAnswered = answeredQuestions && answeredQuestions.length === (exercise ? exercise.questionCount : 0)

  return {
    id: exercise ? exercise.id : 0,
    isAnswered,
    isCorrect: isAnswered && answeredQuestions.every((q) => q.result === RESULT_VALUE.CORRECT),
    isTouched: questions.some((q) => q.result !== RESULT_VALUE.NEUTRAL),
  }
})

export default { getExercise }
