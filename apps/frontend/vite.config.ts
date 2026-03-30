import path from 'node:path'

import { Unhead } from '@unhead/react/bundler'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import type { UserConfig } from 'vite'

const rootDir = path.resolve(import.meta.dirname, '..', '..')
const srcDir = path.resolve(import.meta.dirname, 'src')

const configFn = defineConfig(({ command, isSsrBuild }) => {
  const unhead = Unhead({ streaming: true }).vite

  const config: UserConfig = {
    envDir: rootDir,
    envPrefix: 'INNODOC_', // Exposed to client
    plugins: [viteReact(), unhead()],
    root: srcDir,
    ssr: {
      noExternal: [/^@innodoc\//],
    },
  }

  if (command !== 'serve') {
    const buildExtras: UserConfig['build'] = isSsrBuild
      ? // Server build
        {
          outDir: path.resolve(import.meta.dirname, 'dist', 'server'),
          rolldownOptions: {
            input: path.resolve(srcDir, 'entry-server.tsx'),
          },
        }
      : // Client build
        {
          outDir: path.resolve(import.meta.dirname, 'dist'),
          rolldownOptions: {
            input: {
              main: path.resolve(srcDir, 'entry-client.tsx'),
            },
          },
        }

    config.build = {
      ...buildExtras,
      emptyOutDir: true,
    }
  }

  return config
})

export default configFn
