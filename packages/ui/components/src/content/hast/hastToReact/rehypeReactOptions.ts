import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import type { Options } from 'rehype-react'

import components from '#content/hast/componentsMap'

const rehypeReactOptions = {
  components,
  development: false,
  Fragment,
  jsx: jsx as Options['jsx'],
  jsxs: jsxs as Options['jsxs'],
  passNode: true,
} satisfies Options

export default rehypeReactOptions
