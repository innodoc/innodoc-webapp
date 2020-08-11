import RESULT_VALUE from '@innodoc/client-misc/src/resultDef'
import orm from '../orm'
import exerciseSelectors from './exercise'

const dummyCourse = {
  id: 0,
  homeLink: '/section/foo',
  languages: ['en'],
  title: { en: ['foobar'] },
}

const dummyState = (results) => {
  const state = orm.getEmptyState()
  const session = orm.mutableSession(state)
  session.Course.create(dummyCourse)
  session.App.create({
    id: 0,
    currentCourse: session.Course.first(),
  })
  session.Exercise.create({
    id: 'foo/bar#E01',
  })
  session.Question.create({
    answer: '42',
    result: results[0],
    id: 'foo/bar#Q01',
    exerciseId: 'foo/bar#E01',
  })
  session.Question.create({
    answer: 'x^2',
    result: results[1],
    id: 'foo/bar#Q02',
    exerciseId: 'foo/bar#E01',
  })
  return { orm: state }
}

describe('exerciseSelectors', () => {
  describe('getExerciseAnswered', () => {
    test.each([
      [true, [RESULT_VALUE.CORRECT, RESULT_VALUE.CORRECT]],
      [true, [RESULT_VALUE.CORRECT, RESULT_VALUE.INCORRECT]],
      [false, [RESULT_VALUE.NEUTRAL, RESULT_VALUE.CORRECT]],
    ])('%s', (exp, values) => {
      const state = dummyState(values)
      const allAnswered = exerciseSelectors.getExerciseAnswered(state, 'foo/bar#E01')
      expect(allAnswered).toBe(exp)
    })
  })

  describe('getExerciseCorrect', () => {
    test.each([
      [true, [RESULT_VALUE.CORRECT, RESULT_VALUE.CORRECT]],
      [false, [RESULT_VALUE.CORRECT, RESULT_VALUE.INCORRECT]],
      [false, [RESULT_VALUE.NEUTRAL, RESULT_VALUE.CORRECT]],
    ])('%s', (exp, values) => {
      const state = dummyState(values)
      const correct = exerciseSelectors.getExerciseCorrect(state, 'foo/bar#E01')
      expect(correct).toBe(exp)
    })
  })
})
