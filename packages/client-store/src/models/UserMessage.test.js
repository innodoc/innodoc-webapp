import orm from '../orm'
import { closeMessage, showMessage } from '../actions/ui'

describe('UserMessage', () => {
  let session

  beforeEach(() => {
    session = orm.session(orm.getEmptyState())
  })

  it('should instantiate', () => {
    session.UserMessage.create({
      closable: true,
      level: 'error',
      text: 'Test text',
      type: 'testType',
    })
    const msg = session.UserMessage.first()
    expect(msg.closable).toBe(true)
    expect(msg.level).toBe('error')
    expect(msg.text).toBe('Test text')
    expect(msg.type).toBe('testType')
  })

  describe('reducer', () => {
    test('closeMessage', () => {
      session.UserMessage.create({})
      const id = session.UserMessage.first().getId()
      session.UserMessage.reducer(closeMessage(id), session.UserMessage)
      expect(session.UserMessage.withId(id)).toBeFalsy()
    })

    test('showMessage', () => {
      session.UserMessage.reducer(
        showMessage({
          closable: false,
          level: 'info',
          text: 'Test text',
          type: 'testType',
        }),
        session.UserMessage
      )
      const msg = session.UserMessage.first()
      expect(msg.ref.closable).toEqual(false)
      expect(msg.ref.level).toEqual('info')
      expect(msg.ref.text).toEqual('Test text')
      expect(msg.ref.type).toEqual('testType')
    })

    test('no-op action', () => {
      session.UserMessage.reducer({ type: 'DOES-NOT-EXIST' }, session.UserMessage)
    })
  })
})
