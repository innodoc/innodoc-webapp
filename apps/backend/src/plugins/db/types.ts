import type Database from '@innodoc/server-db'

declare module 'fastify' {
  interface FastifyInstance {
    db: Database
  }
}

interface KnexPluginOptions {
  knex?: ReturnType<typeof Database.getDefaultConfig>
}

export type { KnexPluginOptions }
