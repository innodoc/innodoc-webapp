import rehypeKatex from 'rehype-katex'
import rehypeSanitize from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'
import remarkHeadingId from 'remark-heading-id'
import remarkInlineLinks from 'remark-inline-links'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

import rehypeInnodoc from './plugins/rehypeInnodoc/rehypeInnodoc'
import remarkGfm from './plugins/remark/remarkGfm'
import remarkInnodoc from './plugins/remark/remarkInnodoc/remarkInnodoc'
import remarkMdx from './plugins/remark/remarkMdx'
import remarkRehypeHandlers from './plugins/remark/remarkRehypeHandlers'
import sanitizationConfig from './sanitization/sanitizationConfig'

/**
 * Unified processor (parse/run phase)
 *
 * Transform Markdown code to hast.
 */
const processor = unified()
  .use(remarkParse)
  .use(remarkMdx)
  .use(remarkHeadingId)
  .use(remarkInlineLinks)
  .use(remarkGfm)
  .use(remarkInnodoc)
  .use(remarkMath)
  .use(remarkRehype, { handlers: remarkRehypeHandlers })
  .use(rehypeSlug)
  .use(rehypeInnodoc)
  .use(rehypeSanitize, sanitizationConfig)
  .use(rehypeKatex, { output: 'html' })

/** Transform Markdown code to hast. */
async function markdownToHast(markdownCode: string) {
  return processor.run(processor.parse(markdownCode))
}

export default markdownToHast
