import { createSelector } from 'redux-orm'

import orm from '../../orm'
import appSelectors from '..'
import courseSelectors from '../course'
import getBreadcrumbSections from './breadcrumb'
import getNextPrevSections from './next-prev'
import getToc from './toc'

const selectSectionId = (state, id) => id

// Check if section exists
const sectionExists = createSelector(
  orm, appSelectors.getOrmState, selectSectionId,
  (session, id) => session.Section.idExists(id)
)

// Return section by ID
const getSection = createSelector(
  orm, appSelectors.getOrmState, selectSectionId,
  (session, id) => session.Section.withId(id).ref
)

// Return current section
const getCurrentSection = createSelector(
  orm, appSelectors.getOrmState, courseSelectors.getCurrentCourse,
  (session, course) => {
    const section = session.Section.withId(course.currentSectionId)
    return section ? section.ref : null
  }
)

// Return direct subsections for current section
const getCurrentSubsections = createSelector(
  orm, appSelectors.getOrmState, courseSelectors.getCurrentCourse,
  (session, course) => session.Section.all()
    .filter(section => section.parentId === course.currentSectionId)
    .toRefArray()
)

export default {
  getBreadcrumbSections,
  getCurrentSection,
  getCurrentSubsections,
  getNextPrevSections,
  getSection,
  getToc,
  sectionExists,
}
