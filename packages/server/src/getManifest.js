const getManifest = async (contentRoot) => {
  const url = new URL(contentRoot)
  url.pathname = '/manifest.json'
  return fetch(url.toString()).then((response) =>
    response.ok
      ? response.json()
      : Promise.reject(
          new Error(`Could not fetch course manifest. (Status: ${response.status} URL: ${url})`)
        )
  )
}

export default getManifest
