import type { Schema } from 'hast-util-sanitize'
import { defaultSchema } from 'rehype-sanitize'
import {
  GRID_ITEM_PROPERTIES,
  QUESTION_PROPERTIES,
  TAB_ITEM_PROPERTIES,
  TABS_PROPERTIES,
  VIDEO_PROPERTIES,
  YOUTUBE_VIDEO_PROPERTIES,
} from './properties.js'

const sanitizationConfig: Schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,

    // `name` is the MDX component dispatch key that ui-content's DivNode/SpanNode read, so it
    // is allowlisted explicitly on div and span. hast-util-sanitize also falls back to the
    // `*` defaults for attributes missing from a tag's own list; riding on that fallback meant
    // a hast-util-sanitize upgrade dropping `name` from its defaults would break every custom
    // component silently.
    // No rehype-katex className values are allowlisted on purpose: the pipeline runs
    // rehype-katex after rehype-sanitize, and its `output: 'html'` output never carries the
    // legacy react-katex `math`/`math-display`/`math-inline` classes.
    div: [
      ...(defaultSchema.attributes?.div ?? []),
      'name',
      ['root'], // Mark root element for React rendering
      ...GRID_ITEM_PROPERTIES,
      ...TABS_PROPERTIES,
      ...TAB_ITEM_PROPERTIES,
      ...YOUTUBE_VIDEO_PROPERTIES,
      ...VIDEO_PROPERTIES,
      // Question props (solution/points/validation/…) are whitelisted on div too, not just span:
      // a question written on its own line is promoted to a flow element (div), so without this
      // it would lose every question prop in silence.
      ...QUESTION_PROPERTIES,
    ],

    span: [...(defaultSchema.attributes?.span ?? []), 'name', ...QUESTION_PROPERTIES],
  },
  clobber: undefined,
  protocols: {
    ...defaultSchema.protocols,
    href: [...(defaultSchema.protocols?.href ?? []), 'app'],
  },
}

export default sanitizationConfig
