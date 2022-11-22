import { gfmStrikethroughFromMarkdown } from 'mdast-util-gfm-strikethrough'
import { gfmTableFromMarkdown } from 'mdast-util-gfm-table'
import { gfmStrikethrough } from 'micromark-extension-gfm-strikethrough'
import { gfmTable } from 'micromark-extension-gfm-table'
import remarkDirective from 'remark-directive'
import remarkFrontmatter from 'remark-frontmatter'
import remarkInlineLinks from 'remark-inline-links'
import remarkParse from 'remark-parse'
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs'
import { unified } from 'unified'
import { removePosition } from 'unist-util-remove-position'

function remarkGfm() {
  const data = this.data()

  add('micromarkExtensions', gfmStrikethrough())
  add('micromarkExtensions', gfmTable)
  add('fromMarkdownExtensions', gfmStrikethroughFromMarkdown)
  add('fromMarkdownExtensions', gfmTableFromMarkdown)

  function add(field, value) {
    const list = data[field] ? data[field] : (data[field] = [])
    list.push(value)
  }
}

const parser = unified()
  .use(remarkParse)
  .use(remarkSqueezeParagraphs)
  .use(remarkInlineLinks)
  .use(remarkFrontmatter)
  .use(remarkDirective)
  .use(remarkGfm)

export function parseMarkdown(markdown: string) {
  const mdast = parser.parse(markdown)
  removePosition(mdast)
  return mdast
}
