import { createSelector } from 'redux-orm'

import orm from '../../orm'
import appSelectors from '..'
import { parseSectionId } from '../../../lib/util'

const selectLinkInfo = (state, sectionIdHash) => {
  const [sectionId, hash] = parseSectionId(sectionIdHash)
  return { hash, sectionId }
}

const makeGetSectionLink = () => createSelector(
  orm,
  appSelectors.getOrmState,
  appSelectors.getApp,
  selectLinkInfo,
  (session, { language }, linkInfo) => {
    const { hash, sectionId } = linkInfo
    if (session.Section.idExists(sectionId)) {
      const section = session.Section.withId(sectionId)
      return {
        hash,
        section: {
          id: sectionId,
          title: section.getDisplayTitle(language),
        },
      }
    }
    return {
      section: {
        id: sectionId,
        title: `UNKNOWN SECTION ID: ${sectionId}`,
      },
    }
  }
)

export default makeGetSectionLink
