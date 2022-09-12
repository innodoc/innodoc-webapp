import { locale, render, screen, store } from '@/test-utils'

import { fetchPageContent } from '@/renderer/fetchData'
import { Page as ContentPage } from '@/pages/page/index.page'

beforeEach(async () => {
  await store.dispatch(fetchPageContent({ locale, id: 'about' }))
})

test('<ContentPage pageId="about" />', () => {
  render(<ContentPage pageId="about" />)
  expect(screen.getAllByText(/about this course/i).at(0)).toBeInTheDocument()
  expect(screen.getAllByText(/This content is a showcase for the/i)[0]).toBeInTheDocument()

  const linkEl = screen.getAllByRole('link', { name: 'innoDoc software package' }).at(0)
  expect(linkEl).toHaveAttribute('href', 'https://www.innocampus.tu-berlin.de/projekte/innodoc/')
})
