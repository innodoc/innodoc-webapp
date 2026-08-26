/**
 * Single source of truth for all icon names used by innoDoc.
 *
 * This list is used by:
 * - The `Icon` component (the icon bundle it renders is generated from it)
 * - The `icon` field of pages, which is validated against it
 *
 * All names must reference the MDI icon set
 * (see https://icon-sets.iconify.design/mdi/ for available icons).
 */
export const ICON_NAMES = [
  'mdi:account-circle',
  'mdi:application-edit-outline',
  'mdi:chart-line',
  'mdi:check',
  'mdi:chevron-down',
  'mdi:chevron-left',
  'mdi:chevron-right',
  'mdi:eye-outline',
  'mdi:file-document-check',
  'mdi:home',
  'mdi:information-outline',
  'mdi:keyboard-outline',
  'mdi:lightbulb-outline',
  'mdi:list-box',
  'mdi:list-box-outline',
  'mdi:login',
  'mdi:menu',
  'mdi:open-in-new',
  'mdi:table-of-contents',
  'mdi:theme-light-dark',
  'mdi:translate',
] as const

export type IconName = (typeof ICON_NAMES)[number]
