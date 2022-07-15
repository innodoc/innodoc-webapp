import constants from 'next/constants.js'

import { api } from '@innodoc/client-misc'

const config = async (phase, config) => {
  let courseManifest

  // mock manifest for testing
  if (constants.PHASE_TEST === phase) {
    // TODO: load from example course?
    courseManifest = {
      homeLink: '/page/about',
    }
  }

  // prod/dev phase
  else {
    courseManifest = await api.fetchManifest()
  }

  return { ...config, courseManifest }
}

export default config
