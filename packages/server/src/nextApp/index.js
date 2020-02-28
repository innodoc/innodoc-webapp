import next from 'next'
import setupExpressNext from './setupExpressNext'

const createApp = async (srcDir, nodeEnv) => {
  const app = next({
    dir: srcDir,
    dev: nodeEnv === 'development',
  })
  await app.prepare()
  return app
}

export { setupExpressNext }
export default createApp
