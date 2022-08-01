import { RootState } from '@innodoc/store/src/makeStore'

export type PageProps = {}

export type PageContext = {
  documentProps?: {
    title?: string
    description?: string
  }
  Page: (pageProps: PageProps) => React.ReactElement
  pageProps: PageProps
  PRELOADED_STATE: RootState
  urlPathname: string
}
