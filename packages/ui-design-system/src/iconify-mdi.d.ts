import type { IconifyJSON } from '@iconify/types'

/** Type the MDI icon set JSON without making TypeScript parse the full 3 MB file into a literal. */
declare module '@iconify-json/mdi/icons.json' {
  const iconsJson: IconifyJSON
  export default iconsJson
}
