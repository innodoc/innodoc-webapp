const HTML_ESCAPE_SEQUENCES: Record<string, string> = {
  '&': '&amp;',
  '"': '&quot;',
  "'": '&#39;',
  '<': '&lt;',
  '>': '&gt;',
}

/**
 * Escape a value interpolated into the error page.
 *
 * The page is built as a string, so everything coming from outside (request path, error message)
 * has to be escaped - it is echoed back to the browser as HTML.
 *
 * @param value Value to escape
 * @returns HTML-escaped value
 */
function escapeHtml(value: string): string {
  return value.replaceAll(/[&"'<>]/gu, (char) => HTML_ESCAPE_SEQUENCES[char] ?? char)
}

interface ErrorShellOptions {
  /**
   * Error detail to display (stack trace). Only pass it in development: production visitors must
   * not see internals.
   */
  detail?: string
  /** Locale of the failed request, used for the document language and for the recovery links */
  locale: string
  /** Path of the failed request, used for the retry link */
  url: string
}

/**
 * Extract a printable detail from anything a render may have thrown.
 *
 * @param error Thrown value
 * @returns Error message with stack when available
 */
function makeErrorDetail(error: unknown): string {
  if (error instanceof Error) {
    return error.stack ?? error.message
  }

  return String(error)
}

/**
 * Minimal page served when the app shell could not be rendered.
 *
 * Deliberately static: no script, no stylesheet, no React. The app shell failed once, and a
 * fallback that runs the same renderer could fail the same way and leave the browser with an empty
 * 200 body - the failure mode this page exists to prevent. It is therefore styled inline and fully
 * self-contained, so the visitor at least learns that the request failed and how to get out.
 *
 * @param options - Error shell options
 * @param options.detail - Optional development-only error detail
 * @param options.locale - Locale of the failed request
 * @param options.url - Path of the failed request
 * @returns Complete HTML document
 */
function renderErrorShell({ detail, locale, url }: ErrorShellOptions): string {
  const safeLocale = escapeHtml(locale)
  const detailBlock = detail ? `<pre class="detail">${escapeHtml(detail)}</pre>` : ''

  return `<!doctype html>
<html lang="${safeLocale}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Error</title>
    <style>
      body {
        align-items: center;
        background: #fff;
        color: #1a1a1a;
        display: flex;
        font-family: system-ui, sans-serif;
        justify-content: center;
        margin: 0;
        min-height: 100vh;
        padding: 1.5rem;
      }
      main {
        max-width: 40rem;
      }
      h1 {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 0.5rem;
      }
      p {
        line-height: 1.5;
        margin: 0 0 1rem;
      }
      a {
        color: #1a1a1a;
      }
      .detail {
        background: #f5f5f5;
        font-size: 0.75rem;
        margin: 1rem 0 0;
        overflow-x: auto;
        padding: 0.75rem;
        white-space: pre-wrap;
        word-break: break-word;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Something went wrong</h1>
      <p>This page could not be displayed. Please try again.</p>
      <p>
        <a href="${escapeHtml(url)}">Retry this page</a> &middot; <a href="/${safeLocale}">Index</a>
      </p>
      ${detailBlock}
    </main>
  </body>
</html>
`
}

export { makeErrorDetail }
export default renderErrorShell
