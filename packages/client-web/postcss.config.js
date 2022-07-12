// Based on Next.js default config
// https://nextjs.org/docs/advanced-features/customizing-postcss-config#customizing-plugins

const cssnanoOpts = {
  reset: ['default', { discardComments: { removeAll: true } }],
}

const presetEnvOpts = {
  autoprefixer: { flexbox: 'no-2009' },
  features: { 'custom-properties': false },
  stage: 3,
}

module.exports = {
  plugins: {
    [require.resolve('postcss-import')]: {},
    [require.resolve('postcss-extend-rule')]: {},
    [require.resolve('postcss-advanced-variables')]: {},
    [require.resolve('postcss-property-lookup')]: {},
    [require.resolve('postcss-nested')]: {},
    [require.resolve('postcss-color-function')]: {},
    [require.resolve('postcss-flexbugs-fixes')]: {},
    [require.resolve('postcss-preset-env')]: presetEnvOpts,
    [require.resolve('cssnano')]: process.env.NODE_ENV === 'production' ? cssnanoOpts : false,
  },
}
