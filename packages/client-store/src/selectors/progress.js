import { createSelector } from 'redux-orm'

import orm from '../orm'
import appSelectors from '.'
import sectionSelectors from './section'

const getProgress = createSelector(
  orm,
  sectionSelectors.getChapters,
  (session, chapters) =>
    // Progress is calculated per chapter (1st-level section)
    chapters.map((chapter) => {
      const sectionIdStart = `${chapter.id}/`

      // moduleUnits (visited sections)
      const sections = session.Section.all().filter(
        (section) =>
          section.id.startsWith(sectionIdStart) || section.id === chapter.id
      )
      const visitedSections = sections.filter((section) => section.visited)

      // exercises
      // TODO:
      // - exclude final test exercises
      // - sum total points & scored points
      const exercises = session.Box.all().filter(
        (box) =>
          box.type === 'exercise' && box.sectionId.startsWith(sectionIdStart)
      )

      // finalTest TODO
      // TODO:
      // - include only final test exercises
      // - sum total points & scored points

      return {
        id: chapter.id,
        title: chapter.title,
        progress: {
          moduleUnits: [visitedSections.count(), sections.count()],
          exercises: [1344, exercises.count()],
          finalTest: [80, 100],
        },
      }
    })
)

export default { getProgress }
