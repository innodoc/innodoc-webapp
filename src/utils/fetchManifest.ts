import type { Manifest } from '../types/api'

function isManifest(data: unknown): data is Manifest {
  return (
    data !== null &&
    typeof data === 'object' &&
    Array.isArray((data as Manifest).languages) &&
    typeof (data as Manifest).toc === 'object'
  )
}

async function fetchManifest(baseUrl: string) {
  const resp = await fetch(`${baseUrl}manifest.json`)
  const data = (await resp.json()) as unknown
  if (isManifest(data)) {
    return data
  }
  throw new Error('Failed to fetch manifest.')
}

export default fetchManifest
