// Material UI font
import '@fontsource/lato/400.css'
import '@fontsource/lato/400-italic.css'
import '@fontsource/lato/700.css'
import '@fontsource/lato/700-italic.css'

// KaTeX CSS
import 'katex/dist/katex.css'

import { PASS_TO_CLIENT_PROPS } from '#constants'

import onBeforeRenderDefault from './server/onBeforeRenderDefault'
import render from './server/render'

export { onBeforeRenderDefault as onBeforeRender, PASS_TO_CLIENT_PROPS as passToClient, render }
