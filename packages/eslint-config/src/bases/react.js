module.exports = {
  extends: [
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['jsx-a11y'],
  settings: {
    react: {
      version: 'detect',
    },
  },
}
