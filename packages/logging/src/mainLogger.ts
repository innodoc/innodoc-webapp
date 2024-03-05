import pino from 'pino'

const mainLogger = pino({
  level: process.env.NODE_ENVIRONMENT === 'production' ? 'warn' : 'debug',
  transport: {
    target: 'pino-pretty',
  },
})

export default mainLogger
