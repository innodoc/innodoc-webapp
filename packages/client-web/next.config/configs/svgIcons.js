import { createRequire } from 'module'

const require = createRequire(import.meta.url)

const config = async (phase, nextConfig = {}) => ({
  ...nextConfig,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: require.resolve('@svgr/webpack'),
          options: {
            icon: true,
          },
        },
      ],
    })

    return typeof nextConfig.webpack === 'function' ? nextConfig.webpack(config, options) : config
  },
})

export default config
