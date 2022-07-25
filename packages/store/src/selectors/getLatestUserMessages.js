import { createSelector } from 'redux-orm'

import orm from '../orm.js'

const getLatestUserMessages = createSelector(orm, (session) => {
  const last = session.UserMessage.last()
  return last ? last.ref : undefined
})

export default getLatestUserMessages
