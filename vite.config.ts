import path from 'path'

import react from '@vitejs/plugin-react'
import { UserConfig } from 'vite'
import ssr from 'vite-plugin-ssr/plugin'

const config: UserConfig = {
  envPrefix: 'INNODOC_',
  plugins: [react(), ssr({ prerender: true })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
}

export default config
