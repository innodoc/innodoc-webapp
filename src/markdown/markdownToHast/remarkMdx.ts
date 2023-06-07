import { mdxJsxFromMarkdown } from 'mdast-util-mdx-jsx'
import { mdxJsx } from 'micromark-extension-mdx-jsx'
import { mdxMd } from 'micromark-extension-mdx-md'
import type { Processor } from 'unified'

import { addExtension } from './utils'

/** Selectively choose features from MDX */
function remarkMdx(this: Processor) {
  const data = this.data()
  addExtension(data, 'micromarkExtensions', mdxMd)
  addExtension(data, 'micromarkExtensions', mdxJsx())
  addExtension(data, 'fromMarkdownExtensions', mdxJsxFromMarkdown())
}

export default remarkMdx
