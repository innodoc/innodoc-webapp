import log4js from 'log4js'

const consoleAppender = { type: 'stdout', layout: { type: 'basic' } }

const configureLogger = () => {
  const logFile = process.env.LOG_FILE
  const appenders = {}
  const categories = {}
  let level

  if (process.env.NODE_ENV === 'production') {
    level = 'info'
    if (!logFile) {
      appenders.console = consoleAppender
    } else {
      appenders.logfile = {
        type: 'file',
        compress: true,
        filename: logFile,
        maxLogSize: 1024 * 1024 * 10, // 10 MiB
      }
    }
  } else {
    level = 'debug'
    appenders.console = consoleAppender
  }

  categories.default = { appenders: Object.keys(appenders), level, enableCallStack: true }
  return log4js.configure({ appenders, categories })
}

const requestLoggerMiddleware = () => log4js.connectLogger(log4js.getLogger('request'))

export { configureLogger, requestLoggerMiddleware }
export default log4js.getLogger
