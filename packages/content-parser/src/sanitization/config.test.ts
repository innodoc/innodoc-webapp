import type { Properties, Root } from 'hast'
import { visit } from 'unist-util-visit'
import { expect, test } from 'vitest'
import markdownToHast from '@innodoc/content-parser'
import { isHastRootDivElement } from '#typeguards'

interface ElementInfo {
  tagName: string
  properties: Properties
}

function collectElements(root: Root): ElementInfo[] {
  const found: ElementInfo[] = []
  visit(root, 'element', (el) => {
    found.push({ tagName: el.tagName, properties: el.properties })
  })
  return found
}

test('keeps the root marker that the renderer relies on', async () => {
  const root = await markdownToHast('# Heading')
  expect(isHastRootDivElement(root)).toBe(true)
})

test('removes javascript: hrefs from links', async () => {
  for (const markdown of ['[bad](<javascript:alert(1)>)', '[bad](javascript:alert(1))']) {
    const root = await markdownToHast(markdown)
    const links = collectElements(root).filter((el) => el.tagName === 'a')
    expect(links.map((el) => el.properties)).toEqual([{}])
  }
})

test('removes other disallowed protocols from links', async () => {
  const root = await markdownToHast('[v](vbscript:alert(1))')
  const links = collectElements(root).filter((el) => el.tagName === 'a')
  expect(links.map((el) => el.properties)).toEqual([{}])
})

test('keeps app: protocol links', async () => {
  const root = await markdownToHast('[go](<app:course:page|p1>)')
  const links = collectElements(root).filter((el) => el.tagName === 'a')
  expect(links.map((el) => el.properties)).toEqual([{ href: 'app://course:page%7Cp1' }])
})

test('deletes script elements and their content', async () => {
  const root = await markdownToHast('<script>alert(1)</script>')
  expect(root.children).toEqual([])
  expect(collectElements(root).some((el) => el.tagName === 'script')).toBe(false)
})

test('keeps surrounding content when a script element is deleted', async () => {
  const root = await markdownToHast('before\n\n<script>alert(1)</script>\nafter')
  const elements = collectElements(root)
  expect(elements.map((el) => el.tagName)).toEqual(['div', 'p', 'p'])
})

test('strips event handler attributes from custom elements', async () => {
  const root = await markdownToHast('<img src="x" onerror="alert(1)" />')
  const images = collectElements(root).filter((el) => el.properties.name === 'img')
  expect(images.map((el) => el.properties)).toEqual([{ src: 'x', name: 'img' }])
})

test('strips data-* attributes from custom elements', async () => {
  const root = await markdownToHast('<Info data-x="1" title="t">\n\nx\n\n</Info>')
  const infos = collectElements(root).filter((el) => el.properties.name === 'Info')
  expect(infos.map((el) => el.properties)).toEqual([{ title: 't', name: 'Info' }])
})

test('strips style attributes from custom elements', async () => {
  const root = await markdownToHast('<Info style="background:red">\n\nx\n\n</Info>')
  const infos = collectElements(root).filter((el) => el.properties.name === 'Info')
  expect(infos.map((el) => el.properties)).toEqual([{ name: 'Info' }])
})

test('never keeps javascript: hrefs on custom anchor elements', async () => {
  const blockRoot = await markdownToHast('<a href="javascript:alert(1)">\n\nx\n\n</a>')
  const blockAnchors = collectElements(blockRoot).filter((el) => el.properties.name === 'a')
  expect(blockAnchors.map((el) => el.properties)).toEqual([{ name: 'a' }])

  const inlineRoot = await markdownToHast('see <a href="javascript:alert(1)">x</a> ok')
  const inlineAnchors = collectElements(inlineRoot).filter((el) => el.properties.name === 'a')
  expect(inlineAnchors.map((el) => el.properties)).toEqual([{ name: 'a' }])
})

test('keeps question properties on inline question elements', async () => {
  const root = await markdownToHast('a <TextQuestion solution="42" points="5">q</TextQuestion> b')
  const questions = collectElements(root).filter((el) => el.tagName === 'span' && el.properties.name === 'TextQuestion')
  expect(questions.map((el) => el.properties)).toEqual([{ solution: '42', points: '5', name: 'TextQuestion' }])
})

test('keeps grid properties on grid item elements', async () => {
  const root = await markdownToHast('<Grid>\n<GridItem xs="12" xsOffset="2">\n\nhello\n\n</GridItem>\n</Grid>')
  const items = collectElements(root).filter((el) => el.properties.name === 'GridItem')
  expect(items.map((el) => el.properties)).toEqual([{ xs: '12', xsOffset: '2', name: 'GridItem' }])
})

test('keeps tab labels and tab item indexes', async () => {
  const root = await markdownToHast(
    '<Tabs>\n<TabItem label="P0">\n\na\n\n</TabItem>\n<TabItem label="P1">\n\nb\n\n</TabItem>\n</Tabs>',
  )
  const elements = collectElements(root)
  const tabs = elements.filter((el) => el.properties.name === 'Tabs')
  expect(tabs.map((el) => el.properties)).toEqual([{ name: 'Tabs', labels: ['P0', 'P1'] }])
  const items = elements.filter((el) => el.properties.name === 'TabItem')
  expect(items.map((el) => el.properties.index)).toEqual(['0', '1'])
})

test('keeps video src and videoId properties', async () => {
  const videoRoot = await markdownToHast('<Video src="https://vimeo.com/1" />')
  const videos = collectElements(videoRoot).filter((el) => el.properties.name === 'Video')
  expect(videos.map((el) => el.properties)).toEqual([{ src: 'https://vimeo.com/1', name: 'Video' }])

  const youtubeRoot = await markdownToHast('<YouTubeVideo videoId="abc" />')
  const youtubes = collectElements(youtubeRoot).filter((el) => el.properties.name === 'YouTubeVideo')
  expect(youtubes.map((el) => el.properties)).toEqual([{ videoId: 'abc', name: 'YouTubeVideo' }])
})
