import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server/startServer.ts'],
  format: 'esm',
  outDir: 'dist',
  platform: 'node',
  minify: false,
  shims: true,
  sourcemap: false,
  splitting: false,
  target: 'node18',
})
