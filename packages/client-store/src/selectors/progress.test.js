import { constants } from '@innodoc/client-misc'

import orm from '../orm'
import progressSelectors from './progress'

const dummyCourse = {
  id: 0,
  homeLink: '/section/foo',
  languages: ['en'],
  title: { en: ['foobar'] },
}

const sections = [
  {
    id: 'ch1',
    ord: [0],
    title: { en: 'Chapter 1' },
    content: { en: 'content' },
    parentId: undefined,
    visited: false,
    type: 'regular',
  },
  {
    id: 'ch1/sec1',
    ord: [0, 0],
    title: { en: 'Chapter 1 Section 1' },
    content: { en: 'content' },
    parentId: 'ch1',
    visited: false,
    type: 'regular',
  },
  {
    id: 'ch2',
    ord: [1],
    title: { en: 'Chapter 2' },
    content: { en: 'content' },
    parentId: undefined,
    visited: true,
    type: 'regular',
  },
  {
    id: 'ch2/sec1',
    ord: [1, 0],
    title: { en: 'Chapter 2 Section 1' },
    content: { en: 'content' },
    parentId: 'ch2',
    visited: true,
    type: 'regular',
  },
  {
    id: 'ch2/sec2',
    ord: [1, 1],
    title: { en: 'Chapter 2 Section 2' },
    content: { en: 'content' },
    parentId: 'ch2',
    visited: false,
    type: 'regular',
  },
  {
    id: 'ch2/test',
    ord: [1, 2],
    title: { en: 'Chapter 2 Test' },
    content: { en: 'content' },
    parentId: 'ch2',
    visited: true,
    type: 'test',
  },
  {
    id: 'ch3',
    ord: [2],
    title: { en: 'Chapter 3' },
    content: { en: 'content' },
    parentId: undefined,
    visited: true,
    type: 'regular',
  },
  {
    id: 'ch3/sec1',
    ord: [2, 1],
    title: { en: 'Chapter 3 Section 1' },
    content: { en: 'content' },
    parentId: 'ch3',
    visited: true,
    type: 'regular',
  },
]

const exercises = [
  {
    id: 'ch1/sec1#EX_01',
    number: '1.1.1',
    sectionId: 'ch1/sec1',
    points: 4,
  },
  {
    id: 'ch2/sec1#EX_01',
    number: '2.1.1',
    sectionId: 'ch2/sec1',
    points: 8,
  },
  {
    id: 'ch2/sec1#EX_02',
    number: '2.1.2',
    sectionId: 'ch2/sec1',
    points: 2,
  },
  {
    id: 'ch2/sec2#EX_01',
    number: '2.2.1',
    sectionId: 'ch2/sec2',
    points: 10,
  },
  {
    id: 'ch2/test#EX_01',
    number: '2.3.1',
    sectionId: 'ch2/test',
    points: 11,
  },
  {
    id: 'ch2/test#EX_02',
    number: '2.3.2',
    sectionId: 'ch2/test',
    points: 8,
  },
  {
    id: 'ch2/test#EX_03',
    number: '2.3.3',
    sectionId: 'ch2/test',
    points: 10,
  },
]

const questions = [
  {
    exerciseId: 'ch1/sec1#EX_01',
    result: constants.RESULT.NEUTRAL,
    points: 4,
  },
  {
    exerciseId: 'ch2/sec1#EX_01',
    answer: '23',
    answeredTimestamp: 1598451191939,
    result: constants.RESULT.INCORRECT,
    points: 4,
  },
  {
    exerciseId: 'ch2/sec1#EX_01',
    answer: 'foo',
    answeredTimestamp: 1598451191939,
    result: constants.RESULT.INCORRECT,
    points: 4,
  },
  {
    exerciseId: 'ch2/sec1#EX_02',
    answer: '42',
    answeredTimestamp: 1598451191939,
    result: constants.RESULT.CORRECT,
    points: 2,
  },
  {
    exerciseId: 'ch2/sec2#EX_01',
    result: constants.RESULT.NEUTRAL,
    points: 10,
  },
  {
    exerciseId: 'ch2/test#EX_01',
    answer: '1',
    answeredTimestamp: 1598451191939,
    result: constants.RESULT.CORRECT,
    points: 11,
  },
  {
    exerciseId: 'ch2/test#EX_02',
    answer: 'x/2',
    answeredTimestamp: 1598451191939,
    result: constants.RESULT.INCORRECT,
    points: 4,
  },
  {
    exerciseId: 'ch2/test#EX_02',
    answer: 'x',
    answeredTimestamp: 1598451191939,
    result: constants.RESULT.CORRECT,
    points: 4,
  },
  {
    exerciseId: 'ch2/test#EX_03',
    answer: '{5}',
    answeredTimestamp: 1598451191939,
    result: constants.RESULT.INCORRECT,
    points: 5,
  },
  {
    exerciseId: 'ch2/test#EX_03',
    answer: '1',
    answeredTimestamp: 1598451191939,
    result: constants.RESULT.INCORRECT,
    points: 5,
  },
]

