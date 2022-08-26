import { parse as parseSvg, type RootNode } from 'svg-parser'

import type { Manifest } from '@/types/api'

async function getLogo(manifest: Manifest): Promise<RootNode | undefined> {
  const contentRoot = process.env.INNODOC_CONTENT_ROOT
  if (contentRoot === undefined)
    throw new Error('You need to set the env variable INNODOC_CONTENT_ROOT.')

  if (typeof manifest.logo !== 'string' || !manifest.logo.startsWith('file:')) return undefined

  const url = `${contentRoot}_static/${manifest.logo.substring(5)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch logo ${url}`)
  return parseSvg(await res.text())
}

export default getLogo
