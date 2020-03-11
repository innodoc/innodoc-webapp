import { createSelector } from 'redux-orm'

import orm from '../orm'

const makeGetLatest = (types) =>
  createSelector(orm, (session) => {
    const last = session.UserMessage.filter((msg) =>
      types.includes(msg.type)
    ).last()
    return last ? last.ref : undefined
  })

export default {
  makeGetLatest,
}
