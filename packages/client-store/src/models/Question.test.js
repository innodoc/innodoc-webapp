import { constants } from '@innodoc/client-misc'

import orm from '../orm'
import { resetExercise } from '../actions/exercise'
import {
  addQuestion,
  questionAnswered,
  questionEvaluated,
  questionInvalid,
} from '../actions/question'
import { clearProgress, loadProgress, resetTest } from '../actions/user'

describe('Question', () => {
  let session

  beforeEach(() => {
    session = orm.session(orm.getEmptyState())
    session.App.create({ language: 'en' })
    session.Course.create({})
  })

  it('should instantiate', () => {
    session.Question.create({ id: 'foo/bar#EX01' })
    expect(session.Question.all().count()).toEqual(1)
    expect(session.Question.first().result).toEqual(constants.RESULT.NEUTRAL)
  })

  describe('reducer', () => {
    test('resetExercise', () => {
      session.Question.create({
        id: 'foo/bar#Q01',
        exerciseId: 'foo/bar#EX01',
        answer: '42',
        result: constants.RESULT.CORRECT,
        messages: ['foo'],
        latexCode: '42',
      })
      session.Question.create({
        id: 'foo/bar#Q02',
        exerciseId: 'foo/bar#EX02',
        answer: '41',
        result: constants.RESULT.INCORRECT,
        messages: ['bar'],
        latexCode: '41',
      })

      session.Question.reducer(resetExercise('foo/bar#EX01'), session.Question, session)
      const q1 = session.Question.withId('foo/bar#Q01')
      expect(q1.answer).toBeUndefined()
      expect(q1.result).toBe(constants.RESULT.NEUTRAL)
      expect(q1.messages).toHaveLength(0)
      expect(q1.latexCode).toBeUndefined()
      const q2 = session.Question.withId('foo/bar#Q02')
      expect(q2.answer).toBe('41')
      expect(q2.result).toBe(constants.RESULT.INCORRECT)
      expect(q2.messages).toEqual(['bar'])
      expect(q2.latexCode).toBe('41')
    })

    test('addQuestion', () => {
      expect(session.Question.all().toRefArray()).toHaveLength(0)
      session.Question.reducer(
        addQuestion('foo/bar#EX01', 'foo/bar#Q01', 5),
        session.Question,
        session
      )
      const questions = session.Question.all().toRefArray()
      expect(questions).toHaveLength(1)
      expect(questions[0].id).toBe('foo/bar#Q01')
      expect(questions[0].exerciseId).toBe('foo/bar#EX01')
      expect(questions[0].answer).toBeUndefined()
      expect(questions[0].points).toBe(5)
    })

    test('questionAnswered', () => {
      session.Question.create({ id: 'foo/bar#Q01' })
      session.Question.reducer(questionAnswered('foo/bar#Q01', '42', {}), session.Question, session)
      const questions = session.Question.all().toRefArray()
      expect(questions).toHaveLength(1)
      expect(questions[0].id).toBe('foo/bar#Q01')
      expect(questions[0].answer).toBe('42')
    })

    test('questionEvaluated', () => {
      session.Question.create({ id: 'foo/bar#Q01', answer: 'x^2' })
      session.Question.reducer(
        questionEvaluated('foo/bar#Q01', constants.RESULT.CORRECT, ['foo'], 'x^{2}'),
        session.Question,
        session
      )
      const questions = session.Question.all().toRefArray()
      expect(questions).toHaveLength(1)
      expect(questions[0].messages).toHaveLength(1)
      expect(questions[0].messages[0]).toBe('foo')
      expect(questions[0].result).toBe(constants.RESULT.CORRECT)
      expect(questions[0].latexCode).toBe('x^{2}')
    })

    test('questionInvalid', () => {
      session.Question.create({ id: 'foo/bar#Q01', answer: 'x^2' })
      session.Question.reducer(
        questionInvalid('foo/bar#Q01', 'Question invalid: Error in validation'),
        session.Question,
        session
      )
      const questions = session.Question.all().toRefArray()
      expect(questions).toHaveLength(1)
      expect(questions[0].invalid).toBe(true)
      expect(questions[0].messages).toHaveLength(1)
      expect(questions[0].messages[0].type).toBe('error')
      expect(questions[0].messages[0].msg).toBe('Question invalid: Error in validation')
    })

    test('loadProgress', () => {
      const timestampNew = 1598450179152
      const timestampNewer = 1598450179152 + 10000
      const timestampOld = 1598450179152 - 10000
      session.Question.create({
        id: 'foo/bar#Q01',
        exerciseId: 'foo/bar#EX01',
        answer: '41',
        answeredTimestamp: timestampOld,
        result: constants.RESULT.INCORRECT,
        point: 4,
      })
      session.Question.create({
        id: 'foo/bar#Q02',
        exerciseId: 'foo/bar#EX01',
        answer: '5',
        answeredTimestamp: timestampNewer,
        result: constants.RESULT.CORRECT,
        point: 6,
      })

      const updatedQuestions = [
        {
          id: 'foo/bar#Q01',
          exerciseId: 'foo/bar#EX01',
          answer: '42',
          answeredTimestamp: timestampNew,
          result: constants.RESULT.CORRECT,
          point: 4,
        },
        {
          id: 'foo/bar#Q02',
          exerciseId: 'foo/bar#EX01',
          answer: '10',
          answeredTimestamp: timestampNew,
          result: constants.RESULT.INCORRECT,
          point: 6,
        },
        {
          id: 'foo/bar#Q03',
          exerciseId: 'foo/bar#EX02',
          answer: '{}',
          answeredTimestamp: timestampNew,
          result: constants.RESULT.CORRECT,
          point: 8,
        },
      ]
      const action = loadProgress(updatedQuestions, [])
      session.Question.reducer(action, session.Question, session)
      expect(session.Question.all().count()).toBe(3)

      const q1 = session.Question.withId('foo/bar#Q01')
      expect(q1.answer).toBe('42')
      expect(q1.answeredTimestamp).toBe(timestampNew)
      expect(q1.result).toBe(constants.RESULT.CORRECT)

      const q2 = session.Question.withId('foo/bar#Q02')
      expect(q2.answer).toBe('5')
      expect(q2.answeredTimestamp).toBe(timestampNewer)
      expect(q2.result).toBe(constants.RESULT.CORRECT)

      const q3 = session.Question.withId('foo/bar#Q03')
      expect(q3.answer).toBe('{}')
      expect(q3.answeredTimestamp).toBe(timestampNew)
      expect(q3.result).toBe(constants.RESULT.CORRECT)
    })

    test('clearProgress', () => {
      session.Question.create({
        id: 'foo/bar#Q01',
        answer: '42',
        result: constants.RESULT.CORRECT,
        messages: ['foo'],
        latexCode: '42',
      })
      session.Question.create({
        id: 'foo/bar#Q02',
        answer: '41',
        result: constants.RESULT.INCORRECT,
        messages: ['bar'],
        latexCode: '41',
      })

      session.Question.reducer(clearProgress(), session.Question, session)
      const qIds = ['foo/bar#Q01', 'foo/bar#Q02']
      qIds.forEach((qId) => {
        const q = session.Question.withId(qId)
        expect(q.answer).toBeUndefined()
        expect(q.messages).toHaveLength(0)
        expect(q.result).toBe(constants.RESULT.NEUTRAL)
        expect(q.latexCode).toBeUndefined()
      })
    })

    test('resetTest', () => {
      session.Section.create({ id: 'foo/bar' })
      session.Exercise.create({
        id: 'foo/bar#EX01',
        questionCount: 2,
        sectionId: 'foo/bar',
      })
      session.Question.create({
        id: 'foo/bar#Q01',
        exerciseId: 'foo/bar#EX01',
        answer: '42',
        result: constants.RESULT.CORRECT,
        messages: ['foo'],
        latexCode: '42',
      })
      session.Question.create({
        id: 'foo/bar#Q02',
        exerciseId: 'foo/bar#EX01',
        answer: '41',
        result: constants.RESULT.INCORRECT,
        messages: ['bar'],
        latexCode: '41',
      })
      session.Question.reducer(resetTest('foo/bar'), session.Question, session)
      const qIds = ['foo/bar#Q01', 'foo/bar#Q02']
      qIds.forEach((qId) => {
        const q = session.Question.withId(qId)
        expect(q.answer).toBeUndefined()
        expect(q.messages).toHaveLength(0)
        expect(q.result).toBe(constants.RESULT.NEUTRAL)
        expect(q.latexCode).toBeUndefined()
      })
    })

    test('no-op action', () => {
      session.Question.reducer({ type: 'DOES-NOT-EXIST' }, session.Question, session)
    })
  })
})
