import type { DefinitionContentMap, Root } from 'mdast'
import remarkDirective from 'remark-directive'
import remarkInlineLinks from 'remark-inline-links'
import remarkParse from 'remark-parse'
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs'
import { type Plugin, unified } from 'unified'
import { Index } from 'unist-util-index'

import { indexTypes, type MarkdownDoc } from '#types/entities/markdown'

import remarkGfm from './remarkGfm'
import remarkId from './remarkId'
import remarkNumberCards from './remarkNumberCards'

type ExtraPlugin = [Plugin, Record<string, unknown>]

class MarkdownParser {
  protected readonly parser

  constructor(extraPlugins: ExtraPlugin[] = []) {
    this.parser = unified()
      .use(remarkParse)
      .use(remarkDirective)
      .use(remarkInlineLinks)
      .use(remarkGfm)
      .use(remarkSqueezeParagraphs)
      .use(remarkId)
      .use(remarkNumberCards)

    for (const [plugin, pluginArgs] of extraPlugins) {
      this.parser.use(plugin, pluginArgs)
    }
  }

  parse(markdown: string): MarkdownDoc {
    const root = this.parser.parse(markdown)

    const indices = indexTypes.reduce<MarkdownDoc['indices']>((acc, type) => {
      const index = MarkdownParser.createIndex(root, type)
      return Object.keys(index).length > 0 ? { ...acc, [type]: index } : acc
    }, {})

    return { root, indices }
  }

  protected static createIndex<T extends keyof DefinitionContentMap>(root: Root, type: T) {
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
