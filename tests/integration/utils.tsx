import createCache, { type EmotionCache } from '@emotion/cache'
import { cleanup, render, type RenderOptions } from '@testing-library/react'
import type { i18n as I18n } from 'i18next'
import I18NextFsBackend from 'i18next-fs-backend'
import { type ReactElement, type ReactNode } from 'react'
import { afterEach } from 'vitest'

import { CONTENT_NAME_FOOTER_A, CONTENT_NAME_FOOTER_B } from '@/constants'
import { getI18nBackendOpts } from '@/renderer/_default.page.server'
import fetchContent from '@/renderer/fetchContent'
import makeStore, { type Store } from '@/store/makeStore'
import contentApi from '@/store/slices/contentApi'
import PageShell from '@/ui/components/PageShell/PageShell'
import getI18n from '@/utils/getI18n'

let emotionCache: EmotionCache
let i18n: I18n
let store: Store
const locale = 'en'

beforeEach(async () => {
  emotionCache = createCache({ key: 'emotion-style' })
  store = makeStore()
  const { initiate: getContent } = contentApi.endpoints.getContent
  await store.dispatch(contentApi.endpoints.getManifest.initiate())
  await fetchContent(store, getContent({ locale, path: CONTENT_NAME_FOOTER_A }))
  await fetchContent(store, getContent({ locale, path: CONTENT_NAME_FOOTER_B }))
  i18n = await getI18n(I18NextFsBackend, getI18nBackendOpts(), 'cimode', store)
})

afterEach(() => {
  cleanup()
})

function TestPageShell({ children }: { children: ReactNode }) {
  return (
    <PageShell emotionCache={emotionCache} i18n={i18n} store={store}>
      {children}
    </PageShell>
  )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: TestPageShell, ...options })

export * from '@testing-library/react'
export { locale, customRender as render, store }
