import { createSelector } from 'redux-orm'

import orm from '../orm'
import appSelectors from '.'
import sectionSelectors from './section'

// Return exercise boxes
const getExerciseBoxesByChapter = createSelector(
  orm,
  appSelectors.getApp,
  sectionSelectors.getChapters,
  (session, { language }, chapters) =>
    chapters.map((chapter) => {
      const sectionIdStart = `${chapter.id}/`
      const boxes = session.Box.filter(
        (box) =>
          box.type === 'exercise' && box.sectionId.startsWith(sectionIdStart)
      ).toRefArray()
      return {
        boxes,
        id: chapter.id,
        title: chapter.getDisplayTitle(language),
      }
    })
)

export default { getExerciseBoxesByChapter }
