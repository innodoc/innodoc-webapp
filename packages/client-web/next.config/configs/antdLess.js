const fs = require('fs').promises
const path = require('path')

const clone = require('clone')

const postcss = require('postcss')
const postcssrc = require('postcss-load-config')
const sugarss = require('sugarss')

// Path to overridden antd variables
const antdVarsOverrideFilename = path.resolve(
  __dirname,
  '..',
  '..',
  'src',
  'style',
  'antd-theme.sss'
)

// Extract variables from our theme file to feed them into antd less
const generateModifyVars = async () => {
  let modifyVars

  try {
    const { plugins, options } = await postcssrc()
    const buffer = await fs.readFile(antdVarsOverrideFilename)
    const result = await postcss(plugins).process(buffer.toString(), {
      ...options,
      parser: sugarss,
      from: antdVarsOverrideFilename,
    })
    modifyVars = result.root.variables
  } catch (err) {
    console.error('Error: Failed to generate variables for antd!')
    console.error(err)
    process.exit(-1)
  }
  return modifyVars
}

const addToIgnoreLoader = (rules) => {
  const ignoreRuleIdx = rules.findIndex((r) => r.use.toString().includes('ignore-loader'))
  const ignoreRule = rules[ignoreRuleIdx]
  ignoreRule.test.push(/(?<!\.module)\.less$/)
}

const addLessRule = (rules, cssLoaderOptions, modifyVars) => {
  // Use sass rule as base
  const sassRuleIdx = rules.findIndex(
    (r) => r.test?.toString() === /(?<!\.module)\.(scss|sass)$/.toString()
  )
  const sassRule = rules[sassRuleIdx]
  const lessRule = clone(sassRule)
  lessRule.test = /(?<!\.module)\.less$/
  delete lessRule.issuer

  // Update css-loader options
  const cssLoaderIdx = lessRule.use.findIndex((l) => l.loader.includes('css-loader'))
  const cssLoader = lessRule.use[cssLoaderIdx]
  cssLoader.options = {
    ...cssLoader.options,
    ...cssLoaderOptions,
    importLoaders: cssLoader.options.importLoaders - 1,
  }

  // Replace resolve-url-loader + sass-loader with less-loader
  const lessLoader = {
    loader: require.resolve('less-loader'),
    options: {
      lessOptions: {
        javascriptEnabled: true,
        modifyVars,
      },
      sourceMap: cssLoaderOptions.sourceMap,
    },
  }
  const resolveUrlLoaderIdx = lessRule.use.findIndex((l) => l.loader.includes('resolve-url-loader'))
  lessRule.use.splice(resolveUrlLoaderIdx, 2, lessLoader)

  // Insert rule
  rules.splice(sassRuleIdx, 0, lessRule)
}

module.exports = async (phase, nextConfig = {}) => {
  const modifyVars = await generateModifyVars()

  return {
    ...nextConfig,
    webpack: (config, options) => {
      const isDev = process.env.NODE_ENV === 'development'

      const cssLoaderOptions = {
        sourceMap: isDev,
        modules: false,
      }

      const { rules } = config.module
      const ruleIndex = rules.findIndex((rule) => Array.isArray(rule.oneOf))
      const rule = rules[ruleIndex]

      if (options.isServer) {
        addToIgnoreLoader(rule.oneOf)
      } else {
        addLessRule(rule.oneOf, cssLoaderOptions, modifyVars)
      }

      return typeof nextConfig.webpack === 'function' ? nextConfig.webpack(config, options) : config
    },
  }
}
