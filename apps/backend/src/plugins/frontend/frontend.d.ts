import type { ViteDevServer } from 'vite'

import type { FrontendRouteInfo } from '@innodoc/shared-core/types'

module 'fastify' {
  interface FastifyRequest {
    // Decorator
    routeInfo: FrontendRouteInfo | null
  }

  interface FastifyInstance {
    // Set by vite-dev-server plugin
    viteDevServer: ViteDevServer
  }
}
