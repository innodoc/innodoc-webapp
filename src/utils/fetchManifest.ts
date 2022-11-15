import type { ApiManifest } from '@/types/api'

function isApiManifest(data: unknown): data is ApiManifest {
  return (
    data !== null &&
    typeof data === 'object' &&
    Array.isArray((data as ApiManifest).languages) &&
    typeof (data as ApiManifest).toc === 'object'
  )
}

async function fetchManifest() {
  const contentRoot = process.env.INNODOC_CONTENT_ROOT
  if (contentRoot === undefined) {
    throw new Error('You need to set the env variable INNODOC_CONTENT_ROOT.')
  }

  const resp = await fetch(`${contentRoot}manifest.json`)
  const data = (await resp.json()) as unknown
  if (isApiManifest(data)) {
    return data
  }
  throw new Error('Failed to fetch manifest.')
}

export default fetchManifest
