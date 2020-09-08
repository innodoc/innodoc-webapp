import { createSelector } from 'redux-orm'

import RESULT_VALUE from '@innodoc/client-misc/src/resultDef'

import orm from '../orm'
import sectionSelectors from './section'

const getSectionExercises = (session, sections) =>
  sections.reduce((acc, sec) => [...acc, ...sec.exercises.toModelArray()], [])

const getTotalPoints = (exercises) => exercises.reduce((acc, ex) => acc + ex.points, 0)

const getScoredPoints = (exercises) =>
  exercises.reduce(
    (eAcc, ex) =>
      eAcc +
      ex.questions
        .toRefArray()
        .reduce((qAcc, q) => qAcc + (q.result === RESULT_VALUE.CORRECT ? q.points : 0), 0),
    0
  )

const getProgress = createSelector(orm, sectionSelectors.getChapters, (session, chapters) =>
  // Progress is calculated per chapter (1st-level section)
  chapters.map((chapter) => {
    const sectionIdStart = `${chapter.id}/`
    const chapterSections = session.Section.all().filter(
      (section) => section.id.startsWith(sectionIdStart) || section.id === chapter.id
    )
    const moduleSections = chapterSections.filter((section) => section.type !== 'test')
    const visitedSections = moduleSections.filter((section) => section.visited)
    const chapterExercises = getSectionExercises(session, moduleSections.toModelArray())
    const testSections = chapterSections.filter((section) => section.type === 'test')
    const testExercises = getSectionExercises(session, testSections.toModelArray())

    if (chapter.id === '02-elements') {
      console.log('getProgress visited=', visitedSections.count(), 'total=', moduleSections.count())
    }

    return {
      id: chapter.id,
      title: chapter.title,
      progress: {
        moduleUnits: [visitedSections.count(), moduleSections.count()],
        exercises: [getScoredPoints(chapterExercises), getTotalPoints(chapterExercises)],
        finalTest: [getScoredPoints(testExercises), getTotalPoints(testExercises)],
      },
    }
  })
)

// Create progress object for persistance
const getPersistedProgress = createSelector(orm, (session) => {
  const questions = session.Question.filter((q) => q.result !== RESULT_VALUE.NEUTRAL)
    .toRefArray()
    .map((q) => ({
      id: q.id,
      exerciseId: q.exerciseId,
      answer: q.answer,
      answeredTimestamp: q.answeredTimestamp,
      result: q.result,
      points: q.points,
    }))

  const sections = session.Section.filter((s) => s.visited)
    .toRefArray()
    .map((s) => s.id)

  return {
    answeredQuestions: questions,
    visitedSections: sections,
  }
})

export default { getProgress, getPersistedProgress }
