async function fetchWithTimeout(url, { timeout = 10000, ...otherOptions } = {}) {
  let timeoutId
  const controller = new AbortController()

  try {
    timeoutId = setTimeout(() => controller.abort(), timeout)
    return await fetch(url, {
      ...otherOptions,
      signal: controller.signal,
    })
  } catch (err) {
    throw err.type === 'aborted' ? new Error(`Timeout while fetching ${url}`) : err
  } finally {
    clearTimeout(timeoutId)
  }
}

const getUrl = (base, pathname) => new URL(pathname, base).toString()

export { fetchWithTimeout, getUrl }
