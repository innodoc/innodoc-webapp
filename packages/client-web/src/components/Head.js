import { Head as NextHead } from 'next/document'

// For some unfathomable reason CSS needs to be reversed in production, so it
// ends up in the correct order.

export default class Head extends NextHead {
  getCssLinks() {
    const cssLinks = super.getCssLinks()
    return process.env.NODE_ENV === 'production' ? cssLinks.reverse() : cssLinks
  }
}
