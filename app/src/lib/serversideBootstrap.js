import { getManifest, getRunningOperationPromises } from '@innodoc/store/api/content'

import nextReduxWrapper from './nextReduxWrapper.js'

const serversideBootstrap = (getStaticProps) =>
  nextReduxWrapper.getStaticProps((store) => async (context) => {
    // Fetch manifest
    store.dispatch(getManifest.initiate())
    await Promise.all(getRunningOperationPromises())

    // Get static props
    const props = await getStaticProps(context, store)

    return { props }
  })

export default serversideBootstrap
