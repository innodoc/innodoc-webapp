const getJson = (url) =>
  fetch(url).then((response) =>
    response.ok
      ? response.json()
      : Promise.reject(
          new Error(`Could not fetch JSON data. (Status: ${response.status} URL: ${url})`)
        )
  )

export const fetchFragment = (base, language, fragmentId) =>
  getJson(`${base}${language}/${fragmentId}.json`)

export const fetchManifest = (base) => getJson(`${base}manifest.json`)

export const fetchPage = (base, language, pageId) =>
  getJson(`${base}${language}/_pages/${pageId}.json`)

export const fetchProgress = (base) => getJson(`${base}user/progress`)

export const fetchSection = (base, language, sectionId) =>
  getJson(`${base}${language}/${sectionId}/content.json`)
