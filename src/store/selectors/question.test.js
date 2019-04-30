import orm from '../orm'
import questionSelectors from './question'

const dummyCourse = {
  id: 0,
  homeLink: 'foo',
  languages: ['en'],
  title: { en: ['foobar'] },
}

const dummyState = () => {
  const state = orm.getEmptyState()
  const session = orm.mutableSession(state)
  session.Course.create(dummyCourse)
  session.App.create({
    id: 0,
    currentCourse: session.Course.first(),
  })
  session.Question.create({
    answer: '42',
    correct: true,
    id: 'foo/bar#baz',
  })
  return { orm: state }
}

describe('questionSelectors', () => {
  test('getQuestion', () => {
    const state = dummyState()
    const question = questionSelectors.getQuestion(state, 'foo/bar#baz')
    expect(question.answer).toBe('42')
    expect(question.correct).toBe(true)
    expect(question.id).toEqual('foo/bar#baz')
  })
})
