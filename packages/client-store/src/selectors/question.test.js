import { constants } from '@innodoc/client-misc'

import orm from '../orm'
import questionSelectors from './question'

const dummyCourse = {
  id: 0,
  homeLink: '/section/foo',
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
  session.Exercise.create({
    id: 'foo/bar#E01',
  })
  session.Question.create({
    answer: '42',
    result: constants.RESULT.CORRECT,
    id: 'foo/bar#Q01',
    exerciseId: 'foo/bar#E01',
    invalid: false,
  })
  return { orm: state }
}

describe('questionSelectors', () => {
  test('makeGetQuestion', () => {
    const state = dummyState()
    const question = questionSelectors.makeGetQuestion()(state, 'foo/bar#Q01')
    expect(question.answer).toBe('42')
    expect(question.result).toBe(constants.RESULT.CORRECT)
    expect(question.id).toEqual('foo/bar#Q01')
    expect(question.invalid).toBe(false)
  })
})
