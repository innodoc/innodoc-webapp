import useMedia from 'use-media'

import css from '@innodoc/client-web/src/style/breakpoints.sss'

// Map CSS breakpoints to JS object
const breakpoints = Object.keys(css).reduce(
  (obj, key) => ({
    ...obj,
    [key.substring(7)]: parseInt(css[key], 10),
  }),
  {}
)

const useIsNarrowerThan = (breakpoint) =>
  useMedia({ maxWidth: breakpoints[breakpoint] })

export default useIsNarrowerThan
