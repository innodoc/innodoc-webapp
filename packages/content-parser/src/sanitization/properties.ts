const COMMON_PROPERTIES = ['solution', 'validation', 'points'] as const

const TEXT_PROPERTIES = ['length', 'precision', 'supporting-points', 'simplification', 'variables'] as const

const QUESTION_PROPERTIES = [...COMMON_PROPERTIES, ...TEXT_PROPERTIES] as const

// Grid offsets use the camelCase (JSX-legal) spelling: kebab-case `*-offset` is not a legal
// JSX identifier (it only parses because mdast-util-mdx-jsx accepts the HTML-ish form), and
// MUI's Grid item props are camelCase. camelCase is the only supported spelling.
const GRID_ITEM_PROPERTIES = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'xsOffset',
  'smOffset',
  'mdOffset',
  'lgOffset',
  'xlOffset',
] as const

const TABS_PROPERTIES = ['labels'] as const

const TAB_ITEM_PROPERTIES = ['index'] as const

const VIDEO_PROPERTIES = ['src'] as const

const YOUTUBE_VIDEO_PROPERTIES = ['videoId'] as const

export {
  GRID_ITEM_PROPERTIES,
  QUESTION_PROPERTIES,
  TAB_ITEM_PROPERTIES,
  TABS_PROPERTIES,
  VIDEO_PROPERTIES,
  YOUTUBE_VIDEO_PROPERTIES,
}
