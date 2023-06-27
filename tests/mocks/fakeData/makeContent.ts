import type { Faker } from '@faker-js/faker'
import { root, paragraph, text, heading, list, listItem, code } from 'mdast-builder'
import stringify from 'remark-stringify'
import { unified } from 'unified'

import { isMdastRoot } from '#markdown/typeGuards'
import { capitalize } from '#utils/content'

import type { Content, ContentOptions, Fakers, NodeMakers } from './types'
import { range, seed } from './utils'

const defaultOptions: ContentOptions = {
  nodeCount: 5,
}

const processor = unified().use(stringify, {
  bullet: '-',
  fences: true,
  incrementListMarker: false,
})

let _nodeMakers: NodeMakers
let _weights: number[]
function getNodeMakers(faker: Faker) {
  if (_nodeMakers === undefined) {
    _nodeMakers = [
      [80, () => paragraph(text(faker.lorem.paragraph()))],
      [5, () => makeList(faker)],
      [3, () => makeCode(faker)],
    ]
    _weights = [_nodeMakers[0][0]]
    for (let i = 1; i < _nodeMakers.length; ++i) {
      _weights[i] = _nodeMakers[i][0] + _weights[i - 1]
    }
  }
  return { nodeMakers: _nodeMakers, weights: _weights }
}

function makeList(faker: Faker) {
  const randNum = faker.number.int({ min: 2, max: 5 })
  return list(
    faker.datatype.boolean() ? 'ordered' : 'unordered',
    range(randNum).map(() => listItem(text(faker.lorem.paragraph(1))))
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
function makeNode(faker: Faker) {
  const { nodeMakers, weights } = getNodeMakers(faker)
  const randNum = faker.number.float({ min: 0, max: 1 }) * weights[weights.length - 1]
  for (let i = 0; i < weights.length; ++i) {
    if (randNum <= weights[i]) {
      return nodeMakers[i][1]()
    }
  }
  throw new Error('Should not happen')
}

function makeMarkdown(faker: Faker, options: Partial<ContentOptions>) {
  const mergedOps = { ...defaultOptions, ...options }

  if (options.seed) {
    seed(options.seed, faker)
  }

  const nodes = range(mergedOps.nodeCount).map(() => makeNode(faker))

  if (mergedOps.headerDepth !== undefined) {
    nodes.unshift(heading(mergedOps.headerDepth, text(capitalize(faker.lorem.words()))))
  }

  const rootNode = root(nodes)
  if (!isMdastRoot(rootNode)) {
    throw new Error('Type assertion error in Markdown generation')
  }

  return processor.stringify(rootNode)
}

const makeContent = (fakers: Fakers, options: Partial<ContentOptions> = {}): Content =>
  Object.fromEntries(
    Object.entries(fakers).map(([locale, faker]) => [locale, makeMarkdown(faker, options)])
  )

export default makeContent
