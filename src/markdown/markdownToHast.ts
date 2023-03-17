import rehypeKatex from 'rehype-katex'
import rehypeSanitize from 'rehype-sanitize'
import remarkDirective from 'remark-directive'
import remarkInlineLinks from 'remark-inline-links'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs'
import { unified } from 'unified'

import remarkGfm from './remarkGfm'
import remarkNumberCards from './remarkNumberCards'
import { isContainerDirective } from './typeGuards'

/**
 * Unified processor (parse/run phase)
 *
 * Transform Markdown code to hast.
 */
const processor = unified()
  .use(remarkParse)
  .use(remarkSqueezeParagraphs)
  .use(remarkDirective)
  .use(remarkInlineLinks)
  .use(remarkGfm)
  .use(remarkNumberCards)
  .use(remarkMath)
  .use(remarkRehype, {
    handlers: {
      containerDirective: (state, node) => {
        if (!isContainerDirective(node)) {
          throw new Error('Invalid container directive')
        }

        return {
          type: 'element',
          tagName: 'div',
          properties: {
            type: node.type,
            name: node.name,
          },
          children: state.all(node),
        }
      },

      // TODO: Possible to somehow replace wrapping div with Fragment?
      // root: (state, node) => {
      //   if (!isRoot(node)) {
      //     throw new Error('Invalid root')
      //   }

      // const root = defaultHandlers.root(state, node)
      // root.data.root = true
      // root.
      // console.log('--------------- root')
      // console.log(node)

      // return root

      // return {
      //   type: 'element',
      //   tagName: 'div',
      //   properties: {},
      //   children: [],
      // }
      // },
    },
    // unknownHandler: (state, node) => {
    //   console.log('Unknown hast node:', node)
    //   return null
    // },
  })
  .use(rehypeKatex, { output: 'html' })
  // TODO: fix rehypeSanitize
  // .use(rehypeSanitize, { clobber: undefined })
  .freeze()

/** Transform Markdown code to hast. */
function markdownToHast(markdownCode: string) {
  return processor.run(processor.parse(markdownCode))
}

/** Transform Markdown code to hast (sync version). */
function markdownToHastSync(markdownCode: string) {
  return processor.runSync(processor.parse(markdownCode))
}

export { markdownToHast, markdownToHastSync }
