function readCookie(name: string): string | undefined {
  return document.cookie
    .split(';')
    ?.map((row) => row.trim())
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1]
}

function setCookie(name: string, value: string) {
  const maxAge = 60 * 60 * 24 * 365 // 1 year
  document.cookie = `${name}=${value}; max-age=${maxAge}; path=/`
}

export { readCookie, setCookie }
