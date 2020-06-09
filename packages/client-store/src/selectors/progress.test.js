import RESULT_VALUE from '@innodoc/client-misc/src/resultDef'
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
    content: { en: 'test content' },
    parentId: undefined,
    visited: false,
  },
  {
    id: 'ch1/sec1',
    ord: [0, 0],
    title: { en: 'Chapter 1 Section 1' },
    content: { en: 'test content' },
    parentId: 'ch1',
    visited: false,
  },
  {
    id: 'ch2',
    ord: [1],
    title: { en: 'Chapter 2' },
    content: { en: 'test content' },
    parentId: undefined,
    visited: true,
  },
  {
    id: 'ch2/sec1',
    ord: [1, 0],
    title: { en: 'Chapter 2 Section 1' },
    content: { en: 'test content' },
    parentId: 'ch2',
    visited: true,
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
]

const questions = [
  {
    exerciseId: 'ch1/sec1#EX_01',
    result: RESULT_VALUE.NEUTRAL,
    points: 4,
  },
  {
    exerciseId: 'ch2/sec1#EX_01',
    result: RESULT_VALUE.INCORRECT,
    points: 4,
  },
  {
    exerciseId: 'ch2/sec1#EX_01',
    result: RESULT_VALUE.INCORRECT,
    points: 4,
  },
  {
    exerciseId: 'ch2/sec1#EX_02',
    result: RESULT_VALUE.CORRECT,
    points: 2,
  },
]

const dummyState = () => {
  const state = orm.getEmptyState()
  const session = orm.mutableSession(state)
  session.Course.create(dummyCourse)
  session.App.create({
    id: 0,
    currentCourse: session.Course.first(),
    language: 'en',
  })
  sections.forEach((section) => session.Section.create(section))
  exercises.forEach((exercise) => session.Exercise.create(exercise))
  questions.forEach((question) => session.Question.create(question))
  return { orm: state }
}

describe('progressSelectors', () => {
  test('getProgress', () => {
    const state = dummyState()
    const progress = progressSelectors.getProgress(state)
    expect(progress).toHaveLength(2)
    const [chap1, chap2] = progress

    // TODO: finalTest

    expect(chap1.id).toBe('ch1')
    expect(chap1.progress.moduleUnits).toEqual([0, 2])
    expect(chap1.progress.exercises).toEqual([0, 4])

    expect(chap2.id).toBe('ch2')
    expect(chap2.progress.moduleUnits).toEqual([2, 2])
    expect(chap2.progress.exercises).toEqual([2, 10])
  })
})
