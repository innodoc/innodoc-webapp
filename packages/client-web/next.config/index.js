// TODO
// - test bundle analyzer
// - use next.js postcss.config as base?

import withConfigs from './configs/index.js'

// Apply config modules sequentially
const config = (phase, { defaultConfig }) =>
  withConfigs.reduce(
    (p, withConfig) => p.then((config) => withConfig(phase, config)),
    Promise.resolve().then(() => defaultConfig)
  )

export default config
