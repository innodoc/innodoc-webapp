import type { Schema } from 'hast-util-sanitize'
import { defaultSchema } from 'rehype-sanitize'

import { GRID_ITEM_PROPERTIES } from '#ui/components/content/grid/types'
import { ALL_TABS_PROPERTIES } from '#ui/components/content/tabs/types'
import { QUESTION_PROPERTIES } from '#ui/components/exercises/questions/types'

const sanitizeSchema: Schema = {
  ...defaultSchema,
  clobber: undefined,
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
}

export default sanitizeSchema
