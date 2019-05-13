import orm from '../orm'
import QuestionModel from './question'
import { questionAnswered, questionSolved } from '../actions/question'

describe('reducer', () => {
  test('questionAnswered', () => {
    const state = orm.getEmptyState()
    const session = orm.session(state)
    expect(session.Question.all().toRefArray()).toHaveLength(0)
    QuestionModel.reducer(questionAnswered({ questionId: 'foo/bar#EX01', answer: '42' }), session.Question)
    const questions = session.Question.all().toRefArray()
    expect(questions).toHaveLength(1)
    expect(questions[0].id).toBe('foo/bar#EX01')
    expect(questions[0].answer).toBe('42')
    expect(questions[0].correct).toBeUndefined()
  })

  test('questionSolved', () => {
    const state = orm.getEmptyState()
    const session = orm.session(state)
    QuestionModel.reducer(questionAnswered({ questionId: 'foo/bar#EX01', answer: '42' }), session.Question)
    QuestionModel.reducer(questionSolved({ questionId: 'foo/bar#EX01', correct: true }), session.Question)
    const questions = session.Question.all().toRefArray()
    expect(questions).toHaveLength(1)
    expect(questions[0].correct).toBe(true)
  })
})
