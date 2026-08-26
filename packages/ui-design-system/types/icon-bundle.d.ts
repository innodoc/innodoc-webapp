/**
 * Type for the `#icon-bundle` subpath import: maps each icon name
 * (e.g. `mdi:home`) to its SVG path data.
 *
 * At runtime this resolves to the prebuilt `dist/icon-bundle.json` (production)
 * or `src/icon-bundle.ts` (development).
 */
declare const iconBundle: Record<string, string>
export default iconBundle
