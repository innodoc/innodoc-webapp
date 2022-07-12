// TODO
// - test bundle analyzer
// - use next.js postcss.config as base?

const withConfigs = require('./configs')

// Apply config modules sequentially
module.exports = (phase, { defaultConfig }) =>
  withConfigs.reduce(
    (p, withConfig) => p.then((config) => withConfig(phase, config)),
    Promise.resolve().then(() => defaultConfig)
  )
