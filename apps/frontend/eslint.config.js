import { defineConfig } from 'eslint/config'

import { frontendConfig } from '@innodoc/configs/eslint'

const config = defineConfig([
  frontendConfig,
  {
    name: 'innodoc/frontend-ignore-vike-filenames',
    files: ['src/**/+*.ts'],
    rules: {
      'unicorn/filename-case': 'off',
    },
  },
])

export default config
