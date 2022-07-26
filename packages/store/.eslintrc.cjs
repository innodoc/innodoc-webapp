module.exports = {
  overrides: [
    {
      files: ['src/slices/**/*.js'],
      rules: {
        'no-param-reassign': [
          'error',
          {
            props: true,
            ignorePropertyModificationsFor: ['state'],
          },
        ],
      },
    },
  ],
}
