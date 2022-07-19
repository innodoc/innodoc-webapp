// @svgr mock, taken from
// https://github.com/vercel/next.js/discussions/31152#discussioncomment-2925168

import { forwardRef } from 'react'

const SvgrMock = forwardRef((props, ref) => <span ref={ref} {...props} />)

SvgrMock.displayName = 'SvgrMock'

export const ReactComponent = SvgrMock
export default SvgrMock
