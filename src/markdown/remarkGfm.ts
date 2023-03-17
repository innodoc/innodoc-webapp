import { gfmStrikethroughFromMarkdown } from 'mdast-util-gfm-strikethrough'
import { gfmTableFromMarkdown } from 'mdast-util-gfm-table'
import { gfmStrikethrough } from 'micromark-extension-gfm-strikethrough'
import { gfmTable } from 'micromark-extension-gfm-table'
import type { Processor } from 'unified'

function addExtension<T>(data: Record<string, unknown>, field: string, extension: T) {
  let list: T[]
  if (Array.isArray(data[field])) {
    list = data[field] as T[]
  } else {
    data[field] = list = []
  }
  list.push(extension)
}

/** Selectively choose features from mdast-util-gfm */
function remarkGfm(this: Processor) {
  const data = this.data()
  addExtension(data, 'micromarkExtensions', gfmStrikethrough())
  addExtension(data, 'micromarkExtensions', gfmTable)
  addExtension(data, 'fromMarkdownExtensions', gfmStrikethroughFromMarkdown)
  addExtension(data, 'fromMarkdownExtensions', gfmTableFromMarkdown)
}

export default remarkGfm
