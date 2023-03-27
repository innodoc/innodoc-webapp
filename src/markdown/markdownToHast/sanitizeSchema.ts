import type { Schema } from 'hast-util-sanitize'
import { defaultSchema } from 'rehype-sanitize'

import { QUESTION_PROPERTIES } from '#ui/components/content/exercises/questions/types'
import { GRID_ITEM_PROPERTIES } from '#ui/components/content/grid/types'
import { ALL_TABS_PROPERTIES } from '#ui/components/content/tabs/types'

const sanitizeSchema: Schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,

    div: [
      ...(defaultSchema.attributes?.div || []),
      ['className', 'math', 'math-display'], // rehype-katex
      ...GRID_ITEM_PROPERTIES,
      ...ALL_TABS_PROPERTIES,
    ],

    span: [
      ...(defaultSchema.attributes?.span || []),
      ['className', 'math', 'math-inline'],
      ...QUESTION_PROPERTIES,
    ],
  },
  clobber: undefined,
  protocols: {
    ...defaultSchema.protocols,
    href: [...(defaultSchema.protocols?.href || []), 'app'],
  },
}

export default sanitizeSchema
