import { createSelector } from 'redux-orm'

import orm from '../orm.js'

import { getCurrentCourse } from './course.js'
import { getMakeGetContentLink, selectId } from './misc.js'

// Check if page exists
export const pageExists = createSelector(orm, selectId, (session, id) => session.Page.idExists(id))

// Return current page
export const getCurrentPage = createSelector(orm, getCurrentCourse, (session, course) => {
  if (course) {
    const page = session.Page.withId(course.currentPageId)
    return page ? page.ref : undefined
  }
  return undefined
})

// Return page by ID
export const getPage = createSelector(orm, selectId, (session, id) => session.Page.withId(id).ref)

// Return pages that appear in footer
export const getFooterPages = createSelector(orm, (session) =>
  session.Page.all()
    .filter((page) => page.inFooter)
    .orderBy('ord')
    .toRefArray()
)

// Return pages that appear in navigation
export const getNavPages = createSelector(orm, (session) =>
  session.Page.all()
    .filter((page) => page.inNav)
    .orderBy('ord')
    .toRefArray()
)

export const makeGetPageLink = getMakeGetContentLink('Page')
