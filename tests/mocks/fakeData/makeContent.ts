import { faker } from '@faker-js/faker'
import type { LanguageCode } from 'iso-639-1'
import { root, paragraph, text, heading, list, listItem, code } from 'mdast-builder'
import stringify from 'remark-stringify'
import { unified } from 'unified'

import { isRoot } from '#markdown/typeGuards'
import { capitalize } from '#utils/content'

import type { Content, ContentOptions, NodeMakers } from './types'
import { range, seed } from './utils'

const defaultOptions: ContentOptions = {
  nodeCount: 5,
}

const processor = unified().use(stringify, {
  bullet: '-',
  fences: true,
  incrementListMarker: false,
})

const nodeMakers: NodeMakers = [
  [80, () => paragraph(text(faker.lorem.paragraph()))],
  [5, () => makeList()],
  [3, () => makeCode()],
]
const weights = [nodeMakers[0][0]]
for (let i = 1; i < nodeMakers.length; ++i) {
  weights[i] = nodeMakers[i][0] + weights[i - 1]
}

function makeList() {
  const randNum = faker.datatype.number({ min: 2, max: 5 })
  return list(
    faker.datatype.boolean() ? 'ordered' : 'unordered',
    range(randNum).map(() => listItem(text(faker.lorem.paragraph(1))))
  )
}

function makeCode() {
  const randNum = faker.datatype.number({ min: 3, max: 10 })
  const phrases = range(randNum)
    .map(() => faker.hacker.phrase())
    .join('\n')
  return code('', phrases)
}

function makeNode() {
  const randNum = faker.datatype.float({ min: 0, max: 1 }) * weights[weights.length - 1]
  for (let i = 0; i < weights.length; ++i) {
    if (randNum <= weights[i]) {
      return nodeMakers[i][1]()
    }
  }
  throw new Error('Should not happen')
}

function makeMarkdown(options: Partial<ContentOptions>) {
  const mergedOps = { ...defaultOptions, ...options }

  if (options.seed) {
    seed(options.seed)
  }

  const nodes = range(mergedOps.nodeCount).map(makeNode)

  if (mergedOps.headerDepth !== undefined) {
    nodes.unshift(heading(mergedOps.headerDepth, text(capitalize(faker.lorem.words()))))
  }

  const rootNode = root(nodes)
  if (!isRoot(rootNode)) {
    throw new Error('Type assertion error in Markdown generation')
  }

  return processor.stringify(rootNode)
}

const makeContent = (locales: LanguageCode[], options: Partial<ContentOptions> = {}): Content =>
  Object.fromEntries(locales.map((locale) => [locale, makeMarkdown(options)]))

export default makeContent
