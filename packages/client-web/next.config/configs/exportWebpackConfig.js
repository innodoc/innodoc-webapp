import fs from 'fs'
import path from 'path'

const exportJson = (name, config, { isServer }) => {
  /* eslint-disable-next-line no-extend-native */
  Object.defineProperty(RegExp.prototype, 'toJSON', {
    value: RegExp.prototype.toString,
  })

  const { rules } = config.module
  const ruleIndex = rules.findIndex((rule) => Array.isArray(rule.oneOf))
  const rule = rules[ruleIndex]

  const serverClient = isServer ? 'server' : 'client'
  const filepath = path.resolve(process.env.EXPORT_WEBPACK_CONFIG, `${name}-${serverClient}.json`)
  fs.mkdirSync(process.env.EXPORT_WEBPACK_CONFIG, { recursive: true })
  fs.writeFileSync(filepath, JSON.stringify(rule, null, 2))
  console.log(`Exported webpack config ${filepath}`)
}

const exportWebpackConfigPre = async (phase, nextConfig = {}) => ({
  ...nextConfig,
  webpack: (config, options) => {
    exportJson('before', config, options)

    return typeof nextConfig.webpack === 'function' ? nextConfig.webpack(config, options) : config
  },
})

const exportWebpackConfigPost = async (phase, nextConfig = {}) => ({
  ...nextConfig,
  webpack: (config, options) => {
    exportJson('after', config, options)

    return typeof nextConfig.webpack === 'function' ? nextConfig.webpack(config, options) : config
  },
})

export { exportWebpackConfigPre, exportWebpackConfigPost }
