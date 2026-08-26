import type { UserConfig } from 'vite'
import { Unhead } from '@unhead/react/bundler'
import viteReact from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'

const rootDir = path.resolve(import.meta.dirname, '..', '..')
const srcDir = path.resolve(import.meta.dirname, 'src')

const configFn = defineConfig(({ command, isSsrBuild }) => {
  // 'inline' injects the streaming head IIFE into the HTML directly; the
  // default 'async' mode references an external IIFE file that rolldown-vite
  // does not emit, which would 404 in production.
  const unhead = Unhead({ streaming: { mode: 'inline' } }).vite

  const config: UserConfig = {
    envDir: rootDir,
    envPrefix: 'INNODOC_', // Exposed to client
    plugins: [viteReact(), unhead()],
    root: srcDir,
    publicDir: path.resolve(import.meta.dirname, 'public'),
    ssr: {
      noExternal: [/^@innodoc\//u],
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
            input: path.resolve(srcDir, 'index.html'),
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
