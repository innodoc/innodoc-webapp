import { createSelector } from 'redux-orm'

import { RESULT } from '@innodoc/misc/constants'

import orm from '../orm.js'

import { selectId } from './misc.js'

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
          result: RESULT.NEUTRAL,
          invalid: false,
        }
  })

export default makeGetQuestion
