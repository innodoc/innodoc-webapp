import type { Schema } from 'hast-util-sanitize'
import { defaultSchema } from 'rehype-sanitize'

import { QUESTION_PROPERTIES } from '#ui/components/content/exercises/questions/properties'
import { GRID_ITEM_PROPERTIES } from '#ui/components/content/grid/GridItem'
import { TAB_ITEM_PROPERTIES } from '#ui/components/content/tabs/TabItem'
import { TABS_PROPERTIES } from '#ui/components/content/tabs/Tabs'
import { VIDEO_PROPERTIES } from '#ui/components/content/video/Video'
import { YOUTUBE_VIDEO_PROPERTIES } from '#ui/components/content/video/YouTubeVideo'

const sanitizeSchema: Schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,

    div: [
      ...(defaultSchema.attributes?.div || []),
      ['className', 'math', 'math-display'], // rehype-katex
      ...GRID_ITEM_PROPERTIES,
      ...TABS_PROPERTIES,
      ...TAB_ITEM_PROPERTIES,
      ...YOUTUBE_VIDEO_PROPERTIES,
      ...VIDEO_PROPERTIES,
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
