import mainLogger from './main-logger.js'

function createChildLogger(name: string) {
  return mainLogger.child({ module: name })
}

export default createChildLogger
