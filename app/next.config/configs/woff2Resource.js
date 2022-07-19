export default async (phase, nextConfig = {}) => ({
  ...nextConfig,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.woff2$/,
      type: 'asset/resource',
    })

    return typeof nextConfig.webpack === 'function' ? nextConfig.webpack(config, options) : config
  },
})
