import { loadManifestSuccess } from '@innodoc/client-store/src/actions/content'
import withLoadManifest from './withLoadManifest'

jest.mock('next/config', () => () => ({
  serverRuntimeConfig: {
    manifest: { foo: 'bar' },
  },
}))

const mockStore = {
  dispatch: jest.fn(),
}

describe('withLoadManifest', () => {
  const Component = () => null
  const context = { ctx: { store: mockStore } }
  let WithLoadManifest

  beforeEach(() => {
    WithLoadManifest = withLoadManifest(Component)
  })

  it('should dispatch loadManifestSuccess', async () => {
    expect.assertions(1)
    await WithLoadManifest.getInitialProps(context)
    expect(mockStore.dispatch).toBeCalledWith(loadManifestSuccess({ content: { foo: 'bar' } }))
  })
})
