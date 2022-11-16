import { locale, render, screen, store } from '@/test-utils'

import { Page as ContentPage } from '@/pages/page/index.page'
import fetchContent from '@/renderer/fetchContent'
import contentApi from '@/store/slices/contentApi'

beforeEach(async () => {
  await fetchContent(store, contentApi.endpoints.getPageContent.initiate({ locale, id: 'about' }))
})

test('<ContentPage pageId="about" />', () => {
  render(<ContentPage pageId="about" />)
  expect(screen.getAllByText(/about this course/i).at(0)).toBeInTheDocument()
  expect(screen.getAllByText(/This content is a showcase for the/i)[0]).toBeInTheDocument()

  const linkEl = screen.getAllByRole('link', { name: 'innoDoc software package' }).at(0)
  expect(linkEl).toHaveAttribute('href', 'https://www.innocampus.tu-berlin.de/projekte/innodoc/')
})
