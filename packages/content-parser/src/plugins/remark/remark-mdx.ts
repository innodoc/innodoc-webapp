import type { Processor } from 'unified'
import { mdxJsxFromMarkdown } from 'mdast-util-mdx-jsx'
import { mdxJsx } from 'micromark-extension-mdx-jsx'
import { mdxMd } from 'micromark-extension-mdx-md'
import { addExtension } from './utils.js'

/** Selectively choose features from MDX */
function remarkMdx(this: Processor) {
  const data = this.data() as Record<string, unknown>
  // Turn some CommonMark features off that conflict with MDX
  // (HTML, `codeIndented`, autolinks)
  addExtension(data, 'micromarkExtensions', mdxMd)
  // micromark JSX support
  addExtension(data, 'micromarkExtensions', mdxJsx())
  // mdast JSX extension
  addExtension(data, 'fromMarkdownExtensions', mdxJsxFromMarkdown())
}

export default remarkMdx
