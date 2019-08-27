import orm from '../orm'

import { questionAnswered, questionSolved } from '../actions/question'

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
  })

  describe('reducer', () => {
    test('questionAnswered', () => {
      expect(session.Question.all().toRefArray()).toHaveLength(0)
      session.Question.reducer(questionAnswered({ questionId: 'foo/bar#EX01', answer: '42' }), session.Question)
      const questions = session.Question.all().toRefArray()
      expect(questions).toHaveLength(1)
      expect(questions[0].id).toBe('foo/bar#EX01')
      expect(questions[0].answer).toBe('42')
      expect(questions[0].correct).toBeUndefined()
    })

    test('questionSolved', () => {
      session.Question.reducer(questionAnswered({ questionId: 'foo/bar#EX01', answer: '42' }), session.Question)
      session.Question.reducer(questionSolved({ questionId: 'foo/bar#EX01', correct: true }), session.Question)
      const questions = session.Question.all().toRefArray()
      expect(questions).toHaveLength(1)
      expect(questions[0].correct).toBe(true)
    })

    test('no-op action', () => {
      session.Question.reducer({ type: 'DOES-NOT-EXIST' }, session.Question)
    })
  })
})
