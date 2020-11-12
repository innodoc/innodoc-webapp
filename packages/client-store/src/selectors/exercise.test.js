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
    questionCount: 2,
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
  describe('getExercise', () => {
    test.each([
      [
        { isAnswered: true, isCorrect: true, isTouched: true },
        [RESULT_VALUE.CORRECT, RESULT_VALUE.CORRECT],
      ],
      [
        { isAnswered: true, isCorrect: false, isTouched: true },
        [RESULT_VALUE.CORRECT, RESULT_VALUE.INCORRECT],
      ],
      [
        { isAnswered: false, isCorrect: false, isTouched: true },
        [RESULT_VALUE.NEUTRAL, RESULT_VALUE.CORRECT],
      ],
      [
        { isAnswered: false, isCorrect: false, isTouched: false },
        [RESULT_VALUE.NEUTRAL, RESULT_VALUE.NEUTRAL],
      ],
    ])('%s', (exp, values) => {
      const state = dummyState(values)
      const exercise = exerciseSelectors.getExercise(state, 'foo/bar#E01')
      expect(exercise.id).toBe('foo/bar#E01')
      expect(exercise.isAnswered).toBe(exp.isAnswered)
      expect(exercise.isCorrect).toBe(exp.isCorrect)
      expect(exercise.isTouched).toBe(exp.isTouched)
    })
  })
})
