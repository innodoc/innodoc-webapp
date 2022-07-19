import fetch from 'cross-fetch'

async function fetchWithTimeout(url, { timeout = 10000, ...otherOptions } = {}) {
  let response
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  try {
    response = await fetch(url, {
      ...otherOptions,
      signal: controller.signal,
    })
  } catch (err) {
    if (err.type === 'aborted') {
      throw new Error(`Timeout while fetching ${url}`)
    }
  }
  clearTimeout(timeoutId)
  return response
}

const getUrl = (base, pathname) => {
  const url = new URL(pathname, base)
  return url.toString()
}

export { fetchWithTimeout, getUrl }
