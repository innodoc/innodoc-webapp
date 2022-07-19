import fs from 'fs'
import { createRequire } from 'module'
import path from 'path'

import clone from 'clone'

import { getCssModuleLocalIdentForNextJs } from './getCssModuleLocalIdent.js'
import postcssConfig from '../../postcss.config.cjs'

const require = createRequire(import.meta.url)

const updateRegexp = (re) => new RegExp(re.source.replace('scss|sass', 'scss|sass|sss'))

const patchSassRegexps = (rules) => {
  for (const rule of rules) {
    if (!rule.test && rule.issuer instanceof RegExp) {
      rule.issuer = updateRegexp(rule.issuer)
    } else if (Array.isArray(rule.test)) {
      rule.test = rule.test.map((re) => updateRegexp(re))
    } else if (!rule.use.at?.(-1).loader.includes('sass-loader')) {
      rule.test = updateRegexp(rule.test)
    }
  }
}

// Create sugarss loader
const addSugarssRule = (rules, cssLoaderOptions) => {
  // Use sass rule as base
  const sassRuleIdx = rules.findIndex(
    (r) => r.test.toString() === /\.module\.(scss|sass)$/.toString()
  )
  const sassRule = rules[sassRuleIdx]
  const sssRuleModule = clone(sassRule)
  sssRuleModule.test = /\.module\.sss$/

  // Update css-loader options
  const cssLoaderIdx = sssRuleModule.use.findIndex((l) => l.loader.includes('css-loader'))
  const cssLoader = sssRuleModule.use[cssLoaderIdx]
  cssLoader.options = {
    ...cssLoader.options,
    ...cssLoaderOptions,
    importLoaders: cssLoader.options.importLoaders - 2,
  }

  // Pass antd variables to postcss-advanced-variables
  const variables = JSON.parse(
    fs.readFileSync(
      path.resolve(
        new URL('.', import.meta.url).pathname,
        '..',
        '..',
        'src',
        'style',
        'antd-vars.json'
      )
    )
  )
  const advancedVariablesKey = Object.keys(postcssConfig.plugins).find((k) =>
    k.includes('postcss-advanced-variables')
  )
  postcssConfig.plugins[advancedVariablesKey] = { variables }

  // Update postcss-loader options
  const postcssLoaderIdx = sssRuleModule.use.findIndex((l) => l.loader.includes('postcss-loader'))
  sssRuleModule.use[postcssLoaderIdx] = {
    loader: require.resolve('postcss-loader'),
    options: {
      sourceMap: cssLoaderOptions.sourceMap,
      postcssOptions: {
        plugins: postcssConfig.plugins,
        parser: require.resolve('sugarss'),
      },
    },
  }

  // Remove resolve-url-loader + sass-loader
  const resolveUrlLoaderIdx = sssRuleModule.use.findIndex((l) =>
    l.loader.includes('resolve-url-loader')
  )
  sssRuleModule.use.splice(resolveUrlLoaderIdx, 2)

  // Insert rule
  rules.splice(sassRuleIdx, 0, sssRuleModule)

  // non-module sugarss rule
  const sssRule = clone(sssRuleModule)
  sssRule.test = /(?<!\.module)\.sss$/

  // Update css-loader options
  const cssLoaderClone = clone(sssRule.use[cssLoaderIdx])
  cssLoaderClone.options = {
    ...cssLoaderClone.options,
    ...cssLoaderOptions,
    modules: false,
  }
  sssRule.use[cssLoaderIdx] = cssLoaderClone

  // Insert rule
  rules.splice(sassRuleIdx, 0, sssRule)
}

export default async (phase, nextConfig = {}) => ({
  ...nextConfig,
  webpack: (config, options) => {
    const isDev = process.env.NODE_ENV === 'development'

    const localIdentName = isDev ? '[local]--[hash:base64:4]' : '[hash:base64:8]'
    const cssLoaderOptions = {
      sourceMap: isDev,
      modules: {
        exportLocalsConvention: 'asIs',
        exportOnlyLocals: options.isServer,
        localIdentName,
        mode: 'local',
        auto: true,
        getLocalIdent: getCssModuleLocalIdentForNextJs, // TODO include or remove??
      },
    }

    const { rules } = config.module
    const ruleIndex = rules.findIndex((rule) => Array.isArray(rule.oneOf))
    const rule = rules[ruleIndex]

    patchSassRegexps(rule.oneOf)
    addSugarssRule(rule.oneOf, cssLoaderOptions)

    return typeof nextConfig.webpack === 'function' ? nextConfig.webpack(config, options) : config
  },
})
