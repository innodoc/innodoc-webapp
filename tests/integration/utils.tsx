import createCache, { type EmotionCache } from '@emotion/cache'
import { cleanup, render, type RenderOptions } from '@testing-library/react'
import type { i18n as I18n } from 'i18next'
import I18NextFsBackend from 'i18next-fs-backend'
import { type ReactElement, type ReactNode, StrictMode } from 'react'
import { afterEach } from 'vitest'

import { CONTENT_NAME_FOOTER_A, CONTENT_NAME_FOOTER_B } from '@/constants'
import makeStore, { type Store } from '@/store/makeStore'
import getI18n from '@/utils/getI18n'
import { getI18nBackendOpts } from '@/renderer/_default.page.server'
import { fetchContent, fetchManifest } from '@/renderer/fetchData'
import PageShell from '@/ui/components/PageShell/PageShell'

let emotionCache: EmotionCache
let i18n: I18n
let store: Store
const locale = 'en'

beforeEach(async () => {
  emotionCache = createCache({ key: 'emotion-style' })
  store = makeStore()
  await store.dispatch(fetchManifest())
  await store.dispatch(fetchContent({ locale, path: CONTENT_NAME_FOOTER_A }))
  await store.dispatch(fetchContent({ locale, path: CONTENT_NAME_FOOTER_B }))
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
