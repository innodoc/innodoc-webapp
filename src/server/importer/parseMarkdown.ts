import { gfmStrikethroughFromMarkdown } from 'mdast-util-gfm-strikethrough'
import { gfmTableFromMarkdown } from 'mdast-util-gfm-table'
import { gfmStrikethrough } from 'micromark-extension-gfm-strikethrough'
import { gfmTable } from 'micromark-extension-gfm-table'
import remarkDirective from 'remark-directive'
import remarkFrontmatter from 'remark-frontmatter'
import remarkInlineLinks from 'remark-inline-links'
import remarkParse from 'remark-parse'
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs'
import { type Processor, unified } from 'unified'
import { removePosition } from 'unist-util-remove-position'

function addExtension<T>(data: Record<string, unknown>, field: string, extension: T) {
  let list: T[]
  if (Array.isArray(data[field])) {
    list = data[field] as T[]
  } else {
    data[field] = list = []
  }
  list.push(extension)
}

function remarkGfm(this: Processor) {
  const data = this.data()
  addExtension(data, 'micromarkExtensions', gfmStrikethrough())
  addExtension(data, 'micromarkExtensions', gfmTable)
  addExtension(data, 'fromMarkdownExtensions', gfmStrikethroughFromMarkdown)
  addExtension(data, 'fromMarkdownExtensions', gfmTableFromMarkdown)
}

const parser = unified()
  .use(remarkParse)
  .use(remarkFrontmatter)
  .use(remarkDirective)
  .use(remarkInlineLinks)
  .use(remarkGfm)
  .use(remarkSqueezeParagraphs)

/** Parse Markdown code to mdast */
function parseMarkdown(markdown: string) {
  const mdast = parser.parse(markdown)
  removePosition(mdast)
  return mdast
}

export default parseMarkdown