const initState = () => {
  const state = orm.getEmptyState()
  const session = orm.mutableSession(state)
  session.Course.create(dummyCourse)
  session.App.create({
    id: 0,
    currentCourseId: session.Course.first(),
    language: 'en',
  })
  return { orm: state }
}

const dummyState = () => {
  const state = initState()
  const session = orm.mutableSession(state.orm)
  sections.forEach((section) => session.Section.create(section))
  exercises.forEach((exercise) => session.Exercise.create(exercise))
  questions.forEach((question) => session.Question.create(question))
  return state
}

describe('progressSelectors', () => {
  test('calculateTestScore', () => {
    const state = dummyState()
    expect(progressSelectors.calculateTestScore(state, 'ch2/test')).toBe(15)
  })

  test('getProgress', () => {
    const state = dummyState()
    const progress = progressSelectors.getProgress(state)
    expect(progress).toHaveLength(3)
    const [chap1, chap2, chap3] = progress

    expect(chap1.id).toBe('ch1')
    expect(chap1.progress.moduleUnits).toEqual([0, 2])
    expect(chap1.progress.exercises).toEqual([0, 4])
    expect(chap1.progress.finalTest).toEqual([0, 0])

    expect(chap2.id).toBe('ch2')
    expect(chap2.progress.moduleUnits).toEqual([2, 3])
    expect(chap2.progress.exercises).toEqual([2, 20])
    expect(chap2.progress.finalTest).toEqual([15, 29])

    expect(chap3.id).toBe('ch3')
    expect(chap3.progress.moduleUnits).toEqual([2, 2])
    expect(chap3.progress.exercises).toEqual([0, 0])
    expect(chap3.progress.finalTest).toEqual([0, 0])
  })

  test('getPersistedProgress', () => {
    const state = dummyState()
    const p = progressSelectors.getPersistedProgress(state)
    expect(p.visitedSections).toHaveLength(5)
    expect(p.visitedSections).toContain('ch2')
    expect(p.visitedSections).toContain('ch2/sec1')
    expect(p.visitedSections).toContain('ch2/test')
    expect(p.visitedSections).toContain('ch3')
    expect(p.visitedSections).toContain('ch3/sec1')
    expect(p.answeredQuestions).toHaveLength(8)
    const expQuestions = [1, 2, 3, 5, 6, 7, 8, 9]
    expQuestions.forEach((i) =>
      expect(p.answeredQuestions).toContainEqual({
        id: expect.any(Number),
        ...questions[i],
      })
    )
  })

  describe('getTest', () => {
    let state

    beforeEach(() => {
      state = initState()
      const session = orm.mutableSession(state.orm)
      session.Section.create({
        id: 'test',
        ord: [0],
        parentId: undefined,
        type: 'test',
      })
      session.Course.first().set('currentSectionId', 'test')

      session.Exercise.create({
        id: 'test#EX_01',
        number: '1.1.1',
        sectionId: 'test',
        points: 3,
      })
      session.Question.create({
        exerciseId: 'test#EX_01',
        result: constants.RESULT.NEUTRAL,
        points: 1,
      })
      session.Question.create({
        exerciseId: 'test#EX_01',
        result: constants.RESULT.NEUTRAL,
        points: 2,
      })

      session.Exercise.create({
        id: 'test#EX_02',
        number: '1.1.2',
        sectionId: 'test',
        points: 5,
      })
      session.Question.create({
        exerciseId: 'test#EX_02',
        result: constants.RESULT.NEUTRAL,
        points: 2,
      })
      session.Question.create({
        exerciseId: 'test#EX_02',
        result: constants.RESULT.NEUTRAL,
        points: 3,
      })
    })

    describe('submitted=false', () => {
      test('no question answered', () =>
        expect(progressSelectors.getTest(state)).toEqual({
          canBeReset: false,
          canBeSubmitted: false,
          isSubmitted: false,
          score: undefined,
          totalScore: 8,
        }))

      test('one question answered', () => {
        orm
          .mutableSession(state.orm)
          .Exercise.first()
          .questions.first()
          .set('result', constants.RESULT.CORRECT)
        expect(progressSelectors.getTest(state)).toEqual({
          canBeReset: true,
          canBeSubmitted: false,
          isSubmitted: false,
          score: undefined,
          totalScore: 8,
        })
      })

      test('one exercise answered', () => {
        orm
          .mutableSession(state.orm)
          .Exercise.first()
          .questions.toModelArray()
          .forEach((q) => q.set('result', constants.RESULT.CORRECT))
        expect(progressSelectors.getTest(state)).toEqual({
          canBeReset: true,
          canBeSubmitted: true,
          isSubmitted: false,
          score: undefined,
          totalScore: 8,
        })
      })
    })

    test('submitted=true', () => {
      const session = orm.mutableSession(state.orm)
      session.Question.all()
        .toModelArray()
        .forEach((q) => q.set('result', constants.RESULT.CORRECT))
      session.Section.first().set('testScore', 8)
      expect(progressSelectors.getTest(state)).toEqual({
        canBeReset: true,
        canBeSubmitted: true,
        isSubmitted: true,
        score: 8,
        totalScore: 8,
      })
    })
  })
})
