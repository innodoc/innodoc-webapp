import type { Root as HastRoot } from 'hast'
import type { Root as MdastRoot } from 'mdast'
import type { Processor } from 'unified'
import rehypeKatex from 'rehype-katex'
import rehypeSanitize from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'
import remarkHeadingId from 'remark-heading-id'
import remarkInlineLinks from 'remark-inline-links'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import rehypeHeadingIdDedupe from './plugins/rehype-innodoc/heading-id-dedupe.js'
import rehypeInnodoc from './plugins/rehype-innodoc/rehype-innodoc.js'
import remarkGfm from './plugins/remark/remark-gfm.js'
import remarkInnodoc from './plugins/remark/remark-innodoc/remark-innodoc.js'
import remarkMdx from './plugins/remark/remark-mdx.js'
import remarkRehypeHandlers from './plugins/remark/remark-rehype-handlers.js'
import sanitizationConfig from './sanitization/config.js'

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
  .use(rehypeHeadingIdDedupe)
  .use(rehypeInnodoc)
  .use(rehypeSanitize, sanitizationConfig)
  .use(rehypeKatex, { output: 'html' }) as Processor<MdastRoot, MdastRoot, HastRoot>

/** Transform Markdown code to hast. */
function markdownToHast(markdownCode: string) {
  return processor.run(processor.parse(markdownCode))
}

export default markdownToHast
