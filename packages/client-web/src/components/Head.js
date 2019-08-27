// TODO: remove this workaround if possible
// CSS links are in wrong order in production build.
// https://github.com/zeit/next.js/issues/3575

import { Head as NextHead } from 'next/document'

class Head extends NextHead {
  getCssLinks() {
    return super.getCssLinks().reverse()
  }
}

export default Head
