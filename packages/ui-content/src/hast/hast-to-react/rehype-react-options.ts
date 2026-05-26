import type { Options } from 'rehype-react'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import components from '#hast/components'

const rehypeReactOptions = {
  components,
  development: false,
  Fragment,
  jsx: jsx as Options['jsx'],
  jsxs: jsxs as Options['jsxs'],
  passNode: true,
} satisfies Options

export default rehypeReactOptions
