export const COMMON_PROPERTIES = ['solution', 'validation', 'points'] as const

export const TEXT_PROPERTIES = [
  'length',
  'precision',
  'supporting-points',
  'simplification',
  'variables',
] as const

export const QUESTION_PROPERTIES = [...COMMON_PROPERTIES, ...TEXT_PROPERTIES] as const

export type Validation = 'exact' | 'parsed' | 'function' | 'interval' | 'exact-fraction'
