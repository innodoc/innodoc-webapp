// TODO:
//  - make transformIgnorePatterns packages dynamic

import path from 'path'

import nextJest from 'next/jest.js'

const __dirname = new URL('.', import.meta.url).pathname
const rootDir = path.resolve(__dirname, '..', '..')

const getNextJestConfig = nextJest({ dir: path.resolve(rootDir, 'src') })()

// Patch config *after* next.js, because next.js doesn't let us override
// transformIgnorePatterns
export default async () => {
  const config = await getNextJestConfig()

  return {
    ...config,

    moduleDirectories: ['<rootDir>/src', '<rootDir>/src/__tests__/utils/integration'],
    testEnvironment: 'jest-environment-jsdom',

    // add custom dev build dir to ignore patterns
    testPathIgnorePatterns: ['/.next-dev/'],
    watchPathIgnorePatterns: ['/.next-dev/'],

    moduleNameMapper: Object.fromEntries(
      Object.entries(config.moduleNameMapper).map(([key, value]) => {
        // add sugarss
        if (key.includes('css|sass|scss')) {
          return [key.replace('css|sass|scss', 'css|sass|scss|sss'), value]
        }

        // mock @svgr
        if (key === '^.+\\.(svg)$') {
          return ['^.+\\.(svg)$', '<rootDir>/src/__tests__/utils/integration/svgr-mock.js']
        }

        return [key, value]
      })
    ),

    transformIgnorePatterns: config.transformIgnorePatterns.map((p) => {
      // Override transformIgnorePatterns to allow certain packages to be transpiled
      if (p === /node_modules/.toString()) {
        return /node_modules\/(?!(camelcase-keys|react-i18next))/.toString()
      }

      // sugarss
      else if (p.includes('css|sass|scss')) {
        return p.replace('css|sass|scss', 'css|sass|scss|sss')
      }

      return p
    }),

    rootDir,

    roots: ['<rootDir>/src/__tests__/integration'],

    setupFilesAfterEnv: ['<rootDir>/src/__tests__/utils/integration/jest.setup.js'],
  }
}
