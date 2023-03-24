export const TABS_PROPERTIES = ['labels'] as const

export const TAB_ITEM_PROPERTIES = ['index'] as const

export const ALL_TABS_PROPERTIES = [...TABS_PROPERTIES, ...TAB_ITEM_PROPERTIES] as const
