import { sortLinks } from './Head'

const linksDef = [
  '/_next/static/chunks/static/development/pages/page.js.chunk.css',
  '/_next/static/css/antd.chunk.css',
  '/_next/static/chunks/static/development/pages/_app.js.chunk.css',
]

const links = linksDef.reduce(
  (acc, href) => [
    ...acc,
    { props: { href, rel: 'preload' } },
    { props: { href, rel: 'stylesheet' } },
  ],
  []
)

describe('sortLinks', () => {
  it('should sort links', () => {
    const sorted = sortLinks(links)
    expect(sorted).toHaveLength(6)
    expect(sorted[0].props.rel).toBe('preload')
    expect(sorted[0].props.href).toMatch('_app.js.chunk.css')
    expect(sorted[1].props.rel).toBe('stylesheet')
    expect(sorted[1].props.href).toMatch('_app.js.chunk.css')
    expect(sorted[2].props.rel).toBe('preload')
    expect(sorted[2].props.href).toMatch('antd.chunk.css')
    expect(sorted[3].props.rel).toBe('stylesheet')
    expect(sorted[3].props.href).toMatch('antd.chunk.css')
    expect(sorted[4].props.rel).toBe('preload')
    expect(sorted[4].props.href).toMatch('page.js.chunk.css')
    expect(sorted[5].props.rel).toBe('stylesheet')
    expect(sorted[5].props.href).toMatch('page.js.chunk.css')
  })
})
