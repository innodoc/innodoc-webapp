module.exports = {
  root: true,
  extends: [
    '@innodoc/eslint-config',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:react-redux/recommended',
  ],
  plugins: ['react-redux', 'jsx-a11y'],
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    'no-restricted-imports': 'off',

    '@typescript-eslint/no-restricted-imports': [
      'error',
      {
        paths: [
          // Warn when using hooks from react-redux directly
          {
            name: 'react-redux',
            importNames: ['useSelector', 'useDispatch'],
            message:
              'Use typed hooks `useDispatch` and `useSelector` from `@innodoc/store` instead.',
          },
          // Warn when using hooks from react-redux directly
          {
            name: '@mui/material',
            importNames: ['Icon'],
            message: 'Use `#ui/components/common/Icon` instead.',
          },
        ],
      },
    ],

    // Allow to "omit" props using destructuring w/o having them marked as "unused"
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
  },
}
