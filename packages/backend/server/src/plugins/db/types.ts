import type Database from '@innodoc/database'

declare module 'fastify' {
  interface FastifyInstance {
    db: Database
  }
}

interface KnexPluginOptions {
  knex?: ReturnType<typeof Database.getDefaultConfig>
}

export type { KnexPluginOptions }
