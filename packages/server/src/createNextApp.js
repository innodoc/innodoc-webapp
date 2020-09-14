import path from 'path'
import next from 'next'

const createNextApp = async () => {
  const nextApp = next({
    dir: path.resolve(__dirname, '..', '..', 'client-web', 'src'),
    dev: process.env.NODE_ENV !== 'production',
  })
  await nextApp.prepare()
  return nextApp
}

export default createNextApp
