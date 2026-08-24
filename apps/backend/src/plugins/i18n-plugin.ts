import type { FastifyPluginAsync } from 'fastify'
import type { FsBackendOptions } from 'i18next-fs-backend'
import fastifyPlugin from 'fastify-plugin'
import I18NextFsBackend from 'i18next-fs-backend'
import { LanguageDetector, plugin as i18nextPlugin } from 'i18next-http-middleware'
import fs from 'node:fs/promises'
import path from 'node:path'
import { DEFAULT_LOCALES } from '@innodoc/shared-core/constants'
import initI18n from '@innodoc/shared-core/i18n'
import { FRONTEND_PATH } from '#constants'
import type { PluginOpts } from '#plugins/types'

const LOCALES_PATH = path.join(FRONTEND_PATH, 'public', 'locales')

const i18nPluginCb: FastifyPluginAsync<PluginOpts> = async (server, { config }) => {
  // Locale paths
  const backendOpts: FsBackendOptions = {
    loadPath: path.join(LOCALES_PATH, '{{lng}}', '{{ns}}.json'),
  }

  if (!config.isProduction) {
    // Store missing locales in development
    backendOpts.addPath = path.join(FRONTEND_PATH, '{{lng}}', '{{ns}}.missing.json')
  }

  // Locales available in the frontend
  const locales = await fs.readdir(LOCALES_PATH)
  const supportedLngs = locales.toSorted()

  const i18next = await initI18n([LanguageDetector, I18NextFsBackend], {
    backend: backendOpts,
    // debug: !config.isProduction,
    saveMissing: !config.isProduction,
    supportedLngs,
    fallbackLng: DEFAULT_LOCALES[0],
  })

  // TODO: check early load language 'dev'
  // TODO: attach i18next.cloneInstance to diScope?

  await server.register(i18nextPlugin, { i18next })
}

const frontendPlugin = fastifyPlugin(i18nPluginCb, { name: 'i18n' })

export default frontendPlugin
