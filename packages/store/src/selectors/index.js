import { createSelector } from 'redux-orm'

import { util } from '@innodoc/misc'

import orm from '../orm'

const getApp = createSelector(orm, (session) => session.App.first().ref)

const selectId = (state, id) => id

const selectLinkInfo = (state, contentIdHash) => {
  const [contentId, hash] = util.parseContentId(contentIdHash)
  return { hash, contentId }
}

const makeMakeGetContentLink = (modelName) => () =>
  createSelector(orm, getApp, selectLinkInfo, (session, { language }, linkInfo) => {
    const { hash, contentId } = linkInfo
    if (session[modelName].idExists(contentId)) {
      const content = session[modelName].withId(contentId)
      const data = {
        hash,
        contentId,
        title: content.getDisplayTitle(language),
      }
      const shortTitle = content.getDisplayTitle(language, true)
      if (shortTitle !== data.title) {
        data.shortTitle = shortTitle
      }
      return data
    }
    return {
      contentId,
      title: `UNKNOWN CONTENT ID: ${contentId} (${modelName})`,
    }
  })

export { makeMakeGetContentLink, selectId }
export default { getApp }
