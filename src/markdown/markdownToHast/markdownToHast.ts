import rehypeKatex from 'rehype-katex'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'
import { remarkHeadingId } from 'remark-custom-heading-id'
import remarkDirective from 'remark-directive'
import remarkInlineLinks from 'remark-inline-links'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs'
import { unified } from 'unified'

import { GRID_PROPERTIES } from '#ui/components/content/grid/types'
import { QUESTION_PROPERTIES } from '#ui/components/exercises/questions/types'

import remarkCustomDirectives from './remarkCustomDirectives'
import remarkGfm from './remarkGfm'
import remarkNumberCards from './remarkNumberCards'

/**
 * Unified processor (parse/run phase)
 *
 * Transform Markdown code to hast.
 */
const processor = unified()
  .use(remarkParse)
  .use(remarkSqueezeParagraphs)
  .use(remarkDirective)
  .use(remarkCustomDirectives)
  .use(remarkHeadingId)
  .use(remarkInlineLinks)
  .use(remarkGfm)
  .use(remarkNumberCards)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeSanitize, {
    ...defaultSchema,
    clobber: undefined,
    attributes: {
      ...defaultSchema.attributes,
      div: [
        ...(defaultSchema.attributes?.div || []),
        ['className', 'math', 'math-display'], // rehype-katex
        ...GRID_PROPERTIES,
      ],
      span: [
        ...(defaultSchema.attributes?.span || []),
        ['className', 'math', 'math-inline'],
        ...QUESTION_PROPERTIES,
      ],
    },
  })
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
