import { createSelector } from 'redux-orm'

import { constants } from '@innodoc/client-misc'

import orm from '../orm'
import { selectId } from '.'

// Return question answer by ID
const makeGetQuestion = () =>
  createSelector(orm, selectId, (session, id) => {
    const question = session.Question.withId(id)
    return question
      ? question.ref
      : {
          id: undefined,
          answer: undefined,
          messages: [],
          result: constants.RESULT.NEUTRAL,
          invalid: false,
        }
  })

export default {
  makeGetQuestion,
}
