import path from 'path'
import next from 'next'

const createNextApp = async ({ nodeEnv }) => {
  const nextApp = next({
    dir: path.resolve(__dirname, '..', '..', 'client-web', 'src'),
    dev: nodeEnv === 'development',
  })
  await nextApp.prepare()
  return nextApp
}

export default createNextApp
