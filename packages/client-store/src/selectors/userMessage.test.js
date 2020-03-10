import orm from '../orm'
import userMessageSelectors from './userMessage'

describe('userMessage', () => {
  test('getLatest', () => {
    const session = orm.session(orm.getEmptyState())
    session.UserMessage.create({
      closable: true,
      level: 'info',
      text: 'Info text',
      type: 'infoType',
    })
    session.UserMessage.create({
      closable: false,
      level: 'error',
      text: 'Error text',
      type: 'errorType',
    })
    expect(userMessageSelectors.getLatest({ orm: session.state }).id).toBe(1)
  })
})
