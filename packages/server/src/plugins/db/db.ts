import fastifyPlugin from 'fastify-plugin'
import type { FastifyPluginCallback } from 'fastify'

import Database from '@innodoc/database'

import type { KnexPluginOptions } from './types'

const knexPlugin: FastifyPluginCallback<KnexPluginOptions> = function (app, options, done) {
  const dbInstance = new Database(options.knex)
  app.decorate('db', dbInstance)

  app.addHook('onClose', async (fastify) => {
    if (fastify.db === dbInstance) {
      await fastify.db.destroy()
    }
  })

  done()
}

const db = fastifyPlugin(knexPlugin, { name: 'knex' })

export default db
