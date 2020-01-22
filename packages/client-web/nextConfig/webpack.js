const path = require('path')
const Dotenv = require('dotenv-webpack')

// Babel rootMode for monorepo support
const rootMode = 'upward'

const printDebugInfo = (config, options) => {
  // eslint-disable-next-line no-extend-native
  Object.defineProperty(RegExp.prototype, 'toJSON', {
    value: RegExp.prototype.toString,
  })
  // eslint-disable-next-line no-console
  console.log(
    `-------------------------- webpack config (isServer=${options.isServer})\n`,
    JSON.stringify(config.module.rules, null, 2),
    '-------------------------- options\n',
    JSON.stringify(options, null, 2)
  )
}

const addDotenv = (config) => {
  const dotEnvFile = path.resolve(__dirname, '..', '..', '..', '.env')
  config.plugins.push(
    new Dotenv({
      path: dotEnvFile,
      safe: `${dotEnvFile}.example`,
      systemvars: true,
    })
  )
}

const addSvgIcons = (config) => {
  config.module.rules.push({
    test: /\.svg$/,
    use: [
      {
        loader: 'babel-loader',
        options: { rootMode },
      },
      {
        loader: '@svgr/webpack',
        options: {
          babel: false,
          icon: true,
        },
      },
    ],
  })
}

const ignoreTests = (config) => {
  config.module.rules.push({
    test: /\.test\.js$/,
    loader: 'ignore-loader',
  })
}

const setRootModeUpward = {
  test: (r) => r.use && r.use.loader && r.use.loader === 'next-babel-loader',
  modify: (rOrig) => {
    const r = { ...rOrig }
    r.use.options.rootMode = rootMode
    return r
  },
}

const disableCssModulesForLess = {
  test: (r) =>
    Array.isArray(r.use) &&
    r.use.some((loader) => loader.loader === 'less-loader'),
  modify: (rOrig) => {
    const r = { ...rOrig }
    for (let i = 0; i < r.use.length; i += 1) {
      const use = r.use[i]
      if (typeof use === 'object' && use.loader.startsWith('css-loader')) {
        use.options.modules = false
      }
    }
    return r
  },
}

const ruleModifiers = [setRootModeUpward, disableCssModulesForLess]

module.exports = (prevConfig, options) => {
  const config = { ...prevConfig }

  // Apply rule modifiers
  for (let i = 0; i < config.module.rules.length; i += 1) {
    for (let j = 0; j < ruleModifiers.length; j += 1) {
      const { test, modify } = ruleModifiers[j]
      if (test(config.module.rules[i])) {
        config.module.rules[i] = modify(config.module.rules[i])
      }
    }
  }

  addDotenv(config)
  addSvgIcons(config)
  ignoreTests(config)

  if (process.env.PRINT_WEBPACK_CONFIG) {
    printDebugInfo(config, options)
  }

  return config
}
