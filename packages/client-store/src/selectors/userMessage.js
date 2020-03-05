import { createSelector } from 'redux-orm'

import orm from '../orm'

const getLatestMessage = createSelector(orm, (session) => {
  const message = session.UserMessage.last()
  return message ? message.ref : undefined
})

export default {
  getLatestMessage,
}
