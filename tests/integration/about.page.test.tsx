import { locale, render, screen, store } from '#test-utils'

import { Page as ContentPage } from '#pages/page/index.page'
import fetchContent from '#renderer/fetchContent'
import pages from '#store/slices/entities/pages'

beforeEach(async () => {
  await fetchContent(
    store,
    pages.endpoints.getPageContent.initiate({ courseId: 0, locale, pageId: 0 })
  )
})

test('<ContentPage pageSlug="about" />', () => {
  render(<ContentPage pageSlug="about" />)
  expect(screen.getAllByText(/about this course/i).at(0)).toBeInTheDocument()
  expect(screen.getAllByText(/This content is a showcase for the/i)[0]).toBeInTheDocument()

  const linkEl = screen.getAllByRole('link', { name: 'innoDoc software package' }).at(0)
  expect(linkEl).toHaveAttribute('href', 'https://www.innocampus.tu-berlin.de/projekte/innodoc/')
})
