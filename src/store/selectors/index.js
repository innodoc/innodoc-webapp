import { createSelector } from 'redux-orm'

import orm from '../orm'
import { parseContentId } from '../../lib/util'

const getOrmState = (state) => state.orm

const getApp = createSelector(
  orm, getOrmState,
  (session) => session.App.first().ref
)

const selectId = (state, id) => id

const selectLinkInfo = (state, contentIdHash) => {
  const [contentId, hash] = parseContentId(contentIdHash)
  return { hash, contentId }
}

const makeMakeGetContentLink = (modelName) => (
  () => createSelector(
    orm,
    getOrmState,
    getApp,
    selectLinkInfo,
    (session, { language }, linkInfo) => {
      const { hash, contentId } = linkInfo
      if (session[modelName].idExists(contentId)) {
        const content = session[modelName].withId(contentId)
        return {
          hash,
          contentId,
          title: content.getDisplayTitle(language),
        }
      }
      return {
        contentId,
        title: `UNKNOWN CONTENT ID: ${contentId} (${modelName})`,
      }
    }
  )
)

export { makeMakeGetContentLink, selectId }
export default { getApp, getOrmState }
