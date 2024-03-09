import { jsxDEV } from 'react/jsx-dev-runtime'
import type { Options } from 'rehype-react'

import rehypeReactOptions from './rehypeReactOptions'

const rehypeReactOptionsDev = {
  ...rehypeReactOptions,
  development: true,
  jsxDEV: jsxDEV as Options['jsxDEV'],
}

export default rehypeReactOptionsDev
