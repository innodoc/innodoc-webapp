import type { Schema } from 'hast-util-sanitize'
import { defaultSchema } from 'rehype-sanitize'

import {
  GRID_ITEM_PROPERTIES,
  QUESTION_PROPERTIES,
  TAB_ITEM_PROPERTIES,
  TABS_PROPERTIES,
  VIDEO_PROPERTIES,
  YOUTUBE_VIDEO_PROPERTIES,
} from './properties'

const sanitizationConfig: Schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,

    div: [
      ...(defaultSchema.attributes?.div ?? []),
      ['className', 'math', 'math-display'], // rehype-katex
      ...GRID_ITEM_PROPERTIES,
      ...TABS_PROPERTIES,
      ...TAB_ITEM_PROPERTIES,
      ...YOUTUBE_VIDEO_PROPERTIES,
      ...VIDEO_PROPERTIES,
    ],

    span: [
      ...(defaultSchema.attributes?.span ?? []),
      ['className', 'math', 'math-inline'],
      ...QUESTION_PROPERTIES,
    ],
  },
  clobber: undefined,
  protocols: {
    ...defaultSchema.protocols,
    href: [...(defaultSchema.protocols?.href ?? []), 'app'],
  },
}

export default sanitizationConfig
