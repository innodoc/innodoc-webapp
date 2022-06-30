import getConfig from 'next/config'

import { loadManifestSuccess } from '@innodoc/client-store/src/actions/content'

import createHoc from './createHoc'

const { serverRuntimeConfig } = getConfig()

const withLoadManifest = createHoc('withLoadManifest', (ctx, { dispatch }) => {
  dispatch(loadManifestSuccess({ content: serverRuntimeConfig.manifest }))
})

export default withLoadManifest
