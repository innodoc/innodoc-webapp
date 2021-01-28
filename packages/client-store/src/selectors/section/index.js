import { createSelector } from 'redux-orm'

import orm from '../../orm'
import appSelectors, { makeMakeGetContentLink, selectId } from '..'
import courseSelectors from '../course'
import getBreadcrumbSections from './breadcrumb'
import getNextPrevSections from './next-prev'
import getToc from './toc'

// Return all chapters (=level 1 sections)
const getChapters = createSelector(orm, appSelectors.getApp, (session, { language }) =>
  session.Section.filter((section) => !section.parentId)
    .toModelArray()
    .map((section) => ({
      id: section.id,
      title: section.getDisplayTitle(language),
    }))
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

// Return current section title
const getCurrentTitle = createSelector(
  orm,
  appSelectors.getApp,
  courseSelectors.getCurrentCourse,
  (session, { language }, course) => {
    const section = session.Section.withId(course.currentSectionId)
    return section ? section.getDisplayTitle(language) : undefined
  }
)

// Return section by ID
const getSection = createSelector(orm, selectId, (session, id) => session.Section.withId(id).ref)

// Get section by question ID
const getSectionByQuestion = createSelector(orm, selectId, (session, id) => {
  const question = session.Question.withId(id)
  if (question) {
    const exercise = question.exerciseId
    if (exercise) {
      return exercise.sectionId.ref
    }
  }
  return undefined
})

const makeGetSectionLink = makeMakeGetContentLink('Section')

// Check if section exists
const sectionExists = createSelector(orm, selectId, (session, id) => session.Section.idExists(id))

export default {
  getChapters,
  getCurrentSection,
  getCurrentSubsections,
  getCurrentTitle,
  getSection,
  getSectionByQuestion,
  makeGetSectionLink,
  sectionExists,
  // re-exported
  getBreadcrumbSections,
  getNextPrevSections,
  getToc,
}
