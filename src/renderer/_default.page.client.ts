import type { PageContextClient } from '#types/pageContext'

import ClientRenderer from './client/ClientRenderer'

const clientRenderer = new ClientRenderer()

function render(pageContext: PageContextClient) {
  return clientRenderer.render(pageContext)
}

export { render }
export const hydrationCanBeAborted = true // true for React
export const clientRouting = true
