import { setServerConfiguration } from '@innodoc/client-store/src/actions/content'
import { languageDetected } from '@innodoc/client-store/src/actions/i18n'
import {
  actionTypes as userActionTypes,
  userLoggedIn,
} from '@innodoc/client-store/src/actions/user'

import withServerVars from './withServerVars'

jest.mock('next/config', () => () => ({
  serverRuntimeConfig: {
    appRoot: 'https://app.example.com/',
    contentRoot: 'https://static.example.com/content/',
    ftSearch: false,
    pagePathPrefix: 'page',
    sectionPathPrefix: 'section',
    staticRoot: 'https://static.example.com/',
  },
}))

describe('withServerVars', () => {
  let WithServerVars
  const dispatch = jest.fn()
  const getContext = (loggedIn = true) => ({
    ctx: {
      store: { dispatch },
      req: {
        csrfToken: () => '123Token!',
        i18n: { language: 'en' },
        user: loggedIn ? { email: 'alice@example.com' } : undefined,
      },
    },
  })

  beforeEach(() => {
    jest.clearAllMocks()
    WithServerVars = withServerVars(() => null)
  })

  it('should pass server configuration', async () => {
    expect.assertions(1)
    await WithServerVars.getInitialProps(getContext())
    expect(dispatch).toHaveBeenCalledWith(
      setServerConfiguration(
        'https://app.example.com/',
        'https://static.example.com/content/',
        false,
        'https://static.example.com/',
        '123Token!',
        'section',
        'page'
      )
    )
  })

  it('should login user with loggedInEmail', async () => {
    expect.assertions(1)
    await WithServerVars.getInitialProps(getContext())
    expect(dispatch).toHaveBeenCalledWith(userLoggedIn('alice@example.com'))
  })

  it('should not login user w/o loggedInEmail', async () => {
    expect.assertions(1)
    await WithServerVars.getInitialProps(getContext(false))
    const actions = dispatch.mock.calls.map((call) => call[0].type)
    expect(actions).not.toContain(userActionTypes.USER_LOGGED_IN)
  })

  it('should pass language to store', async () => {
    expect.assertions(1)
    await WithServerVars.getInitialProps(getContext())
    expect(dispatch).toHaveBeenCalledWith(languageDetected('en'))
  })
})
