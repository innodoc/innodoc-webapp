import { createSelector } from 'redux-orm'

import orm from '../../orm'
import appSelectors from '..'

const getChildren = (session, level, parentId) => session.Section.all().toRefArray()
  .filter((section) => (
    // by section level
    section.ord.length === level + 1
    // by parent
    && section.parentId === parentId)
  )
  // add children key
  .map((section) => ({
    ...section,
    children: getChildren(session, level + 1, section.id),
  }))
  .sort((a, b) => a.ord[level] > b.ord[level])

// Create tree structure for the TOC
const getToc = createSelector(
  orm, appSelectors.getOrmState,
  (session) => getChildren(session, 0, null)
)

export default getToc
