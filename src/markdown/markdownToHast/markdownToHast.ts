// import rehypeKatex from 'rehype-katex'
// import rehypeSanitize from 'rehype-sanitize'
// import rehypeSlug from 'rehype-slug'
// import remarkDirective from 'remark-directive'
// import remarkHeadingId from 'remark-heading-id'
// import remarkInlineLinks from 'remark-inline-links'
// import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
// import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs'
import { unified } from 'unified'

// import rehypeCaption from './rehypeCaption'
// import rehypeTabs from './rehypeTabs'
// import remarkCustomDirectives from './remarkCustomDirectives'
// import remarkGfm from './remarkGfm'
// import remarkMdx from './remarkMdx'
// import remarkNumberCards from './remarkNumberCards'
import remarkRehypeHandlers from './remarkRehypeHandlers'
// import remarkRewriteAppLinks from './remarkRewriteAppLinks'
// import sanitizeSchema from './sanitizeSchema'

/**
 * Unified processor (parse/run phase)
 *
 * Transform Markdown code to hast.
 */
const processor = unified()
  .use(remarkParse)
  // .use(remarkSqueezeParagraphs)
  // .use(remarkMdx)
  // .use(remarkDirective)
  // .use(remarkHeadingId)
  // .use(remarkCustomDirectives)
  // .use(remarkInlineLinks)
  // .use(remarkGfm)
  // .use(remarkRewriteAppLinks)
  // .use(remarkNumberCards)
  // .use(remarkMath)
  .use(remarkRehype, { handlers: remarkRehypeHandlers })
  // .use(rehypeSlug)
  // .use(rehypeCaption)
  // .use(rehypeTabs)
  // .use(rehypeSanitize, sanitizeSchema)
  // .use(rehypeKatex, { output: 'html' })
  .freeze()

/** Transform Markdown code to hast. */
async function markdownToHast(markdownCode: string) {
  return processor.run(processor.parse(markdownCode))
}

export type HastRoot = Awaited<ReturnType<typeof markdownToHast>>

export default markdownToHast
