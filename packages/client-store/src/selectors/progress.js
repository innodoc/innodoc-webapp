import { createSelector } from 'redux-orm'

import RESULT_VALUE from '@innodoc/client-misc/src/resultDef'

import orm from '../orm'
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
      const moduleUnits = [visitedSections.count(), sections.count()]

      // exercises
      // TODO: exclude final test exercises
      const chapterExercises = session.Exercise.all()
        .filter((ex) => ex.sectionId.startsWith(sectionIdStart))
        .toModelArray()
      let exercises
      if (chapterExercises.length) {
        // Sum over total points
        const total = chapterExercises.reduce((acc, ex) => acc + ex.points, 0)
        // Sum over scored points
        const scored = chapterExercises.reduce(
          (eAcc, ex) =>
            eAcc +
            ex.questions
              .toRefArray()
              .reduce(
                (qAcc, q) =>
                  qAcc + (q.result === RESULT_VALUE.CORRECT ? q.points : 0),
                0
              ),
          0
        )
        exercises = [scored, total]
      } else {
        exercises = null
      }

      // finalTest
      // TODO: only final test exercises, sum total points & scored points
      const finalTest = [80, 100]

      return {
        id: chapter.id,
        title: chapter.title,
        progress: { moduleUnits, exercises, finalTest },
      }
    })
)

export default { getProgress }
