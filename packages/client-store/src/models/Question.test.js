import RESULT_VALUE from '@innodoc/client-misc/src/resultDef'

import orm from '../orm'
import { addQuestion, questionAnswered, questionEvaluated } from '../actions/question'
import { clearProgress, loadProgress } from '../actions/user'

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
    expect(session.Question.first().result).toEqual(RESULT_VALUE.NEUTRAL)
  })

  describe('reducer', () => {
    test('addQuestion', () => {
      expect(session.Question.all().toRefArray()).toHaveLength(0)
      session.Question.reducer(addQuestion('foo/bar#EX01', 'foo/bar#Q01', 5), session.Question)
      const questions = session.Question.all().toRefArray()
      expect(questions).toHaveLength(1)
      expect(questions[0].id).toBe('foo/bar#Q01')
      expect(questions[0].exerciseId).toBe('foo/bar#EX01')
      expect(questions[0].answer).toBeUndefined()
      expect(questions[0].points).toBe(5)
    })

    test('questionAnswered', () => {
      session.Question.create({ id: 'foo/bar#Q01' })
      session.Question.reducer(questionAnswered('foo/bar#Q01', '42', {}), session.Question)
      const questions = session.Question.all().toRefArray()
      expect(questions).toHaveLength(1)
      expect(questions[0].id).toBe('foo/bar#Q01')
      expect(questions[0].answer).toBe('42')
    })

    test('questionEvaluated', () => {
      session.Question.create({ id: 'foo/bar#Q01', answer: 'x^2' })
      session.Question.reducer(
        questionEvaluated('foo/bar#Q01', RESULT_VALUE.CORRECT, ['foo'], 'x^{2}'),
        session.Question
      )
      const questions = session.Question.all().toRefArray()
      expect(questions).toHaveLength(1)
      expect(questions[0].messages).toHaveLength(1)
      expect(questions[0].messages[0]).toBe('foo')
      expect(questions[0].result).toBe(RESULT_VALUE.CORRECT)
      expect(questions[0].latexCode).toBe('x^{2}')
    })

    test('loadProgress', () => {
      session.Question.create({ id: 'foo/bar#Q01', answer: '41' })
      session.Question.create({ id: 'foo/bar#Q02' })

      const messages = [{ foo: 'foo' }]
      const answeredQuestions = [
        {
          id: 'foo/bar#Q01',
          answer: '42',
          messages,
          result: RESULT_VALUE.CORRECT,
        },
      ]
      const action = loadProgress(answeredQuestions, [])
      session.Question.reducer(action, session.Question)

      const question1 = session.Question.withId('foo/bar#Q01')
      expect(question1.answer).toBe('42')
      expect(question1.messages).toBe(messages)
      expect(question1.result).toBe(RESULT_VALUE.CORRECT)

      const question2 = session.Question.withId('foo/bar#Q02')
      expect(question2.answer).toBeUndefined()
      expect(question2.messages).toHaveLength(0)
      expect(question2.result).toBe(RESULT_VALUE.NEUTRAL)
    })

    test('clearProgress', () => {
      session.Question.create({
        id: 'foo/bar#Q01',
        answer: '42',
        result: RESULT_VALUE.CORRECT,
        message: ['foo'],
        latexCode: '42',
      })
      session.Question.create({
        id: 'foo/bar#Q02',
        answer: '41',
        result: RESULT_VALUE.INCORRECT,
        message: ['bar'],
        latexCode: '41',
      })

      session.Question.reducer(clearProgress(), session.Question)
      const qIds = ['foo/bar#Q01', 'foo/bar#Q02']
      qIds.forEach((qId) => {
        const q = session.Question.withId(qId)
        expect(q.answer).toBe(null)
        expect(q.messages).toHaveLength(0)
        expect(q.result).toBe(RESULT_VALUE.NEUTRAL)
        expect(q.latexCode).toBe(null)
      })
    })

    test('no-op action', () => {
      session.Question.reducer({ type: 'DOES-NOT-EXIST' }, session.Question)
    })
  })
})
