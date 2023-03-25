import rehypeKatex from 'rehype-katex'
import rehypeSanitize from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'
import remarkDirective from 'remark-directive'
import remarkHeadingId from 'remark-heading-id'
import remarkInlineLinks from 'remark-inline-links'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs'
import { unified } from 'unified'

import rehypeCaption from './rehypeCaption'
import rehypeTabs from './rehypeTabs'
import remarkCustomDirectives from './remarkCustomDirectives'
import remarkGfm from './remarkGfm'
import remarkNumberCards from './remarkNumberCards'
import sanitizeSchema from './sanitizeSchema'

/**
 * Unified processor (parse/run phase)
 *
 * Transform Markdown code to hast.
 */
const processor = unified()
  .use(remarkParse)
  .use(remarkSqueezeParagraphs)
  .use(remarkDirective)
  .use(remarkHeadingId)
  .use(remarkCustomDirectives)
  .use(remarkInlineLinks)
  .use(remarkGfm)
  .use(remarkNumberCards)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeCaption)
  .use(rehypeTabs)
  .use(rehypeSanitize, sanitizeSchema)
  .use(rehypeKatex, { output: 'html' })
  .freeze()

/** Transform Markdown code to hast. */
function markdownToHast(markdownCode: string) {
  return processor.run(processor.parse(markdownCode))
}

/** Transform Markdown code to hast (sync version). */
function markdownToHastSync(markdownCode: string) {
  return processor.runSync(processor.parse(markdownCode))
}

export { markdownToHastSync }
export default markdownToHast
