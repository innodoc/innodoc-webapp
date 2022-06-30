import { loadManifest } from '@innodoc/client-store/src/actions/content'

const serverBootstrap = async ({ dispatch, sagaTask }) => {
  dispatch(loadManifest(process.env.NEXT_PUBLIC_CONTENT_ROOT))
  await sagaTask.toPromise() // Wait until sagas finished
}

export default serverBootstrap
