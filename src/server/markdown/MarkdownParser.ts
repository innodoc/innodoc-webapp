import camelcaseKeys from 'camelcase-keys'
import yaml from 'js-yaml'
import type { DefinitionContentMap, Root } from 'mdast'
import remarkDirective from 'remark-directive'
import remarkFrontmatter from 'remark-frontmatter'
import remarkInlineLinks from 'remark-inline-links'
import remarkParse from 'remark-parse'
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs'
import { unified } from 'unified'
import { Index } from 'unist-util-index'
import { removePosition as utilRemovePosition } from 'unist-util-remove-position'

import { indexTypes, type MarkdownDoc } from '#types/entities/markdown'

import remarkGfm from './remarkGfm'
import remarkNumberCards from './remarkNumberCards'
import remarkUuid from './remarkUuid'

interface ParseOptions {
  /** Remove position information */
  removePosition?: boolean
}

interface Frontmatter {
  title: string
  short_title?: string
  type?: string
}

class MarkdownParser {
  protected parser

  constructor() {
    this.parser = unified()
      .use(remarkParse)
      .use(remarkFrontmatter)
      .use(remarkDirective)
      .use(remarkInlineLinks)
      .use(remarkGfm)
      .use(remarkSqueezeParagraphs)
      .use(remarkUuid)
      .use(remarkNumberCards)
  }

  parse(markdown: string, opts: ParseOptions = {}) {
    const defaultOpts = { removePosition: true }
    const mergedOpts = { ...defaultOpts, ...opts }

    const root = this.parser.parse(markdown)

    if (mergedOpts.removePosition) utilRemovePosition(root)

    const { title, shortTitle, type } = MarkdownParser.parseYamlFrontmatter(root)

    const indices = indexTypes.reduce<MarkdownDoc['indices']>((acc, type) => {
      const index = MarkdownParser.createIndex(root, type)
      return Object.keys(index).length > 0 ? { ...acc, [type]: index } : acc
    }, {})

    return { root, title, shortTitle, type, indices }
  }

  static parseYamlFrontmatter(root: Root) {
    const yamlNode = root.children.shift()
    if (!yamlNode || yamlNode.type !== 'yaml') {
      throw new Error('YAML frontmatter not found')
    }
    return camelcaseKeys(yaml.load(yamlNode.value) as Frontmatter)
  }

  static createIndex<T extends keyof DefinitionContentMap>(root: Root, type: T) {
    const { index } = new Index('identifier', root, type)
    // Convert Map to object
    return Array.from(index).reduce<Record<string, DefinitionContentMap[T]>>((obj, [key, val]) => {
      if (typeof key === 'string') {
        obj[key] = val[0] as DefinitionContentMap[T]
      }
      return obj
    }, {})
  }
}

export default MarkdownParser
