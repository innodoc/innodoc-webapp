const { teardown } = require('jest-process-manager')

module.exports = async () => {
  await teardown()
  console.log('Dev servers stopped.') // eslint-disable-line no-console
}
