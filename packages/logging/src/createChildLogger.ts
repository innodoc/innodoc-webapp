import mainLogger from './mainLogger'

function createChildLogger(name: string) {
  return mainLogger.child({ module: name })
}

export default createChildLogger
