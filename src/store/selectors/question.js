import { createSelector } from 'redux-orm'

import orm from '../orm'
import appSelectors from '.'

const selectQuestionId = (state, id) => id

// Return question answer by ID
const getQuestion = createSelector(
  orm, appSelectors.getOrmState, selectQuestionId,
  (session, id) => {
    const question = session.Question.withId(id)
    return question ? question.ref : null
  }
)

export default {
  getQuestion,
}
