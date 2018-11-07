import { createSelector } from 'reselect'

import contentSelectors from '../../selectors/content'
import i18nSelectors from '../../selectors/i18n'
import ormSelectors from './orm'

// Simply returns the state as is
const getState = state => state

const getSectionTable = state => ormSelectors.getDB(state).Section

const getSection = (state, id) => getSectionTable(state).itemsById[id]

const getSectionTitle = (state, id) => getSection(state, id).title[i18nSelectors.getLanguage(state)]

const getSectionContent = (state, id) => (
  getSection(state, id).content[i18nSelectors.getLanguage(state)]
)

// Gets all sub section IDs from the given one, e.g.: ['test', 'test/child1'] for 'test/child1'
const getAllSectionsIdsFromCurrentSectionId = (
  createSelector(
    [contentSelectors.getCurrentSectionPath],
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
  [i18nSelectors.getLanguage, getAllSectionsFromCurrentSectionId],
  (lang, sections) => sections.map(({ id, title }) => ({ id, title: title[lang] })))

// Gets the previous section for the given section
const getPreviousSection = (state, id) => {
  const currentSection = getSection(state, id)
  const prev = getSectionTable(state).items
    // Get the section
    .map(item => getSection(state, item))
    // Filter everything out that has higher 'ord'
    .filter(item => item.ord.localeCompare(currentSection.ord) < 0)
    // Sort lexicographically
    .sort((a, b) => a.ord.localeCompare(b.ord))
    // Get last element
    .pop()

  return prev
}

// Gets the next seciton for the given section
const getNextSection = (state, id) => {
  const currentSection = getSection(state, id)
  const next = getSectionTable(state).items
    // Get the section
    .map(item => getSection(state, item))
    // Filter everything out that has higher 'ord'
    .filter(item => item.ord.localeCompare(currentSection.ord) > 0)
    // Sort lexicographically and get first element
    .sort((a, b) => a.ord.localeCompare(b.ord))[0]

  return next
}

// Gets the next and previous sections based on the given one
const getNavSections = (state, id) => {
  const prev = getPreviousSection(state, id)
  const next = getNextSection(state, id)

  return { prev, next }
}

// Create tree structure for TOC
const getToc = (state) => {
  const sections = getSectionTable(state).items
  const getSectionLevel = (level, parentId) => sections
    .map(item => getSection(state, item))
    .filter(section => (
      // by section level
      section.ord.length === level + 1
      // by parent
      && section.parentId === parentId)
    )
    // add children key
    .map(section => ({
      ...section,
      children: getSectionLevel(level + 1, section.id),
    }))
    .sort((a, b) => a.ord.localeCompare(b.ord))
  return getSectionLevel(0, null)
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
