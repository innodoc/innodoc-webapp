import { transform } from '@svgr/core'

import type { ApiManifest } from '#types/api'

async function getLogo(manifest: ApiManifest): Promise<string> {
  const contentRoot = process.env.INNODOC_CONTENT_ROOT
  if (contentRoot === undefined) {
    throw new Error('You need to set the env variable INNODOC_CONTENT_ROOT.')
  }

  if (typeof manifest.logo !== 'string' || !manifest.logo.startsWith('file:')) {
    return 'export default null'
  }

  // Fetch logo
  const url = `${contentRoot}_static/${manifest.logo.substring(5)}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch logo ${url}`)
  }
  const svgCode = await res.text()

  // Transform SVG into JSX
  return transform(
    svgCode,
    {
      plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
      jsxRuntime: 'automatic',
      typescript: true,
    },
    { componentName: 'Logo' }
  )
}

export default getLogo
