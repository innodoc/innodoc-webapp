import { createSelector } from 'redux-orm'

import orm from '../../orm'
import appSelectors from '..'
import courseSelectors from '../course'

// Return an array for the Breadcrumb component. E.g.:
// [
//  { id: 'foo', title: 'Foo' },
//  { id: 'foo/bar', title: 'Bar' },
//  { id: 'foo/bar/baz', title: 'Baz' },
// ]
const getBreadcrumbSections = createSelector(
  orm, appSelectors.getOrmState, courseSelectors.getCurrentCourse, appSelectors.getApp,
  (session, course, { language }) => (
    course.currentSection
      ? course.currentSection
        // Calculate array of parent sections, e.g.: current='a/b/c' => ['a', 'a/b', 'a/b/c']
        .split('/')
        .reduce(
          // ID fragments to fully qualified ID, e.g. 'c' => 'a/b/c'
          (acc, fragment) => {
            acc.cur.push(fragment)
            acc.res.push(acc.cur.join('/'))
            return acc
          },
          { cur: [], res: [] }).res
        // Map IDs to desired output structure
        .map((id) => {
          const section = session.Section.withId(id)
          return {
            id: section.id,
            title: section.getDisplayTitle(language),
          }
        })
      : []
  )
)

export default getBreadcrumbSections
