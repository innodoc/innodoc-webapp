const COMMON_PROPERTIES = ['solution', 'validation', 'points'] as const

const TEXT_PROPERTIES = [
  'length',
  'precision',
  'supporting-points',
  'simplification',
  'variables',
] as const

export const QUESTION_PROPERTIES = [...COMMON_PROPERTIES, ...TEXT_PROPERTIES] as const

export const GRID_ITEM_PROPERTIES = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'xs-offset',
  'sm-offset',
  'md-offset',
  'lg-offset',
  'xl-offset',
] as const

export const TABS_PROPERTIES = ['labels'] as const

export const TAB_ITEM_PROPERTIES = ['index'] as const

export const VIDEO_PROPERTIES = ['src'] as const

export const YOUTUBE_VIDEO_PROPERTIES = ['videoId'] as const
