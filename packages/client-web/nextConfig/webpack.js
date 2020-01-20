const path = require('path')
const Dotenv = require('dotenv-webpack')

// Babel rootMode for monorepo support
const rootMode = 'upward'

module.exports = (prevConfig) => {
  const config = { ...prevConfig }

  const dotEnvFile = path.resolve(__dirname, '..', '..', '..', '.env')
  config.plugins.push(
    new Dotenv({
      path: dotEnvFile,
      safe: `${dotEnvFile}.example`,
      systemvars: true,
    })
  )

  // SVG icons
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

  // Do not include '*.test.js' files in the build
  config.module.rules.push({
    test: /\.test\.js$/,
    loader: 'ignore-loader',
  })

  for (let i = 0; i < config.module.rules.length; i += 1) {
    const rule = config.module.rules[i]

    // Disable CSS modules for less
    if (
      Array.isArray(rule.use) &&
      rule.use.some((loader) => loader.loader === 'less-loader')
    ) {
      for (let j = 0; j < rule.use.length; j += 1) {
        const use = rule.use[j]
        if (typeof use === 'object' && use.loader.startsWith('css-loader')) {
          use.options.modules = false
        }
      }
    }

    // Use .sss extension for css-loader
    if (!rule.oneOf && rule.test.source.match('css')) {
      rule.test = /\.sss$/
    }

    // Add rootMode to next-babel-loader. This is important so sub-package babel
    // is picking up the root babel.config.js.
    if (
      rule.use &&
      rule.use.loader &&
      rule.use.loader === 'next-babel-loader'
    ) {
      rule.use.options.rootMode = rootMode
    }

    // Disable CSS minimize (performed by cssnano)
    if (Array.isArray(rule.use)) {
      for (let j = 0; j < rule.use.length; j += 1) {
        const use = rule.use[j]
        if (typeof use === 'object' && use.loader.startsWith('css-loader')) {
          use.options.minimize = false
        }
      }
    }
  }

  // Debug print webpack config
  if (process.env.PRINT_WEBPACK_CONFIG) {
    /* eslint-disable-next-line no-extend-native */
    Object.defineProperty(RegExp.prototype, 'toJSON', {
      value: RegExp.prototype.toString,
    })
    /* eslint-disable-next-line no-console */
    console.log(JSON.stringify(config.module.rules, null, 2))
  }

  return config
}
