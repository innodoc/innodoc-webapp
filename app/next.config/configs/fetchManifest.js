import constants from 'next/constants.js'

import { fetchManifest } from '@innodoc/misc/api'

export default async (phase, config) => {
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
    try {
      courseManifest = await fetchManifest()
    } catch (err) {
      console.error(
        'Unable to fetch content manifest! ' +
          'Did you set NEXT_PUBLIC_CONTENT_ROOT correctly? ' +
          'The content needs to be accessible on build time.'
      )
      console.error(err)
      process.exit(-1)
    }
  }

  return { ...config, courseManifest }
}
