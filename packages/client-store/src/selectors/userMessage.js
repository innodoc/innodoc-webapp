import { createSelector } from 'redux-orm'

import orm from '../orm'

const getLatest = createSelector(orm, (session) => {
  const last = session.UserMessage.last()
  return last ? last.ref : undefined
})

export default {
  getLatest,
}
