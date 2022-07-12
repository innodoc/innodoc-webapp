module.exports = async (phase, config) => {
  /* eslint-disable-next-line no-extend-native */
  Object.defineProperty(RegExp.prototype, 'toJSON', {
    value: RegExp.prototype.toString,
  })
  console.log('-------------------------- next.js config\n', JSON.stringify(config, null, 2))

  return config
}
