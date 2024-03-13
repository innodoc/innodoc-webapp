import mainLogger from './mainLogger.js'

function createChildLogger(name: string) {
  return mainLogger.child({ module: name })
}

export default createChildLogger
