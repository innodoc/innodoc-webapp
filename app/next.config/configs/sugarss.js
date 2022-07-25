import fs from 'fs/promises'
import { createRequire } from 'module'
import path from 'path'

import clone from 'clone'

import postcssConfig from '../../postcss.config.cjs'

import { antdExtractedVarsTmp } from './common.js'
import { getCssModuleLocalIdentForNextJs } from './getCssModuleLocalIdent.js'

const require = createRequire(import.meta.url)

const dirname = new URL('.', import.meta.url).pathname
const innodocUiSrcPath = path.resolve(dirname, '..', '..', '..', 'packages', 'ui', 'src')

const updateRegexp = (re) => new RegExp(re.source.replace('scss|sass', 'scss|sass|sss'))

const patchSassRegexps = (rules) => {
  for (const rule of rules) {
    if (
      // Skip 'CSS Modules cannot be imported from within node_modules' rule b/c
      // we import SSS modules from @innodoc/ui
      Array.isArray(rule.test) &&
      rule.test[1].toString() !== /\.module\.(scss|sass)$/.toString()
    ) {
      if (!rule.test && rule.issuer instanceof RegExp) {
        rule.issuer = updateRegexp(rule.issuer)
      } else if (Array.isArray(rule.test)) {
        rule.test = rule.test.map((re) => updateRegexp(re))
      } else if (!rule.use.at?.(-1).loader.includes('sass-loader')) {
        rule.test = updateRegexp(rule.test)
      }
    }
  }
}

// const createWebpackMatcher = (modulesToTranspile) => {
//   return (filePath, b, c) => {
//     console.log(`checking ${filePath}`, b, c)

//     const isNestedNodeModules = (filePath.match(/node_modules/g) || []).length > 1

//     if (isNestedNodeModules) {
//       return false
//     }

//     return modulesToTranspile.some((modulePath) => {
//       const transpiled = filePath.startsWith(modulePath)
//       return transpiled
//     })
//   }
// }
// const matcher = createWebpackMatcher(['@innodoc/ui'])

const matcher = (filePath) => {
  console.log('matcher', typeof filePath, filePath.length, filePath)
  return filePath.startsWith('@innodoc/ui') || filePath.startsWith('@innodoc/app')
}

// Create sugarss loader
const addSugarssRule = (rules, cssLoaderOptions, antdVars) => {
  // Use sass rule as base
  const sassRuleIdx = rules.findIndex(
    (r) => r.test.toString() === /\.module\.(scss|sass)$/.toString()
  )
  const sassRule = rules[sassRuleIdx]
  const sssRuleModule = clone(sassRule)
  sssRuleModule.test = /\.module\.sss$/

  // Module sss exists only in @innodoc/ui components
  sssRuleModule.issuer = innodocUiSrcPath

  // Update css-loader options
  const cssLoaderIdx = sssRuleModule.use.findIndex((l) => l.loader.includes('css-loader'))
  const cssLoader = sssRuleModule.use[cssLoaderIdx]
  cssLoader.options = {
    ...cssLoader.options,
    ...cssLoaderOptions,
    importLoaders: cssLoader.options.importLoaders - 2,
  }

  // Pass antd variables to postcss-advanced-variables
  const advancedVariablesKey = Object.keys(postcssConfig.plugins).find((k) =>
    k.includes('postcss-advanced-variables')
  )
  postcssConfig.plugins[advancedVariablesKey] = { variables: antdVars }

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

  // global sugarss rule (take module sss rule as a start)
  const sssRuleGlobal = clone(sssRuleModule)
  sssRuleGlobal.test = /(?<!\.module)\.sss$/

  // Global sss exists only in @innodoc/ui/src/style/global dir
  // sssRuleGlobal.issuer = path.join(innodocUiSrcPath, 'style', 'global')
  delete sssRuleGlobal.issuer

  // Update css-loader options
  const cssLoaderClone = clone(sssRuleGlobal.use[cssLoaderIdx])
  cssLoaderClone.options = {
    ...cssLoaderClone.options,
    ...cssLoaderOptions,
    modules: false,
  }
  sssRuleGlobal.use[cssLoaderIdx] = cssLoaderClone

  // Insert rule
  rules.splice(sassRuleIdx, 0, sssRuleGlobal)
}

export default async (phase, nextConfig = {}) => {
  const antdVars = JSON.parse(await fs.readFile(antdExtractedVarsTmp.name))

  return {
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

      // patchSassRegexps(rule.oneOf)
      addSugarssRule(rule.oneOf, cssLoaderOptions, antdVars)

      return typeof nextConfig.webpack === 'function' ? nextConfig.webpack(config, options) : config
    },
  }
}
