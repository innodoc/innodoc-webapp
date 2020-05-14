import {
  loadManifest,
  setServerConfiguration,
} from '@innodoc/client-store/src/actions/content'
import { languageDetected } from '@innodoc/client-store/src/actions/i18n'
import { userLoggedIn } from '@innodoc/client-store/src/actions/user'

import withDispatchConfiguration from './withDispatchConfiguration'

describe('withDispatchConfiguration', () => {
  let WithDispatchConfiguration
  const dispatch = jest.fn()
  const context = {
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
          loggedInEmail: 'alice@example.com',
          pagePathPrefix: 'page',
          sectionPathPrefix: 'section',
          staticRoot: 'https://static.example.com/',
        },
      },
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    WithDispatchConfiguration = withDispatchConfiguration(() => null)
  })

  it('should pass server configuration', async () => {
    expect.assertions(1)
    await WithDispatchConfiguration.getInitialProps(context)
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

  it('should login user', async () => {
    expect.assertions(1)
    await WithDispatchConfiguration.getInitialProps(context)
    expect(dispatch).toHaveBeenCalledWith(userLoggedIn('alice@example.com'))
  })

  it('should pass language to store', async () => {
    expect.assertions(1)
    await WithDispatchConfiguration.getInitialProps(context)
    expect(dispatch).toHaveBeenCalledWith(languageDetected('en'))
  })

  it('should trigger loading of course manifest', async () => {
    expect.assertions(1)
    await WithDispatchConfiguration.getInitialProps(context)
    expect(dispatch).toHaveBeenCalledWith(loadManifest())
  })
})
