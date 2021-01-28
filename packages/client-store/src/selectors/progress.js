import { createSelector } from 'redux-orm'

import RESULT_VALUE from '@innodoc/client-misc/src/resultDef'

import orm from '../orm'
import sectionSelectors from './section'
import { selectId } from '.'

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

// Calculate test score
const calculateTestScore = createSelector(orm, selectId, (session, id) =>
  getScoredPoints(session.Section.withId(id).exercises.toModelArray())
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

  const scores = session.Section.filter((s) => s.type === 'test')
    .toRefArray()
    .reduce((acc, s) => (s.testScore === undefined ? acc : { ...acc, [s.id]: s.testScore }), {})

  return {
    answeredQuestions: questions,
    visitedSections: sections,
    testScores: scores,
  }
})

// Return information about test section
const getTest = createSelector(orm, sectionSelectors.getCurrentSection, (session, section) => {
  const testInfo = {
    canBeReset: true,
    canBeSubmitted: true,
    isSubmitted: true,
    score: undefined,
    totalScore: 0,
  }

  if (section) {
    const exercises = session.Exercise.filter((e) => e.sectionId === section.id).toModelArray()
    testInfo.totalScore = getTotalPoints(exercises)

    if (section.testScore !== undefined) {
      testInfo.score = section.testScore
    } else {
      testInfo.isSubmitted = false

      const questions = exercises.reduce((acc, ex) => [...acc, ex.questions.toRefArray()], [])

      // Test can be submitted if at least one exercise has been answered
      testInfo.canBeSubmitted = questions.some((qArr) =>
        qArr.every((q) => q.result !== RESULT_VALUE.NEUTRAL)
      )
      // Test can be reset if at least one question has been answered
      testInfo.canBeReset = questions.some((qArr) =>
        qArr.some((q) => q.result !== RESULT_VALUE.NEUTRAL)
      )
    }
  }

  return testInfo
})

export default { calculateTestScore, getProgress, getPersistedProgress, getTest }
