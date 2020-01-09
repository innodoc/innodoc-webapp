import { createSelector } from 'redux-orm'

import orm from '../orm'
import { makeMakeGetContentLink, selectId } from '.'
import courseSelectors from './course'

// Check if page exists
const pageExists = createSelector(orm, selectId, (session, id) =>
  session.Page.idExists(id)
)

// Return current page
const getCurrentPage = createSelector(
  orm,
  courseSelectors.getCurrentCourse,
  (session, course) => {
    if (course) {
      const page = course ? session.Page.withId(course.currentPage) : null
      return page ? page.ref : null
    }
    return null
  }
)

// Return page by ID
const getPage = createSelector(
  orm,
  selectId,
  (session, id) => session.Page.withId(id).ref
)

// Return pages that appear in footer
const getFooterPages = createSelector(orm, (session) =>
  session.Page.all()
    .filter((page) => page.inFooter)
    .orderBy('ord')
    .toRefArray()
)

// Return pages that appear in navigation
const getNavPages = createSelector(orm, (session) =>
  session.Page.all()
    .filter((page) => page.inNav)
    .orderBy('ord')
    .toRefArray()
)

const makeGetPageLink = makeMakeGetContentLink('Page')

export default {
  pageExists,
  getCurrentPage,
  getPage,
  getFooterPages,
  getNavPages,
  makeGetPageLink,
}
