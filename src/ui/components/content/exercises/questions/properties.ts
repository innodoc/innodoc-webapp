const COMMON_PROPERTIES = ['solution', 'validation', 'points'] as const

const TEXT_PROPERTIES = [
  'length',
  'precision',
  'supporting-points',
  'simplification',
  'variables',
] as const

export const QUESTION_PROPERTIES = [...COMMON_PROPERTIES, ...TEXT_PROPERTIES] as const
