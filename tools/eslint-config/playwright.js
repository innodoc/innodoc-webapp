import { defineConfig } from 'eslint/config'
import playwright from 'eslint-plugin-playwright'

const config = defineConfig({
  name: 'innodoc/playwright',
  files: ['**/*.test.ts'],
  extends: [playwright.configs['flat/recommended']],
})

export default config
