import { createSelector } from 'redux-orm'

import orm from '../../orm.js'
import { getCurrentCourse } from '../course.js'

const getSortedSections = createSelector(orm, (session) =>
  session.Section.all()
    .toRefArray()
    // sort lexicographically
    .sort((a, b) => {
      const minLen = Math.min(a.ord.length, b.ord.length)
      for (let i = 0; i < minLen; i += 1) {
        if (a.ord[i] < b.ord[i]) {
          return -1
        }
        if (a.ord[i] > b.ord[i]) {
          return 1
        }
      }
      // tie if both have the same length
      if (a.ord.length === b.ord.length) {
        return 0
      }
      // which section is deeper
      return a.ord.length < b.ord.length ? -1 : 1
    })
)

// Gets the next and previous sections
const getNextPrevSections = createSelector(
  orm,
  getCurrentCourse,
  getSortedSections,
  (session, course, sortedSections) => {
    if (course === undefined) {
      return {
        prevId: undefined,
        nextId: undefined,
      }
    }
    const idx = sortedSections.findIndex((section) => section.id === course.currentSectionId)
    return {
      prevId: idx > 0 ? sortedSections[idx - 1].id : undefined,
      nextId: idx < sortedSections.length - 1 ? sortedSections[idx + 1].id : undefined,
    }
  }
)

export default getNextPrevSections
