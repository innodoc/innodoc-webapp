import type { ContentOptions, Fakers, LocalizedContent, NodeFactory } from './types.js'
import type { Faker } from '@faker-js/faker'
import type { RootContent } from 'mdast'
import stringify from 'remark-stringify'
import { unified } from 'unified'
import { isMdastRoot } from '@innodoc/content-parser/typeguards'
import { code, heading, list, listItem, paragraph, root, text } from './mdast-builder.js'
import { capitalize, range, seed } from './utils.js'

let _nodeFactories: NodeFactory[] = []
let _weights: number[]

const defaultOptions: ContentOptions = {
  nodeCount: 5,
}

const processor = unified().use(stringify, {
  bullet: '-',
  fences: true,
  incrementListMarker: false,
})

function getNodeFactories(faker: Faker) {
  if (_nodeFactories.length === 0) {
    _nodeFactories = [
      [80, () => paragraph([text(faker.lorem.paragraph())])],
      [5, () => makeList(faker)],
      [3, () => makeCode(faker)],
    ]
    _weights = [_nodeFactories[0]?.[0] ?? 0]
    for (let i = 1; i < _nodeFactories.length; ++i) {
      _weights[i] = (_nodeFactories[i]?.[0] ?? 0) + (_weights[i - 1] ?? 0)
    }
  }
  return { nodeFactories: _nodeFactories, weights: _weights }
}

function makeList(faker: Faker) {
  const randNum = faker.number.int({ min: 2, max: 5 })
  return list(
    faker.datatype.boolean() ? 'ordered' : 'unordered',
    range(randNum).map(() => listItem([paragraph([text(faker.lorem.paragraph(1))])])),
  )
}

function makeCode(faker: Faker) {
  const randNum = faker.number.int({ min: 3, max: 10 })
  const phrases = range(randNum)
    .map(() => faker.hacker.phrase())
    .join('\n')
  return code('', phrases)
}

/** Get node according to probability */
function makeNode(faker: Faker): RootContent {
  const { nodeFactories, weights } = getNodeFactories(faker)
  const randNum = faker.number.float({ min: 0, max: 1 }) * (weights.at(-1) ?? 1)
  for (const [i, weight] of weights.entries()) {
    if (randNum <= weight) {
      const node = nodeFactories[i]?.[1]()
      if (!node) {
        throw new Error('Node factory not found')
      }
      return node
    }
  }
  throw new Error('No node factories')
}

function makeMarkdown(faker: Faker, options: Partial<ContentOptions>) {
  const mergedOps = { ...defaultOptions, ...options }

  if (options.seed) {
    seed(options.seed, faker)
  }

  const nodes = range(mergedOps.nodeCount).map(() => makeNode(faker))

  if (mergedOps.headerDepth !== undefined) {
    nodes.unshift(heading(mergedOps.headerDepth, [text(capitalize(faker.lorem.words()))]))
  }

  const rootNode = root(nodes)
  if (!isMdastRoot(rootNode)) {
    throw new Error('Type assertion error in Markdown generation')
  }

  return processor.stringify(rootNode)
}

const makeContent = (fakers: Fakers, options: Partial<ContentOptions> = {}): LocalizedContent =>
  Object.fromEntries(Object.entries(fakers).map(([locale, faker]) => [locale, makeMarkdown(faker, options)]))

export default makeContent
