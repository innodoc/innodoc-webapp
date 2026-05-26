import type { Options } from 'rehype-react'
import { jsxDEV } from 'react/jsx-dev-runtime'
import rehypeReactOptions from './rehype-react-options.js'

const rehypeReactOptionsDev = {
  ...rehypeReactOptions,
  development: true,
  jsxDEV: jsxDEV as Options['jsxDEV'],
}

export default rehypeReactOptionsDev
