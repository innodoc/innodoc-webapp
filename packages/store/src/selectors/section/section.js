import { createSelector } from 'redux-orm'

import orm from '../../orm.js'
import { getCurrentCourse } from '../course.js'
import { getApp, getMakeGetContentLink, selectId } from '../misc.js'

import getBreadcrumbSections from './getBreadcrumbSections.js'
import getNextPrevSections from './getNextPrevSections.js'
import getToc from './getToc.js'

// Return all chapters (=level 1 sections)
const getChapters = createSelector(orm, getApp, (session, { language }) =>
  session.Section.filter((section) => !section.parentId)
    .toModelArray()
    .map((section) => ({
      id: section.id,
      title: section.getDisplayTitle(language),
    }))
)

// Return current section
const getCurrentSection = createSelector(orm, getCurrentCourse, (session, course) => {
  if (course) {
    const section = session.Section.withId(course.currentSectionId)
    return section ? section.ref : undefined
  }
  return undefined
})

// Return direct subsections for current section
const getCurrentSubsections = createSelector(orm, getCurrentCourse, (session, course) => {
  if (course === undefined || course.currentSectionId === undefined) {
    return []
  }
  return session.Section.all()
    .filter((section) => section.parentId === course.currentSectionId)
    .toRefArray()
})

// Return current section title
const getCurrentTitle = createSelector(
  orm,
  getApp,
  getCurrentCourse,
  (session, { language }, course) => {
    if (course === undefined) {
      return undefined
    }
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

const makeGetSectionLink = getMakeGetContentLink('Section')

// Check if section exists
const sectionExists = createSelector(orm, selectId, (session, id) => session.Section.idExists(id))

export {
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
