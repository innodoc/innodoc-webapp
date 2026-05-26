import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { RenderFunction } from '@innodoc/frontend'

// Signature of the HTML function returned by createHtmlFunction
// type HtmlFunction = (this: FastifyReply, req: FastifyRequest, render: RenderFunction) => Promise<void>

/**
 * Match a URL path against the frontend route patterns and extract params.
 *
 * Returns the matched route name, params (including locale), or null if no match.
 */
// function matchFrontendRoute(
//   urlPath: string,
//   frontendRoutes: Partial<Record<string, string>>,
// ): { name: string; locale: string; params: Record<string, string> } | null {
//   // Convert regexparam-style pattern to a segment-by-segment matcher
//   function matchPattern(pattern: string, path: string): Record<string, string> | null {
//     const patternSegments = pattern.split('/').filter(Boolean)
//     const pathSegments = path.split('/').filter(Boolean)

//     let pathIdx = 0
//     const params: Record<string, string> = {}

//     for (const segment of patternSegments) {
//       if (pathIdx >= pathSegments.length) {
//         // Pattern has more segments than path — no match (unless it's a wildcard)
//         if (segment === '*') {
//           params['*'] = ''
//           continue
//         }
//         return null
//       }

//       if (segment === '*') {
//         // Catch-all: consume remaining segments
//         params['*'] = pathSegments.slice(pathIdx).join('/')
//         break
//       }

//       if (segment.startsWith(':')) {
//         // Param segment
//         const paramName = segment.slice(1)
//         const value = pathSegments[pathIdx]
//         if (value !== undefined) {
//           params[paramName] = value
//         }
//       } else {
//         // Literal segment — must match exactly
//         if (segment !== pathSegments[pathIdx]) {
//           return null
//         }
//       }

//       pathIdx++
//     }

//     // Path should be fully consumed (or wildcard consumed it)
//     if (pathIdx < pathSegments.length && !patternSegments.includes('*')) {
//       return null
//     }

//     return params
//   }

//   // Try each frontend route pattern
//   for (const [routeName, pattern] of Object.entries(frontendRoutes)) {
//     if (pattern === undefined) continue
//     const params = matchPattern(pattern, urlPath)
//     if (params !== null) {
//       return {
//         name: routeName,
//         locale: params.locale ?? 'en',
//         params: Object.keys(params).length > 0 ? params : {},
//       }
//     }
//   }

//   return null
// }

/**
 * Create the SSR route handler and register a catch-all route on the Fastify server.
 *
 * @param server - Fastify server instance
 * @param render - SSR render function (from frontend server entry)
 * @param htmlTemplate - HTML template
 */
function makeFrontendHandler(server: FastifyInstance, render: RenderFunction, htmlTemplate: string) {
  return async ({ diScope, i18n, url }: FastifyRequest, reply: FastifyReply) => {
    // Build routeInfo — cast to FrontendRouteInfo since dynamic matching
    // can't produce the exact discriminated union type at compile time
    // const routeInfo = match
    //   ? ({
    //       name: match.name as FrontendRouteInfo['name'],
    //       locale: match.locale,
    //       ...(Object.keys(match.params).length > 0 ? match.params : {}),
    //     } as FrontendRouteInfo)
    //   : ({ name: 'app:index', locale: 'en' } as FrontendRouteInfo)

    // Set the routeInfo decorator
    // request.routeInfo = routeInfo

    // await html.call(reply, request, render)

    const routeManager = diScope.resolve('routeManager')
    const store = await diScope.resolve('store')

    const stream = render({ htmlTemplate, i18n, routeManager, store, url })
    reply.type('text/html')
    reply.send(stream)
  }
}

// function createSsrRoute(server: FastifyInstance, render: RenderFunction, html: HtmlFunction): void {
//   server.get('/*', async (request, reply) => {
//     const routeManager = request.diScope.resolve('routeManager')
//     const frontendRoutes = routeManager.getFrontendRoutes()

//     // Strip query string for route matching
//     const urlPath = request.url.split('?')[0] ?? request.url

//     // Match the URL path against frontend route patterns
//     const match = matchFrontendRoute(urlPath, frontendRoutes)

//     // Build routeInfo — cast to FrontendRouteInfo since dynamic matching
//     // can't produce the exact discriminated union type at compile time
//     const routeInfo = match
//       ? ({
//           name: match.name as FrontendRouteInfo['name'],
//           locale: match.locale,
//           ...(Object.keys(match.params).length > 0 ? match.params : {}),
//         } as FrontendRouteInfo)
//       : ({ name: 'app:index', locale: 'en' } as FrontendRouteInfo)

//     // Set the routeInfo decorator
//     request.routeInfo = routeInfo

//     await html.call(reply, request, render)
//   })
// }

export default makeFrontendHandler
