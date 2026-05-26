import type { Processor } from 'unified'
import { gfmStrikethroughFromMarkdown } from 'mdast-util-gfm-strikethrough'
import { gfmTableFromMarkdown } from 'mdast-util-gfm-table'
import { gfmStrikethrough } from 'micromark-extension-gfm-strikethrough'
import { gfmTable } from 'micromark-extension-gfm-table'
import { addExtension } from './utils.js'

/** Selectively choose features from mdast-util-gfm */
function remarkGfm(this: Processor) {
  const data = this.data() as Record<string, unknown>
  addExtension(data, 'micromarkExtensions', gfmStrikethrough())
  addExtension(data, 'micromarkExtensions', gfmTable)
  addExtension(data, 'fromMarkdownExtensions', gfmStrikethroughFromMarkdown)
  addExtension(data, 'fromMarkdownExtensions', gfmTableFromMarkdown)
}

export default remarkGfm
