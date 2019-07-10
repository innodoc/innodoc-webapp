import { createSelector } from 'redux-orm'

import orm from '../orm'
import appSelectors, { selectId } from '.'

// Return question answer by ID
const makeGetQuestion = () => createSelector(
  orm, appSelectors.getOrmState, selectId,
  (session, id) => {
    const question = session.Question.withId(id)
    return question
      ? question.ref
      : {
        answer: null,
        correct: null,
        id: null,
      }
  }
)

export default {
  makeGetQuestion,
}
