import { type RequestHandler, Router } from 'express'
import type { ParamsDictionary } from 'express-serve-static-core'

import { fetchContent } from '#server/content/fetch'
import { parseMarkdown } from '#server/content/parseMarkdown'
import type { ServerConfig } from '#server/getConfig'

function makeHandler(
  config: ServerConfig,
  makeUrlPath: (params: ParamsDictionary) => string
): RequestHandler {
  return (async (req, res, next) => {
    const markdown = await fetchContent(config.contentRoot, makeUrlPath(req.params))

    if (markdown === undefined) {
      next()
      return
    }

    const mdast = parseMarkdown(markdown)

    console.log(JSON.stringify(mdast, undefined, 2))

    res.json(mdast)
  }) as RequestHandler
}

function contentRouter(config: ServerConfig) {
  return (
    Router()
      // Manifest
      .get('/manifest', (req, res) => {
        res.json(config.manifest)
      })

      // Page
      .get(
        '/:locale([a-z]{2})/page/:id([\\da-z_-]+)',
        makeHandler(config, (params) => `${params.locale}/_pages/${params.id}.md`)
      )

      // Section
      .get(
        '/:locale([a-z]{2})/section/:section(*)',
        makeHandler(config, (params) => `${params.locale}/${params.section}/content.md`)
      )

      // Content (currently footer fragments)
      .get(
        '/:locale([a-z]{2})/:id([\\da-z_-]+)',
        makeHandler(config, (params) => `${params.locale}/${params.id}.md`)
      )
  )
}

export default contentRouter
