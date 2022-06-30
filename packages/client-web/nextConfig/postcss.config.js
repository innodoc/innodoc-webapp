const cssnanoOpts = {
  reset: [
    'default',
    {
      discardComments: { removeAll: true },
    },
  ],
}

module.exports = {
  plugins: {
    [require.resolve('postcss-import')]: {},
    [require.resolve('precss')]: {},
    [require.resolve('postcss-color-function')]: {},
    [require.resolve('cssnano')]: process.env.NODE_ENV === 'production' ? cssnanoOpts : false,
  },
}
