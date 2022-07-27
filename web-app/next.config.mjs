// @ts-check
// Type-safety: https://github.com/vercel/next.js/discussions/35969#discussioncomment-2523019

/**
 * @typedef {import('next').NextConfig} NextConfig
 * @typedef {import('webpack').Configuration} WebpackConfig
 * @typedef {import('next/dist/server/config-shared').WebpackConfigContext} WebpackConfigContext
 * @typedef {(config: WebpackConfig, context: WebpackConfigContext) => any} NextWebpackConfig
 */

import withTMFactory from 'next-transpile-modules'

const withTM = withTMFactory(['@innodoc/ui']);

/** type {NextConfig} */
export default (_phase, { defaultConfig }) => {
  const plugins = [withTM]
  return plugins.reduce((acc, plugin) => plugin(acc), defaultConfig)
}
