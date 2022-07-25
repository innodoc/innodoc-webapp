import { createSelector } from 'redux-orm'

import { RESULT } from '@innodoc/misc/constants'

import orm from '../orm.js'

import { selectId } from './misc.js'

const getExercise = createSelector(orm, selectId, (session, id) => {
  const exercise = session.Exercise.withId(id)
  const questions = session.Question.filter({ exerciseId: id }).toRefArray()
  const answeredQuestions = questions.filter((q) => q.result !== RESULT.NEUTRAL)
  const isAnswered = answeredQuestions && answeredQuestions.length === exercise.questionCount

  return {
    id: exercise.id,
    isAnswered,
    isCorrect: isAnswered && answeredQuestions.every((q) => q.result === RESULT.CORRECT),
    isTouched: questions.some((q) => q.result !== RESULT.NEUTRAL),
  }
})

export default getExercise
