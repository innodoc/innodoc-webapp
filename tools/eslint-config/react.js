import react from '@eslint-react/eslint-plugin'
import { defineConfig } from 'eslint/config'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import hooks from 'eslint-plugin-react-hooks'

const config = defineConfig({
  name: 'innodoc/react',
  files: ['**/*.tsx'],
  extends: [react.configs['strict-type-checked'], hooks.configs.flat.recommended, jsxA11y.flatConfigs.recommended],
  rules: {
    // Allow to "omit" props using destructuring w/o having them marked as "unused"
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
  },
})

export default config
