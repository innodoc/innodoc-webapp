import { setServerConfiguration } from '@innodoc/client-store/src/actions/content'
import { languageDetected } from '@innodoc/client-store/src/actions/i18n'
import {
  actionTypes as userActionTypes,
  userLoggedIn,
} from '@innodoc/client-store/src/actions/user'

import withDispatchConfiguration from './withDispatchConfiguration'

describe('withDispatchConfiguration', () => {
  let WithDispatchConfiguration
  const dispatch = jest.fn()
  const getContext = (loggedIn = true) => ({
    ctx: {
      store: { dispatch },
      req: {
        csrfToken: () => '123Token!',
        i18n: { language: 'en' },
      },
      res: {
        locals: {
          appRoot: 'https://app.example.com/',
          contentRoot: 'https://static.example.com/content/',
          loggedInEmail: loggedIn ? 'alice@example.com' : undefined,
          pagePathPrefix: 'page',
          sectionPathPrefix: 'section',
          staticRoot: 'https://static.example.com/',
        },
      },
    },
  })

  beforeEach(() => {
    jest.clearAllMocks()
    WithDispatchConfiguration = withDispatchConfiguration(() => null)
  })

  it('should pass server configuration', async () => {
    expect.assertions(1)
    await WithDispatchConfiguration.getInitialProps(getContext())
    expect(dispatch).toHaveBeenCalledWith(
      setServerConfiguration(
        'https://app.example.com/',
        'https://static.example.com/content/',
        'https://static.example.com/',
        '123Token!',
        'section',
        'page'
      )
    )
  })

  it('should login user with loggedInEmail', async () => {
    expect.assertions(1)
    await WithDispatchConfiguration.getInitialProps(getContext())
    expect(dispatch).toHaveBeenCalledWith(userLoggedIn('alice@example.com'))
  })

  it('should not login user w/o loggedInEmail', async () => {
    expect.assertions(1)
    await WithDispatchConfiguration.getInitialProps(getContext(false))
    const actions = dispatch.mock.calls.map((call) => call[0].type)
    expect(actions).not.toContain(userActionTypes.USER_LOGGED_IN)
  })

  it('should pass language to store', async () => {
    expect.assertions(1)
    await WithDispatchConfiguration.getInitialProps(getContext())
    expect(dispatch).toHaveBeenCalledWith(languageDetected('en'))
  })
})
