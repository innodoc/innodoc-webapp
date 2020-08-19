import log4js from 'log4js'

const configureLogger = ({ logFile, nodeEnv }) => {
  const appenders = {}
  const categories = {}

  if (nodeEnv === 'production') {
    appenders.logfile = {
      type: 'file',
      compress: true,
      filename: logFile,
      maxLogSize: 1024 * 1024 * 10, // 10 MiB
    }
    categories.default = { appenders: ['logfile'], level: 'info', enableCallStack: true }
  } else {
    appenders.console = { type: 'stdout', layout: { type: 'basic' } }
    categories.default = { appenders: ['console'], level: 'debug', enableCallStack: true }
  }

  return log4js.configure({ appenders, categories })
}

const requestLoggerMiddleware = () => log4js.connectLogger(log4js.getLogger('request'))

export { configureLogger, requestLoggerMiddleware }
export default log4js.getLogger
