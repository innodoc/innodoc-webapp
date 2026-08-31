import { expect, test } from 'vitest'
import renderErrorShell, { makeErrorDetail } from './error-shell.js'

// The page is built as a string and echoed back to the browser with data from the request in it, so
// escaping is the behaviour under test, not a detail of how the strings happen to look.
test('renderErrorShell escapes what came from the request', () => {
  const html = renderErrorShell({
    detail: 'TypeError: <b>Expected parameter</b>',
    locale: 'en',
    url: '/en/<img src=x onerror=alert(1)>',
  })

  expect(html).not.toContain('<b>')
  expect(html).toContain('&lt;b&gt;')
  expect(html).not.toContain('<img src=x')
  expect(html).toContain('&lt;img src=x')
})

test('renderErrorShell is a standalone page about the failed request', () => {
  const html = renderErrorShell({ locale: 'de', url: '/de/test-course/progress' })

  expect(html).toContain('<html lang="de">')
  expect(html).toContain('<meta name="robots" content="noindex" />')
  // The retry link points back at the failed path
  expect(html).toContain('<a href="/de/test-course/progress">')
  // Nothing to boot: the renderer is what just failed
  expect(html).not.toContain('<script')
})

test('renderErrorShell shows an error detail only when given one', () => {
  expect(renderErrorShell({ locale: 'en', url: '/en' })).not.toContain('class="detail"')
  expect(renderErrorShell({ detail: 'App shell could not be rendered', locale: 'en', url: '/en' })).toContain(
    'class="detail">App shell could not be rendered<',
  )
})

test('makeErrorDetail keeps the stack and stringifies anything else', () => {
  const error = new Error('boom')

  expect(makeErrorDetail(error)).toBe(error.stack)
  expect(makeErrorDetail('boom')).toBe('boom')
})
