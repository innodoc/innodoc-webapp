import { createSelector } from 'redux-orm'

import RESULT_VALUE from '@innodoc/client-misc/src/resultDef'

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
          result: RESULT_VALUE.NEUTRAL,
          invalid: false,
        }
  })

export default {
  makeGetQuestion,
}
