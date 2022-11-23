import camelcaseKeys from 'camelcase-keys'
import { load as yamlLoad } from 'js-yaml'

import type { ApiCourse } from '#types/api'

function isApiCourse(data: object): data is ApiCourse {
  return Array.isArray((data as ApiCourse).locales) && 'homeLink' in data
}

async function fetchContent(contentRoot: string, path: string) {
  const resp = await fetch(`${contentRoot}${path}`)
  if (resp.status === 200) {
    return resp.text()
  }
}

async function fetchManifest(contentRoot: string): Promise<ApiCourse> {
  let resp = await fetch(`${contentRoot}manifest.yml`)
  if (resp.status !== 200) {
    resp = await fetch(`${contentRoot}manifest.yaml`)
  }
  if (resp.status !== 200) {
    throw new Error(`Failed to fetch manifest: ${resp.status} ${resp.statusText}`)
  }

  const parsedData = yamlLoad(await resp.text())

  if (parsedData !== null && typeof parsedData === 'object') {
    const camelcasedData = camelcaseKeys(parsedData)

    if (isApiCourse(camelcasedData)) {
      return camelcasedData
    }
  }

  throw new Error('Failed to fetch manifest: Received invalid data')
}

export { fetchContent, fetchManifest }
