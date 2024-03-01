import type { PageContextClient } from 'vike/types'

import ClientRenderer from './client/ClientRenderer'

const clientRenderer = new ClientRenderer()

function onRenderClient(pageContext: PageContextClient) {
  return clientRenderer.render(pageContext)
}

export { onRenderClient }
