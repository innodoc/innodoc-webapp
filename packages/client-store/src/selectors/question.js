import { createSelector } from 'redux-orm'

import orm from '../orm'
import { selectId } from '.'

// Return question answer by ID
const makeGetQuestion = () =>
  createSelector(orm, selectId, (session, id) => {
    const question = session.Question.withId(id)
    return question
      ? question.ref
      : {
          answer: undefined,
          correct: undefined,
          id: undefined,
        }
  })

export default {
  makeGetQuestion,
}
