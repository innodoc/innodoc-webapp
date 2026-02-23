import { defineConfig } from 'eslint/config'

import { backendConfig } from '@innodoc/configs/eslint'

const config = defineConfig([
  backendConfig,
  {
    name: 'innodoc/server-db-ignore-migration-filenames',
    files: ['src/migrations/*.ts'],
    rules: {
      'unicorn/filename-case': 'off',
    },
  },
])

export default config
