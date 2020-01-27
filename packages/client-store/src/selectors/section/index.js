import { createSelector } from 'redux-orm'

import orm from '../../orm'
import appSelectors, { makeMakeGetContentLink, selectId } from '..'
import courseSelectors from '../course'
import getBreadcrumbSections from './breadcrumb'
import getNextPrevSections from './next-prev'
import getToc from './toc'

// Check if section exists
const sectionExists = createSelector(orm, selectId, (session, id) =>
  session.Section.idExists(id)
)

// Return section by ID
const getSection = createSelector(
  orm,
  selectId,
  (session, id) => session.Section.withId(id).ref
)

// Return current section
const getCurrentSection = createSelector(
  orm,
  courseSelectors.getCurrentCourse,
  (session, course) => {
    if (course) {
      const section = session.Section.withId(course.currentSectionId)
      return section ? section.ref : undefined
    }
    return undefined
  }
)

// Return direct subsections for current section
const getCurrentSubsections = createSelector(
  orm,
  courseSelectors.getCurrentCourse,
  (session, course) =>
    course.currentSectionId
      ? session.Section.all()
          .filter((section) => section.parentId === course.currentSectionId)
          .toRefArray()
      : []
)

const getCurrentTitle = createSelector(
  orm,
  appSelectors.getApp,
  courseSelectors.getCurrentCourse,
  (session, { language }, course) => {
    const section = session.Section.withId(course.currentSectionId)
    return section ? section.getDisplayTitle(language) : undefined
  }
)

const makeGetSectionLink = makeMakeGetContentLink('Section')

export default {
  getBreadcrumbSections,
  getCurrentSection,
  getCurrentSubsections,
  getCurrentTitle,
  getNextPrevSections,
  getSection,
  getToc,
  makeGetSectionLink,
  sectionExists,
}
