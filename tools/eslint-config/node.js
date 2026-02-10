import { defineConfig } from 'eslint/config'
import globals from 'globals'

const config = defineConfig({
  name: 'innodoc/node',
  files: ['**/*.{js,mjs,cjs,ts,tsx}'],
  languageOptions: {
    globals: { ...globals.node },
  },
})

export default config
