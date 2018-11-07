import { createSelector } from 'reselect'

import appSelectors from './app'
import ormSelectors from './orm'

// Simply returns the state as is
const getState = state => state

const getSectionTable = state => ormSelectors.getDB(state).Section

const getSection = (state, id) => getSectionTable(state).itemsById[id]

const getSectionTitle = (state, id) => getSection(state, id).title[appSelectors.getLanguage(state)]

const getSectionContent = (state, id) => (
  getSection(state, id).content[appSelectors.getLanguage(state)]
)

// Gets all sub section IDs from the given one, e.g.: ['test', 'test/child1'] for 'test/child1'
const getAllSectionsIdsFromCurrentSectionId = (
  createSelector(
    [appSelectors.getCurrentSectionId],
    id => id
      // Get the ID fragments from the given ID
      .split('/')
      // Transform ID fragments into their fully qualified ID
      .reduce(
        (acc, fragment) => {
          acc.cur.push(fragment)
          acc.res.push(acc.cur.join('/'))
          return acc
        },
        { cur: [], res: [] })
      // Get the result only
      .res)
)

// Gets all sub section IDs from the given one
const getAllSectionsFromCurrentSectionId = (
  createSelector(
    [getState, getAllSectionsIdsFromCurrentSectionId],
    (state, ids) => ids.map(id => getSection(state, id)))
)

// Returns an array for the Breadcrumb component which looks like this:
// [
//  {
//    id: 'test1',
//    title: 'some title'
//  },
//  {
//    id: 'test1/child1',
//    title: 'another title'
//  },
//  {
//    id: 'test1/child/subchild',
//    title: 'even more titles'
//  },
// ]
const getBreadcrumbSections = createSelector(
  [appSelectors.getLanguage, getAllSectionsFromCurrentSectionId],
  (lang, sections) => sections.map(({ id, title }) => ({ id, title: title[lang] })))

// Gets the next and previous sections based on the given one
const getNavSections = (state, id) => {
  const sortedSections = getSectionTable(state).items
    // Get the section
    .map(item => getSection(state, item))
    // Sort lexicographically
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

      // Tie if both have the same length
      if (a.ord.length === b.ord.length) {
        return 0
      }

      // Check whoever has a longer length
      return a.ord.length < b.ord.length ? -1 : 1
    })
  const idx = sortedSections.findIndex(section => section.id === id)

  return {
    prev: idx > 0 ? sortedSections[idx - 1] : null,
    next: idx < sortedSections.length - 1 ? sortedSections[idx + 1] : null,
  }
}

// Create tree structure for TOC
const getToc = (state) => {
  const sections = getSectionTable(state).items
  const getSectionLevel = (level, parentOrd = null) => sections
    .map(item => getSection(state, item))
    .filter(section => (
      // by section level
      section.ord.length === level + 1
      // by parent
      && (level < 1 || section.ord.slice(0, -1).join('/') === parentOrd.join('/'))
    ))
    .map(section => ({
      ...section,
      children: getSectionLevel(level + 1, section.ord),
    }))
  return getSectionLevel(0)
}

export default {
  getSectionTable,
  getSection,
  getSectionTitle,
  getSectionContent,
  getBreadcrumbSections,
  getNavSections,
  getToc,
}
