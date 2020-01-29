/* eslint-disable no-console, no-extend-native */

module.exports = (config, options) => {
  Object.defineProperty(RegExp.prototype, 'toJSON', {
    value: RegExp.prototype.toString,
  })
  console.log(
    `-------------------------- webpack config (isServer=${options.isServer})\n`,
    JSON.stringify(config.module.rules, null, 2),
    '-------------------------- options\n',
    JSON.stringify(options, null, 2)
  )
}
