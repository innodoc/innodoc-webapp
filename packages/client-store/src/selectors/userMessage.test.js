import {
  MESSAGE_TYPES_LOGIN,
  MESSAGE_TYPES_MODAL,
  MESSAGE_TYPES_REGISTER,
} from '@innodoc/client-misc/src/messageDef'
import orm from '../orm'
import userMessageSelectors from './userMessage'

describe('userMessage', () => {
  let session
  beforeEach(() => {
    session = orm.session(orm.getEmptyState())
    session.UserMessage.create({
      closable: true,
      level: 'info',
      text: 'User exists',
      type: 'registerUserFailure',
    })
    session.UserMessage.create({
      closable: false,
      level: 'error',
      text: 'Test text',
      type: 'loadManifestFailure',
    })
    session.UserMessage.create({
      closable: true,
      level: 'info',
      text: 'Unauthorized',
      type: 'loginUserFailure',
    })
  })

  it.each([
    ['MESSAGE_TYPES_MODAL', MESSAGE_TYPES_MODAL, 'loadManifestFailure'],
    ['MESSAGE_TYPES_LOGIN', MESSAGE_TYPES_LOGIN, 'loginUserFailure'],
    ['MESSAGE_TYPES_REGISTER', MESSAGE_TYPES_REGISTER, 'registerUserFailure'],
  ])('should select latest of type %s', (_, types, type) => {
    const getLatestModal = userMessageSelectors.makeGetLatest(types)
    expect(getLatestModal({ orm: session.state }).type).toBe(type)
  })
})
