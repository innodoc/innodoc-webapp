import createCache from '@emotion/cache'
import { render as renderOrig, type RenderOptions } from '@testing-library/react'
import type { i18n as I18n } from 'i18next'
import I18NextFsBackend from 'i18next-fs-backend'
import { type ReactElement, type ReactNode } from 'react'

import { CONTENT_NAME_FOOTER_A, CONTENT_NAME_FOOTER_B } from '@/constants'
import fetchContent from '@/renderer/fetchContent'
import makeStore, { type Store } from '@/store/makeStore'
import contentApi from '@/store/slices/contentApi'
import PageShell from '@/ui/components/PageShell/PageShell'
import getI18n from '@/utils/getI18n'

let i18n: I18n
let store: Store
const locale = 'en'

const { initiate: getContent } = contentApi.endpoints.getContent

beforeEach(async () => {
  store = makeStore()
  i18n = await getI18n(I18NextFsBackend, {}, 'cimode', store)
  await store.dispatch(contentApi.endpoints.getManifest.initiate())
  await fetchContent(store, getContent({ locale, path: CONTENT_NAME_FOOTER_A }))
  await fetchContent(store, getContent({ locale, path: CONTENT_NAME_FOOTER_B }))
})

function TestPageShell({ children }: { children: ReactNode }) {
  return (
    <PageShell emotionCache={createCache({ key: 'emotion-style' })} i18n={i18n} store={store}>
      {children}
    </PageShell>
  )
}

function render(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return renderOrig(ui, { wrapper: TestPageShell, ...options })
}

export * from '@testing-library/react'
export { locale, render, store }
