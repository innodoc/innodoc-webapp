import RESULT_VALUE from '@innodoc/client-misc/src/resultDef'
import orm from '../orm'

import { addQuestion, questionAnswered, questionEvaluated } from '../actions/question'

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

    test('no-op action', () => {
      session.Question.reducer({ type: 'DOES-NOT-EXIST' }, session.Question)
    })
  })
})
