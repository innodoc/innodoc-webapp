import { loadManifest } from '@innodoc/client-store/src/actions/content'
import nextReduxWrapper from '../store'

const serverBootstap = (getStaticProps) =>
  nextReduxWrapper.getStaticProps((store) => async (context) => {
    // Fetch manifest
    store.dispatch(loadManifest(process.env.NEXT_PUBLIC_CONTENT_ROOT))

    // Get static props
    const props = await getStaticProps(context, store)

    // Wait until sagas finish
    await store.sagaTask.toPromise()

    return { props }
  })

export default serverBootstap
